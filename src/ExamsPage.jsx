import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "./api";

export default function ExamsPage() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const initialFlash = location && location.state ? location.state.flash : "";
  const [localFlash, setLocalFlash] = useState(initialFlash || "");

  useEffect(() => {
    if (initialFlash) navigate(location.pathname, { replace: true, state: {} });
  }, [initialFlash, navigate, location.pathname]);

  useEffect(() => {
    if (!localFlash) return;
    const t = setTimeout(() => setLocalFlash(""), 3000);
    return () => clearTimeout(t);
  }, [localFlash]);

  useEffect(() => {
    api
      .get("/api/exams")
      .then((r) => setItems(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    api
      .get("/api/auth/me")
      .then((r) => setUser(r.data))
      .catch(() => setUser(null));
  }, []);

  async function del(id) {
    if (!confirm("Delete exam?")) return;
    try {
      await api.delete(`/api/exams/${id}`);
      setItems((s) => s.filter((x) => x._id !== id));
      setLocalFlash("Exam deleted");
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) return <p>Loading exams...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="panel">
      {localFlash && (
        <div style={{ marginBottom: 10, color: "limegreen", fontWeight: 700 }}>
          {localFlash}
        </div>
      )}
      <h2>Exams</h2>
      {user && user.role === "admin" && (
        <p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/exams/new")}
          >
            + Add Exam
          </button>
        </p>
      )}
      {items.length === 0 ? (
        <p className="muted">No exams defined.</p>
      ) : (
        items.map((e) => (
          <div className="list-item" key={e._id}>
            <div style={{ textAlign: "left" }}>
              <strong>{e.examType}</strong>
              <div className="muted">
                Sections: {(e.sections || []).join(", ")} • Timer:{" "}
                {e.timer || "—"}
              </div>
            </div>
            {user && user.role === "admin" && (
              <div>
                <button
                  className="btn"
                  onClick={() => navigate(`/exams/${e._id}/edit`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  style={{ marginLeft: 8 }}
                  onClick={() => del(e._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
