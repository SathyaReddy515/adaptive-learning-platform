const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student',
  },
  googleId: { // For Google OAuth
    type: String,
    sparse: true, // This allows multiple nulls, but only one unique value
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});
module.exports = mongoose.model('User', userSchema);