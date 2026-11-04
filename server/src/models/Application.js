const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
    default: 'Applied'
  },
  coverNote: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  skillMatchPercentage: { type: Number, default: 0 },
  matchingSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  interviewDate: { type: Date },
  interviewMeetingLink: { type: String, default: '' },
  adminNotes: { type: String, default: '' },
  timeline: [{
    status: { type: String, required: true },
    note: { type: String, default: '' },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Prevent multiple applications to the exact same job by same student
applicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
