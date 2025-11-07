const Question = require('../models/Question');
const LearnerModel = require('../models/LearnerModel');

// @desc    Start a quiz (generate questions)
// @route   GET /api/quiz/start
// @access  Private (Student)
exports.startQuiz = async (req, res) => {
  try {
    const { topic } = req.query; 
    const userId = req.user._id;

    let learnerModel = await LearnerModel.findOne({ student: userId });
    if (!learnerModel) {
      learnerModel = await LearnerModel.create({ student: userId, mastery: new Map() });
    }

    const topicMastery = learnerModel.mastery.get(topic) || { score: 0, totalAttempts: 0 };
    const masteryScore = topicMastery.score;

    // Adaptive Logic: Determine target difficulty
    let targetDifficulty;
    if (masteryScore < 0.4) {
      targetDifficulty = 'easy';
    } else if (masteryScore < 0.8) {
      targetDifficulty = 'medium';
    } else {
      targetDifficulty = 'hard';
    }

    // 4. Find 5 random questions
    let questions = await Question.aggregate([
      { $match: { 'metadata.topic': topic, 'metadata.difficulty': targetDifficulty } },
      { $sample: { size: 5 } }
    ]);

    // Fallback if no questions are found at target difficulty
    if (questions.length === 0) {
      questions = await Question.aggregate([
        { $match: { 'metadata.topic': topic, 'metadata.difficulty': 'medium' } },
        { $sample: { size: 5 } }
      ]);
    }

    // Security: Strip the answers
    const safeQuestions = questions.map(q => {
      const safeOptions = (q.options || []).map(opt => ({
        _id: opt._id,
        text: opt.text,
      }));
      return {
        _id: q._id,
        content: q.content,
        type: q.type,
        options: safeOptions,
        metadata: q.metadata,
      };
    });

    res.status(200).json(safeQuestions);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Check a single answer (for instant feedback)
// @route   POST /api/quiz/check
// @access  Private (Student)
exports.checkAnswer = async (req, res) => {
  try {
    const { questionId, selectedOptionId, answerText } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    let isCorrect = false;
    let correctAnswer = null;
    let explanation = question.explanation;

    if (question.type === 'mcq') {
      const correctOption = question.options.find(opt => opt.isCorrect);
      if (correctOption) {
        correctAnswer = correctOption._id.toString(); 
        if (correctAnswer === selectedOptionId) {
          isCorrect = true;
        }
      }
    } 
    else if (question.type === 'short-answer') {
      correctAnswer = question.correctAnswer;
      if (String(answerText).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase()) {
        isCorrect = true;
      }
    }

    res.status(200).json({
      isCorrect,
      correctAnswer,
      explanation,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Submit a quiz and update mastery AND history
// @route   POST /api/quiz/submit
// @access  Private (Student)
exports.submitQuiz = async (req, res) => {
  try {
    const userId = req.user._id;
    // 1. Get score and history from client
    const { topic, correctCount, totalQuestions, fullAttemptHistory } = req.body; 

    const learnerModel = await LearnerModel.findOne({ student: userId });
    if (!learnerModel) {
      await LearnerModel.create({ student: userId, mastery: new Map() });
    }
    
    // 2. Calculate new mastery
    const currentMastery = learnerModel.mastery.get(topic) || { score: 0, totalAttempts: 0 };
    const quizScore = correctCount / totalQuestions;

    const newTotalAttempts = currentMastery.totalAttempts + totalQuestions;
    const newMasteryScore = 
      ((currentMastery.score * currentMastery.totalAttempts) + (quizScore * totalQuestions)) 
      / newTotalAttempts;

    // 3. Save mastery
    learnerModel.mastery.set(topic, {
      score: newMasteryScore,
      totalAttempts: newTotalAttempts,
    });
    
    // 🚀 FIX: Save full history (for Recent Activity)
    if (fullAttemptHistory && fullAttemptHistory.length > 0) {
        learnerModel.attemptHistory.push(...fullAttemptHistory);
    }
    
    await learnerModel.save();

    // 4. Send back the new mastery score
    res.status(200).json({
      message: 'Quiz submitted successfully!',
      correctCount,
      totalQuestions,
      newMastery: newMasteryScore,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};