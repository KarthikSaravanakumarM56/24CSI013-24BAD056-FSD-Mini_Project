const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const VALID_STATUSES = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

// @route   POST /api/applications
// @desc    Apply for a job (Student)
router.post('/', protect, async (req, res, next) => {
  try {
    const { jobId, coverNote, resumeUrl } = req.body;

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, message: 'Valid Job ID is required' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if duplicate application
    const existingApp = await Application.findOne({ job: jobId, student: req.user._id });
    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this position. Check your Application Tracker.'
      });
    }

    // Compute skill match snapshot at time of application
    const user = await User.findById(req.user._id);
    const studentSkills = user.currentSkills.map(s => s.name.trim().toLowerCase());
    
    let matching = [];
    let missing = [];
    let score = 0;

    if (job.requiredSkills && job.requiredSkills.length > 0) {
      matching = job.requiredSkills.filter(reqSkill =>
        studentSkills.includes(reqSkill.trim().toLowerCase())
      );
      missing = job.requiredSkills.filter(reqSkill =>
        !studentSkills.includes(reqSkill.trim().toLowerCase())
      );
      score = Math.round((matching.length / job.requiredSkills.length) * 100);
    }

    const application = await Application.create({
      job: jobId,
      student: req.user._id,
      status: 'Applied',
      coverNote: coverNote || '',
      resumeUrl: resumeUrl || user.resumeUrl || '',
      skillMatchPercentage: score,
      matchingSkills: matching,
      missingSkills: missing,
      timeline: [
        {
          status: 'Applied',
          note: 'Application submitted successfully to ' + job.company,
          date: new Date()
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/applications/my
// @desc    Get all applications submitted by logged-in student (Application Tracker)
router.get('/my', protect, async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('job')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/applications/all
// @desc    Get all applications (Admin)
router.get('/all', protect, adminOnly, async (req, res, next) => {
  try {
    const { status, jobId } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;
    if (jobId) filter.job = jobId;

    const applications = await Application.find(filter)
      .populate('job')
      .populate('student', 'name email college degree graduationYear currentSkills resumeUrl badges')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status, add note, or schedule interview (Admin)
router.put('/:id/status', protect, adminOnly, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Valid Application ID is required' });
    }

    const { status, note, interviewDate, interviewMeetingLink, adminNotes } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` 
      });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (status) {
      application.status = status;
      application.timeline.push({
        status,
        note: note || `Status updated to ${status}`,
        date: new Date()
      });
    }

    if (interviewDate) application.interviewDate = interviewDate;
    if (interviewMeetingLink) application.interviewMeetingLink = interviewMeetingLink;
    if (adminNotes !== undefined) application.adminNotes = adminNotes;

    await application.save();

    res.json({
      success: true,
      message: 'Application status updated successfully',
      application
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/applications/:id
// @desc    Withdraw or delete application
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Valid Application ID is required' });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Student can only delete their own; Admin can delete any
    if (req.user.role !== 'admin' && application.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this application' });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Application withdrawn successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
