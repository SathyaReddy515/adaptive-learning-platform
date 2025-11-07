import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileSettings from './pages/ProfileSettings';
import QuizPage from './pages/QuizPage'; // 👈 1. Make sure you import QuizPage

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* --- Protected Routes --- */}
        
        {/* Student-Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/quiz" element={<QuizPage />} /> {/* 👈 2. This is the missing line */}
        </Route>

        {/* Instructor-Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
          <Route path="/instructor" element={<InstructorDashboard />} />
        </Route>
        
        {/* Admin-Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} /> 
        </Route>
        
        {/* Routes for ALL logged-in users */}
        <Route element={<ProtectedRoute allowedRoles={['student', 'instructor', 'admin']} />}>
          <Route path="/profile-settings" element={<ProfileSettings />} />
        </Route>
        
      </Routes>
    </>
  );
}

export default App;