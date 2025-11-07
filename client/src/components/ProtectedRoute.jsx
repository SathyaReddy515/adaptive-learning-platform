import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// This component will protect our admin and instructor routes
const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // If not logged in, redirect to home
    return <Navigate to="/" replace />;
  }

  // Check if the user's role is in the allowedRoles array
  return allowedRoles.includes(user.role) ? (
    <Outlet /> // 👈 Renders the child route (e.g., AdminDashboard)
  ) : (
    <Navigate to="/" replace /> // 👈 If wrong role, redirect to home
  );
};

export default ProtectedRoute;