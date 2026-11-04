const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');
const MentorshipRequest = require('../models/MentorshipRequest');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/mentors
// @desc    Get all mentors with domain filtering
router.get('/', async (req, res, next) => {
  try {
    const { domain, search } = req.query;
    const filter = {};
    if (domain && domain !== 'All') filter.domain = domain;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }

    const mentors = await Mentor.find(filter).sort({ rating: -1 });
    res.json({ success: true, count: mentors.length, mentors });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/mentors/:id/request
// @desc    Submit a mentorship session request
router.post('/:id/request', protect, async (req, res, next) => {
  try {
    const { topic, message, preferredDate, preferredTime } = req.body;
    const mentorId = req.params.id;

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }

    if (!topic || !message || !preferredDate) {
      return res.status(400).json({ success: false, message: 'Please provide topic, message, and preferred date' });
    }

    const request = await MentorshipRequest.create({
      mentor: mentorId,
      student: req.user._id,
      topic,
      message,
      preferredDate,
      preferredTime: preferredTime || 'Evening (6 PM - 8 PM IST)',
      status: 'Approved', // Auto-confirm for student convenience in demo
      meetingLink: 'https://meet.google.com/sb-skillbridge-demo'
    });

    res.status(201).json({
      success: true,
      message: 'Mentorship session booked successfully!',
      request
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/mentors/my/requests
// @desc    Get logged-in user's mentorship bookings
router.get('/my/requests', protect, async (req, res, next) => {
  try {
    const requests = await MentorshipRequest.find({ student: req.user._id })
      .populate('mentor')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/mentors (Admin)
// @desc    Add a new mentor
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const mentor = await Mentor.create(req.body);
    res.status(201).json({ success: true, mentor });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/mentors/:id (Admin)
// @desc    Delete mentor
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Mentor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Mentor deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
