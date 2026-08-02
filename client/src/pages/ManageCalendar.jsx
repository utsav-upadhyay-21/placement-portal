import { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import Loading from "../components/Loading";
import { isAdmin } from "../utils/auth";

const initialEventState = {
  company_name: "",
  visit_date: "",
  description: "",
};

function ManageCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialEventState);
  const [editingId, setEditingId] = useState(null);
  const dateInputRef = useRef(null);

  const fetchEvents = async () => {
    try {
      const data = await api.get("/calendar");
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
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
        await api.put(`/calendar/${editingId}`, formData);
      } else {
        await api.post("/calendar", formData);
      }
      setFormData(initialEventState);
      setEditingId(null);
      setShowForm(false);
      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      company_name: event.company_name,
      visit_date: event.visit_date ? event.visit_date.split("T")[0] : "",
      description: event.description || "",
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/calendar/${id}`);
      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setFormData(initialEventState);
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <Loading />;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const upcomingCompanies = events
    .filter((event) => new Date(event.visit_date) >= startOfToday)
    .sort((a, b) => new Date(a.visit_date) - new Date(b.visit_date));

  const visitedCompanies = events
    .filter((event) => new Date(event.visit_date) < startOfToday)
    .sort((a, b) => new Date(a.visit_date) - new Date(b.visit_date));

  const renderTable = (list) => (
    <table className="data-table">
      <thead>
        <tr>
          <th>Company</th>
          <th>Visit Date</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {list.map((event) => (
          <tr key={event.id}>
            <td>{event.company_name}</td>
            <td>
              {new Date(event.visit_date).toLocaleDateString("en-IN")}
            </td>
            <td>{event.description || "-"}</td>
            <td>
              <button
                className="btn-edit"
                onClick={() => handleEdit(event)}
              >
                Edit
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(event.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="manage-page">
      <h1>Manage Calendar</h1>

      {error && <p className="error-msg">{error}</p>}

      <button
        className="btn-primary"
        onClick={() => {
          handleCancel();
          setShowForm(!showForm);
        }}
      >
        {showForm ? "Cancel" : "Add Event"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="manage-form">
          <h2>{editingId ? "Edit Event" : "Add New Event"}</h2>
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
            <label>Visit Date *</label>
            <input
              ref={dateInputRef}
              type="date"
              name="visit_date"
              value={formData.visit_date}
              onChange={handleChange}
              onFocus={() => {
                if (dateInputRef.current) {
                  dateInputRef.current.showPicker();
                }
              }}
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
          <button type="submit" className="btn-primary">
            {editingId ? "Update Event" : "Create Event"}
          </button>
        </form>
      )}

      {events.length === 0 && <p className="empty-msg">No events found.</p>}

      {upcomingCompanies.length > 0 && (
        <div className="manage-list">
          <h2 className="calendar-section-title">Upcoming Companies</h2>
          {renderTable(upcomingCompanies)}
        </div>
      )}

      {visitedCompanies.length > 0 && (
        <div className="manage-list">
          <h2 className="calendar-section-title">Visited Companies</h2>
          {renderTable(visitedCompanies)}
        </div>
      )}
    </div>
  );
}

export default ManageCalendar;
