import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile')
};

export const departmentAPI = {
  getColleges: () => api.get('/departments/colleges'),
  createCollege: (data) => api.post('/departments/colleges', data),
  updateCollege: (id, data) => api.put(`/departments/colleges/${id}`, data),
  getDepartments: (params = {}) => api.get('/departments', { params }),
  getDepartment: (id) => api.get(`/departments/${id}`),
  createDepartment: (data) => api.post('/departments', data),
  updateDepartment: (id, data) => api.put(`/departments/${id}`, data),
  deleteDepartment: (id, hard = false) => api.delete(`/departments/${id}`, { params: { hard } })
};

export const selectionAPI = {
  getSettings: () => api.get('/selection/settings'),
  updateSettings: (data) => api.put('/selection/settings', data),
  getEligible: () => api.get('/selection/eligible'),
  getMyChoices: () => api.get('/selection/my-choices'),
  submitChoices: (choices) => api.post('/selection/choices', { choices }),
  getMyResult: () => api.get('/selection/my-result'),
  runAssignment: () => api.post('/selection/run-assignment'),
  getAllResults: () => api.get('/selection/results')
};

export default api;
