const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  verified: { type: Boolean, default: false }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: false },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  avatar: { type: String, default: '' },
  googleId: { type: String, default: '' },
  isGoogleUser: { type: Boolean, default: false },
  
  // Student / Alumni Category
  studentStatus: { 
    type: String, 
    enum: ['Passed Out Graduate (Alumni)', 'Current Student', 'Career Switcher / Job Seeker'], 
    default: 'Passed Out Graduate (Alumni)' 
  },
  noticePeriod: { 
    type: String, 
    default: 'Immediate Joiner (Available Today)' 
  },
  headline: { type: String, default: 'Software Engineer Graduate | Seeking Full-time Opportunities' },
  bio: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: 'Bangalore, India' },
  
  // Education Details
  college: { type: String, default: '' },
  degree: { type: String, default: 'B.Tech in Computer Science' },
  department: { type: String, default: 'Computer Science and Engineering' },
  graduationYear: { type: Number, default: 2025 },
  cgpa: { type: String, default: '8.4' },
  
  // Skills & Career Goal
  domain: { 
    type: String, 
    default: 'Full Stack Development',
    index: true
  },
  targetRole: { type: String, default: 'Full Stack Developer' },
  currentSkills: [skillSchema],
  
  // Social & Portfolios
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  portfolio: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  
  // Verified Skill Badges (earned via assessments)
  badges: [{
    skill: String,
    score: Number,
    awardedAt: { type: Date, default: Date.now }
  }],
  
  // Saved / Bookmarked jobs
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  
  // Saved ATS Resume from Builder
  resumeData: {
    personal: Object,
    summary: String,
    education: Array,
    experience: Array,
    projects: Array,
    skills: Array,
    certifications: Array
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
