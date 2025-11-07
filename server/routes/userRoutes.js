const express = require('express');
const router = express.Router();

// 1. Import ALL controller functions
const { 
  createTeacher, 
  updateUserProfile, 
  getUserProfile,
  getStudentDashboardData,
  getAllStudentAnalytics 
} = require('../controllers/userController');

// 2. Import ALL middleware
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// --- Admin-only route ---
router.post('/create-teacher', verifyToken, isAdmin, createTeacher);


// --- Routes for all logged-in users ---
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);

// GET dashboard data (Student)
router.get('/dashboard-data', verifyToken, getStudentDashboardData); 

// GET analytics data (Instructor/Admin)
router.get('/analytics/students', verifyToken, isAdmin, getAllStudentAnalytics); 

module.exports = router;