import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import Loading from "../components/Loading";
import { isAdmin } from "../utils/auth";

const initialMaterialState = {
  title: "",
  description: "",
  file_url: "",
  folder_id: "",
};

const initialFolderState = {
  name: "",
  description: "",
};

function ManageMaterials() {
  const [materials, setMaterials] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialMaterialState);
  const [editingId, setEditingId] = useState(null);
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [folderForm, setFolderForm] = useState(initialFolderState);
  const [editingFolderId, setEditingFolderId] = useState(null);

  const fetchData = async () => {
    try {
      const [materialsData, foldersData] = await Promise.all([
        api.get("/materials"),
        api.get("/folders"),
      ]);
      setMaterials(materialsData);
      setFolders(foldersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!isAdmin()) return <Navigate to="/admin/login" replace />;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await api.put(`/materials/${editingId}`, formData);
      } else {
        await api.post("/materials", formData);
      }
      setFormData(initialMaterialState);
      setEditingId(null);
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (material) => {
    setFormData({
      title: material.title,
      description: material.description || "",
      file_url: material.file_url,
      folder_id: material.folder_id ? String(material.folder_id) : "",
    });
    setEditingId(material.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?"))
      return;
    setError("");
    setSuccess("");
    try {
      await api.delete(`/materials/${id}`);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setFormData(initialMaterialState);
    setEditingId(null);
    setShowForm(false);
  };

  const handleFolderChange = (e) => {
    setFolderForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFolderSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingFolderId) {
        await api.put(`/folders/${editingFolderId}`, folderForm);
        setSuccess("Folder updated successfully.");
      } else {
        await api.post("/folders", folderForm);
        setSuccess("Folder created successfully.");
      }
      setFolderForm(initialFolderState);
      setEditingFolderId(null);
      setShowFolderForm(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditFolder = (folder) => {
    setFolderForm({
      name: folder.name,
      description: folder.description || "",
    });
    setEditingFolderId(folder.id);
    setShowFolderForm(true);
  };

  const handleDeleteFolder = async (folder) => {
    if (
      !window.confirm(
        `Delete folder "${folder.name}"? Materials inside will become uncategorized but will NOT be deleted.`
      )
    )
      return;
    setError("");
    setSuccess("");
    try {
      await api.delete(`/folders/${folder.id}`);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelFolder = () => {
    setFolderForm(initialFolderState);
    setEditingFolderId(null);
    setShowFolderForm(false);
  };

  if (loading) return <Loading />;

  return (
    <div className="manage-page">
      <h1>Manage Placement Materials</h1>

      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}

      <h2 className="manage-subheading">Folders</h2>

      <button
        className="btn-primary"
        onClick={() => {
          handleCancelFolder();
          setShowFolderForm(!showFolderForm);
        }}
      >
        {showFolderForm ? "Cancel" : "Add Folder"}
      </button>

      {showFolderForm && (
        <form onSubmit={handleFolderSubmit} className="manage-form">
          <h2>{editingFolderId ? "Edit Folder" : "Add New Folder"}</h2>
          <div className="form-group">
            <label>Folder Name *</label>
            <input
              name="name"
              value={folderForm.name}
              onChange={handleFolderChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={folderForm.description}
              onChange={handleFolderChange}
              rows="2"
            />
          </div>
          <button type="submit" className="btn-primary">
            {editingFolderId ? "Update Folder" : "Create Folder"}
          </button>
        </form>
      )}

      <div className="manage-list">
        {folders.length === 0 ? (
          <p className="empty-msg">No folders yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Materials</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {folders.map((folder) => (
                <tr key={folder.id}>
                  <td>{folder.name}</td>
                  <td>{folder.description || "-"}</td>
                  <td>{folder.material_count}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditFolder(folder)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteFolder(folder)}
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

      <h2 className="manage-subheading">Materials</h2>

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
          <div className="form-group">
            <label>Folder</label>
            <select
              name="folder_id"
              value={formData.folder_id}
              onChange={handleChange}
            >
              <option value="">None / Uncategorized</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
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
                <th>Folder</th>
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
                  <td>{material.folder_name || "Uncategorized"}</td>
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
