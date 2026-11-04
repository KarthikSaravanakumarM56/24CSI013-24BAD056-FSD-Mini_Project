const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Job = require('../models/Job');
const User = require('../models/User');
const { protect, adminOnly, JWT_SECRET } = require('../middleware/auth');

// Helper to extract student profile context if token is optionally provided
const getStudentContextFromHeader = async (req) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        return {
          skills: user.currentSkills ? user.currentSkills.map(s => s.name.trim().toLowerCase()) : [],
          domain: user.domain || 'Full Stack Development',
          targetRole: user.targetRole,
          department: user.department
        };
      }
    }
  } catch (err) {
    // optional token, ignore error
  }
  return null;
};

// @route   GET /api/jobs
// @desc    Get all active jobs with optional domain filtering, search, and skill match calculation
router.get('/', async (req, res, next) => {
  try {
    const { domain, search, type, workMode, location, minMatch, status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'Active';
    }

    if (domain && domain !== 'All') {
      query.domain = domain;
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    if (workMode && workMode !== 'All') {
      query.workMode = workMode;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } },
        { domain: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    let jobs = await Job.find(query).sort({ createdAt: -1 });

    const studentContext = await getStudentContextFromHeader(req);
    const studentSkills = studentContext ? studentContext.skills : null;

    // Compute skill match for each job if student skills are available
    let jobResults = jobs.map(job => {
      const jobObj = job.toObject();
      const isDomainMatch = Boolean(studentContext && studentContext.domain && job.domain === studentContext.domain);
      jobObj.isDomainMatch = isDomainMatch;

      if (studentSkills && job.requiredSkills && job.requiredSkills.length > 0) {
        const matching = job.requiredSkills.filter(reqSkill => 
          studentSkills.includes(reqSkill.trim().toLowerCase())
        );
        const missing = job.requiredSkills.filter(reqSkill => 
          !studentSkills.includes(reqSkill.trim().toLowerCase())
        );
        const matchPercentage = Math.round((matching.length / job.requiredSkills.length) * 100);

        jobObj.match = {
          score: matchPercentage,
          matchingSkills: matching,
          missingSkills: missing
        };
      } else {
        jobObj.match = null;
      }
      return jobObj;
    });

    // If user is authenticated and no explicit domain filter was passed,
    // boost jobs matching student's preferred domain to top
    if (studentContext && !domain) {
      jobResults.sort((a, b) => {
        const aPref = a.isDomainMatch ? 1 : 0;
        const bPref = b.isDomainMatch ? 1 : 0;
        if (aPref !== bPref) return bPref - aPref;
        const aScore = a.match ? a.match.score : 0;
        const bScore = b.match ? b.match.score : 0;
        return bScore - aScore;
      });
    }

    if (minMatch && studentSkills) {
      const threshold = parseInt(minMatch, 10);
      jobResults = jobResults.filter(j => j.match && j.match.score >= threshold);
    }

    res.json({
      success: true,
      count: jobResults.length,
      studentDomain: studentContext ? studentContext.domain : null,
      jobs: jobResults
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job by ID with detailed skill comparison
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Valid Job ID is required' });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    const jobObj = job.toObject();
    const studentSkills = await getStudentSkillsFromHeader(req);

    if (studentSkills && job.requiredSkills) {
      const matching = job.requiredSkills.filter(reqSkill => 
        studentSkills.includes(reqSkill.trim().toLowerCase())
      );
      const missing = job.requiredSkills.filter(reqSkill => 
        !studentSkills.includes(reqSkill.trim().toLowerCase())
      );
      const matchPercentage = Math.round((matching.length / job.requiredSkills.length) * 100);

      jobObj.match = {
        score: matchPercentage,
        matchingSkills: matching,
        missingSkills: missing
      };
    }

    res.json({ success: true, job: jobObj });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/jobs
// @desc    Create a new job (Admin only)
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const {
      title, company, logo, location, workMode, type,
      salary, experience, domain, department, requiredSkills, optionalSkills,
      description, responsibilities, requirements, openings
    } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({ success: false, message: 'Title, company and description are required' });
    }

    const newJob = await Job.create({
      title,
      company,
      logo: logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&background=4f46e5&color=fff`,
      location: location || 'Bangalore, India',
      workMode: workMode || 'Hybrid',
      type: type || 'Internship',
      salary: salary || '₹30,000 / month',
      experience: experience || 'Fresher (0-1 yr)',
      domain: domain || 'Full Stack Development',
      department: department || 'Any',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map(s => s.trim()) : []),
      optionalSkills: Array.isArray(optionalSkills) ? optionalSkills : [],
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      openings: openings || 2,
      postedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      job: newJob
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job (Admin only)
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Valid Job ID is required' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({
      success: true,
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Valid Job ID is required' });
    }

    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/jobs/:id/bookmark
// @desc    Bookmark or unbookmark a job
router.post('/:id/bookmark', protect, async (req, res, next) => {
  try {
    const { id: jobId } = req.params;
    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, message: 'Valid Job ID is required' });
    }

    const user = await User.findById(req.user._id);
    const isBookmarked = user.savedJobs.some(id => id.toString() === jobId);

    if (isBookmarked) {
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();

    res.json({
      success: true,
      isBookmarked: !isBookmarked,
      savedJobs: user.savedJobs
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
