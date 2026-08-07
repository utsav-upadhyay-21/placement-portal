import { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import Loading from "../components/Loading";
import { isAdmin } from "../utils/auth";

const initialEventState = {
  company_name: "",
  visit_date: "",
  description: "",
  jtype: "",
  event_type: "",
};

const JTYPE_OPTIONS = ["Internship", "Internship + PBC/PPO", "FTE"];
const EVENT_TYPE_OPTIONS = ["RVITM Campus", "RVCE Campus", "Company Campus"];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

const toInputDateString = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function ManageCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialEventState);
  const [editingId, setEditingId] = useState(null);
  const dateInputRef = useRef(null);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

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
      visit_date: toInputDateString(event.visit_date),
      description: event.description || "",
      jtype: event.jtype || "",
      event_type: event.event_type || "",
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/calendar/${id}`);
      setFormData(initialEventState);
      setEditingId(null);
      setShowForm(false);
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

  const getEventsForDay = (day) => {
    return events.filter((event) => {
      const d = new Date(event.visit_date);
      return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const calendarDays = [];
  for (let i = 0; i < getFirstDayOfMonth(currentYear, currentMonth); i++) {
    calendarDays.push({ day: null, key: `empty-${i}` });
  }
  for (let d = 1; d <= getDaysInMonth(currentYear, currentMonth); d++) {
    calendarDays.push({ day: d, key: `day-${d}` });
  }

  return (
    <div className="manage-page calendar-view">
      <div className="calendar-top-bar">
        <h1>Manage Calendar</h1>
        <button className="btn-today" onClick={goToToday}>
          Today
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="calendar-nav">
        <button className="nav-btn" onClick={prevMonth}>
          &#8249;
        </button>
        <h2 className="calendar-title">
          {MONTHS[currentMonth]} {currentYear}
        </h2>
        <button className="nav-btn" onClick={nextMonth}>
          &#8250;
        </button>
      </div>

      <button
        className="btn-primary"
        onClick={() => {
          handleCancel();
          setShowForm(!showForm);
        }}
      >
        {showForm && !editingId ? "Cancel" : "Add Event"}
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
            <label>Job Type</label>
            <select
              name="jtype"
              value={formData.jtype}
              onChange={handleChange}
            >
              <option value="">Select Job Type</option>
              {JTYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Event Type</label>
            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
            >
              <option value="">Select Event Type</option>
              {EVENT_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
          {editingId && (
            <button
              type="button"
              className="btn-delete"
              style={{ marginLeft: "0.5rem" }}
              onClick={() => handleDelete(editingId)}
            >
              Delete Event
            </button>
          )}
        </form>
      )}

      {events.length === 0 && <p className="empty-msg">No events found.</p>}

      <div className="calendar-grid-view">
        {DAYS.map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}

        {calendarDays.map(({ day, key }) => {
          const dayEvents = day ? getEventsForDay(day) : [];
          const isToday = day === todayDate && currentMonth === todayMonth && currentYear === todayYear;

          return (
            <div
              key={key}
              className={`calendar-cell ${day ? "" : "empty"} ${isToday ? "is-today" : ""}`}
            >
              {day && (
                <>
                  <span className={`cell-date ${isToday ? "today-number" : ""}`}>
                    {day}
                  </span>
                  <div className="cell-events">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="cell-event"
                        onClick={() => handleEdit(event)}
                      >
                        {event.company_name}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ManageCalendar;
