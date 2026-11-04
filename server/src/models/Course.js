const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  provider: { type: String, required: true, trim: true },
  skill: { type: String, required: true, trim: true },
  domain: { 
    type: String, 
    default: 'Full Stack Development',
    index: true 
  },
  category: { 
    type: String, 
    default: 'Software Development' 
  },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    default: 'Intermediate' 
  },
  duration: { type: String, default: '15 Hours' },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 1250 },
  isFree: { type: Boolean, default: true },
  price: { type: String, default: 'Free' },
  url: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  description: { type: String, required: true },
  syllabus: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
