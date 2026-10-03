import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Multi-step form
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    // Account
    student_id: '',
    email: '',
    password: '',
    confirm_password: '',
    // Personal
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    phone: '',
    national_id: '',
    region: '',
    city: '',
    address: '',
    // Academic
    high_school_name: '',
    high_school_year: '',
    total_score: '',
    gpa: '',
    english_score: '',
    mathematics_score: '',
    science_score: '',
    social_score: '',
    category: 'Regular',
    stream: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const nextStep = () => {
    // Basic validation per step
    if (step === 1) {
      if (!formData.student_id || !formData.email || !formData.password) {
        setError('Please fill all required account fields.');
        return;
      }
      if (formData.password !== formData.confirm_password) {
        setError('Passwords do not match.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }
    if (step === 2) {
      if (!formData.first_name || !formData.last_name || !formData.gender) {
        setError('Please fill all required personal fields.');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Remove confirm_password before sending
      const { confirm_password, ...payload } = formData;
      
      // Convert empty strings to null for optional numeric fields
      const cleanPayload = {
        ...payload,
        total_score: payload.total_score ? parseFloat(payload.total_score) : null,
        gpa: payload.gpa ? parseFloat(payload.gpa) : null,
        english_score: payload.english_score ? parseFloat(payload.english_score) : null,
        mathematics_score: payload.mathematics_score ? parseFloat(payload.mathematics_score) : null,
        science_score: payload.science_score ? parseFloat(payload.science_score) : null,
        social_score: payload.social_score ? parseFloat(payload.social_score) : null,
        high_school_year: payload.high_school_year || null
      };

      const res = await authAPI.register(cleanPayload);

      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message 
        || err.response?.data?.errors?.[0]?.msg 
        || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center py-3">
              <h3 className="mb-0">Student Registration</h3>
              <small>Department Selection System</small>
            </div>

            <div className="card-body p-4">
              {/* Progress Steps */}
              <div className="d-flex justify-content-between mb-4">
                {['Account', 'Personal Info', 'Academic Info'].map((label, idx) => (
                  <div key={idx} className="text-center flex-fill">
                    <div className={`rounded-circle d-inline-flex align-items-center justify-content-center 
                      ${step > idx + 1 ? 'bg-success' : step === idx + 1 ? 'bg-primary' : 'bg-secondary'} 
                      text-white`} style={{ width: 36, height: 36 }}>
                      {step > idx + 1 ? '✓' : idx + 1}
                    </div>
                    <div className="small mt-1">{label}</div>
                  </div>
                ))}
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>
                {/* STEP 1: Account */}
                {step === 1 && (
                  <div>
                    <h5 className="mb-3 text-primary">Account Information</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Student ID <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" name="student_id"
                          value={formData.student_id} onChange={handleChange} required
                          placeholder="e.g. STU2026001" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email <span className="text-danger">*</span></label>
                        <input type="email" className="form-control" name="email"
                          value={formData.email} onChange={handleChange} required
                          placeholder="student@example.com" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Password <span className="text-danger">*</span></label>
                        <input type="password" className="form-control" name="password"
                          value={formData.password} onChange={handleChange} required
                          placeholder="Min 6 characters" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Confirm Password <span className="text-danger">*</span></label>
                        <input type="password" className="form-control" name="confirm_password"
                          value={formData.confirm_password} onChange={handleChange} required />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Personal */}
                {step === 2 && (
                  <div>
                    <h5 className="mb-3 text-primary">Personal Information</h5>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label">First Name <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" name="first_name"
                          value={formData.first_name} onChange={handleChange} required />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Middle Name</label>
                        <input type="text" className="form-control" name="middle_name"
                          value={formData.middle_name} onChange={handleChange} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Last Name <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" name="last_name"
                          value={formData.last_name} onChange={handleChange} required />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Gender <span className="text-danger">*</span></label>
                        <select className="form-select" name="gender" value={formData.gender}
                          onChange={handleChange} required>
                          <option value="">Select...</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Date of Birth</label>
                        <input type="date" className="form-control" name="date_of_birth"
                          value={formData.date_of_birth} onChange={handleChange} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Phone</label>
                        <input type="tel" className="form-control" name="phone"
                          value={formData.phone} onChange={handleChange} placeholder="+251..." />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">National ID</label>
                        <input type="text" className="form-control" name="national_id"
                          value={formData.national_id} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Region</label>
                        <input type="text" className="form-control" name="region"
                          value={formData.region} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">City</label>
                        <input type="text" className="form-control" name="city"
                          value={formData.city} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Address</label>
                        <input type="text" className="form-control" name="address"
                          value={formData.address} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Academic */}
                {step === 3 && (
                  <div>
                    <h5 className="mb-3 text-primary">Academic Information</h5>
                    <div className="row g-3">
                      <div className="col-md-8">
                        <label className="form-label">High School Name</label>
                        <input type="text" className="form-control" name="high_school_name"
                          value={formData.high_school_name} onChange={handleChange} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Graduation Year</label>
                        <input type="number" className="form-control" name="high_school_year"
                          value={formData.high_school_year} onChange={handleChange}
                          min="2000" max="2030" />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Total / Entrance Score</label>
                        <input type="number" step="0.01" className="form-control" name="total_score"
                          value={formData.total_score} onChange={handleChange} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">GPA</label>
                        <input type="number" step="0.01" className="form-control" name="gpa"
                          value={formData.gpa} onChange={handleChange} min="0" max="4" />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Stream</label>
                        <select className="form-select" name="stream" value={formData.stream}
                          onChange={handleChange}>
                          <option value="">Select...</option>
                          <option value="Natural Science">Natural Science</option>
                          <option value="Social Science">Social Science</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">English</label>
                        <input type="number" step="0.01" className="form-control" name="english_score"
                          value={formData.english_score} onChange={handleChange} />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Mathematics</label>
                        <input type="number" step="0.01" className="form-control" name="mathematics_score"
                          value={formData.mathematics_score} onChange={handleChange} />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Science</label>
                        <input type="number" step="0.01" className="form-control" name="science_score"
                          value={formData.science_score} onChange={handleChange} />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Social</label>
                        <input type="number" step="0.01" className="form-control" name="social_score"
                          value={formData.social_score} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Category / Quota</label>
                        <select className="form-select" name="category" value={formData.category}
                          onChange={handleChange}>
                          <option value="Regular">Regular</option>
                          <option value="Special Needs">Special Needs</option>
                          <option value="Regional Quota">Regional Quota</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-4">
                  {step > 1 ? (
                    <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
                      ← Previous
                    </button>
                  ) : <div></div>}

                  {step < 3 ? (
                    <button type="button" className="btn btn-primary" onClick={nextStep}>
                      Next →
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-success" disabled={loading}>
                      {loading ? 'Registering...' : 'Complete Registration'}
                    </button>
                  )}
                </div>
              </form>

              <hr className="my-4" />
              <p className="text-center mb-0">
                Already have an account? <Link to="/login">Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
