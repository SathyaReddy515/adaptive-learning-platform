import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Target, Clock, Loader2, AlertCircle, TrendingUp, Zap, Star } from 'lucide-react'; 
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Import necessary components
import StartQuizCard from '../components/StartQuizCard'; 
import MasteryProgress from '../components/MasteryProgress'; 
import RecentActivity from '../components/RecentActivity';
import DashboardFooter from '../components/DashboardFooter'; 

// --- Helper Component for KPI Cards ---
const DashboardKPI = ({ icon: Icon, title, value, colorClass = "text-blue-600" }) => (
    <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-gray-300 transition-shadow hover:shadow-2xl">
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
        <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
    </div>
);


const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [masteryData, setMasteryData] = useState(new Map());
  const [recentActivity, setRecentActivity] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  
  const token = localStorage.getItem('token');
  
  // 🚀 NEW STATE: Calculated KPIs
  const [kpis, setKpis] = useState({ 
    highestTopic: 'N/A', 
    highestScore: 0, 
    lastScore: 'N/A' 
  });


  // 🚀 Function to calculate KPIs from masteryData and FRESH activity data
  const calculateKpis = (mData, activity) => {
    let highestScore = 0;
    let localHighestTopic = 'N/A'; // Use a local name to avoid direct state access confusion
    
    // Find highest topic
    for (const [topic, data] of mData.entries()) {
      if (data.score > highestScore) {
        highestScore = data.score;
        localHighestTopic = topic; // Assign to local variable
      }
    }
    
    // FIX: Calculate last score based on the FRESH activity array (activity[0] is the newest)
    const totalRecentAttempts = activity.slice(0, 5); 
    const recentCorrect = totalRecentAttempts.filter(a => a.isCorrect).length;
    const recentTotal = totalRecentAttempts.length;

    let lastScoreDisplay = 'N/A';
    if (recentTotal > 0) {
        const accuracy = Math.round((recentCorrect / recentTotal) * 100);
        lastScoreDisplay = `${accuracy}% Accuracy`;
    }

    // 🚀 FIX: Update state with the local variable (no unused variable warning)
    setKpis({
      highestTopic: localHighestTopic, 
      highestScore: Math.round(highestScore * 100),
      lastScore: lastScoreDisplay,
    });
  };

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

        const masteryMap = new Map(Object.entries(data.mastery));
        const activity = data.recentActivity || [];

        setMasteryData(masteryMap);
        setRecentActivity(activity); 
        
        // CRITICAL FIX: Pass the fresh data directly to the KPI calculator
        calculateKpis(masteryMap, activity); 

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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between"> 
      
      {/* Wrapper for main content */}
      <div className='flex-grow'> 
        <div className="p-8 pt-24 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Review your progress and select your next challenge.
          </p>

          {/* ERROR DISPLAY BLOCK */}
          {error && (
            <div className="flex items-center rounded-md bg-red-50 p-3 mb-6 border border-red-300">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" /> 
              <p className="ml-2 text-sm font-medium text-red-700">{error}</p>
            </div>
          )}
          
          {/* 🚀 SECTION 1: KPI STATS CARDS */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <DashboardKPI 
                  icon={Star} 
                  title="Top Mastery Topic" 
                  value={kpis.highestTopic}
                  colorClass="text-yellow-600"
              />
              <DashboardKPI 
                  icon={TrendingUp} 
                  title="Highest Mastery Score" 
                  value={`${kpis.highestScore}%`}
                  colorClass="text-green-600"
              />
              <DashboardKPI 
                  icon={Zap} 
                  title="Last Attempt Accuracy" 
                  value={kpis.lastScore}
                  // Color class logic simplified based on string value
                  colorClass={kpis.lastScore.includes('%') && parseInt(kpis.lastScore) >= 50 ? 'text-green-600' : 'text-red-600'}
              />
          </section>

          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Main Column: Start Quiz and Recent Activity */}
            <div className="lg:col-span-2 space-y-8">
              <StartQuizCard masteryData={masteryData} /> 
              
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
      
      <DashboardFooter /> 
    </div>
  );
};

export default StudentDashboard;