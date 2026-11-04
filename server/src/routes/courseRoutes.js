const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const { ROLE_SKILL_MATRIX, DOMAINS } = require('../config/domains');

// @route   GET /api/courses
// @desc    Get all courses with optional filters (domain, category, skill, level)
router.get('/', async (req, res, next) => {
  try {
    const { domain, category, skill, level, search, isFree } = req.query;
    const filter = {};

    if (domain && domain !== 'All') filter.domain = domain;
    if (category && category !== 'All') filter.category = category;
    if (level && level !== 'All') filter.level = level;
    if (skill && skill !== 'All') filter.skill = { $regex: skill, $options: 'i' };
    if (isFree !== undefined && isFree !== 'All') filter.isFree = isFree === 'true';

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { provider: { $regex: search, $options: 'i' } },
        { skill: { $regex: search, $options: 'i' } },
        { domain: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter).sort({ rating: -1, createdAt: -1 });

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/courses/recommended
// @desc    Get personalized courses targeting student's missing skill gaps in their career domain
router.get('/recommended', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const studentSkills = user.currentSkills.map(s => s.name.trim().toLowerCase());
    const studentDomain = user.domain || 'Full Stack Development';
    const studentRole = user.targetRole || 'Full Stack Developer';

    const targetList = ROLE_SKILL_MATRIX[studentDomain] || 
                       ROLE_SKILL_MATRIX[studentRole] || 
                       ROLE_SKILL_MATRIX['Full Stack Development'];

    // Identify skills the user is missing
    const missingSkills = targetList.filter(reqSkill => !studentSkills.includes(reqSkill.toLowerCase()));

    // Find courses covering these missing skills, prioritizing student's domain
    let recommendedCourses = [];
    if (missingSkills.length > 0) {
      recommendedCourses = await Course.find({
        $or: [
          { skill: { $in: missingSkills.map(s => new RegExp(`^${s}$`, 'i')) } },
          { domain: studentDomain }
        ]
      }).limit(12);
    }

    // Fallback if not enough matching courses
    if (recommendedCourses.length < 4) {
      const additional = await Course.find({
        _id: { $nin: recommendedCourses.map(c => c._id) }
      }).sort({ rating: -1 }).limit(8 - recommendedCourses.length);
      recommendedCourses = [...recommendedCourses, ...additional];
    }

    res.json({
      success: true,
      domain: studentDomain,
      targetRole: studentRole,
      missingSkillsTargeted: missingSkills,
      count: recommendedCourses.length,
      courses: recommendedCourses
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/courses
// @desc    Create a new course (Admin)
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { title, provider, skill, category, level, duration, rating, isFree, price, url, thumbnail, description, syllabus } = req.body;

    if (!title || !provider || !skill || !url || !description) {
      return res.status(400).json({ success: false, message: 'Please provide title, provider, skill, url, and description' });
    }

    const course = await Course.create({
      title,
      provider,
      skill,
      category: category || 'Backend',
      level: level || 'Intermediate',
      duration: duration || '10 Hours',
      rating: rating || 4.7,
      isFree: isFree !== undefined ? isFree : true,
      price: price || (isFree ? 'Free' : '₹999'),
      url,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60',
      description,
      syllabus: Array.isArray(syllabus) ? syllabus : []
    });

    res.status(201).json({
      success: true,
      message: 'Course added successfully',
      course
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/courses/:id
// @desc    Update course (Admin)
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Valid Course ID is required' });
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, message: 'Course updated', course });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course (Admin)
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Valid Course ID is required' });
    }

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
