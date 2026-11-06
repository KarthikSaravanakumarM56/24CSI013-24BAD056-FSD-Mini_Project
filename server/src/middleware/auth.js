const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'skillbridge_super_secret_jwt_key_2026';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route, token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Support offline demo sessions if DB is disconnected
    if (typeof decoded.id === 'string' && decoded.id.startsWith('demo_')) {
      req.user = {
        _id: decoded.id,
        name: 'Karthik Saravanakumar',
        email: 'karthik.alumni@gmail.com',
        role: 'student',
        domain: 'Full Stack Development',
        targetRole: 'Full Stack Developer',
        college: 'Kumaraguru College of Technology',
        studentStatus: 'Passed Out Graduate (Alumni)',
        graduationYear: 2026,
        currentSkills: [
          { name: 'React', level: 'Intermediate', verified: true },
          { name: 'Node.js', level: 'Intermediate', verified: true },
          { name: 'JavaScript', level: 'Advanced', verified: true },
          { name: 'MongoDB', level: 'Intermediate', verified: true }
        ]
      };
      return next();
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found with this token' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token', error: err.message });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Access denied: Admin privilege required' });
  }
};

module.exports = { protect, adminOnly, JWT_SECRET };
