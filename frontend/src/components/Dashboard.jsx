import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, selectionAPI } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [result, setResult] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    Promise.all([
      authAPI.getProfile(),
      selectionAPI.getMyResult().catch(() => ({ data: { data: null } })),
      selectionAPI.getSettings().catch(() => ({ data: { data: {} } }))
    ])
      .then(([profRes, resultRes, settingsRes]) => {
        if (profRes.data.success) setProfile(profRes.data.data);
        setResult(resultRes.data.data);
        setSettings(settingsRes.data.data || {});
      })
      .catch(() => {
        localStorage.clear();
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  const isOpen = settings.selection_open === '1';

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Student Dashboard</h2>
        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body">
              <h5 className="card-title text-primary">Welcome</h5>
              <p className="mb-1"><strong>{profile?.first_name} {profile?.last_name}</strong></p>
              <p className="text-muted mb-1">Student ID: {profile?.student_id}</p>
              <p className="text-muted mb-0">Email: {profile?.email}</p>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body">
              <h5 className="card-title text-primary">Academic Summary</h5>
              <div className="row">
                <div className="col-6 col-md-3">
                  <small className="text-muted">Total Score</small>
                  <p className="fw-bold fs-5">{profile?.total_score ?? '—'}</p>
                </div>
                <div className="col-6 col-md-3">
                  <small className="text-muted">GPA</small>
                  <p className="fw-bold fs-5">{profile?.gpa ?? '—'}</p>
                </div>
                <div className="col-6 col-md-3">
                  <small className="text-muted">Stream</small>
                  <p className="fw-bold">{profile?.stream ?? '—'}</p>
                </div>
                <div className="col-6 col-md-3">
                  <small className="text-muted">Category</small>
                  <p className="fw-bold">{profile?.category ?? '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body">
              <h5 className="card-title">Department Selection</h5>
              <p className="text-muted small">
                {isOpen 
                  ? 'Selection is open. Choose your preferred departments.' 
                  : 'Selection is currently closed.'}
              </p>
              <Link to="/select" className="btn btn-primary">
                {isOpen ? 'Select Departments' : 'View My Choices'}
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body">
              <h5 className="card-title">My Result</h5>
              {result && result.status === 'Assigned' ? (
                <>
                  <p className="mb-1"><strong className="text-success">{result.department_name}</strong></p>
                  <p className="text-muted small mb-2">{result.college_name}</p>
                  <Link to="/result" className="btn btn-success btn-sm">View Full Result</Link>
                </>
              ) : result && result.status === 'Not Assigned' ? (
                <>
                  <p className="text-danger mb-2">Not Assigned</p>
                  <Link to="/result" className="btn btn-outline-danger btn-sm">View Details</Link>
                </>
              ) : (
                <>
                  <p className="text-muted small mb-2">Assignment not yet completed.</p>
                  <Link to="/result" className="btn btn-outline-secondary btn-sm">Check Result</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
