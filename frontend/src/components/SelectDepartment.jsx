import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { selectionAPI } from '../services/api';

function SelectDepartment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [eligible, setEligible] = useState([]);
  const [studentScores, setStudentScores] = useState(null);
  const [myChoices, setMyChoices] = useState([]);
  const [selected, setSelected] = useState([]); // array of department ids in order
  const [settings, setSettings] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || user.role !== 'student') {
      navigate('/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [eligRes, choicesRes, settingsRes] = await Promise.all([
        selectionAPI.getEligible(),
        selectionAPI.getMyChoices(),
        selectionAPI.getSettings()
      ]);

      setEligible(eligRes.data.data.departments || []);
      setStudentScores(eligRes.data.data.student_scores);
      setSettings(settingsRes.data.data || {});

      const existing = choicesRes.data.data || [];
      setMyChoices(existing);
      setSelected(existing.map(c => c.department_id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const maxChoices = parseInt(settings.max_choices || '3', 10);
  const isOpen = settings.selection_open === '1';

  const toggleSelect = (deptId) => {
    if (!isOpen) return;
    setError('');
    setSuccess('');

    if (selected.includes(deptId)) {
      setSelected(selected.filter(id => id !== deptId));
    } else {
      if (selected.length >= maxChoices) {
        setError(`You can select maximum ${maxChoices} departments.`);
        return;
      }
      setSelected([...selected, deptId]);
    }
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newSel = [...selected];
    [newSel[index - 1], newSel[index]] = [newSel[index], newSel[index - 1]];
    setSelected(newSel);
  };

  const moveDown = (index) => {
    if (index === selected.length - 1) return;
    const newSel = [...selected];
    [newSel[index], newSel[index + 1]] = [newSel[index + 1], newSel[index]];
    setSelected(newSel);
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      setError('Please select at least one department.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');

    const choices = selected.map((deptId, idx) => ({
      department_id: deptId,
      choice_order: idx + 1
    }));

    try {
      await selectionAPI.submitChoices(choices);
      setSuccess('Your preferences have been saved successfully!');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const getDept = (id) => eligible.find(d => d.id === id);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading eligible departments...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="mb-0">Select Departments</h2>
          <small className="text-muted">Choose up to {maxChoices} departments in order of preference</small>
        </div>
        <Link to="/dashboard" className="btn btn-outline-secondary btn-sm">← Dashboard</Link>
      </div>

      {/* Status */}
      {!isOpen && (
        <div className="alert alert-warning">
          <strong>Selection is currently closed.</strong> You can view your previous choices but cannot change them.
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Student Scores Summary */}
      {studentScores && (
        <div className="card shadow-sm mb-4">
          <div className="card-body py-3">
            <div className="row text-center g-2">
              <div className="col"><small className="text-muted d-block">Total Score</small><strong>{studentScores.total_score ?? '—'}</strong></div>
              <div className="col"><small className="text-muted d-block">GPA</small><strong>{studentScores.gpa ?? '—'}</strong></div>
              <div className="col"><small className="text-muted d-block">Math</small><strong>{studentScores.mathematics_score ?? '—'}</strong></div>
              <div className="col"><small className="text-muted d-block">Science</small><strong>{studentScores.science_score ?? '—'}</strong></div>
              <div className="col"><small className="text-muted d-block">Stream</small><strong>{studentScores.stream ?? '—'}</strong></div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        {/* Available Departments */}
        <div className="col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
              <strong>Eligible Departments</strong>
              <span className="badge bg-primary ms-2">{eligible.length}</span>
            </div>
            <div className="card-body p-0" style={{ maxHeight: 480, overflowY: 'auto' }}>
              {eligible.length === 0 ? (
                <p className="text-muted text-center py-5">No eligible departments found based on your scores.</p>
              ) : (
                <div className="list-group list-group-flush">
                  {eligible.map(d => {
                    const isSelected = selected.includes(d.id);
                    const order = selected.indexOf(d.id) + 1;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isSelected ? 'list-group-item-primary' : ''}`}
                        onClick={() => toggleSelect(d.id)}
                        disabled={!isOpen && !isSelected}
                      >
                        <div className="text-start">
                          <strong>{d.name}</strong>
                          <small className="d-block text-muted">{d.college_name} • Capacity: {d.remaining_capacity}/{d.capacity}</small>
                          {d.min_total_score > 0 && (
                            <small className="text-muted">Min Score: {d.min_total_score}</small>
                          )}
                        </div>
                        {isSelected && (
                          <span className="badge bg-primary rounded-pill">#{order}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Preferences */}
        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <strong>Your Preferences</strong>
              <span className="badge bg-secondary">{selected.length}/{maxChoices}</span>
            </div>
            <div className="card-body">
              {selected.length === 0 ? (
                <p className="text-muted text-center py-4">Click departments on the left to add them here.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {selected.map((id, index) => {
                    const d = getDept(id);
                    if (!d) return null;
                    return (
                      <li key={id} className="list-group-item d-flex align-items-center px-0">
                        <span className="badge bg-primary me-3" style={{ width: 28 }}>{index + 1}</span>
                        <div className="flex-grow-1">
                          <strong>{d.name}</strong>
                          <small className="d-block text-muted">{d.college_name}</small>
                        </div>
                        {isOpen && (
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-secondary" onClick={() => moveUp(index)} disabled={index === 0}>↑</button>
                            <button className="btn btn-outline-secondary" onClick={() => moveDown(index)} disabled={index === selected.length - 1}>↓</button>
                            <button className="btn btn-outline-danger" onClick={() => toggleSelect(id)}>×</button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}

              {isOpen && (
                <button
                  className="btn btn-success w-100 mt-4"
                  onClick={handleSubmit}
                  disabled={saving || selected.length === 0}
                >
                  {saving ? 'Saving...' : 'Save Preferences'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectDepartment;
