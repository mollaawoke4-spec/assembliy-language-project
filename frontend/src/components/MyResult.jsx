import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { selectionAPI } from '../services/api';

function MyResult() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    selectionAPI.getMyResult()
      .then(res => setResult(res.data.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load result'))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">My Assignment Result</h2>
        <Link to="/dashboard" className="btn btn-outline-secondary btn-sm">← Dashboard</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {!result || result.status === 'Pending' ? (
        <div className="card shadow-sm text-center py-5">
          <div className="card-body">
            <div className="display-4 mb-3">⏳</div>
            <h4>Assignment Pending</h4>
            <p className="text-muted mb-0">
              {result?.message || 'The automatic assignment has not been completed yet. Please check back later.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className={`card shadow-lg border-0 ${result.status === 'Assigned' ? 'border-success' : 'border-danger'}`}>
              <div className={`card-header text-white py-3 ${result.status === 'Assigned' ? 'bg-success' : 'bg-danger'}`}>
                <h4 className="mb-0 text-center">
                  {result.status === 'Assigned' ? '✓ Department Assigned' : '✗ Not Assigned'}
                </h4>
              </div>
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <p className="text-muted mb-1">Student</p>
                  <h5>{user.first_name} {user.last_name}</h5>
                  <p className="text-muted">ID: {user.student_id}</p>
                </div>

                {result.status === 'Assigned' ? (
                  <>
                    <div className="row g-3 text-center mb-4">
                      <div className="col-md-6">
                        <div className="p-3 bg-light rounded">
                          <small className="text-muted d-block">Department</small>
                          <h4 className="mb-0 text-primary">{result.department_name}</h4>
                          <code>{result.department_code}</code>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-3 bg-light rounded">
                          <small className="text-muted d-block">College</small>
                          <h4 className="mb-0">{result.college_name}</h4>
                          <code>{result.college_code}</code>
                        </div>
                      </div>
                    </div>
                    <div className="row text-center">
                      <div className="col-4">
                        <small className="text-muted d-block">Preference Used</small>
                        <strong>#{result.choice_order}</strong>
                      </div>
                      <div className="col-4">
                        <small className="text-muted d-block">Score</small>
                        <strong>{result.score_used ?? '—'}</strong>
                      </div>
                      <div className="col-4">
                        <small className="text-muted d-block">Assigned On</small>
                        <strong>{result.assigned_at ? new Date(result.assigned_at).toLocaleDateString() : '—'}</strong>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-muted">{result.remarks || 'No available capacity in your selected departments.'}</p>
                    <p className="mb-0">Score: <strong>{result.score_used ?? '—'}</strong></p>
                  </div>
                )}

                <hr className="my-4" />
                <div className="text-center">
                  <button className="btn btn-outline-primary" onClick={() => window.print()}>
                    🖨️ Print Result
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyResult;
