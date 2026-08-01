import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Loading from "../components/Loading";

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <p className="error-msg">{error}</p>;
  if (!job) return <p className="empty-msg">Job not found.</p>;

  return (
    <div className="job-details">
      <Link to="/jobs" className="back-link">
        &larr; Back to Jobs
      </Link>

      <div className="job-header">
        <h1>{job.company_name}</h1>
        <span className="job-role-badge">{job.role}</span>
      </div>

      <div className="job-quick-info">
        <div className="job-quick-item">
          <span className="job-quick-label">Package</span>
          <span className="job-quick-value highlight">{job.package}</span>
        </div>
        <div className="job-quick-item">
          <span className="job-quick-label">Deadline</span>
          <span className="job-quick-value">
            {new Date(job.deadline).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="job-quick-item">
          <span className="job-quick-label">Work Mode</span>
          <span className="job-quick-value">{job.work_mode}</span>
        </div>
      </div>

      <div className="job-details-grid">
        <div className="job-detail-card">
          <h4>Minimum CGPA</h4>
          <p className="job-detail-value">{job.minimum_cgpa || "N/A"}</p>
        </div>
        <div className="job-detail-card">
          <h4>Branch Eligibility</h4>
          <p className="job-detail-value">{job.branch_eligibility || "N/A"}</p>
        </div>
        <div className="job-detail-card">
          <h4>Backlogs Allowed</h4>
          <p className="job-detail-value">
            {job.active_backlogs_allowed ? "Yes" : "No"}
          </p>
        </div>
      </div>

      {job.skills_required && (
        <div className="job-section">
          <h3>Skills Required</h3>
          <p>{job.skills_required}</p>
        </div>
      )}

      {job.additional_notes && (
        <div className="job-section">
          <h3>Additional Notes</h3>
          <p>{job.additional_notes}</p>
        </div>
      )}

      <div className="job-apply-section">
        <a
          href={job.registration_link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary apply-btn"
        >
          Apply Now
        </a>
      </div>
    </div>
  );
}

export default JobDetails;
