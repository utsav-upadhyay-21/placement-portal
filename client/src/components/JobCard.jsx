import { Link } from "react-router-dom";

function JobCard({ job }) {
  return (
    <div className="job-card">
      <h3>{job.company_name}</h3>
      <p className="job-role">{job.role}</p>
      <p className="job-package">{job.package}</p>
      <p className="job-deadline">
        Deadline: {new Date(job.deadline).toLocaleDateString("en-IN")}
      </p>
      <Link to={`/jobs/${job.id}`} className="btn-primary">
        View Details
      </Link>
    </div>
  );
}

export default JobCard;
