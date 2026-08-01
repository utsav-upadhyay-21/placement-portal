import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import Loading from "../components/Loading";

const initialJobState = {
  company_name: "",
  role: "",
  package: "",
  deadline: "",
  work_mode: "",
  branch_eligibility: "",
  minimum_cgpa: "",
  active_backlogs_allowed: false,
  skills_required: "",
  additional_notes: "",
  registration_link: "",
};

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialJobState);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/admin/login" replace />;

  const fetchJobs = async () => {
    try {
      const data = await api.get("/jobs");
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await api.put(`/jobs/${editingId}`, formData);
      } else {
        await api.post("/jobs", formData);
      }
      setFormData(initialJobState);
      setEditingId(null);
      setShowForm(false);
      fetchJobs();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (job) => {
    setFormData({
      company_name: job.company_name,
      role: job.role,
      package: job.package,
      deadline: job.deadline ? job.deadline.replace(" ", "T").slice(0, 16) : "",
      work_mode: job.work_mode,
      branch_eligibility: job.branch_eligibility,
      minimum_cgpa: job.minimum_cgpa || "",
      active_backlogs_allowed: job.active_backlogs_allowed,
      skills_required: job.skills_required,
      additional_notes: job.additional_notes,
      registration_link: job.registration_link,
    });
    setEditingId(job.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setFormData(initialJobState);
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <Loading />;

  return (
    <div className="manage-page">
      <h1>Manage Jobs</h1>

      {error && <p className="error-msg">{error}</p>}

      <button
        className="btn-primary"
        onClick={() => {
          handleCancel();
          setShowForm(!showForm);
        }}
      >
        {showForm ? "Cancel" : "Add Job"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="manage-form">
          <h2>{editingId ? "Edit Job" : "Add New Job"}</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Company Name *</label>
              <input
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input
                name="role"
                value={formData.role}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Package</label>
              <input
                name="package"
                value={formData.package}
                onChange={handleChange}
                placeholder="e.g., 10 LPA"
              />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Work Mode</label>
              <input
                name="work_mode"
                value={formData.work_mode}
                onChange={handleChange}
                placeholder="e.g., Work From Office"
              />
            </div>
            <div className="form-group">
              <label>Branch Eligibility</label>
              <input
                name="branch_eligibility"
                value={formData.branch_eligibility}
                onChange={handleChange}
                placeholder="e.g., CSE, ISE"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Minimum CGPA</label>
              <input
                name="minimum_cgpa"
                value={formData.minimum_cgpa}
                onChange={handleChange}
              />
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="active_backlogs_allowed"
                  checked={formData.active_backlogs_allowed}
                  onChange={handleChange}
                />
                Active Backlogs Allowed
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>Skills Required</label>
            <textarea
              name="skills_required"
              value={formData.skills_required}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              name="additional_notes"
              value={formData.additional_notes}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Registration Link *</label>
            <input
              name="registration_link"
              value={formData.registration_link}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            {editingId ? "Update Job" : "Create Job"}
          </button>
        </form>
      )}

      <div className="manage-list">
        {jobs.length === 0 ? (
          <p className="empty-msg">No jobs found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Package</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.company_name}</td>
                  <td>{job.role}</td>
                  <td>{job.package}</td>
                  <td>
                    {new Date(job.deadline).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(job)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(job.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManageJobs;
