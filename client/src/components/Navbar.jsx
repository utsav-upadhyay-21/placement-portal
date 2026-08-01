import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className={`navbar ${token ? "navbar-admin" : ""}`}>
      <Link to="/" className="navbar-logo">
        <img
          src="https://i.ibb.co/qYRq69MV/rvitm-logo.webp"
          alt="RVITM Placement Portal"
          className="navbar-logo-img"
        />
      </Link>
      <div className="navbar-links">
        {token ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/dashboard/calendar">Manage Calendar</Link>
            <Link to="/dashboard/students">Manage Students</Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/student">Student</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
