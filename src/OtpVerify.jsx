import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./api";

export default function OtpVerify() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const email = sessionStorage.getItem("mfa_email");
  // Do not auto-prefill OTP. If a dev/test OTP is available, show a small
  // option to paste it into the input so it's never inserted without user action.
  const devOtp = sessionStorage.getItem("dev_otp");

  if (!email) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p>
            No pending OTP. Please <a href="/login">login</a> first.
          </p>
        </div>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const res = await auth.verifyOtp(email, otp);
      const { token } = res.data;
      localStorage.setItem("token", token);
      sessionStorage.removeItem("mfa_email");
      sessionStorage.removeItem("dev_otp");
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Verify your login</h2>
        <p>
          We’ve sent a 6-digit code to {email}. Enter it below to finish signing
          in.
        </p>

        <form className="auth-form" onSubmit={submit}>
          {error && <div className="alert alert-error">{error}</div>}

          <label className="field">
            <div className="label">One-time code</div>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit code"
              autoComplete="off"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
            />
            {devOtp && (
              <div style={{ marginTop: 8 }}>
                <small style={{ color: "var(--muted)" }}>
                  Test OTP available for this session.
                </small>
                <div style={{ marginTop: 6 }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setOtp(devOtp)}
                  >
                    Use test OTP
                  </button>
                </div>
              </div>
            )}
          </label>

          <button className="btn primary full" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify and continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
