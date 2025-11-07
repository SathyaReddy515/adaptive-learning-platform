import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AlertCircle, Loader2 } from 'lucide-react';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setError('You are not authorized.');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      try {
        const { data } = await axios.get(
          'http://localhost:5001/api/questions',
          config
        );
        setQuestions(data);
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch questions';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []); // The empty array means this runs once when the component mounts

  // --- Render Logic ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center rounded-md bg-red-50 p-4">
        <AlertCircle className="h-5 w-5 text-red-400" />
        <p className="ml-2 text-sm font-medium text-red-700">{error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return <p className="text-gray-600">No questions found. Add one to get started!</p>;
  }

  return (
    <div className="space-y-4">
      {questions.map((q, index) => (
        <div key={q._id} className="bg-gray-50 p-4 rounded-lg border">
          <p className="text-sm text-gray-500">
            {index + 1}. **Topic:** {q.metadata.topic} | **Difficulty:** {q.metadata.difficulty}
          </p>
          <p className="mt-2 font-medium text-gray-900">{q.content}</p>
          
          {/* Display options for MCQs */}
          {q.type === 'mcq' && (
            <ul className="mt-2 space-y-1 pl-4 list-disc">
              {q.options.map((opt) => (
                <li
                  key={opt._id}
                  className={opt.isCorrect ? 'text-green-600 font-bold' : 'text-gray-700'}
                >
                  {opt.text}
                </li>
              ))}
            </ul>
          )}

          {/* Display answer for short-answer */}
          {q.type === 'short-answer' && (
            <p className="mt-2 text-sm text-green-600">
              **Answer:** {q.correctAnswer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionList;