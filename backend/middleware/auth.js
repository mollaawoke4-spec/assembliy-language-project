const jwt = require('jsonwebtoken');
<<<<<<< HEAD
require('dotenv').config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, student_id, role }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }
};

module.exports = { authenticate, isAdmin };
=======

// Middleware to verify JWT and attach `req.user`
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.token;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// Authorization middleware factory: authorize('admin','manager')
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Access denied. No token provided.' });

  const userRole = (req.user.role || '').toString().toLowerCase();
  const normalized = allowedRoles.map(r => r.toString().toLowerCase());

  if (normalized.includes(userRole)) return next();

  return res.status(403).json({ message: 'Access denied. Insufficient rights.' });
};

// Backwards-compatible helpers
const verifyToken = auth;
const isAdmin = authorize('admin');

module.exports = {
  auth,
  authorize,
  verifyToken,
  isAdmin
};
>>>>>>> 8713a78e626719ce70c78385819a4b78967cbf0e
