const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const optionSchema = new Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true, default: false },
});

const questionSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['mcq', 'short-answer', 'code'],
    required: true,
  },
  // For MCQs
  options: [optionSchema],

  // For short-answer or code (can be a string or array of acceptable strings)
  correctAnswer: {
    type: Schema.Types.Mixed, 
  },
  hints: [{
    type: String,
  }],
  explanation: {
    type: String,
    required: true,
  },
  metadata: {
    topic: { type: String, required: true, index: true }, // Indexed for fast queries
    difficulty: { 
      type: String, 
      enum: ['easy', 'medium', 'hard'], 
      default: 'medium',
      index: true,
    },
    skills: [String],
    bloomTaxonomy: {
      type: String,
      enum: ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'],
    },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Question', questionSchema);