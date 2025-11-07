import React, { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, LayoutDashboard, User } from 'lucide-react';

import AuthContext from '../context/AuthContext';
import useClickOutside from '../hooks/useClickOutside';

// Helper function to get initials
const getInitials = (name) => {
  if (!name) return 'U';
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const ProfileDropdown = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Ref for the dropdown
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    switch (user.role) {
      case 'student':
        return '/dashboard';
      case 'instructor':
        return '/instructor';
      case 'admin':
        return '/admin';
      default:
        return '/';
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {getInitials(user.name)}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-50 border"
          >
            {/* User Info Header */}
            <div className="p-4 border-b">
              <p className="font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>

            {/* Menu Items */}
            <ul className="py-2">
              <Link
                to={getDashboardLink()}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LayoutDashboard className="w-4 h-4" />
                My Dashboard
              </Link>
              <Link
                to="/profile-settings" // We can build this page later
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User className="w-4 h-4" />
                Profile Settings
              </Link>
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;