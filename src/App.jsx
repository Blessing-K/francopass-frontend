import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
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
              <Link to="/users">Users</Link>
              <Link to="/feedback">Feedback</Link>
            </div>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/new" element={<ResourceForm />} />
            <Route path="/resources/:id/edit" element={<ResourceForm />} />

            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/users/:id/edit" element={<UserForm />} />

            <Route path="/vocab" element={<VocabPage />} />
            <Route path="/vocab/new" element={<VocabForm />} />
            <Route path="/vocab/:id/edit" element={<VocabForm />} />

            <Route path="/exams" element={<ExamsPage />} />
            <Route path="/exams/new" element={<ExamForm />} />
            <Route path="/exams/:id/edit" element={<ExamForm />} />

            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/feedback/new" element={<FeedbackForm />} />
            <Route path="/feedback/:id/edit" element={<FeedbackForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
