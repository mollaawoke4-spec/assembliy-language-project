import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { departmentAPI } from '../services/api';

function AdminDepartments() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterCollege, setFilterCollege] = useState('');

  const emptyForm = {
    college_id: '',
    name: '',
    code: '',
    description: '',
    capacity: 30,
    min_total_score: 0,
    min_gpa: 0,
    min_english: 0,
    min_mathematics: 0,
    min_science: 0,
    min_social: 0,
    allowed_stream: '',
    priority_order: 100,
    is_active: 1
  };

  const [formData, setFormData] = useState(emptyForm);

  // Check admin
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
      const [deptRes, collegeRes] = await Promise.all([
        departmentAPI.getDepartments(),
        departmentAPI.getColleges()
      ]);
      setDepartments(deptRes.data.data || []);
      setColleges(collegeRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const openEdit = (dept) => {
    setEditingId(dept.id);
    setFormData({
      college_id: dept.college_id,
      name: dept.name,
      code: dept.code || '',
      description: dept.description || '',
      capacity: dept.capacity,
      min_total_score: dept.min_total_score || 0,
      min_gpa: dept.min_gpa || 0,
      min_english: dept.min_english || 0,
      min_mathematics: dept.min_mathematics || 0,
      min_science: dept.min_science || 0,
      min_social: dept.min_social || 0,
      allowed_stream: dept.allowed_stream || '',
      priority_order: dept.priority_order || 100,
      is_active: dept.is_active
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      ...formData,
      college_id: parseInt(formData.college_id, 10),
      capacity: parseInt(formData.capacity, 10) || 0,
      min_total_score: parseFloat(formData.min_total_score) || 0,
      min_gpa: parseFloat(formData.min_gpa) || 0,
      min_english: parseFloat(formData.min_english) || 0,
      min_mathematics: parseFloat(formData.min_mathematics) || 0,
      min_science: parseFloat(formData.min_science) || 0,
      min_social: parseFloat(formData.min_social) || 0,
      priority_order: parseInt(formData.priority_order, 10) || 100,
      allowed_stream: formData.allowed_stream || null,
      is_active: parseInt(formData.is_active, 10)
    };

    try {
      if (editingId) {
        await departmentAPI.updateDepartment(editingId, payload);
        setSuccess('Department updated successfully.');
      } else {
        await departmentAPI.createDepartment(payload);
        setSuccess('Department created successfully.');
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Operation failed');
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this department? Students will no longer see it.')) return;
    try {
      await departmentAPI.deleteDepartment(id);
      setSuccess('Department deactivated.');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deactivate');
    }
  };

  const filtered = filterCollege
    ? departments.filter(d => String(d.college_id) === String(filterCollege))
    : departments;

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading departments...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="mb-0">Department Management</h2>
          <small className="text-muted">Admin Panel</small>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin" className="btn btn-outline-secondary btn-sm">← Admin Home</Link>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>+ New Department</button>
        </div>
      </div>

      {error && <div className="alert alert-danger alert-dismissible">{error}
        <button type="button" className="btn-close" onClick={() => setError('')}></button>
      </div>}
      {success && <div className="alert alert-success alert-dismissible">{success}
        <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
      </div>}

      {/* Filter */}
      <div className="mb-3">
        <select className="form-select form-select-sm w-auto" value={filterCollege}
          onChange={(e) => setFilterCollege(e.target.value)}>
          <option value="">All Colleges</option>
          {colleges.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Code</th>
                <th>Department</th>
                <th>College</th>
                <th>Capacity</th>
                <th>Remaining</th>
                <th>Min Score</th>
                <th>Stream</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="9" className="text-center text-muted py-4">No departments found</td></tr>
              ) : filtered.map(d => (
                <tr key={d.id} className={!d.is_active ? 'table-secondary' : ''}>
                  <td><code>{d.code || '—'}</code></td>
                  <td>
                    <strong>{d.name}</strong>
                    {d.description && <small className="d-block text-muted">{d.description.substring(0, 40)}...</small>}
                  </td>
                  <td>{d.college_name}</td>
                  <td>{d.capacity}</td>
                  <td>
                    <span className={d.remaining_capacity <= 5 ? 'text-danger fw-bold' : ''}>
                      {d.remaining_capacity}
                    </span>
                  </td>
                  <td>{d.min_total_score || '—'}</td>
                  <td>{d.allowed_stream || 'Any'}</td>
                  <td>
                    <span className={`badge ${d.is_active ? 'bg-success' : 'bg-secondary'}`}>
                      {d.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-primary" onClick={() => openEdit(d)}>Edit</button>
                      {d.is_active && (
                        <button className="btn btn-outline-danger" onClick={() => handleDeactivate(d.id)}>Deactivate</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingId ? 'Edit Department' : 'New Department'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">College <span className="text-danger">*</span></label>
                      <select className="form-select" name="college_id" value={formData.college_id}
                        onChange={handleChange} required>
                        <option value="">Select College...</option>
                        {colleges.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Department Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" name="name" value={formData.name}
                        onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Code</label>
                      <input type="text" className="form-control" name="code" value={formData.code}
                        onChange={handleChange} placeholder="e.g. CS" />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Capacity <span className="text-danger">*</span></label>
                      <input type="number" className="form-control" name="capacity" value={formData.capacity}
                        onChange={handleChange} min="0" required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Priority Order</label>
                      <input type="number" className="form-control" name="priority_order"
                        value={formData.priority_order} onChange={handleChange} />
                      <small className="text-muted">Lower = higher priority</small>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea className="form-control" name="description" rows="2"
                        value={formData.description} onChange={handleChange}></textarea>
                    </div>

                    <div className="col-12"><hr className="my-1" /><strong>Minimum Requirements</strong></div>

                    <div className="col-md-3">
                      <label className="form-label">Min Total Score</label>
                      <input type="number" step="0.01" className="form-control" name="min_total_score"
                        value={formData.min_total_score} onChange={handleChange} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Min GPA</label>
                      <input type="number" step="0.01" className="form-control" name="min_gpa"
                        value={formData.min_gpa} onChange={handleChange} min="0" max="4" />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Min Mathematics</label>
                      <input type="number" step="0.01" className="form-control" name="min_mathematics"
                        value={formData.min_mathematics} onChange={handleChange} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Min Science</label>
                      <input type="number" step="0.01" className="form-control" name="min_science"
                        value={formData.min_science} onChange={handleChange} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Min English</label>
                      <input type="number" step="0.01" className="form-control" name="min_english"
                        value={formData.min_english} onChange={handleChange} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Min Social</label>
                      <input type="number" step="0.01" className="form-control" name="min_social"
                        value={formData.min_social} onChange={handleChange} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Allowed Stream</label>
                      <select className="form-select" name="allowed_stream" value={formData.allowed_stream}
                        onChange={handleChange}>
                        <option value="">Any Stream</option>
                        <option value="Natural Science">Natural Science</option>
                        <option value="Social Science">Social Science</option>
                      </select>
                    </div>
                    {editingId && (
                      <div className="col-md-3">
                        <label className="form-label">Status</label>
                        <select className="form-select" name="is_active" value={formData.is_active}
                          onChange={handleChange}>
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Update Department' : 'Create Department'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDepartments;
