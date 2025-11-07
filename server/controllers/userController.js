const User = require('../models/User');
const bcrypt = require('bcryptjs');
const LearnerModel = require('../models/LearnerModel');
const Question = require('../models/Question'); 

// @desc    Create a new teacher (by an Admin)
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'instructor', 
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user profile
exports.getUserProfile = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Update user profile
exports.updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    const updatedUser = await user.save();
    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get student's profile and mastery data
exports.getStudentDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Fetch LearnerModel WITHOUT the complex populate
    let learnerModel = await LearnerModel.findOne({ student: userId }); 
    
    if (!learnerModel) {
      learnerModel = await LearnerModel.create({ student: userId, mastery: new Map() });
    }
    
    // 1. Get the last 5 attempts safely
    const recentActivity = (Array.isArray(learnerModel?.attemptHistory) ? learnerModel.attemptHistory : [])
      .slice(-5) 
      .reverse(); 

    // 2. Safely populate the question details for the recent history manually
    // This uses Question.populate, which requires Question to be imported (done at the top)
    const populatedActivity = await Question.populate(recentActivity, {
      path: 'question',
      model: 'Question',
      select: 'metadata.topic' 
    });

    res.status(200).json({
      profile: req.user,
      mastery: learnerModel?.mastery || new Map(), 
      recentActivity: populatedActivity,
    });

  } catch (error) {
    console.error("DASHBOARD DATA CRASH:", error); 
    res.status(500).json({ message: 'Error fetching student dashboard data. Check server logs.' });
  }
};

// @desc    Get all students and their mastery data
// @route   GET /api/users/analytics/students
// @access  Private (Admin/Instructor)
exports.getAllStudentAnalytics = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').lean();
    const studentIds = students.map(s => s._id);

    const learnerModels = await LearnerModel.find({ student: { $in: studentIds } }).lean();

    const modelMap = new Map(learnerModels.map(model => [model.student.toString(), model]));

    const analyticData = students.map(student => {
      const model = modelMap.get(student._id.toString());
      
      const rawMasteryData = model?.mastery || {};
      
      // 🚀 FINAL FIX: Use Object.entries and explicitly convert scores to Number 
      // immediately upon Map creation to guarantee numeric types for the frontend.
      const masteryMap = new Map();
      if (typeof rawMasteryData === 'object') {
          for (const [topic, data] of Object.entries(rawMasteryData)) {
              masteryMap.set(topic, {
                  score: Number(data.score), // FORCE CONVERSION
                  totalAttempts: Number(data.totalAttempts) // FORCE CONVERSION
              });
          }
      }
      
      return {
        id: student._id,
        name: student.name,
        email: student.email,
        mastery: masteryMap, 
        totalAttempts: model?.attemptHistory?.length || 0
      };
    });

    res.status(200).json(analyticData);

  } catch (error) {
    console.error("ANALYTICS DATA CRASH:", error);
    res.status(500).json({ message: 'Error fetching student analytics.' });
  }
};