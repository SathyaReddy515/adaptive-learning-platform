import React, { useState} from 'react';
import { toast } from 'react-hot-toast';
import { UserPlus, AlertCircle } from 'lucide-react';

import axios from 'axios';

const CreateTeacherForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // 1. Get the admin's token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You are not authorized. Please log in again.');
      setLoading(false);
      return;
    }

    // 2. Set up the authorization headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    // 3. Set up the new teacher's data
    const newTeacherData = { name, email, password };

    try {
      // 4. Make the secure API call
      await axios.post(
        'http://localhost:5001/api/users/create-teacher',
        newTeacherData,
        config
      );

      setLoading(false);
      toast.success(`Instructor "${name}" created successfully!`);
      
      // Clear the form
      setName('');
      setEmail('');
      setPassword('');

    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Failed to create teacher';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Instructor</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="flex items-center rounded-md bg-red-50 p-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-2 text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text" id="name" value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="John Doe" required
          />
        </div>
        
        <div>
          <label htmlFor="teacher-email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email" id="teacher-email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="teacher@example.com" required
          />
        </div>
        
        <div>
          <label htmlFor="teacher-password" className="block text-sm font-medium text-gray-700">Temporary Password</label>
          <input
            type="password" id="teacher-password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Min. 6 characters" required
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          {loading ? 'Creating...' : 'Create Instructor Account'}
        </button>
      </form>
    </div>
  );
};

export default CreateTeacherForm;