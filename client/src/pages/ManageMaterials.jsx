import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import Loading from "../components/Loading";
import { isAdmin } from "../utils/auth";

const initialMaterialState = {
  title: "",
  description: "",
  file_url: "",
};

function ManageMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialMaterialState);
  const [editingId, setEditingId] = useState(null);

  const fetchMaterials = async () => {
    try {
      const data = await api.get("/materials");
      setMaterials(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  if (!isAdmin()) return <Navigate to="/admin/login" replace />;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await api.put(`/materials/${editingId}`, formData);
      } else {
        await api.post("/materials", formData);
      }
      setFormData(initialMaterialState);
      setEditingId(null);
      setShowForm(false);
      fetchMaterials();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (material) => {
    setFormData({
      title: material.title,
      description: material.description || "",
      file_url: material.file_url,
    });
    setEditingId(material.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?"))
      return;
    try {
      await api.delete(`/materials/${id}`);
      fetchMaterials();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setFormData(initialMaterialState);
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <Loading />;

  return (
    <div className="manage-page">
      <h1>Manage Placement Materials</h1>

      {error && <p className="error-msg">{error}</p>}

      <button
        className="btn-primary"
        onClick={() => {
          handleCancel();
          setShowForm(!showForm);
        }}
      >
        {showForm ? "Cancel" : "Add Material"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="manage-form">
          <h2>{editingId ? "Edit Material" : "Add New Material"}</h2>
          <div className="form-group">
            <label>Title *</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>File URL *</label>
            <input
              name="file_url"
              value={formData.file_url}
              onChange={handleChange}
              placeholder="https://drive.google.com/..."
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            {editingId ? "Update Material" : "Create Material"}
          </button>
        </form>
      )}

      <div className="manage-list">
        {materials.length === 0 ? (
          <p className="empty-msg">No materials found.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>File</th>
                <th>Added On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.id}>
                  <td>{material.title}</td>
                  <td>{material.description || "-"}</td>
                  <td>
                    <a
                      href={material.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="table-link"
                    >
                      Open
                    </a>
                  </td>
                  <td>
                    {new Date(material.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(material)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(material.id)}
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

export default ManageMaterials;
