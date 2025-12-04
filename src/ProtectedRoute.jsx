import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { auth } from "./api";

// ProtectedRoute: wraps children and ensures user is authenticated
// props:
// - children: React node
// - allowedRoles: array of roles allowed (optional)
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  // Stable dependency for allowed roles to satisfy lint rules
  const allowedRolesKey = allowedRoles.join(",");

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await auth.me();
        const u = res.data;
        // If no specific roles required, allow any authenticated user
        const allowedList = allowedRolesKey ? allowedRolesKey.split(",") : [];
        if (allowedList.length === 0) {
          setForbidden(false);
        } else if (!allowedList.includes(u.role)) {
          // Authenticated but role not allowed
          setForbidden(true);
        } else {
          setForbidden(false);
        }
      } catch {
        // token invalid or fetch failed -> treat as unauthenticated
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [allowedRolesKey]);

  if (loading) return <div>Loading...</div>;

  // If not authenticated, redirect to login
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  // If authenticated but not allowed, show friendly Access Denied UI
  if (forbidden) {
    return (
      <div style={{ padding: 20 }}>
        <div className="access-denied">
          <h3>Access denied</h3>
          <p>
            You don’t have permission to view this page. If you think this is a
            mistake, contact an administrator or return to the homepage.
          </p>
          <div style={{ marginTop: 12 }}>
            <Link to="/" className="btn">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise allow access
  return children;
}
