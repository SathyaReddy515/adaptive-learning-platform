import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Loader2, Check, CheckCircle, XCircle, Type, SearchX } from 'lucide-react';
 
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [shortAnswerText, setShortAnswerText] = useState('');
  
  const [score, setScore] = useState(0);
  const [answerStatus, setAnswerStatus] = useState('idle');
  const [feedback, setFeedback] = useState({ isCorrect: false, correctAnswer: null, explanation: '' });
  
  // 🚀 FIX 1: New State to collect history for submission
  const [fullAttemptHistory, setFullAttemptHistory] = useState([]); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const topic = location.state?.topic; 
  const token = localStorage.getItem('token');

  // --- Fetch questions (The adaptive generation API call) ---
  useEffect(() => {
    if (!topic) {
      toast.error('No topic selected. Returning to dashboard.');
      navigate('/dashboard');
      return;
    }
    if (!user) {
      toast.error('You must be logged in to start a quiz.');
      navigate('/');
      return;
    }
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `http://localhost:5001/api/quiz/start?topic=${topic}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data && data.length > 0) {
          setQuestions(data);
        } else {
          setError(`No questions found for the topic "${topic}".`);
          toast.error(`No questions found for "${topic}".`);
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to fetch quiz';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [user, topic, navigate, token]);

  // --- Check Answer Function (Instant Feedback & History Collection) ---
  const handleCheckAnswer = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    let payload = { questionId: currentQuestion._id };

    if (currentQuestion.type === 'mcq') {
      if (!selectedAnswer) return;
      payload.selectedOptionId = selectedAnswer;
    } else if (currentQuestion.type === 'short-answer') {
      if (shortAnswerText.trim() === '') return;
      payload.answerText = shortAnswerText;
    }

    setAnswerStatus('checking');
    const startTime = Date.now(); // Start timer for timeTaken

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(
        'http://localhost:5001/api/quiz/check',
        payload, 
        config
      );
      
      const timeTaken = Math.round((Date.now() - startTime) / 1000); // Time in seconds

      // 🚀 FIX 2: Create and store the attempt record
      const attemptRecord = {
        question: currentQuestion._id, // This is the ID Mongoose needs for population
        isCorrect: data.isCorrect,
        timeTaken: timeTaken,
        // Timestamp is automatically added by Mongoose schema
      };
      setFullAttemptHistory(prev => [...prev, attemptRecord]); // Add to our submission history

      setFeedback(data);
      setAnswerStatus('answered');
      if (data.isCorrect) {
        setScore(score + 1);
        toast.success("Correct!", { duration: 1500 });
      } else {
        toast.error("Not quite!", { duration: 1500 });
      }

    } catch (err) {
      toast.error('Error checking answer.');
      setAnswerStatus('idle');
    }
  };

  // --- Submit Quiz Function (Final Mastery Update) ---
  const handleSubmitQuiz = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // 🚀 FIX 3: Send the full history array in the payload
      const { data } = await axios.post(
        'http://localhost:5001/api/quiz/submit',
        { 
            topic, 
            correctCount: score, 
            totalQuestions: questions.length,
            fullAttemptHistory: fullAttemptHistory // 👈 Sending the collected history
        },
        config
      );
      setLoading(false);
      toast.success(
        `Quiz Finished! You scored ${data.correctCount} / ${data.totalQuestions}.`,
        { duration: 4000 }
      );
      toast(
        `Your new mastery for ${topic} is ${Math.round(data.newMastery * 100)}%`,
        { icon: '🎯' }
      );
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit quiz';
      toast.error(message);
      setLoading(false);
    }
  };
  
  // --- Next Question Function ---
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setAnswerStatus('idle');
      setSelectedAnswer(null);
      setShortAnswerText('');
      setFeedback({ isCorrect: false, correctAnswer: null, explanation: '' });
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };
  
  // --- Render Logic Setup ---
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const isButtonDisabled = 
    (currentQuestion?.type === 'mcq' && !selectedAnswer) ||
    (currentQuestion?.type === 'short-answer' && shortAnswerText.trim() === '');

  // Helper function to style options
  const getOptionClass = (option) => {
    if (answerStatus !== 'answered') {
      return selectedAnswer === option._id
        ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500' 
        : 'bg-white border-gray-300 hover:bg-gray-50';
    }
    if (option._id === feedback.correctAnswer) {
      return 'bg-green-100 border-green-500 ring-2 ring-green-500'; 
    }
    if (option._id === selectedAnswer && !feedback.isCorrect) {
      return 'bg-red-100 border-red-500 ring-2 ring-red-500';
    }
    return 'bg-white border-gray-300 opacity-60';
  };

  // --- Conditional Render Blocks ---

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="mt-4 text-lg text-gray-700">
          Getting your quiz ready...
        </p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-8">
        <div className="text-center bg-white p-10 md:p-12 rounded-lg shadow-xl">
          <SearchX className="h-20 w-20 text-blue-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No Questions Found</h2>
          <p className="text-lg text-gray-600 max-w-md mb-6">
            {error ? error : `We couldn't find any questions for the topic "${topic}".`}
          </p>
          <p className="text-md text-gray-500 max-w-md mb-8">
            Please ask your **Admin** or **Instructor** to add questions for this topic.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-medium text-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 pt-24">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-600 mb-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Content */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {currentQuestion.content}
        </h2>

        {/* Answer Area (MCQ + Short Answer) */}
        <div className="space-y-4">
          
          {/* --- MCQ Renderer --- */}
          {currentQuestion.type === 'mcq' && currentQuestion.options && currentQuestion.options.map((opt) => (
            <label
              key={opt._id}
              className={`flex items-center p-4 border rounded-md cursor-pointer transition-all ${getOptionClass(opt)}`}
            >
              <input
                type="radio"
                name="quizOption"
                className="w-5 h-5 text-blue-600"
                checked={selectedAnswer === opt._id}
                onChange={() => {
                  if (answerStatus === 'idle') {
                    setSelectedAnswer(opt._id);
                  }
                }}
                disabled={answerStatus !== 'idle'}
              />
              <span className="ml-4 text-lg text-gray-800">{opt.text}</span>
            </label>
          ))}

          {/* --- Short-Answer Renderer --- */}
          {currentQuestion.type === 'short-answer' && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Type className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="shortAnswer"
                placeholder="Type your answer here..."
                value={shortAnswerText}
                onChange={(e) => setShortAnswerText(e.target.value)}
                disabled={answerStatus !== 'idle'}
                className={`block w-full pl-10 p-4 border rounded-md text-lg ${
                  answerStatus === 'idle' 
                    ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-gray-100'
                }`}
              />
            </div>
          )}

        </div>

        {/* Feedback Section */}
        <AnimatePresence>
          {answerStatus === 'answered' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mt-6 p-4 rounded-md ${feedback.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
            >
              <div className="flex items-center">
                {feedback.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 mr-3" />
                )}
                <h3 className="text-lg font-bold">
                  {feedback.isCorrect ? 'Correct!' : 'Not Quite!'}
                </h3>
              </div>
              {/* Show the correct answer if they got it wrong or if it's a short answer */}
              {!feedback.isCorrect && (
                <p className="mt-2 text-gray-700 font-semibold">
                  Correct Answer: {feedback.correctAnswer}
                </p>
              )}
              <p className="mt-2 text-gray-700">{feedback.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button Logic */}
        <div className="mt-8 text-right">
          {answerStatus === 'idle' && (
            <button
              onClick={handleCheckAnswer}
              disabled={isButtonDisabled}
              className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-md font-medium text-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Check className="w-5 h-5 inline-block mr-2" />
              Check Answer
            </button>
          )}

          {answerStatus === 'answered' && (
            <button
              onClick={handleNextQuestion}
              className="w-full md:w-auto bg-green-600 text-white px-8 py-3 rounded-md font-medium text-lg hover:bg-green-700"
            >
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;