import { Link, useNavigate } from "react-router-dom";
import { getRole, clearToken } from "../utils/auth";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const role = getRole();

  const handleLogout = () => {
    clearToken();
    navigate(role === "student" ? "/student/login" : "/");
  };

  return (
    <nav className={`navbar ${role ? "navbar-admin" : ""}`}>
      <Link to="/" className="navbar-logo">
        Placement Portal
      </Link>
      <div className="navbar-links">
        {role === "admin" ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/dashboard/calendar">Manage Calendar</Link>
            <Link to="/dashboard/students">Manage Students</Link>
            <Link to="/dashboard/materials">Materials</Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : role === "student" ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/student/dashboard">Dashboard</Link>
            <Link to="/calendar">Calendar</Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/student/login">Student</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
