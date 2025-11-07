const Question = require('../models/Question');

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private/Instructor or Admin
exports.createQuestion = async (req, res) => {
  try {
    // We get the 'topic', 'type', 'content', etc. from the body
    const question = new Question({
      ...req.body,
      createdBy: req.user._id, // Attach the user who created it
    });

    const createdQuestion = await question.save();
    res.status(201).json(createdQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all questions (for the question bank)
// @route   GET /api/questions
// @access  Private/Instructor or Admin
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find({});
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};