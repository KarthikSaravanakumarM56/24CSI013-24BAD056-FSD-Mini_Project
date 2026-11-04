const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, JWT_SECRET } = require('../middleware/auth');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// Helper for email format validation
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// @route   POST /api/auth/register
// @desc    Register a new user (Student or Admin)
router.post('/register', async (req, res, next) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      college, 
      degree, 
      department,
      domain,
      graduationYear, 
      targetRole, 
      studentStatus,
      noticePeriod,
      currentSkills 
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters long' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address (e.g. student@college.edu)' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Initial default skills if provided
    let skillsList = [];
    if (Array.isArray(currentSkills)) {
      skillsList = currentSkills.map(s => typeof s === 'string' ? { name: s, level: 'Intermediate' } : s);
    } else {
      skillsList = [
        { name: 'JavaScript', level: 'Intermediate', verified: false },
        { name: 'React', level: 'Intermediate', verified: false },
        { name: 'MongoDB', level: 'Beginner', verified: false }
      ];
    }

    const assignedRole = role === 'admin' ? 'admin' : 'student';

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: assignedRole,
      college: college || 'National Institute of Engineering',
      degree: degree || 'B.Tech / B.E in Computer Science',
      department: department || 'Computer Science and Engineering',
      domain: domain || 'Full Stack Development',
      graduationYear: graduationYear || 2026,
      studentStatus: studentStatus || 'Passed Out Graduate (Alumni)',
      noticePeriod: noticePeriod || 'Immediate Joiner (Available Today)',
      targetRole: targetRole || (domain ? `${domain} Specialist` : 'Full Stack Developer'),
      currentSkills: skillsList
    });

    const token = generateToken(user._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userResponse
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    if (!user.password && user.isGoogleUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'This profile is linked to Google authentication. Please click "Sign in with Google" to access your account.' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: userResponse
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/google
// @desc    Authenticate or register via Google OAuth
router.post('/google', async (req, res, next) => {
  try {
    const { email, name, avatar, googleId, graduationYear, studentStatus, college, targetRole } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Google authentication requires a valid email address' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Create new user via Google
      const isPassedOut = graduationYear ? parseInt(graduationYear, 10) <= 2025 : true;
      user = await User.create({
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        googleId: googleId || `goog_${Date.now()}`,
        isGoogleUser: true,
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || normalizedEmail)}&background=4285f4&color=fff`,
        role: 'student',
        studentStatus: studentStatus || (isPassedOut ? 'Passed Out Graduate (Alumni)' : 'Current Student'),
        graduationYear: graduationYear || 2024,
        college: college || 'National Institute of Engineering',
        targetRole: targetRole || 'Full Stack Developer',
        headline: isPassedOut ? 'Software Engineer Graduate | Seeking Full-time Opportunities' : 'Final Year Student | Aspiring Developer',
        currentSkills: [
          { name: 'JavaScript', level: 'Intermediate', verified: true },
          { name: 'React', level: 'Intermediate', verified: false },
          { name: 'MongoDB', level: 'Beginner', verified: false }
        ]
      });
    } else {
      // Update google info if missing
      if (!user.isGoogleUser) {
        user.isGoogleUser = true;
        user.googleId = googleId || user.googleId;
        if (avatar && !user.avatar) user.avatar = avatar;
        await user.save();
      }
    }

    const token = generateToken(user._id);
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Signed in with Google successfully',
      token,
      user: userResponse
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/auth/me
// @desc    Get currently logged-in user profile
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
