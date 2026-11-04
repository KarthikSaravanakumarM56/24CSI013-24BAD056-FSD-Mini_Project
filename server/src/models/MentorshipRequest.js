const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema({
  mentor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Mentor', 
    required: true 
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  topic: { type: String, required: true },
  message: { type: String, required: true },
  preferredDate: { type: String, required: true },
  preferredTime: { type: String, default: 'Evening (6 PM - 8 PM IST)' },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Completed', 'Declined'], 
    default: 'Pending' 
  },
  meetingLink: { type: String, default: '' },
  mentorNotes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema);
