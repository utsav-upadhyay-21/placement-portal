import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { clearToken } from "../utils/auth";
import Loading from "../components/Loading";
import "../styles/student.css";

const TABS = [
  { key: "overview", label: "Dashboard" },
  { key: "profile", label: "Profile" },
  { key: "semester", label: "Semester Marks" },
  { key: "cgpa", label: "CGPA" },
  { key: "materials", label: "Placement Materials" },
];

function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [student, setStudent] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const profile = await api.get("/auth/profile");
        setStudent(profile);
        const materialsData = await api.get("/materials");
        setMaterials(materialsData);
        const foldersData = await api.get("/folders");
        setFolders(foldersData);
      } catch (err) {
        if (err.status !== 401 && err.status !== 403) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate("/student/login");
  };

  if (loading) return <Loading />;

  if (!student) {
    return <p className="error-msg">{error || "Unable to load profile."}</p>;
  }

  const formatDate = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderOverview = () => (
    <div className="dashboard-grid student-overview-grid">
      <div className="dashboard-card">
        <h2>Student Name</h2>
        <p className="overview-value">{student.student_name}</p>
      </div>
      <div className="dashboard-card">
        <h2>USN</h2>
        <p className="overview-value mono">{student.usn}</p>
      </div>
      <div className="dashboard-card">
        <h2>Branch</h2>
        <p className="overview-value">{student.branch || "N/A"}</p>
      </div>
      <div className="dashboard-card">
        <h2>CGPA</h2>
        <p className="overview-value accent">{student.cgpa || "N/A"}</p>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="manage-list">
      <table className="data-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>USN</td>
            <td>{student.usn}</td>
          </tr>
          <tr>
            <td>Student Name</td>
            <td>{student.student_name}</td>
          </tr>
          <tr>
            <td>Branch</td>
            <td>{student.branch || "N/A"}</td>
          </tr>
          <tr>
            <td>College Email</td>
            <td>{student.college_email || "N/A"}</td>
          </tr>
          <tr>
            <td>Personal Email</td>
            <td>{student.personal_email || "N/A"}</td>
          </tr>
          <tr>
            <td>Phone</td>
            <td>{student.phone_number || "N/A"}</td>
          </tr>
          <tr>
            <td>Active Backlogs</td>
            <td>{student.active_backlogs}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderSemesterMarks = () => (
    <div className="manage-list">
      {student.semester_marks && student.semester_marks.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Semester</th>
              <th>SGPA</th>
              <th>Marks (%)</th>
            </tr>
          </thead>
          <tbody>
            {student.semester_marks.map((mark) => (
              <tr key={mark.semester}>
                <td>{mark.semester}</td>
                <td>{mark.sgpa || "N/A"}</td>
                <td>{mark.marks != null ? `${mark.marks}%` : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="empty-msg">No semester marks recorded yet.</p>
      )}
    </div>
  );

  const renderCgpa = () => (
    <div className="cgpa-summary">
      <div className="cgpa-big">{student.cgpa || "N/A"}</div>
      <p className="cgpa-caption">Overall CGPA</p>
      <div className="cgpa-details">
        <div className="cgpa-stat">
          <span className="cgpa-label">10th Marks</span>
          <span className="cgpa-value">{student.tenth_marks}%</span>
        </div>
        <div className="cgpa-stat">
          <span className="cgpa-label">12th Marks</span>
          <span className="cgpa-value">{student.twelfth_marks}%</span>
        </div>
        <div className="cgpa-stat">
          <span className="cgpa-label">Active Backlogs</span>
          <span className="cgpa-value">{student.active_backlogs}</span>
        </div>
      </div>
    </div>
  );

  const renderFolderGrid = () => {
    const uncategorized = materials.filter((m) => !m.folder_id);

    if (folders.length === 0 && uncategorized.length === 0) {
      return <p className="empty-msg">No placement materials available yet.</p>;
    }

    return (
      <div className="material-grid">
        {folders.map((folder) => (
          <button
            key={folder.id}
            className="folder-card"
            onClick={() => setSelectedFolder(folder)}
          >
            <h3>{folder.name}</h3>
            {folder.description && (
              <p className="folder-desc">{folder.description}</p>
            )}
            <span className="folder-count">
              {folder.material_count}{" "}
              {folder.material_count === 1 ? "material" : "materials"}
            </span>
          </button>
        ))}
        {uncategorized.length > 0 && (
          <button
            className="folder-card"
            onClick={() =>
              setSelectedFolder({ id: null, name: "Uncategorized" })
            }
          >
            <h3>Uncategorized</h3>
            <p className="folder-desc">Materials not placed in any folder.</p>
            <span className="folder-count">
              {uncategorized.length}{" "}
              {uncategorized.length === 1 ? "material" : "materials"}
            </span>
          </button>
        )}
      </div>
    );
  };

  const renderMaterials = () => {
    if (selectedFolder) {
      const folderMaterials = selectedFolder.id
        ? materials.filter((m) => m.folder_id === selectedFolder.id)
        : materials.filter((m) => !m.folder_id);

      return (
        <div>
          <button
            className="back-link folder-back"
            onClick={() => setSelectedFolder(null)}
          >
            &larr; All folders
          </button>
          <h2 className="folder-heading">{selectedFolder.name}</h2>
          {folderMaterials.length === 0 ? (
            <p className="empty-msg">This folder is empty.</p>
          ) : (
            <div className="material-grid">
              {folderMaterials.map((material) => (
                <div className="material-card" key={material.id}>
                  <h3>{material.title}</h3>
                  {material.description && (
                    <p className="material-desc">{material.description}</p>
                  )}
                  <p className="material-date">
                    Added on {formatDate(material.created_at)}
                  </p>
                  <a
                    href={material.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary material-link"
                  >
                    Open / Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return renderFolderGrid();
  };

  return (
    <div className="student-dashboard">
      <div className="student-profile-header">
        <h1>Student Dashboard</h1>
        <span className="student-usn-badge">{student.usn}</span>
      </div>

      <div className="dashboard-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`dashboard-tab ${
              activeTab === tab.key ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
        <button className="dashboard-tab logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <section className="dashboard-section">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "profile" && renderProfile()}
        {activeTab === "semester" && renderSemesterMarks()}
        {activeTab === "cgpa" && renderCgpa()}
        {activeTab === "materials" && renderMaterials()}
      </section>
    </div>
  );
}

export default StudentDashboard;
