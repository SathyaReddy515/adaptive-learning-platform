const express = require('express');
const router = express.Router();

// 1. Import the new function
const { startQuiz, checkAnswer, submitQuiz } = require('../controllers/quizController'); 
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/start', verifyToken, startQuiz);
router.post('/submit', verifyToken, submitQuiz); 
router.post('/check', verifyToken, checkAnswer); // 👈 2. Add the new route

module.exports = router;