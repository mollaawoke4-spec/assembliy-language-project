import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { departmentAPI, selectionAPI } from '../services/api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ colleges: 0, departments: 0, activeDepts: 0, totalCapacity: 0 });
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('');
  const [resultsSummary, setResultsSummary] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!localStorage.getItem('token') || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cRes, dRes, sRes] = await Promise.all([
        departmentAPI.getColleges(),
        departmentAPI.getDepartments(),
        selectionAPI.getSettings()
      ]);
      const depts = dRes.data.data || [];
      setStats({
        colleges: (cRes.data.data || []).length,
        departments: depts.length,
        activeDepts: depts.filter(d => d.is_active).length,
        totalCapacity: depts.reduce((sum, d) => sum + (d.capacity || 0), 0)
      });
      setSettings(sRes.data.data || {});
    } catch (e) {}
    finally { setLoading(false); }
  };

  const toggleSelection = async () => {
    const newVal = settings.selection_open === '1' ? '0' : '1';
    try {
      await selectionAPI.updateSettings({ selection_open: newVal });
      setSettings(prev => ({ ...prev, selection_open: newVal }));
      setMessage(newVal === '1' ? 'Selection opened successfully.' : 'Selection closed successfully.');
    } catch (e) {
      setMessage('Failed to update selection status.');
    }
  };

  const handleRunAssignment = async () => {
    if (!window.confirm('This will clear previous assignments and run the automatic allocation for all students who submitted choices. Continue?')) return;
    setRunning(true);
    setMessage('');
    try {
      const res = await selectionAPI.runAssignment();
      setMessage(res.data.message);
      setResultsSummary(res.data.data);
      setSettings(prev => ({ ...prev, assignment_done: '1' }));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Assignment failed');
    } finally {
      setRunning(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Admin Dashboard</h2>
          <small className="text-muted">Welcome, {user.first_name || user.student_id || 'Admin'}</small>
        </div>
        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
      </div>

      {message && (
        <div className={`alert ${message.includes('fail') || message.includes('Fail') ? 'alert-danger' : 'alert-success'} alert-dismissible`}>
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card text-center shadow-sm h-100 border-0">
                <div className="card-body">
                  <h3 className="text-primary mb-0">{stats.colleges}</h3>
                  <small className="text-muted">Colleges</small>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card text-center shadow-sm h-100 border-0">
                <div className="card-body">
                  <h3 className="text-primary mb-0">{stats.departments}</h3>
                  <small className="text-muted">Departments</small>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card text-center shadow-sm h-100 border-0">
                <div className="card-body">
                  <h3 className="text-success mb-0">{stats.activeDepts}</h3>
                  <small className="text-muted">Active Depts</small>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card text-center shadow-sm h-100 border-0">
                <div className="card-body">
                  <h3 className="text-info mb-0">{stats.totalCapacity}</h3>
                  <small className="text-muted">Total Capacity</small>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mb-4 border-0">
            <div className="card-body">
              <h5 className="card-title">Selection Control</h5>
              <div className="d-flex flex-wrap gap-3 align-items-center">
                <span>
                  Status: 
                  <span className={`badge ms-2 ${settings.selection_open === '1' ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {settings.selection_open === '1' ? 'OPEN' : 'CLOSED'}
                  </span>
                </span>
                <button className={`btn btn-sm ${settings.selection_open === '1' ? 'btn-warning' : 'btn-success'}`}
                  onClick={toggleSelection}>
                  {settings.selection_open === '1' ? 'Close Selection' : 'Open Selection'}
                </button>
                <span className="text-muted small">Max choices: {settings.max_choices || 3}</span>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mb-4 border-0">
            <div className="card-body">
              <h5 className="card-title">Automatic Assignment</h5>
              <p className="text-muted small">
                Runs merit-based assignment: students ordered by score → fill 1st choice if capacity available → otherwise 2nd → 3rd.
              </p>
              <button className="btn btn-danger" onClick={handleRunAssignment} disabled={running}>
                {running ? 'Running Assignment...' : '▶ Run Automatic Assignment'}
              </button>
              {resultsSummary && (
                <div className="mt-3 p-3 bg-light rounded">
                  <strong>Last Run Summary:</strong>
                  <ul className="mb-0 mt-1">
                    <li>Total students processed: {resultsSummary.total_students}</li>
                    <li className="text-success">Assigned: {resultsSummary.assigned}</li>
                    <li className="text-danger">Not Assigned: {resultsSummary.not_assigned}</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-4">
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body">
                  <h5 className="card-title">Departments</h5>
                  <p className="text-muted small">Manage colleges, departments, capacity & requirements.</p>
                  <Link to="/admin/departments" className="btn btn-primary btn-sm">Manage Departments</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body">
                  <h5 className="card-title">Assignment Results</h5>
                  <p className="text-muted small">View all student assignment results.</p>
                  <Link to="/admin/results" className="btn btn-primary btn-sm">View Results</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body">
                  <h5 className="card-title">Home Page</h5>
                  <p className="text-muted small">Return to the public landing page.</p>
                  <Link to="/" className="btn btn-outline-secondary btn-sm">Go Home</Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
