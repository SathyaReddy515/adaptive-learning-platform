import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
// FINAL CLEAN IMPORTS: AlertCircle is removed as it's no longer used.
import { Loader2, Check, CheckCircle, XCircle, Type, SearchX, BookOpen, Clock, AlertTriangle } from 'lucide-react'; 
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [shortAnswerText, setShortAnswerText] = useState('');
  
  const [score, setScore] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0); 
  const [answerStatus, setAnswerStatus] = useState('idle');
  const [feedback, setFeedback] = useState({ isCorrect: false, correctAnswer: null, explanation: '' });
  
  const [fullAttemptHistory, setFullAttemptHistory] = useState([]); 
  const [secondsElapsed, setSecondsElapsed] = useState(0); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const topic = location.state?.topic; 
  const token = localStorage.getItem('token');

  // --- Timer Effect ---
  useEffect(() => {
    if (answerStatus === 'idle' && !loading) {
      const interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [answerStatus, loading]);

  // Reset timer on question change
  useEffect(() => {
    setSecondsElapsed(0);
  }, [currentQuestionIndex]);
  
  // --- Fetch questions ---
  useEffect(() => {
    if (!topic || !user) { /* ... error handling ... */ return; }
    const fetchQuestions = async () => {
        setLoading(true); setError(null);
        try {
            const { data } = await axios.get(`http://localhost:5001/api/quiz/start?topic=${topic}`, { headers: { Authorization: `Bearer ${token}` } });
            if (data && data.length > 0) { setQuestions(data); } else { setError(`No questions found for the topic "${topic}".`); toast.error(`No questions found for "${topic}".`); }
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to fetch quiz'; setError(message); toast.error(message);
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
    const timeTaken = secondsElapsed; 

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(
        'http://localhost:5001/api/quiz/check',
        payload, 
        config
      );
      
      if (data.isCorrect) {
        setScore(score + 1);
      }
      setAttemptCount(attemptCount + 1); 

      const attemptRecord = {
        question: currentQuestion._id, 
        isCorrect: data.isCorrect,
        timeTaken: timeTaken,
      };
      setFullAttemptHistory(prev => [...prev, attemptRecord]);

      setFeedback(data);
      setAnswerStatus('answered');
      
      data.isCorrect ? toast.success("Correct!", { duration: 1500 }) : toast.error("Not quite!", { duration: 1500 });

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
      
      const { data } = await axios.post(
        'http://localhost:5001/api/quiz/submit',
        { 
            topic, 
            correctCount: score, 
            totalQuestions: questions.length,
            fullAttemptHistory: fullAttemptHistory
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
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

  // Final Quiz Render
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 pt-24">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        
        {/* 🚀 ENHANCED HEADER - SCORE AND TIMER */}
        <header className="mb-6 flex justify-between items-center pb-3 border-b">
            
            {/* Left: Topic & Score */}
            <div className="flex flex-col">
                <div className="flex items-center text-sm font-semibold text-gray-700">
                    <BookOpen className="w-4 h-4 mr-1 text-blue-600" />
                    <span>{topic} Quiz</span>
                    <span className={`ml-3 px-2 py-0.5 rounded text-xs text-white font-bold ${getDifficultyColor(currentQuestion.metadata?.difficulty)}`}>
                        {currentQuestion.metadata?.difficulty.toUpperCase()}
                    </span>
                </div>
                <div className="text-left mt-1">
                    <p className="text-lg font-bold text-green-600">Score: {score} / {attemptCount}</p>
                </div>
            </div>

            {/* Right: Timer */}
            <div className="flex items-center text-right text-gray-700">
                <Clock className="w-5 h-5 mr-1 text-gray-500" />
                <span className="text-lg font-bold">
                    {secondsElapsed}s
                </span>
            </div>
        </header>

        {/* Progress Bar */}
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-600 mb-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-blue-600 h-2.5 rounded-full" 
            ></motion.div>
          </div>
        </div>

        {/* Question Content */}
        <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {currentQuestion.content}
            </h2>

            {/* Answer Area (MCQ + Short Answer) */}
            <div className="space-y-4">
            
            {/* --- MCQ Renderer --- */}
            {currentQuestion.type === 'mcq' && currentQuestion.options && currentQuestion.options.map((opt) => (
                <label
                key={opt._id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${getOptionClass(opt)}`}
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
                    } transition duration-150`}
                />
                </div>
            )}

            </div>
        </motion.div>


        {/* Feedback Section */}
        <AnimatePresence>
          {answerStatus === 'answered' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mt-6 p-4 rounded-lg border-l-4 ${feedback.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}
            >
              <div className="flex items-center mb-2">
                {feedback.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 mr-3" />
                )}
                <h3 className="text-lg font-bold">
                  {feedback.isCorrect ? 'Correct! Well Done.' : 'Try Again! Review the explanation below.'}
                </h3>
              </div>
              
              {/* Show the correct answer if they got it wrong */}
              {!feedback.isCorrect && (
                <p className="mt-2 text-gray-700 font-semibold">
                  Correct Answer: <span className="text-green-700">{feedback.correctAnswer}</span>
                </p>
              )}
              {/* Explanation */}
              <p className="mt-2 text-gray-700 border-t border-gray-200 pt-2 text-sm">{feedback.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button Logic */}
        <div className="mt-8 flex justify-between items-center">
            
            {/* NEW: Hint Button */}
            {answerStatus === 'idle' && (
                <button
                    onClick={() => toast('Hint integration coming soon!', { icon: '💡' })}
                    className="text-gray-500 flex items-center hover:text-blue-600 transition duration-150"
                >
                    <AlertTriangle className="w-4 h-4 mr-1" /> Need a Hint?
                </button>
            )}

            {/* Right Side Buttons */}
            <div className="ml-auto">
              {answerStatus === 'idle' && (
                <button
                  onClick={handleCheckAnswer}
                  disabled={isButtonDisabled}
                  className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-md font-medium text-lg hover:bg-blue-700 disabled:opacity-50 transition duration-150"
                >
                  <Check className="w-5 h-5 inline-block mr-2" />
                  Check Answer
                </button>
              )}

              {answerStatus === 'answered' && (
                <button
                  onClick={handleNextQuestion}
                  className="w-full md:w-auto bg-green-600 text-white px-8 py-3 rounded-md font-medium text-lg hover:bg-green-700 transition duration-150"
                >
                  {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                </button>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;