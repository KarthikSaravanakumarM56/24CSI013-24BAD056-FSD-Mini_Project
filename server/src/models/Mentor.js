const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  avatar: { type: String, default: '' },
  domain: { 
    type: String, 
    default: 'Full Stack Development'
  },
  experienceYears: { type: Number, default: 5 },
  skills: [{ type: String }],
  bio: { type: String, required: true },
  linkedin: { type: String, default: '' },
  rating: { type: Number, default: 4.9 },
  sessionsCompleted: { type: Number, default: 45 },
  availableSlots: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Mentor', mentorSchema);
