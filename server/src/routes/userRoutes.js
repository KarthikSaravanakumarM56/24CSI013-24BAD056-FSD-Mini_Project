const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const { protect, adminOnly } = require('../middleware/auth');
const { DOMAINS, DEPARTMENTS, ROLE_SKILL_MATRIX } = require('../config/domains');

// @route   GET /api/users/domains
// @desc    Get all 12 supported career domains, departments, and skill mappings
router.get('/domains', (req, res) => {
  res.json({
    success: true,
    domains: DOMAINS,
    departments: DEPARTMENTS
  });
});

// @route   GET /api/users/profile
// @desc    Get current user profile
router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
router.put('/profile', protect, async (req, res, next) => {
  try {
    const allowedFields = [
      'name', 'headline', 'bio', 'phone', 'location',
      'college', 'degree', 'department', 'graduationYear', 'cgpa',
      'domain', 'targetRole', 'studentStatus', 'noticePeriod',
      'github', 'linkedin', 'portfolio', 'resumeUrl'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // If domain was updated but targetRole wasn't, sync targetRole
    if (updates.domain && !req.body.targetRole) {
      const matchedDomain = DOMAINS.find(d => d.name === updates.domain);
      if (matchedDomain) {
        updates.targetRole = matchedDomain.primaryRole;
      }
    }

    if (req.body.currentSkills && Array.isArray(req.body.currentSkills)) {
      updates.currentSkills = req.body.currentSkills;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/users/skills
// @desc    Add or update student skills
router.post('/skills', protect, async (req, res, next) => {
  try {
    const { name, level } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }

    const user = await User.findById(req.user._id);
    const existingIndex = user.currentSkills.findIndex(
      s => s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (existingIndex > -1) {
      user.currentSkills[existingIndex].level = level || user.currentSkills[existingIndex].level;
    } else {
      user.currentSkills.push({
        name: name.trim(),
        level: level || 'Intermediate',
        verified: false
      });
    }

    await user.save();

    res.json({
      success: true,
      message: `Skill ${name} updated successfully`,
      currentSkills: user.currentSkills
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/users/skills/:name
// @desc    Remove a skill from profile
router.delete('/skills/:name', protect, async (req, res, next) => {
  try {
    const skillName = decodeURIComponent(req.params.name).toLowerCase();
    const user = await User.findById(req.user._id);

    user.currentSkills = user.currentSkills.filter(
      s => s.name.toLowerCase() !== skillName
    );

    await user.save();

    res.json({
      success: true,
      message: 'Skill removed',
      currentSkills: user.currentSkills
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/users/skill-gap
// @desc    Calculate skill gap between current student skills and target role or target job
router.get('/skill-gap', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const requestedDomain = req.query.domain;
    const requestedRole = req.query.role;
    const targetKey = requestedDomain || requestedRole || user.domain || user.targetRole || 'Full Stack Development';
    const targetJobId = req.query.jobId;

    let targetSkills = ROLE_SKILL_MATRIX[targetKey];
    if (!targetSkills) {
      // Case-insensitive lookup or partial match
      const matchedKey = Object.keys(ROLE_SKILL_MATRIX).find(
        k => k.toLowerCase() === targetKey.toLowerCase()
      );
      targetSkills = matchedKey ? ROLE_SKILL_MATRIX[matchedKey] : ROLE_SKILL_MATRIX['Full Stack Development'];
    }

    if (targetJobId) {
      const job = await Job.findById(targetJobId);
      if (job && job.requiredSkills && job.requiredSkills.length > 0) {
        targetSkills = job.requiredSkills;
      }
    }

    const matchedDomainObj = DOMAINS.find(d => 
      d.name.toLowerCase() === targetKey.toLowerCase() ||
      d.primaryRole.toLowerCase() === targetKey.toLowerCase() ||
      d.popularRoles.some(r => r.toLowerCase() === targetKey.toLowerCase())
    ) || DOMAINS[0];

    const studentSkillNames = user.currentSkills.map(s => s.name.trim().toLowerCase());

    const acquiredSkills = [];
    const missingSkills = [];

    targetSkills.forEach(skill => {
      const hasSkill = studentSkillNames.includes(skill.trim().toLowerCase());
      if (hasSkill) {
        const studentSkillObj = user.currentSkills.find(s => s.name.trim().toLowerCase() === skill.trim().toLowerCase());
        acquiredSkills.push({
          name: skill,
          level: studentSkillObj ? studentSkillObj.level : 'Intermediate',
          verified: studentSkillObj ? studentSkillObj.verified : false
        });
      } else {
        missingSkills.push(skill);
      }
    });

    const totalTarget = targetSkills.length;
    const matchPercentage = totalTarget > 0 
      ? Math.round((acquiredSkills.length / totalTarget) * 100) 
      : 0;

    // Additional student skills that may not be in this target role but student has
    const extraSkills = user.currentSkills.filter(
      s => !targetSkills.some(ts => ts.toLowerCase() === s.name.toLowerCase())
    );

    res.json({
      success: true,
      data: {
        domain: matchedDomainObj.name,
        targetRole: targetKey,
        domainDescription: matchedDomainObj.description,
        totalRequired: totalTarget,
        matchPercentage,
        acquiredSkills,
        missingSkills,
        extraSkills,
        allTargetSkills: targetSkills
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/users/resume
// @desc    Save resume builder state
router.post('/resume', protect, async (req, res, next) => {
  try {
    const { resumeData } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { resumeData } },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Resume saved to profile',
      resumeData: user.resumeData
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/users/all (Admin)
// @desc    Get all students
router.get('/all', protect, adminOnly, async (req, res, next) => {
  try {
    const { search, role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
        { targetRole: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/users/:id (Admin)
// @desc    Delete a user
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
