import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { setToken } from "../utils/auth";

function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api.post("/auth/login", { email, password });
      setToken(data.token);
      navigate("/student/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="back-link">
          &larr; Back to Home
        </Link>
        <h1>Student Login</h1>
        <p className="login-hint">
          Use your college email and USN as password
        </p>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>College Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name.rvitm@rvei.edu.in"
              required
            />
          </div>
          <div className="form-group">
            <label>USN (ALL CAPS)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g., 1RF24IS001"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentLogin;
