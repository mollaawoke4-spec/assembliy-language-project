<<<<<<< HEAD
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
=======
import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Sidebar from './components/Layout/Sidebar';
import Home from './components/Pages/Home';
import Login from './components/Pages/Login';
import Register from './components/Pages/Register';
import Rooms from './components/Pages/Rooms';
import ReserveRoom from './components/Pages/ReserveRoom';
import ReserveDesk from './components/Pages/ReserveDesk';
import OrderFood from './components/Pages/OrderFood';
import Feedback from './components/Pages/Feedback';
import ReportProblem from './components/Pages/ReportProblem';
import Payment from './components/Pages/Payment';
import PaymentConfirmation from './components/Pages/PaymentConfirmation';
import MyAccounts from './components/Pages/MyAccounts';
import About from './components/Pages/About';
import Contact from './components/Pages/Contact';
import Discounts from './components/Pages/Discounts';
import Profile from './components/Pages/Profile';
import PrivacyPolicy from './components/Pages/PrivacyPolicy';
import TermsConditions from './components/Pages/TermsConditions';
import CookiePolicy from './components/Pages/CookiePolicy';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ManagerDashboard from './components/Dashboard/ManagerDashboard';
import ReceptionistDashboard from './components/Dashboard/ReceptionistDashboard';
import CustomerDashboard from './components/Dashboard/CustomerDashboard';
import './styles.css';

function AppLayout() {
    const { user, loading } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    // Always show sidebar (customer dashboard experience on app start)
    const hasSidebar = true;

    useEffect(() => {
        // Open sidebar by default on desktop
        if (window.innerWidth > 768) setSidebarOpen(true);
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-main, #f5f5f7)' }}>
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="app">
            <Header sidebarOpen={sidebarOpen} onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />

            <div className="layout-with-sidebar">
                {hasSidebar && (
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                )}
                <main className={`layout-content ${!hasSidebar ? 'no-sidebar' : ''}`}>
                    <Routes>
                        {/* Root URL always shows the public Home page (default landing page). */}
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/rooms" element={<Rooms />} />
                        <Route path="/reserve-room" element={<ReserveRoom />} />
                        <Route path="/reserve-desk" element={<ReserveDesk />} />
                        <Route path="/order-food" element={<OrderFood />} />
                        <Route path="/feedback" element={<Feedback />} />
                        <Route path="/report-problem" element={<ReportProblem />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
                        <Route path="/my-accounts" element={<MyAccounts />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/discounts" element={<Discounts />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-conditions" element={<TermsConditions />} />
                        <Route path="/cookie-policy" element={<CookiePolicy />} />
                        <Route path="/dashboard/admin" element={<AdminDashboard />} />
                        <Route path="/dashboard/manager" element={<ManagerDashboard />} />
                        <Route path="/dashboard/receptionist" element={<ReceptionistDashboard />} />
                        <Route path="/dashboard/customer" element={<CustomerDashboard />} />
                        {/* Unknown routes fall back to Home rather than forcing a dashboard. */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>

            <Footer />
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        borderRadius: '10px',
                        background: '#1a1a2e',
                        color: '#fff',
                        fontSize: '14px',
                    },
                    success: { iconTheme: { primary: '#f0a500', secondary: '#1a1a2e' } },
                }}
            />
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppLayout />
            </Router>
        </AuthProvider>
    );
>>>>>>> 8713a78e626719ce70c78385819a4b78967cbf0e
}

export default App;
