import { Link, Navigate } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <p>Manage the placement portal</p>

      <div className="dashboard-grid">
        <Link to="/dashboard/calendar" className="dashboard-card">
          <div className="dashboard-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="14" x2="8" y2="14.01" />
              <line x1="12" y1="14" x2="12" y2="14.01" />
              <line x1="16" y1="14" x2="16" y2="14.01" />
              <line x1="8" y1="18" x2="8" y2="18.01" />
              <line x1="12" y1="18" x2="12" y2="18.01" />
            </svg>
          </div>
          <h2>Manage Calendar</h2>
          <p>Add, edit, or delete calendar events</p>
        </Link>

        <Link to="/dashboard/students" className="dashboard-card">
          <div className="dashboard-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
            </svg>
          </div>
          <h2>Manage Students</h2>
          <p>Search and update student details</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
