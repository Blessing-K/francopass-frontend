import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./api";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!identifier || !password) {
      setError("Please enter email/username and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await auth.login(identifier, password);
      // Backend returns email for OTP flow (and in dev may return otp/previewUrl)
      const { email, otp, previewUrl } = res.data;
      sessionStorage.setItem("mfa_email", email || identifier);
      // Optionally show OTP/preview for developer convenience
      if (otp) sessionStorage.setItem("dev_otp", otp);
      if (previewUrl) sessionStorage.setItem("dev_preview", previewUrl);
      navigate("/verify-otp");
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-logo">FP</div>
          <h2>Sign in to FrancoPass</h2>
          <p className="subtitle">Enter your email and password to continue.</p>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {error && <div className="alert alert-error">{error}</div>}

          <label className="field">
            <div className="label">Email</div>
            <input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </label>

          <label className="field">
            <div className="label">Password</div>
            <div className="password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye"
                onClick={() => setShowPassword((s) => !s)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button className="btn primary full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Continue"}
          </button>

          <div className="auth-footer">
            <small>
              New here? <Link to="/signup">Create an account</Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}
