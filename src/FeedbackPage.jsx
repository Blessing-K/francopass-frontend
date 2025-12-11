import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "./api";

export default function FeedbackPage() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const initialFlash = location && location.state ? location.state.flash : "";
  const [localFlash, setLocalFlash] = useState(initialFlash || "");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/feedback");
      setItems(res.data || []);
    } catch (e) {
      setError(
        e?.response?.data?.message || e.message || "Failed to load feedback"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    api
      .get("/api/auth/me")
      .then((r) => setUser(r.data))
      .catch(() => setUser(null));
  }, []);
  useEffect(() => {
    if (initialFlash) navigate(location.pathname, { replace: true, state: {} });
  }, [initialFlash, navigate, location.pathname]);

  useEffect(() => {
    if (!localFlash) return;
    const t = setTimeout(() => setLocalFlash(""), 3000);
    return () => clearTimeout(t);
  }, [localFlash]);

  async function del(id) {
    if (!confirm("Delete feedback?")) return;
    try {
      await api.delete(`/api/feedback/${id}`);
      setItems((s) => s.filter((x) => x._id !== id));
      setLocalFlash("Feedback deleted");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="panel">
      <h2>Feedback</h2>
      {localFlash && (
        <div style={{ marginBottom: 10, color: "limegreen", fontWeight: 700 }}>
          {localFlash}
        </div>
      )}
      <div
        style={{
          marginBottom: 12,
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        {user && user.role === "admin" && (
          <Link to="/feedback/new" className="btn btn-primary">
            + Add
          </Link>
        )}
        <button className="btn" onClick={load}>
          Reload
        </button>
        <div className="muted" style={{ marginLeft: "auto" }}>
          {loading ? "Loading..." : `${items.length} item(s)`}
        </div>
      </div>

      {error && <div style={{ color: "salmon", marginBottom: 8 }}>{error}</div>}

      {!loading && items.length === 0 && (
        <div>
          <p className="muted">
            No feedback available. Click <Link to="/feedback/new">Add</Link> to
            create one.
          </p>
        </div>
      )}

      {items.map((f) => {
        const user = f.userId;
        const userDisplay =
          typeof user === "object" && user !== null
            ? user.username || user.email || user._id
            : user || "unknown";

        return (
          <div className="list-item" key={f._id}>
            <div style={{ textAlign: "left" }}>
              <strong>{f.message || "—"}</strong>
              <div className="muted">
                User: {userDisplay} • Rating: {f.rating || "—"}
              </div>
            </div>
            {user && user.role === "admin" && (
              <div>
                <button
                  className="btn"
                  onClick={() => navigate(`/feedback/${f._id}/edit`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  style={{ marginLeft: 8 }}
                  onClick={() => del(f._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
