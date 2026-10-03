import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SelectDepartment from './components/SelectDepartment';
import MyResult from './components/MyResult';
import AdminDashboard from './components/AdminDashboard';
import AdminDepartments from './components/AdminDepartments';
import AdminResults from './components/AdminResults';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isHome = location.pathname === '/';

  return (
    <nav className={`navbar navbar-expand-lg ${isHome ? 'navbar-dark bg-primary' : 'navbar-dark bg-primary'} shadow-sm`}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">🎓 Dept Selection</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {user ? (
              user.role === 'admin' ? (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/admin/departments">Departments</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/admin/results">Results</Link></li>
                </>
              ) : (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/select">Select</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/result">My Result</Link></li>
                </>
              )
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item">
                  <Link className="btn btn-light btn-sm px-3" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-light d-flex flex-column">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/select" element={<SelectDepartment />} />
            <Route path="/result" element={<MyResult />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/departments" element={<AdminDepartments />} />
            <Route path="/admin/results" element={<AdminResults />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
