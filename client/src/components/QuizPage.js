import React, { useEffect } from 'react';

const QuizPage = ({
  questions,
  currentQuestionIndex,
  userAnswers,
  visitedQuestions,
  attemptedQuestions,
  timeLeft,
  formatTime,
  onAnswerSelect,
  onQuestionNavigation,
  onQuizComplete
}) => {
  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = userAnswers[currentQuestionIndex];

  // Mark current question as visited when component mounts
  useEffect(() => {
    onQuestionNavigation(currentQuestionIndex);
  }, [currentQuestionIndex, onQuestionNavigation]);

  const handleOptionClick = (option) => {
    onAnswerSelect(currentQuestionIndex, option);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      onQuestionNavigation(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      onQuestionNavigation(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    onQuizComplete();
  };

  const getQuestionStatus = (index) => {
    if (index === currentQuestionIndex) return 'current';
    if (attemptedQuestions.has(index)) return 'attempted';
    if (visitedQuestions.has(index)) return 'visited';
    return '';
  };

  const getAnsweredCount = () => {
    return Array.from(attemptedQuestions).length;
  };

  const getVisitedCount = () => {
    return Array.from(visitedQuestions).length;
  };

  const getNotVisitedCount = () => {
    return questions.length - Array.from(visitedQuestions).length;
  };

  return (
    <div style={{ 
      height: 'calc(100vh - 120px)', 
      display: 'flex', 
      gap: '24px',
      overflow: 'hidden'
    }}>
      {/* Left Panel - Question and Options */}
      <div style={{ 
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Question Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{ 
            backgroundColor: '#667eea', 
            color: 'white',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            color: '#666',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.9rem'
          }}>
            {currentQuestion.difficulty}
          </div>
        </div>

        {/* Category */}
        <div style={{ 
          color: '#666',
          fontSize: '0.9rem',
          marginBottom: '20px'
        }}>
          {currentQuestion.category}
        </div>

        {/* Question Text */}
        <div style={{ 
          fontSize: '1.2rem', 
          lineHeight: '1.6', 
          marginBottom: '32px',
          color: '#333',
          fontWeight: '500'
        }}>
          {currentQuestion.question}
        </div>

        {/* Answer Options */}
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '32px'
        }}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 20px',
                border: `2px solid ${userAnswer === option ? '#667eea' : '#e9ecef'}`,
                borderRadius: '8px',
                backgroundColor: userAnswer === option ? '#f8f9ff' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                width: '100%'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: userAnswer === option ? '#667eea' : '#e9ecef',
                color: userAnswer === option ? 'white' : '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                {String.fromCharCode(65 + index)}
              </div>
              <span style={{ fontSize: '1rem', color: '#333' }}>
                {option}
              </span>
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: 'auto'
        }}>
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            style={{ 
              padding: '12px 24px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#333',
              cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentQuestionIndex === 0 ? 0.5 : 1,
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            ← Previous
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px'
          }}>
            <span style={{ 
              color: '#666', 
              fontSize: '0.9rem' 
            }}>
              {userAnswer ? 'Answer selected' : 'Select an answer'}
            </span>
            
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                style={{ 
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                style={{ 
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Timer and Navigation */}
      <div style={{ 
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Timer */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ 
            fontSize: '1rem', 
            color: '#666',
            marginBottom: '12px',
            fontWeight: '500'
          }}>
            Time Remaining
          </div>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: '450',
            color: '#333',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {formatTime(timeLeft)}
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#e9ecef',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(timeLeft / (30 * 60)) * 100}%`,
              height: '80%',
              backgroundColor: '#667eea',
              borderRadius: '4px',
              transition: 'width 1s ease'
            }}></div>
          </div>
        </div>

        {/* Question Navigation */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          flex: '1'
        }}>
          <h3 style={{ 
            marginBottom: '16px', 
            color: '#333',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            Question Overview
          </h3>
          
          <div style={{ 
            marginBottom: '16px',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            {getAnsweredCount()}/{questions.length} answered
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '8px',
            marginBottom: '20px'
          }}>
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => onQuestionNavigation(index)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: '2px solid #e9ecef',
                  backgroundColor: getQuestionStatus(index) === 'attempted' ? '#28a745' : 
                                getQuestionStatus(index) === 'current' ? '#ffc107' :
                                getQuestionStatus(index) === 'visited' ? '#667eea' : 'white',
                  color: getQuestionStatus(index) === 'attempted' || getQuestionStatus(index) === 'visited' ? 'white' : '#333',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '8px',
            fontSize: '0.8rem',
            color: '#666'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#28a745', 
                borderRadius: '50%' 
              }}></div>
              <span>Answered ({getAnsweredCount()})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#667eea', 
                borderRadius: '50%' 
              }}></div>
              <span>Visited ({getVisitedCount()})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#e9ecef', 
                borderRadius: '50%' 
              }}></div>
              <span>Not visited ({getNotVisitedCount()})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage; 