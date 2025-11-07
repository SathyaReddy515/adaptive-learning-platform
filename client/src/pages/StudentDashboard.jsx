import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Target, Clock, Loader2, AlertCircle } from 'lucide-react'; 
import axios from 'axios';
import { toast } from 'react-hot-toast';

import StartQuizCard from '../components/StartQuizCard'; 
import MasteryProgress from '../components/MasteryProgress'; 
import RecentActivity from '../components/RecentActivity'; 

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [masteryData, setMasteryData] = useState(new Map());
  const [recentActivity, setRecentActivity] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  
  const token = localStorage.getItem('token');

  // Fetch Dashboard Data on load
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(
          'http://localhost:5001/api/users/dashboard-data',
          config
        );

        // Process mastery data: Convert object received from API into a Map structure
        const masteryMap = new Map(Object.entries(data.mastery));
        setMasteryData(masteryMap);
        
        // Set recent activity data
        setRecentActivity(data.recentActivity || []); 
        
      } catch (err) {
        setError('Failed to load dashboard data. Please check server logs or network.');
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user, token]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="mt-4 text-lg text-gray-700">Loading Dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Ready to start learning? Your current mastery scores are below.
        </p>

        {/* ERROR DISPLAY BLOCK */}
        {error && (
          <div className="flex items-center rounded-md bg-red-50 p-3 mb-6 border border-red-300">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" /> 
            <p className="ml-2 text-sm font-medium text-red-700">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Column: Start Quiz and Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            <StartQuizCard /> 
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Recent Activity
              </h3>
              <RecentActivity activity={recentActivity} /> 
            </div>
          </div>

          {/* Right Sidebar: Mastery Stats */}
          <div className="lg:col-span-1 space-y-8">
            <div className="p-6 rounded-lg shadow-lg bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Mastery Progress
              </h3>
              <MasteryProgress masteryData={masteryData} /> 
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;