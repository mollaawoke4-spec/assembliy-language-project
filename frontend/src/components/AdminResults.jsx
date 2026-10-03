import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { selectionAPI } from '../services/api';

function AdminResults() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!localStorage.getItem('token') || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    selectionAPI.getAllResults()
      .then(res => setResults(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const filtered = filter === 'all' 
    ? results 
    : results.filter(r => r.status === filter);

  const assigned = results.filter(r => r.status === 'Assigned').length;
  const notAssigned = results.filter(r => r.status === 'Not Assigned').length;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="mb-0">Assignment Results</h2>
          <small className="text-muted">
            Total: {results.length} | Assigned: {assigned} | Not Assigned: {notAssigned}
          </small>
        </div>
        <Link to="/admin" className="btn btn-outline-secondary btn-sm">← Admin Home</Link>
      </div>

      <div className="mb-3">
        <div className="btn-group btn-group-sm">
          <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('all')}>All</button>
          <button className={`btn ${filter === 'Assigned' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setFilter('Assigned')}>Assigned</button>
          <button className={`btn ${filter === 'Not Assigned' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setFilter('Not Assigned')}>Not Assigned</button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Score</th>
                  <th>Department</th>
                  <th>College</th>
                  <th>Choice #</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="7" className="text-center text-muted py-4">No results found. Run the assignment first.</td></tr>
                ) : filtered.map(r => (
                  <tr key={r.id}>
                    <td><code>{r.student_id}</code></td>
                    <td>{r.first_name} {r.last_name}</td>
                    <td>{r.score_used ?? '—'}</td>
                    <td>{r.department_name || '—'}</td>
                    <td>{r.college_name || '—'}</td>
                    <td>{r.choice_order ? `#${r.choice_order}` : '—'}</td>
                    <td>
                      <span className={`badge ${r.status === 'Assigned' ? 'bg-success' : 'bg-danger'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminResults;
