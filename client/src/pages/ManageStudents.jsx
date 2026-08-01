import { useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import Loading from "../components/Loading";

function ManageStudents() {
  const [usn, setUsn] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({});

  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/admin/login" replace />;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!usn.trim()) return;

    setLoading(true);
    setError("");
    setSuccess("");
    setStudent(null);

    try {
      const data = await api.get(`/students/${usn.trim().toUpperCase()}`);
      setStudent(data);
      setFormData({
        student_name: data.student_name || "",
        branch: data.branch || "",
        college_email: data.college_email || "",
        phone_number: data.phone_number || "",
        personal_email: data.personal_email || "",
        tenth_marks: data.tenth_marks || "",
        twelfth_marks: data.twelfth_marks || "",
        cgpa: data.cgpa || "",
        active_backlogs: data.active_backlogs || 0,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.put(`/students/${usn.trim().toUpperCase()}`, formData);
      setSuccess("Student updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="manage-page">
      <h1>Manage Students</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter USN"
          value={usn}
          onChange={(e) => setUsn(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          Search
        </button>
      </form>

      {loading && <Loading />}
      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}

      {student && (
        <form onSubmit={handleSave} className="manage-form">
          <div className="form-row">
            <div className="form-group">
              <label>USN</label>
              <input value={student.usn} disabled />
            </div>
            <div className="form-group">
              <label>CGPA</label>
              <input
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Student Name *</label>
              <input
                name="student_name"
                value={formData.student_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Branch *</label>
              <input
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>College Email</label>
              <input
                name="college_email"
                value={formData.college_email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Personal Email</label>
              <input
                name="personal_email"
                value={formData.personal_email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Active Backlogs</label>
              <input
                name="active_backlogs"
                type="number"
                value={formData.active_backlogs}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>10th Marks</label>
              <input
                name="tenth_marks"
                value={formData.tenth_marks}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>12th Marks</label>
              <input
                name="twelfth_marks"
                value={formData.twelfth_marks}
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
}

export default ManageStudents;
