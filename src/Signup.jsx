import { useState } from "react";
import { api } from "./api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/api/users", { username, email, password });
      setSuccess("Signup successful. Please login.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err?.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-logo">FP</div>
          <h2>Create your account</h2>
          <div className="subtitle">Sign up to start using FrancoPass</div>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert">{success}</div>}

          <label className="field">
            <div className="label">Username</div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="field">
            <div className="label">Email</div>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="field">
            <div className="label">Password</div>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button className="btn primary full" type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
