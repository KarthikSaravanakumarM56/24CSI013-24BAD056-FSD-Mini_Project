const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Course = require('../models/Course');
const AssessmentResult = require('../models/AssessmentResult');
const Mentor = require('../models/Mentor');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/analytics/dashboard
// @desc    Get system-wide analytics for Admin Dashboard
router.get('/dashboard', protect, adminOnly, async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalJobs,
      activeJobs,
      totalApplications,
      totalCourses,
      totalMentors,
      totalAssessmentsTaken,
      recentApplications,
      recentStudents
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Job.countDocuments(),
      Job.countDocuments({ status: 'Active' }),
      Application.countDocuments(),
      Course.countDocuments(),
      Mentor.countDocuments(),
      AssessmentResult.countDocuments(),
      Application.find()
        .populate('job', 'title company')
        .populate('student', 'name email college')
        .sort({ createdAt: -1 })
        .limit(6),
      User.find({ role: 'student' })
        .select('name email college degree graduationYear currentSkills createdAt')
        .sort({ createdAt: -1 })
        .limit(6)
    ]);

    // Aggregate Application status counts
    const statusCounts = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusMap = {
      'Applied': 0,
      'Under Review': 0,
      'Shortlisted': 0,
      'Interview Scheduled': 0,
      'Selected': 0,
      'Rejected': 0
    };
    statusCounts.forEach(s => {
      if (statusMap[s._id] !== undefined) {
        statusMap[s._id] = s.count;
      }
    });

    // Extract Top in-demand skills across all jobs
    const jobs = await Job.find({ status: 'Active' }).select('requiredSkills');
    const skillFreq = {};
    jobs.forEach(j => {
      if (Array.isArray(j.requiredSkills)) {
        j.requiredSkills.forEach(s => {
          const norm = s.trim();
          skillFreq[norm] = (skillFreq[norm] || 0) + 1;
        });
      }
    });

    const topSkills = Object.keys(skillFreq)
      .map(k => ({ skill: k, count: skillFreq[k] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalJobs,
        activeJobs,
        totalApplications,
        totalCourses,
        totalMentors,
        totalAssessmentsTaken,
        statusBreakdown: statusMap,
        topSkills,
        recentApplications,
        recentStudents
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
