import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To check auth status on load

  // This effect will run on app load to check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // We should ideally verify the token with the backend,
      // but for now, we'll just re-set the user data from localStorage.
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, []);

  // Login Function
  const login = async (email, password) => { // 👈 'role' parameter is GONE
    try {
      // 🚀 UPDATE: Send ONLY email and password
      const { data } = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password,
      });

      // Save to state
      setUser(data.user);
      
      // Save to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data.user; // Return user data (with the correct role)
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    }
  };
    


  // 🚀 UPDATED REGISTER FUNCTION
  const register = async (name, email, password) => {
    try {
      // This just sends the registration request.
      // We don't log the user in.
      await axios.post('http://localhost:5001/api/auth/register', {
        name,
        email,
        password,
      });

      // Return true on success
      return true;
      
    } catch (error) {
      // Throw error to be caught by the form
      const message = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(message);
    }
  };

  // Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // 🚀 ADD THIS NEW FUNCTION
  const updateUser = (newUserData) => {
    // 1. Update the state
    setUser(newUserData);
    // 2. Update localStorage so it persists on refresh
    localStorage.setItem('user', JSON.stringify(newUserData));
  };


  return (
    // 🚀 3. Add 'updateUser' to the provider value
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;