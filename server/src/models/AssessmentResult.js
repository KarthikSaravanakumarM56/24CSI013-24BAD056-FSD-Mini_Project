const mongoose = require('mongoose');

const assessmentResultSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  assessment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Assessment', 
    required: true 
  },
  skill: { type: String, required: true },
  scorePercent: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  details: [{
    questionText: String,
    selectedOption: Number,
    correctOption: Number,
    isCorrect: Boolean,
    explanation: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('AssessmentResult', assessmentResultSchema);
