import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'customer',
  status: 'active',
};

export default function AdminDashboard() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'feedback' ? 'feedback' : 'users';

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const sortByRecent = (arr) => {
    if (!Array.isArray(arr)) return [];
    return [...arr].sort((a, b) => {
      const getVal = (x) => {
        const dateVal = x.updated_at || x.created_at || x.transaction_date || x.order_date || x.reservation_date || x.registration_date;
        if (dateVal) {
          const t = new Date(dateVal).getTime();
          if (!Number.isNaN(t)) return t;
        }
        return Number(x.id || x.reservation_id || 0);
      };
      return getVal(b) - getVal(a);
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'feedback') {
        const res = await api.get('/admin/reports-and-feedback');
        setFeedback(sortByRecent(res.data.feedback || res.data.reports || res.data || []));
      } else {
        const res = await api.get('/auth/users');
        setUsers(sortByRecent(res.data.users || []));
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const startEdit = (u) => {
    setEditingId(u.id);
    setForm({
      firstName: u.first_name || '',
      lastName: u.last_name || '',
      email: u.email || '',
      phone: u.phone || '',
      password: '',
      confirmPassword: '',
      role: u.role || 'customer',
      status: u.status || 'active',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      toast.error('First name, last name and email are required');
      return;
    }
    if (!editingId) {
      if (!form.password || form.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      if (form.password !== form.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    } else if (form.password) {
      if (form.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      if (form.password !== form.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        role: form.role,
        status: form.status,
      };
      if (form.password) payload.password = form.password;

      if (editingId) {
        await api.put(`/auth/users/${editingId}`, payload);
        toast.success('User updated');
      } else {
        await api.post('/auth/users', payload);
        toast.success('User created');
      }
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (u) => {
    if (u.role === 'admin') {
      toast.error('Cannot delete admin accounts from here');
      return;
    }
    if (!window.confirm(`Delete user "${u.email || u.first_name}" permanently?`)) return;
    try {
      await api.delete(`/auth/users/${u.id}`);
      toast.success('User deleted');
      if (editingId === u.id) resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="inside">
      <div className="page-header">
        <div>
          <h1 className="page-title">🛡️ Admin</h1>
          <p className="page-subtitle">
            {activeTab === 'feedback' ? 'Customer feedback' : 'Add, update and delete users'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loading-wrap"><div className="spinner" /></div>
      ) : activeTab === 'feedback' ? (
        <div className="card">
          <h3 className="card-title">💬 Customer Feedback & Reports</h3>
          {feedback.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💬</div>
              <div className="empty-state-title">No feedback yet</div>
              <div className="empty-state-desc">Customer feedback will appear here</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {feedback.map((item) => (
                <div key={item.id} style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong>{item.userFullName || item.username || 'Anonymous'}</strong>
                    <span className="badge badge-active">{item.role || 'Customer'}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-dark)', lineHeight: '1.6', marginBottom: '10px' }}>
                    "{item.comment || item.text || item.feedback}"
                  </p>
                  <small style={{ color: 'var(--text-muted)' }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : item.created_at ? new Date(item.created_at).toLocaleString() : 'Recently'}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { setShowAddForm(true); setEditingId(null); setForm({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', role: 'customer', status: 'active' }); }}
            >
              + Add User
            </button>
          </div>
          {(showAddForm || editingId) && (
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 className="card-title">{editingId ? '✏️ Update User' : '➕ Add User'}</h3>
              <form onSubmit={async (e) => { await handleSubmit(e); setShowAddForm(false); }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  <input className="form-input" placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                  <input className="form-input" placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                  <input className="form-input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  <input className="form-input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option value="customer">Customer</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <input className="form-input" type="password" placeholder={editingId ? 'New password (optional)' : 'Password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editingId} />
                  <input className="form-input" type="password" placeholder={editingId ? 'Confirm new password' : 'Confirm password'} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required={!editingId || !!form.password} />
                </div>
                <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : editingId ? 'Update user' : 'Add user'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => { resetForm(); setShowAddForm(false); }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="card">
            <h3 className="card-title">👥 Users ({users.length})</h3>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: 24, color: '#888' }}>No users found</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.first_name} {u.last_name}</td>
                        <td>{u.email || u.username}</td>
                        <td>{u.email}</td>
                        <td><span className="badge badge-active">{u.role}</span></td>
                        <td>{u.status || 'active'}</td>
                        <td>
                          <button type="button" className="btn btn-sm btn-secondary" onClick={() => { startEdit(u); setShowAddForm(true); }}>Edit</button>{' '}
                          <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(u)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
