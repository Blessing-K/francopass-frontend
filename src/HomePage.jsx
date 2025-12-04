import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="hero hero--with-image">
          <div className="hero-content">
            <h2>Welcome to FrancoPass</h2>
            <p className="muted">
              Learn French with curated resources, build vocabulary, practice
              exams and collect feedback — all in one simple app.
            </p>

            <div className="hero-ctas">
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

          <div className="hero-media">
            {/* Image in public folder: /LearnFrenchFrancopassheroimage.jpeg */}
            <img
              src="/LearnFrenchFrancopassheroimage.jpeg"
              alt="Learn French — FrancoPass"
            />
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Explore FrancoPass</h3>
        <div className="features">
          <div className="feature">
            <h4>Resources</h4>
            <p className="muted">
              Articles, videos and courses to support learning.
            </p>
            <div style={{ marginTop: 10 }}>
              <Link to="/resources" className="btn">
                Open
              </Link>
            </div>
          </div>
          <div className="feature">
            <h4>Vocab Builder</h4>
            <p className="muted">
              Flashcards and examples to reinforce vocabulary.
            </p>
            <div style={{ marginTop: 10 }}>
              <Link to="/vocab" className="btn">
                Open
              </Link>
            </div>
          </div>
          <div className="feature">
            <h4>Exam Practice</h4>
            <p className="muted">Timed practice for DELF and TCF exams.</p>
            <div style={{ marginTop: 10 }}>
              <Link to="/exams" className="btn">
                Open
              </Link>
            </div>
          </div>
          <div className="feature">
            <h4>Feedback</h4>
            <p className="muted">Collect user feedback and ratings.</p>
            <div style={{ marginTop: 10 }}>
              <Link to="/feedback" className="btn">
                Open
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
