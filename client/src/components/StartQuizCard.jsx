import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { BookOpen, AlertTriangle } from 'lucide-react'; 

const StartQuizCard = ({ masteryData }) => {
  // All topics available in the application (must match seed data topics)
  const allTopics = ["Algebra", "Calculus", "Geometry"]; 
  
  const [topic, setTopic] = useState('Algebra'); // Controls the dropdown's selected value
  const [suggestedTopic, setSuggestedTopic] = useState(null); // Displays the suggested topic string
  const [lowestScoreDisplay, setLowestScoreDisplay] = useState(0); // 👈 NEW STATE for displaying the score
  const navigate = useNavigate(); 
  
  // 🚀 Logic to determine the lowest mastery topic
  useEffect(() => {
    let lowestScore = Infinity; // Local variable for calculation
    let lowestTopic = null;
    
    // Safety check: If no mastery data exists, do nothing
    if (!masteryData || masteryData.size === 0) {
      setSuggestedTopic(null);
      return;
    }

    // Iterate over the Map entries to find the minimum score
    for (const [t, data] of masteryData.entries()) {
      // Ensure score is treated as a number
      const score = Number(data.score); 
      
      // We only consider topics the student has attempted (attempts > 0)
      if (score < lowestScore && data.totalAttempts > 0) {
        lowestScore = score;
        lowestTopic = t;
      }
    }
    
    if (lowestTopic) {
      setSuggestedTopic(lowestTopic);
      setTopic(lowestTopic); // Set the dropdown default to the suggested topic
      setLowestScoreDisplay(lowestScore); // 👈 STORE SCORE IN STATE
    } else {
      // If student has scores but totalAttempts=0 for all (initial data) or hasn't started
      setSuggestedTopic(null);
      setTopic('Algebra'); // Default back to the first topic
      setLowestScoreDisplay(0);
    }
  }, [masteryData]);


  const handleStartQuiz = () => {
    // Navigates to the quiz page, passing the currently selected topic
    navigate('/quiz', { state: { topic: topic } });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-blue-600">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your Next Challenge</h2>
      
      {/* 🚀 Suggested Topic Cue (Appears when suggestion is found) */}
      {suggestedTopic && (
          <div className="flex items-center p-3 mb-4 rounded-md bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm font-medium">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {/* 👈 FIX: Use the state variable for display */}
              Your lowest mastery is in **{suggestedTopic}** ({Math.round(lowestScoreDisplay * 100)}%). We suggest reviewing this topic.
          </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
            Select Topic
          </label>
          <select
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {/* Map through all possible topics */}
            {allTopics.map(t => (
                <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleStartQuiz}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <BookOpen className="w-5 h-5" />
          Start Quiz on {topic}
        </button>
      </div>
    </div>
  );
};

export default StartQuizCard;