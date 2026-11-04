const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  explanation: { type: String, default: '' }
}, { _id: true });

const assessmentSchema = new mongoose.Schema({
  skill: { type: String, required: true, trim: true },
  domain: { 
    type: String, 
    default: 'Full Stack Development',
    index: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'Web Development' },
  durationMinutes: { type: Number, default: 15 },
  passingScorePercent: { type: Number, default: 70 },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  badgeIcon: { type: String, default: 'Award' },
  questions: [questionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
