import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "./api";

export default function VocabPage() {
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
      .get(`/api/vocab`)
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
    if (!confirm("Delete this entry?")) return;
    try {
      await api.delete(`/api/vocab/${id}`);
      setItems((s) => s.filter((x) => x._id !== id));
      setLocalFlash("Vocab deleted");
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) return <p>Loading vocab...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="panel">
      {localFlash && (
        <div style={{ marginBottom: 10, color: "limegreen", fontWeight: 700 }}>
          {localFlash}
        </div>
      )}
      <h2>Vocab</h2>
      <p>
        <Link to="/vocab/new" className="btn btn-primary">
          + Add
        </Link>
      </p>
      {items.length === 0 ? (
        <p className="muted">No vocab yet.</p>
      ) : (
        items.map((v) => (
          <div key={v._id} className="list-item">
            <div style={{ textAlign: "left" }}>
              <strong>{v.word}</strong>
              <div className="muted">
                {v.partOfSpeech} • {v.difficultyLevel}
              </div>
            </div>
            <div>
              {user &&
              (user.role === "admin" ||
                String(user.id) === String(v.createdBy)) ? (
                <>
                  <button
                    className="btn"
                    onClick={() => navigate(`/vocab/${v._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ marginLeft: 8 }}
                    onClick={() => del(v._id)}
                  >
                    Delete
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
