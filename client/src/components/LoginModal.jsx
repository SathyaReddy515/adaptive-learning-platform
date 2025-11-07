import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { X, User, BookUser, LogIn, AlertCircle, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast'; 

// --- Google Icon (no change) ---
const GoogleIcon = (props) => (
  <svg viewBox="0 0 48 48" {...props}><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v8.51h12.8c-.57 2.82-2.4 5.2-4.96 6.89l6.85 6.85c3.87-3.56 6.21-8.98 6.21-15.19z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-6.85-6.85c-2.15 1.45-4.92 2.3-8.04 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg>
);

// --- RegisterForm (no change) ---
const RegisterForm = ({ onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(name, email, password); 
      
      setLoading(false);
      
      toast.success('Registration successful! Please log in.');
      onRegisterSuccess(); // Call the function to switch tabs
      
      // Clear form
      setName('');
      setEmail('');
      setPassword('');

    } catch (err) {
      setLoading(false);
      setError(err.message); 
      toast.error(err.message); 
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="flex items-center rounded-md bg-red-50 p-3">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="ml-2 text-sm font-medium text-red-700">{error}</p>
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text" id="name" name="name"
          value={name} onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Your Name" required
        />
      </div>
      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email" id="reg-email" name="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="you@example.com" required
        />
      </div>
      <div>
        <label htmlFor="reg-password"className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password" id="reg-password" name="password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="At least 6 characters" required
        />
      </div>
      <button
        type="submit" disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        {loading ? 'Registering...' : 'Create Account'}
      </button>
    </form>
  );
};


// --- 🚀 UPDATED LOGIN FORM ---
// The handleSubmit function is now simpler and more secure.
const LoginForm = ({ userType, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext); 
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    setLoading(true);
    // 👈 'role' variable is GONE.

    try {
      // 👈 Call login with only email and password
      const loggedInUser = await login(email, password);
      
      setLoading(false);
      onClose(); 
      toast.success(`Welcome, ${loggedInUser.name}!`);
      
      // 👈 This redirect logic now works for all roles
      if (loggedInUser.role === 'student') {
        navigate('/dashboard');
      } else if (loggedInUser.role === 'instructor') {
        navigate('/instructor');
      } else if (loggedInUser.role === 'admin') { 
        navigate('/admin');
      }

    } catch (err) {
      setLoading(false);
      setError(err.message); 
      toast.error(err.message); // Will show "Invalid email or password"
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="flex items-center rounded-md bg-red-50 p-3">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="ml-2 text-sm font-medium text-red-700">{error}</p>
        </div>
      )}
      <div>
        {/* 'userType' is still used for the label, which is fine */}
        <label htmlFor={`${userType}-email`} className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email" id={`${userType}-email`} name="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="you@example.com" required
        />
      </div>
      <div>
        <label htmlFor={`${userType}-password`} className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password" id={`${userType}-password`} name="password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••" required
        />
      </div>
      <button
        type="button"
        className="text-sm text-blue-600 hover:underline focus:outline-none"
      >
        Forgot password?
      </button>
      <button
        type="submit" disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <LogIn className="w-4 h-4 mr-2" />
        {/* 'userType' is still used for the button text */}
        {loading ? 'Logging in...' : `Login as ${userType}`} 
      </button>
    </form>
  );
};

// --- LoginModal (Main Component) (no change) ---
const LoginModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('loginStudent'); 

  if (!isOpen) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } },
  };

  const handleRegisterSuccess = () => {
    setActiveTab('loginStudent');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
          variants={backdropVariants} initial="hidden" animate="visible" exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
            variants={modalVariants} initial="hidden" animate="visible" exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex border-b">
              <button
                className={`flex-1 flex justify-center items-center gap-2 p-4 text-sm font-medium ${
                  activeTab === 'loginStudent'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('loginStudent')}
              >
                <User className="w-4 h-4" />
                Student Login
              </button>
              <button
                className={`flex-1 flex justify-center items-center gap-2 p-4 text-sm font-medium ${
                  activeTab === 'loginTeacher'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('loginTeacher')}
              >
                <BookUser className="w-4 h-4" />
                Instructor / Admin
              </button>
              <button
                className={`flex-1 flex justify-center items-center gap-2 p-4 text-sm font-medium ${
                  activeTab === 'register'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('register')}
              >
                <UserPlus className="w-4 h-4" />
                Register
              </button>
            </div>

            <div className="p-6">
              <div className={activeTab === 'loginStudent' ? 'block' : 'hidden'}>
                <LoginForm userType="Student" onClose={onClose} />
              </div>
              <div className={activeTab === 'loginTeacher' ? 'block' : 'hidden'}>
                {/* We pass "Instructor / Admin" as the userType prop, 
                  which is only used for the button text.
                */}
                <LoginForm userType="Instructor / Admin" onClose={onClose} />
              </div>
              <div className={activeTab === 'register' ? 'block' : 'hidden'}>
                <RegisterForm onClose={onClose} onRegisterSuccess={handleRegisterSuccess} />
              </div>

              {activeTab !== 'register' && (
                <>
                  <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-sm text-gray-500">Or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>
                  <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <GoogleIcon className="w-5 h-5 mr-3" />
                    Sign in with Google
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;