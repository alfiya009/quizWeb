import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import StartPage from './components/StartPage';
import QuizPage from './components/QuizPage';
import ReportPage from './components/ReportPage';
import { quizAPI, resultsAPI, authAPI } from './services/api';
import './styles/loading.css';

const decodeHtmlEntities = (text) => {
  if (!text) return '';
  const parser = new DOMParser();
  return parser.parseFromString(text, "text/html").body.textContent;
};

function App() {
  const [currentPage, setCurrentPage] = useState('auth');
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const [attemptedQuestions, setAttemptedQuestions] = useState(new Set());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentPage('start');
    }
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await quizAPI.getQuestions({ amount: 15 });
      const decodedQuestions = response.data.questions.map(question => ({
        ...question,
        question: decodeHtmlEntities(question.question),
        correct_answer: decodeHtmlEntities(question.correct_answer),
        options: question.options.map(option => decodeHtmlEntities(option))
      }));
      setQuestions(decodedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([
        {
          id: 0,
          question: "What is the capital of France?",
          correct_answer: "Paris",
          options: ["London", "Berlin", "Paris", "Madrid"],
          category: "Geography",
          difficulty: "easy"
        },
        {
          id: 1,
          question: "Which planet is known as the Red Planet?",
          correct_answer: "Mars",
          options: ["Venus", "Mars", "Jupiter", "Saturn"],
          category: "Science",
          difficulty: "easy"
        },
        {
          id: 2,
          question: "What is the largest ocean on Earth?",
          correct_answer: "Pacific Ocean",
          options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
          category: "Geography",
          difficulty: "easy"
        },
        {
          id: 3,
          question: "Who wrote 'Romeo and Juliet'?",
          correct_answer: "William Shakespeare",
          options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
          category: "Literature",
          difficulty: "medium"
        },
        {
          id: 4,
          question: "What is the chemical symbol for gold?",
          correct_answer: "Au",
          options: ["Ag", "Au", "Fe", "Cu"],
          category: "Science",
          difficulty: "medium"
        },
        {
          id: 5,
          question: "Which year did World War II end?",
          correct_answer: "1945",
          options: ["1943", "1944", "1945", "1946"],
          category: "History",
          difficulty: "medium"
        },
        {
          id: 6,
          question: "What is the largest mammal in the world?",
          correct_answer: "Blue Whale",
          options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
          category: "Science",
          difficulty: "easy"
        },
        {
          id: 7,
          question: "Which programming language was created by Brendan Eich?",
          correct_answer: "JavaScript",
          options: ["Python", "Java", "JavaScript", "C++"],
          category: "Technology",
          difficulty: "medium"
        },
        {
          id: 8,
          question: "What is the currency of Japan?",
          correct_answer: "Yen",
          options: ["Yuan", "Yen", "Won", "Ringgit"],
          category: "Geography",
          difficulty: "easy"
        },
        {
          id: 9,
          question: "Who painted the Mona Lisa?",
          correct_answer: "Leonardo da Vinci",
          options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
          category: "Art",
          difficulty: "medium"
        },
        {
          id: 10,
          question: "What is the speed of light?",
          correct_answer: "299,792,458 meters per second",
          options: ["299,792,458 meters per second", "199,792,458 meters per second", "399,792,458 meters per second", "499,792,458 meters per second"],
          category: "Science",
          difficulty: "hard"
        },
        {
          id: 11,
          question: "Which country is home to the kangaroo?",
          correct_answer: "Australia",
          options: ["New Zealand", "Australia", "South Africa", "Brazil"],
          category: "Geography",
          difficulty: "easy"
        },
        {
          id: 12,
          question: "What is the largest desert in the world?",
          correct_answer: "Antarctic Desert",
          options: ["Sahara Desert", "Arabian Desert", "Antarctic Desert", "Gobi Desert"],
          category: "Geography",
          difficulty: "medium"
        },
        {
          id: 13,
          question: "Who is the author of 'The Great Gatsby'?",
          correct_answer: "F. Scott Fitzgerald",
          options: ["Ernest Hemingway", "F. Scott Fitzgerald", "John Steinbeck", "William Faulkner"],
          category: "Literature",
          difficulty: "medium"
        },
        {
          id: 14,
          question: "What is the atomic number of carbon?",
          correct_answer: "6",
          options: ["4", "5", "6", "7"],
          category: "Science",
          difficulty: "medium"
        }
      ]);
    } finally {
      setTimeout(() => setLoading(false), 1);
    }
  };

  useEffect(() => {
    if (currentPage === 'quiz' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setQuizCompleted(true);
            setCurrentPage('report');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentPage, timeLeft]);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('start');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setCurrentPage('start');
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('auth');
    setQuestions([]);
    setUserAnswers({});
    setVisitedQuestions(new Set());
    setAttemptedQuestions(new Set());
    setCurrentQuestionIndex(0);
    setTimeLeft(30 * 60);
    setQuizCompleted(false);
  };

  const switchAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  const handleStartQuiz = async () => {
    await fetchQuestions();
    setCurrentPage('quiz');
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    setAttemptedQuestions(prev => new Set([...prev, questionIndex]));
  };

  const handleQuestionNavigation = (questionIndex) => {
    setCurrentQuestionIndex(questionIndex);
    setVisitedQuestions(prev => new Set([...prev, questionIndex]));
  };

  const handleQuizComplete = async () => {
    const timeUsed = 30 * 60 - timeLeft;
    try {
      await resultsAPI.saveResult({
        questions: questions.map((q, index) => ({
          question: q.question,
          userAnswer: userAnswers[index] || null,
          correctAnswer: q.correct_answer,
          isCorrect: userAnswers[index] === q.correct_answer
        })),
        timeUsed,
        completed: true
      });
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
    setCurrentPage('report');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="App">
        <div style={{ 
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <div className="card" style={{ 
            maxWidth: '400px', 
            margin: '0 auto', 
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease-in'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <h2 style={{ color: '#333', marginBottom: '10px' }}>Loading Quiz...</h2>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Preparing your questions</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="container">
        {user && currentPage !== 'auth' && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '16px 0',
            marginBottom: '20px'
          }}>
            <div style={{ color: 'white', fontSize: '1.1rem' }}>
              Welcome, {user.name}!
            </div>
            <button 
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ fontSize: '0.9rem' }}
            >
              Logout
            </button>
          </div>
        )}

        {currentPage === 'auth' && (
          authMode === 'login' ? (
            <LoginPage onLogin={handleLogin} onSwitchToRegister={switchAuthMode} />
          ) : (
            <RegisterPage onRegister={handleRegister} onSwitchToLogin={switchAuthMode} />
          )
        )}
        
        {currentPage === 'start' && user && (
          <StartPage onStart={handleStartQuiz} user={user} />
        )}
        
        {currentPage === 'quiz' && questions.length > 0 && (
          <QuizPage
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            userAnswers={userAnswers}
            visitedQuestions={visitedQuestions}
            attemptedQuestions={attemptedQuestions}
            timeLeft={timeLeft}
            formatTime={formatTime}
            onAnswerSelect={handleAnswerSelect}
            onQuestionNavigation={handleQuestionNavigation}
            onQuizComplete={handleQuizComplete}
          />
        )}
        
        {currentPage === 'report' && (
          <ReportPage
            questions={questions}
            userAnswers={userAnswers}
            userEmail={user?.email}
            timeLeft={timeLeft}
            formatTime={formatTime}
            onRetakeQuiz={() => {
              setCurrentPage('start');
              setUserAnswers({});
              setVisitedQuestions(new Set());
              setAttemptedQuestions(new Set());
              setCurrentQuestionIndex(0);
              setTimeLeft(30 * 60);
              setQuizCompleted(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App; 