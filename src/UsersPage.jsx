import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "./api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
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
      .get(`/api/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err?.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`);
      setUsers((u) => u.filter((x) => x._id !== id));
      setLocalFlash("User deleted");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="panel">
      {localFlash && (
        <div style={{ marginBottom: 10, color: "limegreen", fontWeight: 700 }}>
          {localFlash}
        </div>
      )}
      <h2>Users</h2>
      <p>
        <Link to="/users/new" className="btn btn-primary">
          + Add User
        </Link>
      </p>
      <div>
        {users.length === 0 ? (
          <p className="muted">No users found.</p>
        ) : (
          users.map((u) => (
            <div className="list-item" key={u._id}>
              <div style={{ textAlign: "left" }}>
                <strong>{u.username}</strong>
                <div className="muted">
                  {u.email} • {u.subscription}
                </div>
              </div>
              <div>
                <button
                  onClick={() => navigate(`/users/${u._id}/edit`)}
                  className="btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u._id)}
                  className="btn btn-danger"
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
