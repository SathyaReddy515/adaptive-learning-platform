import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const StartQuizCard = () => {
  const [topic, setTopic] = useState('Algebra'); // Default topic
  const navigate = useNavigate(); 

  const handleStartQuiz = () => {
    // Navigate to the quiz page and pass the topic in the 'state'
    // This starts the adaptive logic on the backend for the selected topic.
    navigate('/quiz', { state: { topic: topic } });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Start a New Quiz</h2>
      <p className="text-gray-600 mb-4">
        Select a topic to test your knowledge and improve your mastery.
      </p>
      
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
            {/* These topics must match what's in your Question Bank */}
            <option value="Algebra">Algebra</option>
            <option value="Calculus">Calculus</option>
            <option value="Geometry">Geometry</option>
          </select>
        </div>
        <button
          onClick={handleStartQuiz}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <BookOpen className="w-5 h-5" />
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default StartQuizCard;