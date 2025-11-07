const express = require('express');
const router = express.Router();

const { 
  createQuestion, 
  getAllQuestions 
} = require('../controllers/questionController');

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// We use 'verifyToken' and 'isAdmin' to protect these routes
// Only instructors or admins can create or view all questions
router.route('/')
  .post(verifyToken, isAdmin, createQuestion)
  .get(verifyToken, isAdmin, getAllQuestions);

module.exports = router;