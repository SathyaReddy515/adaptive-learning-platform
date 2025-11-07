import React from 'react';
import { Target, TrendingUp, TrendingDown, Clock } from 'lucide-react'; 
import { motion } from 'framer-motion';

const MasteryProgress = ({ masteryData }) => {
  const topics = Array.from(masteryData.keys());

  if (topics.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg border text-gray-500 flex items-center justify-center gap-2">
        <Clock className="w-5 h-5 text-gray-400" />
        Start your first quiz to see your mastery progress here!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topics.map(topic => {
        const data = masteryData.get(topic); 
        
        // Safety check for corrupted or missing data fields
        if (!data || typeof data.score !== 'number') return null; 

        const score = Math.round(data.score * 100); 
        const attempts = data.totalAttempts;

        // --- Styling Logic ---
        let color, label, Icon;
        if (score >= 80) {
          color = 'bg-green-500';
          label = 'Mastered';
          Icon = TrendingUp; // Used here
        } else if (score >= 40) {
          color = 'bg-yellow-500';
          label = 'Developing';
          Icon = Target; // Used here
        } else {
          color = 'bg-red-500';
          label = 'Needs Review';
          Icon = TrendingDown; // Used here
        }

        return (
          <div key={topic} className="p-4 border rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
            
            {/* Header and Status */}
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <Icon className={`w-5 h-5 ${score >= 80 ? 'text-green-600' : score >= 40 ? 'text-yellow-600' : 'text-red-600'}`} />
                {topic}
              </h4>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${color}`}>
                {label}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1.5 }}
                className={`${color} h-3 rounded-full`}
              ></motion.div>
            </div>
            
            {/* Details */}
            <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
              <span className="font-bold text-gray-900">{score}% Proficiency</span>
              <span>Total Attempts: {attempts}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MasteryProgress;