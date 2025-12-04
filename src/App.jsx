import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import HomePage from "./HomePage";
import ResourcesPage from "./ResourcesPage";
import ResourceForm from "./ResourceForm";

import UsersPage from "./UsersPage";
import UserForm from "./UserForm";

import VocabPage from "./VocabPage";
import VocabForm from "./VocabForm";

import ExamsPage from "./ExamsPage";
import ExamForm from "./ExamForm";

import FeedbackPage from "./FeedbackPage";
import FeedbackForm from "./FeedbackForm";
import Login from "./Login";
import OtpVerify from "./OtpVerify";
import Signup from "./Signup";
import { useState, useEffect } from "react";
import { auth } from "./api";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  // Do not keep a separate token state to avoid sync/setState warnings —
  // derive current token from localStorage when rendering.
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    // Load current user when the app mounts or when the route changes
    // (e.g. after login redirect). We derive the token from localStorage
    // rather than storing it in React state to avoid cascading setState calls.
    const loadUser = async () => {
      const t = localStorage.getItem("token");
      if (!t) {
        setUser(null);
        return;
      }
      try {
        const res = await auth.me();
        setUser(res.data);
      } catch (err) {
        console.warn(
          "Failed fetching user",
          err?.response?.data || err.message
        );
        localStorage.removeItem("token");
        setUser(null);
      }
    };
    loadUser();
  }, [location.pathname]);
  return (
    <div className="app-container">
      {!["/login", "/signup", "/verify-otp"].includes(location.pathname) && (
        <header className="app-header">
          <div className="brand">
            <div className="brand-logo">FP</div>
            <div className="brand-text">
              <h1>FrancoPass</h1>
              <div className="brand-sub">
                Learning French — resources, vocab, exams
              </div>
            </div>
            <div className="flag-wrap">
              <div className="fr-flag" title="France" />
            </div>
          </div>

          <nav>
            <div className="app-nav">
              <Link to="/">Home</Link>
              <Link to="/resources">Resources</Link>
              <Link to="/vocab">Vocab</Link>
              <Link to="/exams">Exams</Link>
              {user?.role === "admin" && <Link to="/users">Users</Link>}
              <Link to="/feedback">Feedback</Link>
              {!token ? (
                <Link to="/login">Login</Link>
              ) : (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                >
                  Logout
                </a>
              )}
            </div>
          </nav>
        </header>
      )}

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <ResourcesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources/new"
            element={
              <ProtectedRoute>
                <ResourceForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources/:id/edit"
            element={
              <ProtectedRoute>
                <ResourceForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/new"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vocab"
            element={
              <ProtectedRoute>
                <VocabPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vocab/new"
            element={
              <ProtectedRoute>
                <VocabForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vocab/:id/edit"
            element={
              <ProtectedRoute>
                <VocabForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/exams"
            element={
              <ProtectedRoute>
                <ExamsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/new"
            element={
              <ProtectedRoute>
                <ExamForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/:id/edit"
            element={
              <ProtectedRoute>
                <ExamForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <FeedbackPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback/new"
            element={
              <ProtectedRoute>
                <FeedbackForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback/:id/edit"
            element={
              <ProtectedRoute>
                <FeedbackForm />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<OtpVerify />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="brand-logo">FP</div>
            <div className="brand-text">
              <strong>FrancoPass</strong>
              <div className="muted">Learning French — resources & exams</div>
            </div>
          </div>

          <div className="footer-links">
            <Link to="/resources">Resources</Link>
            <Link to="/vocab">Vocab</Link>
            <Link to="/exams">Exams</Link>
            <Link to="/feedback">Feedback</Link>
          </div>

          <div className="footer-contact">
            <div className="contact-icons">
              <a
                href="mailto:hello@francopass.local"
                aria-label="Email"
                title="Email"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 7.5L12 13L21 7.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                title="Twitter"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43 1s-2 1.2-3.8 1.71A4.48 4.48 0 0 0 12 6v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5A4.5 4.5 0 0 0 23 3z"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </svg>
              </a>
              <a href="#" aria-label="Help" title="Help">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM9.09 9a3 3 0 1 1 5.82 1c0 2-3 2.5-3 5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} FrancoPass
        </div>
      </footer>
    </div>
  );
}

export default App;
