import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { selectionAPI } from '../services/api';

function Home() {
  const [settings, setSettings] = useState({});
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    selectionAPI.getSettings()
      .then(res => setSettings(res.data.data || {}))
      .catch(() => {});
  }, []);

  const isSelectionOpen = settings.selection_open === '1';

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className="display-5 fw-bold mb-3">Department Selection System</h1>
              <p className="lead mb-4 opacity-90">
                A modern platform for university students to select their preferred academic departments 
                based on eligibility, capacity, and merit.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                {user ? (
                  user.role === 'admin' ? (
                    <Link to="/admin" className="btn btn-light btn-lg px-4">Go to Admin Panel</Link>
                  ) : (
                    <>
                      <Link to="/dashboard" className="btn btn-light btn-lg px-4">My Dashboard</Link>
                      <Link to="/select" className="btn btn-outline-light btn-lg px-4">Select Department</Link>
                    </>
                  )
                ) : (
                  <>
                    <Link to="/register" className="btn btn-light btn-lg px-4">Register Now</Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg px-4">Login</Link>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-5 text-center d-none d-lg-block">
              <div className="bg-white bg-opacity-10 rounded-4 p-5">
                <div className="display-1 mb-2">🎓</div>
                <h4 className="mb-0">Choose Your Future</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Status Banner */}
      <div className={`py-3 ${isSelectionOpen ? 'bg-success' : 'bg-warning'} text-white text-center`}>
        <div className="container">
          <strong>
            {isSelectionOpen 
              ? '🟢 Department Selection is currently OPEN' 
              : '🟡 Department Selection is currently CLOSED'}
          </strong>
          {settings.selection_message && (
            <span className="ms-2 opacity-90">— {settings.selection_message}</span>
          )}
        </div>
      </div>

      {/* Features */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">How It Works</h2>
            <p className="text-muted">Simple, transparent, and fair department assignment</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-3">
                <div className="card-body">
                  <div className="fs-1 mb-3">📝</div>
                  <h5 className="card-title">1. Register & Profile</h5>
                  <p className="card-text text-muted">
                    Create your account and enter your academic scores and personal information.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-3">
                <div className="card-body">
                  <div className="fs-1 mb-3">🎯</div>
                  <h5 className="card-title">2. Select Preferences</h5>
                  <p className="card-text text-muted">
                    Choose up to 3 departments you are eligible for, ranked by priority (1st, 2nd, 3rd).
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-3">
                <div className="card-body">
                  <div className="fs-1 mb-3">🏆</div>
                  <h5 className="card-title">3. Get Assigned</h5>
                  <p className="card-text text-muted">
                    The system automatically assigns departments based on merit, preferences, and capacity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h3 className="fw-bold mb-3">Ready to begin?</h3>
          <p className="text-muted mb-4">Join hundreds of students selecting their academic path.</p>
          {!user && (
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/register" className="btn btn-primary btn-lg px-5">Create Account</Link>
              <Link to="/login" className="btn btn-outline-primary btn-lg px-5">Login</Link>
            </div>
          )}
          {user && user.role === 'student' && (
            <Link to="/select" className="btn btn-primary btn-lg px-5">Go to Selection</Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white-50 py-4">
        <div className="container text-center">
          <small>© {new Date().getFullYear()} Department Selection System — University Portal</small>
        </div>
      </footer>
    </div>
  );
}

export default Home;
