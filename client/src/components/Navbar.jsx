import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, Menu, X } from 'lucide-react';
import LoginModal from './LoginModal';
import ProfileDropdown from './ProfileDropdown';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useContext(AuthContext); 

  const navItems = [
    { name: 'Home', path: '#home' }, // Changed to anchor ID
    { name: 'About', path: '#about' },
    { name: 'Features', path: '#features' },
    { name: 'Contact', path: '#contact' },
  ];

  const handleLoginClick = () => {
    setIsMenuOpen(false);
    setShowLoginModal(true);
  };
  
  // Helper function to handle smooth scrolling for anchor links
  const handleAnchorClick = (e, path) => {
    if (path.startsWith('#') && window.location.pathname === '/') {
        e.preventDefault();
        const targetId = path.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 64, // Subtract navbar height
                behavior: 'smooth'
            });
        }
        setIsMenuOpen(false);
    } else {
        // For 'Home', we just let the Link component handle navigation
        setIsMenuOpen(false);
    }
  };


  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo / Brand Name (Always links home) */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center text-2xl font-bold text-blue-600">
                <BookMarked className="h-8 w-8 mr-2" />
                <span>Learnify</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path} // Use href for scrolling
                  onClick={(e) => handleAnchorClick(e, item.path)} // Custom handler
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Desktop Login/Profile Section */}
            <div className="hidden md:flex items-center">
              {user ? (
                <ProfileDropdown />
              ) : (
                <button 
                  onClick={handleLoginClick}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              {user && <ProfileDropdown />}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none ml-4"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                onClick={(e) => handleAnchorClick(e, item.path)}
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}
            
            {!user && (
              <button 
                onClick={handleLoginClick}
                className="w-full text-left bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        )}
      </nav>

      {!user && (
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      )}
    </>
  );
};

export default Navbar;