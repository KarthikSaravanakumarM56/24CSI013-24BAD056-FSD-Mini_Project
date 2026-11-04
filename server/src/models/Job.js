const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  logo: { type: String, default: '' },
  location: { type: String, required: true, default: 'Bangalore, India' },
  workMode: { 
    type: String, 
    enum: ['Remote', 'Hybrid', 'On-site'], 
    default: 'Hybrid' 
  },
  type: { 
    type: String, 
    enum: ['Internship', 'Full-time', 'Part-time', 'Contract'], 
    default: 'Internship' 
  },
  salary: { type: String, default: '₹35,000 / month' },
  experience: { type: String, default: 'Fresher (0-1 yr)' },
  domain: { 
    type: String, 
    default: 'Full Stack Development',
    index: true 
  },
  department: { type: String, default: 'Any' },
  requiredSkills: [{ type: String, trim: true }],
  optionalSkills: [{ type: String, trim: true }],
  description: { type: String, required: true },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  openings: { type: Number, default: 3 },
  status: { type: String, enum: ['Active', 'Closed'], default: 'Active' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Virtual to calculate total applications count
jobSchema.virtual('applicationsCount', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'job',
  count: true
});

jobSchema.set('toObject', { virtuals: true });
jobSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
