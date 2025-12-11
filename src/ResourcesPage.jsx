import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "./api";

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const initialFlash = location && location.state ? location.state.flash : "";
  const [localFlash, setLocalFlash] = useState(initialFlash || "");

  useEffect(() => {
    // clear nav state if we were navigated here with a flash (we already copied it into local state)
    if (initialFlash) navigate(location.pathname, { replace: true, state: {} });
  }, [initialFlash, navigate, location.pathname]);

  // auto-dismiss flash messages after 3 seconds
  useEffect(() => {
    if (!localFlash) return;
    const t = setTimeout(() => setLocalFlash(""), 3000);
    return () => clearTimeout(t);
  }, [localFlash]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/api/resources`);
        setResources(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }

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

  async function handleDelete(id) {
    if (!confirm("Delete this resource?")) return;
    try {
      await api.delete(`/api/resources/${id}`);
      setResources((r) => r.filter((x) => x._id !== id));
      setLocalFlash("Resource deleted");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  if (loading) return <p>Loading resources...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="panel">
      {localFlash && (
        <div style={{ marginBottom: 10, color: "limegreen", fontWeight: 700 }}>
          {localFlash}
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>Resources</h2>
        {user && user.role === "admin" && (
          <div>
            <Link to="/resources/new" className="btn btn-primary">
              + Add Resource
            </Link>
          </div>
        )}
      </div>

      {resources.length === 0 ? (
        <p className="muted">No resources found.</p>
      ) : (
        <div className="resource-list">
          {resources.map((r) => (
            <div className="resource-card" key={r._id}>
              <div>
                <h4>{r.title}</h4>
                <div className="resource-meta">
                  {r.resourceType} • {r.languageLevel}
                </div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>
                  {r.description || ""}
                </div>
              </div>

              <div className="resource-actions">
                <a
                  className="open"
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open
                </a>
                {user && user.role === "admin" && (
                  <>
                    <button
                      className="edit"
                      onClick={() => navigate(`/resources/${r._id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(r._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
