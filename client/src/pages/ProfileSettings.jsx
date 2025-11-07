import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { User, Mail, Save, AlertCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

// 🚀 We need a new function in AuthContext to update the user
// We'll add this in the next step, but let's use it here now
const ProfileSettings = () => {
  const { user, updateUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. When page loads, fill form with user's data from context
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const { name, email } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      // 2. Call our new PUT endpoint
      const { data } = await axios.put(
        'http://localhost:5001/api/users/profile',
        formData,
        config
      );

      // 3. Update the global state with the new user data
      updateUser(data);
      
      setLoading(false);
      toast.success('Profile updated successfully!');

    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile';
      setError(message);
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-24"> {/* Added padding-top */}
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Profile Settings
        </h1>
        <form 
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg space-y-6"
        >
          {error && (
            <div className="flex items-center rounded-md bg-red-50 p-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-2 text-sm font-medium text-red-700">{error}</p>
            </div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text" name="name" id="name"
                className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={name} onChange={onChange} required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email" name="email" id="email"
                className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={email} onChange={onChange} required
              />
            </div>
          </div>
          
          <button
            type="submit" disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;