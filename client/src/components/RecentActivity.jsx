import React from 'react';
import { CheckCircle, XCircle, Target, Clock } from 'lucide-react'; 
import moment from 'moment'; // Ensure you have installed 'moment' via npm install moment

const RecentActivity = ({ activity }) => {
  // Safety check to handle empty data gracefully
  if (!activity || activity.length === 0) {
    return (
      <p className="text-gray-600 flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-500" />
        No recent quiz attempts found yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {activity.map((attempt, index) => {
        // Ensure the question object exists (needed because we are manually populating)
        if (!attempt.question) return null; 
        
        const Icon = attempt.isCorrect ? CheckCircle : XCircle;
        const color = attempt.isCorrect ? 'text-green-600' : 'text-red-600';
        const bgColor = attempt.isCorrect ? 'bg-green-50' : 'bg-red-50';
        const borderColor = attempt.isCorrect ? 'border-green-400' : 'border-red-400';

        return (
          <div 
            key={index} 
            className={`flex justify-between items-center p-3 rounded-lg border-l-4 ${bgColor} ${borderColor}`}
          >
            {/* Left Side: Status and Question Topic */}
            <div className="flex items-center gap-3">
              <Icon className={`w-5 h-5 ${color} flex-shrink-0`} />
              <div>
                <p className={`font-medium ${color}`}>
                  {attempt.isCorrect ? 'Correct' : 'Incorrect'}
                </p>
                
                {/* Safely access the topic, falling back to 'N/A' */}
                <p className="text-sm text-gray-700 mt-0.5 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-blue-500" /> 
                  **Topic:** {attempt.question?.metadata?.topic || 'N/A'}
                </p>
              </div>
            </div>

            {/* Right Side: Time */}
            <div className="text-right text-xs text-gray-500 flex-shrink-0">
              {moment(attempt.timestamp).fromNow()}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentActivity;