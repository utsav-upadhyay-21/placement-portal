import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loading from "../components/Loading";

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

function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  useEffect(() => {
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
    fetchEvents();
  }, []);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const startOfToday = new Date(
    todayYear,
    todayMonth,
    todayDate
  ).getTime();
  const upcomingEvents = events
    .filter(
      (event) =>
        new Date(event.visit_date).getTime() >= startOfToday
    )
    .sort(
      (a, b) => new Date(a.visit_date) - new Date(b.visit_date)
    );

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

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push({ day: null, key: `empty-${i}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, key: `day-${d}` });
  }

  if (loading) return <Loading />;

  return (
    <div className="calendar-view">
      <Link to="/" className="back-link">
        &larr; Back to Home
      </Link>

      <div className="calendar-top-bar">
        <h1>Placement Calendar</h1>
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
                        onClick={() => setSelectedEvent(event)}
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

      {upcomingEvents.length > 0 && (
        <div className="calendar-legend">
          <h3>Upcoming Events</h3>
          <div className="legend-list">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="legend-item"
                onClick={() => setSelectedEvent(event)}
              >
                <span className="legend-dot"></span>
                <span className="legend-name">{event.company_name}</span>
                <span className="legend-date">
                  {new Date(event.visit_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedEvent(null)}
            >
              &times;
            </button>
            <div className="modal-header-bar"></div>
            <h2>{selectedEvent.company_name}</h2>
            <p className="modal-date">
              {new Date(selectedEvent.visit_date).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            {selectedEvent.description && (
              <p className="modal-desc">{selectedEvent.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
