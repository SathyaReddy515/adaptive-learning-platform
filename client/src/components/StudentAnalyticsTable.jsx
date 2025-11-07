import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Loader2, AlertCircle, Target, User, Clock } from 'lucide-react';

const StudentAnalyticsTable = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(
          'http://localhost:5001/api/users/analytics/students',
          config
        );
        
        // Convert the returned mastery object (which is a serialized Map) back into a proper Map object
        const formattedData = data.map(student => ({
            ...student,
            // CRITICAL FIX: The backend sends a plain object; convert it to a JS Map for iteration
            mastery: student.mastery && typeof student.mastery === 'object' 
                ? new Map(Object.entries(student.mastery))
                : new Map() 
        }));
        setAnalytics(formattedData);

      } catch (err) {
        // If 401/403, we show the specific unauthorized message
        const message = err.response?.data?.message || 'Unauthorized: You must be an Admin/Instructor.';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Helper to calculate and format the overall mastery score
  const getMasteryBar = (masteryMap) => {
    if (masteryMap.size === 0) return <span>Not Started</span>;
    
    let totalScore = 0;
    let totalTopics = 0;
    
    // 🚀 FINAL FIX: Use masteryMap.values() to iterate over the nested score objects
    for (const data of masteryMap.values()) {
        // Ensure scores are numbers before summing (Safety check)
        const score = Number(data.score);
        if (!isNaN(score)) {
            totalScore += score;
            totalTopics++;
        }
    }
    
    if (totalTopics === 0) return <span>Not Started</span>;

    const averageScore = Math.round((totalScore / totalTopics) * 100);
    const color = averageScore >= 70 ? 'bg-green-500' : averageScore >= 40 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div className="w-full">
            <span className="text-sm font-semibold">{averageScore}% Avg.</span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className={`${color} h-2 rounded-full`} 
                  style={{ width: `${averageScore}%` }}
                ></div>
            </div>
        </div>
    );
  };
  
  if (loading) {
    return <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-blue-600 inline-block" /> Loading Analytics...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600"><AlertCircle className="w-6 h-6 inline-block mr-2" /> Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><User className="w-4 h-4 inline-block mr-1"/> Student</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><Target className="w-4 h-4 inline-block mr-1"/> Avg. Mastery</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><Clock className="w-4 h-4 inline-block mr-1"/> Total Attempts</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mastery Breakdown</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {analytics.map((student) => (
            <tr key={student.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{getMasteryBar(student.mastery)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.totalAttempts}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {student.mastery.size === 0 ? (
                    <span className="text-gray-400">Not Started</span>
                ) : (
                    // FIX: Use .entries() for safe iteration over Map structure
                    Array.from(student.mastery.entries()).map(([topic, data]) => (
                        <span key={topic} className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                            {topic}: {Math.round(data.score * 100)}%
                        </span>
                    ))
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentAnalyticsTable;