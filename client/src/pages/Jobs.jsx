import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loading from "../components/Loading";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await api.get("/jobs");
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="manage-page">
      <Link to="/" className="back-link">
        &larr; Back to Home
      </Link>

      <h1>Available Jobs</h1>
      <p style={{ color: "var(--text-light)", marginBottom: "1.5rem" }}>
        Browse active placement opportunities
      </p>

      {error && <p className="error-msg">{error}</p>}

      <div className="manage-list">
        {jobs.length === 0 ? (
          <p className="empty-msg">No active job postings at the moment.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Package</th>
                <th>Deadline</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.company_name}</td>
                  <td>{job.role}</td>
                  <td>{job.package}</td>
                  <td>
                    {new Date(job.deadline).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    <Link to={`/jobs/${job.id}`} className="btn-edit">
                      View Details
                    </Link>
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

export default Jobs;
