const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 1. Define the nested schema for mastery entries
const MasteryEntrySchema = new Schema({
    score: { type: Number, default: 0 },
    totalAttempts: { type: Number, default: 0 }
}, { _id: false }); 

// 2. Define the attempt history schema
const attemptSchema = new Schema({
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question', 
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  timeTaken: { 
    type: Number, 
  },
});

// 3. Define the main learner model schema
const learnerModelSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  mastery: {
    type: Map,
    of: MasteryEntrySchema, 
    default: {},
  },
  attemptHistory: [attemptSchema],
  streaks: {
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('LearnerModel', learnerModelSchema);