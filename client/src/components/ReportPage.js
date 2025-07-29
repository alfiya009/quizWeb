import React from 'react';

const ReportPage = ({ questions, userAnswers, userEmail, timeLeft, formatTime }) => {
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(userAnswers).length;
  const correctAnswers = questions.filter((question, index) => 
    userAnswers[index] === question.correct_answer
  ).length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const timeUsed = 30 * 60 - timeLeft; // 30 minutes minus time left

  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    if (score >= 40) return '#fd7e14';
    return '#dc3545';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent!';
    if (score >= 60) return 'Good job!';
    if (score >= 40) return 'Not bad!';
    return 'Keep practicing!';
  };

  return (
    <div style={{ maxHeight: '80vh', overflowY: 'auto', padding: '24px' }}>
      {/* Header */}
      <div className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Quiz Results
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '24px' }}>
          Thank you for completing the quiz, {userEmail}!
        </p>

        {/* Score Summary */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{ 
            padding: '24px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: getScoreColor(score) }}>
              {score}%
            </div>
            <div style={{ fontSize: '1rem', color: '#666' }}>Score</div>
          </div>

          <div style={{ 
            padding: '24px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
              {correctAnswers}/{totalQuestions}
            </div>
            <div style={{ fontSize: '1rem', color: '#666' }}>Correct Answers</div>
          </div>

          <div style={{ 
            padding: '24px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#28a745' }}>
              {formatTime(timeUsed)}
            </div>
            <div style={{ fontSize: '1rem', color: '#666' }}>Time Used</div>
          </div>

          <div style={{ 
            padding: '24px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ffc107' }}>
              {answeredQuestions}/{totalQuestions}
            </div>
            <div style={{ fontSize: '1rem', color: '#666' }}>Questions Attempted</div>
          </div>
        </div>

        <div style={{ 
          padding: '16px 24px', 
          backgroundColor: getScoreColor(score), 
          color: 'white',
          borderRadius: '8px',
          fontSize: '1.2rem',
          fontWeight: '600',
          marginBottom: '24px'
        }}>
          {getScoreMessage(score)} You got {correctAnswers} out of {totalQuestions} questions correct.
        </div>
      </div>

      {/* Detailed Results */}
      <div className="card">
        <h2 style={{ marginBottom: '24px', color: '#333' }}>Detailed Results</h2>
        
        {questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === question.correct_answer;
          const hasAnswered = userAnswer !== undefined;

          return (
            <div 
              key={index} 
              className={`report-item ${isCorrect ? 'correct' : hasAnswered ? 'incorrect' : ''}`}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>
                  Question {index + 1}
                </h3>
                <div style={{ 
                  padding: '4px 12px', 
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  backgroundColor: isCorrect ? '#d4edda' : hasAnswered ? '#f8d7da' : '#e2e3e5',
                  color: isCorrect ? '#155724' : hasAnswered ? '#721c24' : '#6c757d'
                }}>
                  {isCorrect ? '✓ Correct' : hasAnswered ? '✗ Incorrect' : 'Not Attempted'}
                </div>
              </div>

              <div style={{ 
                fontSize: '1rem', 
                lineHeight: '1.6', 
                marginBottom: '16px',
                color: '#333'
              }}>
                {question.question}
              </div>

              <div style={{ 
                padding: '8px 12px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '6px',
                fontSize: '0.9rem',
                color: '#666',
                marginBottom: '12px'
              }}>
                Category: {question.category} • Difficulty: {question.difficulty}
              </div>

              {hasAnswered && (
                <div className="report-answers">
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                      Your Answer:
                    </div>
                    <div className={`report-answer ${isCorrect ? 'correct' : 'user'}`}>
                      {userAnswer}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                      Correct Answer:
                    </div>
                    <div className="report-answer correct">
                      {question.correct_answer}
                    </div>
                  </div>
                </div>
              )}

              {!hasAnswered && (
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#fff3cd', 
                  borderRadius: '6px',
                  color: '#856404',
                  fontSize: '0.9rem'
                }}>
                  ⚠️ This question was not attempted.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
          style={{ marginRight: '12px' }}
        >
          Take Quiz Again
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => window.print()}
        >
          Print Results
        </button>
      </div>
    </div>
  );
};

export default ReportPage; 