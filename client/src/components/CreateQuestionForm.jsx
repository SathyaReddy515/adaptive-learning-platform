import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, X, AlertCircle } from 'lucide-react';
import axios from 'axios';

const CreateQuestionForm = () => {
  const [questionType, setQuestionType] = useState('mcq');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('Algebra'); // Example topic
  const [difficulty, setDifficulty] = useState('medium');
  const [explanation, setExplanation] = useState('');

  // For MCQs
  const [options, setOptions] = useState([
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
  ]);

  // For Short Answer
  const [correctAnswer, setCorrectAnswer] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- MCQ Option Handlers ---
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const setCorrectOption = (index) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, { text: '', isCorrect: false }]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  // --- Form Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // 1. Construct the question data
    let questionData = {
      content,
      type: questionType,
      explanation,
      metadata: { topic, difficulty },
    };

    // 2. Add data specific to the question type
    if (questionType === 'mcq') {
      questionData.options = options;
    } else if (questionType === 'short-answer') {
      questionData.correctAnswer = correctAnswer;
    }

    // 3. Send to API
    try {
      await axios.post(
        'http://localhost:5001/api/questions',
        questionData,
        config
      );
      setLoading(false);
      toast.success('Question created successfully!');
      // TODO: Clear the form
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create question';
      setError(message);
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add to Question Bank</h2>
      
      {error && (
        <div className="flex items-center rounded-md bg-red-50 p-3 mb-4">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="ml-2 text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Question Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Question Type</label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="mcq">Multiple Choice</option>
            <option value="short-answer">Short Answer</option>
          </select>
        </div>

        {/* Common Fields */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Question Content</label>
          <textarea
            id="content" value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., What is 2 + 2?" required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">Topic</label>
            <input type="text" id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
          </div>
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty</label>
            <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* --- Dynamic Form Section --- */}

        {/* MCQ Form */}
        {questionType === 'mcq' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Options (Select the correct answer)</label>
            {options.map((opt, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correctOption"
                  checked={opt.isCorrect}
                  onChange={() => setCorrectOption(index)}
                  className="w-5 h-5 text-blue-600"
                />
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={opt.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                {options.length > 2 && (
                  <button type="button" onClick={() => removeOption(index)} className="text-red-500 hover:text-red-700">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Option
            </button>
          </div>
        )}

        {/* Short Answer Form */}
        {questionType === 'short-answer' && (
          <div>
            <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700">Correct Answer</label>
            <input
              type="text" id="correctAnswer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., 4" required
            />
          </div>
        )}

        {/* --- End Dynamic Form --- */}

        <div>
          <label htmlFor="explanation" className="block text-sm font-medium text-gray-700">Explanation</label>
          <textarea
            id="explanation" value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Explain why this answer is correct." required
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Question'}
        </button>
      </form>
    </div>
  );
};

export default CreateQuestionForm;