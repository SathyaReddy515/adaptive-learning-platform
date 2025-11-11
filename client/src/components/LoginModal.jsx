import React, { useState, useContext } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import AuthContext from '../context/AuthContext'; 
import { X, User, BookUser, LogIn, AlertCircle, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

// --- Note: GoogleIcon component removed as it is no longer used ---

// --- 🚀 NEW REGISTER FORM COMPONENT ---
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
      onRegisterSuccess(); 
      
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
        <div className="flex items-center rounded-md bg-red-50 p-3 border border-red-300">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="ml-2 text-sm font-medium text-red-700">{error}</p>
        </div>
      )}
      <div className="pt-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text" id="name" name="name"
          value={name} onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          placeholder="Your Name" required
        />
      </div>
      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700">Email Address</label>
        <input
          type="email" id="reg-email" name="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          placeholder="you@example.com" required
        />
      </div>
      <div>
        <label htmlFor="reg-password"className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password" id="reg-password" name="password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          placeholder="At least 6 characters" required
        />
      </div>
      <button
        type="submit" disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-150"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        {loading ? 'Registering...' : 'Create Account'}
      </button>
    </form>
  );
};


// --- 🚀 UPDATED LOGIN FORM COMPONENT ---
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

    try {
      const loggedInUser = await login(email, password);

      setLoading(false);
      onClose(); 
      toast.success(`Welcome, ${loggedInUser.name}!`);
      
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
      toast.error(err.message);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="flex items-center rounded-md bg-red-50 p-3 border border-red-300">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="ml-2 text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      <div className="pt-2">
        <label htmlFor={`${userType}-email`} className="block text-sm font-medium text-gray-700">Email Address</label>
        <input
          type="email" id={`${userType}-email`} name="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          placeholder="you@example.com" required
        />
      </div>
      <div>
        <label htmlFor={`${userType}-password`} className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password" id={`${userType}-password`} name="password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          placeholder="••••••••" required
        />
      </div>
      <button
        type="button"
        className="text-sm text-blue-600 hover:underline focus:outline-none transition duration-150"
      >
        Forgot password?
      </button>
      <button
        type="submit" disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-150"
      >
        <LogIn className="w-4 h-4 mr-2" />
        {loading ? 'Logging in...' : `Login as ${userType}`} 
      </button>
    </form>
  );
};

// --- 🚀 UPDATED LOGIN MODAL (MAIN COMPONENT) ---
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
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* TABS: Student Login | Instructor / Admin | Register */}
            <div className="flex border-b bg-gray-50 rounded-t-xl">
              <button
                className={`flex-1 flex justify-center items-center gap-2 p-4 text-sm font-medium ${
                  activeTab === 'loginStudent'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white shadow-inner'
                    : 'text-gray-600 hover:text-blue-500'
                } transition duration-150`}
                onClick={() => setActiveTab('loginStudent')}
              >
                <User className="w-4 h-4" />
                Student Login
              </button>
              <button
                className={`flex-1 flex justify-center items-center gap-2 p-4 text-sm font-medium ${
                  activeTab === 'loginTeacher'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white shadow-inner'
                    : 'text-gray-600 hover:text-blue-500'
                } transition duration-150`}
                onClick={() => setActiveTab('loginTeacher')}
              >
                <BookUser className="w-4 h-4" />
                Instructor / Admin
              </button>
              <button
                className={`flex-1 flex justify-center items-center gap-2 p-4 text-sm font-medium ${
                  activeTab === 'register'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white shadow-inner'
                    : 'text-gray-600 hover:text-blue-500'
                } transition duration-150`}
                onClick={() => setActiveTab('register')}
              >
                <UserPlus className="w-4 h-4" />
                Register
              </button>
            </div>

            {/* CONTENT PANELS */}
            <div className="p-6">
              <div className={activeTab === 'loginStudent' ? 'block' : 'hidden'}>
                <LoginForm userType="Student" onClose={onClose} />
              </div>
              <div className={activeTab === 'loginTeacher' ? 'block' : 'hidden'}>
                <LoginForm userType="Instructor / Admin" onClose={onClose} />
              </div>
              <div className={activeTab === 'register' ? 'block' : 'hidden'}>
                <RegisterForm onClose={onClose} onRegisterSuccess={handleRegisterSuccess} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;