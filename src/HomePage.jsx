import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="hero" style={{ alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <h2>Welcome to FrancoPass</h2>
            <p className="muted">
              Learn French with curated resources, build vocabulary, practice
              exams and collect feedback — all in one simple app.
            </p>

            <div style={{ marginTop: 14 }}>
              <Link
                to="/resources"
                className="btn btn-primary"
                style={{ marginRight: 10 }}
              >
                Browse Resources
              </Link>
              <Link to="/vocab" className="btn">
                Browse Vocab
              </Link>
            </div>
          </div>

          <div style={{ width: 320 }}>
            <div className="features">
              <div className="feature">
                <h4>Resources</h4>
                <p className="muted">
                  Articles, videos and courses to support learning.
                </p>
              </div>
              <div className="feature">
                <h4>Vocab Builder</h4>
                <p className="muted">
                  Flashcards and examples to reinforce vocabulary.
                </p>
              </div>
              <div className="feature">
                <h4>Exam Practice</h4>
                <p className="muted">Timed practice for DELF and TCF exams.</p>
              </div>
              <div className="feature">
                <h4>Feedback</h4>
                <p className="muted">Collect user feedback and ratings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Quick Links</h3>
        <ul>
          <li>
            <Link to="/resources">Resources</Link>
          </li>
          <li>
            <Link to="/vocab">Vocab</Link>
          </li>
          <li>
            <Link to="/exams">Exams</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
          <li>
            <Link to="/feedback">Feedback</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
