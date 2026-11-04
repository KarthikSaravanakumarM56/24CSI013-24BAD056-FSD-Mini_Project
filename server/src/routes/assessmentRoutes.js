const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/assessments
// @desc    Get all available skill assessments with optional domain filter
router.get('/', async (req, res, next) => {
  try {
    const { domain } = req.query;
    const query = {};
    if (domain && domain !== 'All') {
      query.domain = domain;
    }
    const assessments = await Assessment.find(query).select('-questions.correctOptionIndex -questions.explanation');
    res.json({
      success: true,
      count: assessments.length,
      assessments
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/assessments/:id
// @desc    Get single assessment for taking test (omits answers)
router.get('/:id', protect, async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    const testView = assessment.toObject();
    testView.questions = testView.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options
    }));

    res.json({ success: true, assessment: testView });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/assessments/:id/submit
// @desc    Submit assessment answers, calculate score, grant badge & update user verified skills
router.post('/:id/submit', protect, async (req, res, next) => {
  try {
    const { answers } = req.body; // Array of selectedOption indices: [1, 0, 3, 2, ...]
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers must be an array of selected option indices' });
    }

    let correctCount = 0;
    const details = assessment.questions.map((q, idx) => {
      const selectedOption = answers[idx] !== undefined ? answers[idx] : -1;
      const isCorrect = selectedOption === q.correctOptionIndex;
      if (isCorrect) correctCount++;

      return {
        questionText: q.questionText,
        selectedOption,
        correctOption: q.correctOptionIndex,
        isCorrect,
        explanation: q.explanation
      };
    });

    const totalQuestions = assessment.questions.length;
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercent >= assessment.passingScorePercent;

    // Save result in DB
    const result = await AssessmentResult.create({
      student: req.user._id,
      assessment: assessment._id,
      skill: assessment.skill,
      scorePercent,
      totalQuestions,
      correctAnswers: correctCount,
      passed,
      details
    });

    // If passed, award badge and verify skill on user profile!
    let badgeAwarded = false;
    if (passed) {
      const user = await User.findById(req.user._id);

      // Check if badge already awarded
      const hasBadge = user.badges.some(b => b.skill.toLowerCase() === assessment.skill.toLowerCase());
      if (!hasBadge) {
        user.badges.push({
          skill: assessment.skill,
          score: scorePercent,
          awardedAt: new Date()
        });
        badgeAwarded = true;
      }

      // Check if skill exists in currentSkills; if so, verify it. If not, add as verified!
      const skillIdx = user.currentSkills.findIndex(s => s.name.toLowerCase() === assessment.skill.toLowerCase());
      if (skillIdx > -1) {
        user.currentSkills[skillIdx].verified = true;
      } else {
        user.currentSkills.push({
          name: assessment.skill,
          level: 'Intermediate',
          verified: true
        });
      }

      await user.save();
    }

    res.json({
      success: true,
      message: passed ? 'Congratulations! You passed the assessment!' : 'Assessment completed. Keep practicing!',
      scorePercent,
      correctCount,
      totalQuestions,
      passed,
      badgeAwarded,
      resultId: result._id,
      details
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/assessments/my/results
// @desc    Get assessment history for logged-in student
router.get('/my/results', protect, async (req, res, next) => {
  try {
    const results = await AssessmentResult.find({ student: req.user._id })
      .populate('assessment', 'title difficulty durationMinutes category')
      .sort({ createdAt: -1 });

    const user = await User.findById(req.user._id).select('badges');

    res.json({
      success: true,
      badges: user.badges || [],
      results
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/assessments (Admin)
// @desc    Create new assessment
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { skill, title, description, category, durationMinutes, passingScorePercent, difficulty, questions } = req.body;

    if (!skill || !title || !questions || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'Skill, title, and questions are required' });
    }

    const assessment = await Assessment.create({
      skill,
      title,
      description,
      category: category || 'Web Development',
      durationMinutes: durationMinutes || 15,
      passingScorePercent: passingScorePercent || 70,
      difficulty: difficulty || 'Medium',
      questions
    });

    res.status(201).json({ success: true, message: 'Assessment created', assessment });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/assessments/:id (Admin)
// @desc    Delete assessment
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Assessment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Assessment deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
