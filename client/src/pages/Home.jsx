import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>RVITM Campus Placement Portal</h1>
        <p>Track Companies Coming to College</p>
      </section>

      <section className="feature-cards">
        <Link to="/calendar" className="feature-card calendar-feature">
          <div className="feature-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
          <h2>Placement Calendar</h2>
          <p>View the recruitment calendar and key deadlines</p>
        </Link>

        <Link to="/student" className="feature-card student-feature">
          <div className="feature-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
            </svg>
          </div>
          <h2>ISE Student Details</h2>
          <p>Review your academic details</p>
        </Link>
      </section>
    </div>
  );
}

export default Home;
