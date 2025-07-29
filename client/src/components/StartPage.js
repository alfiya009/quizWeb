import React from 'react';

const StartPage = ({ onStart, user }) => {
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="card" style={{ 
        maxWidth: '600px', 
        width: '100%',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ 
            fontSize: '2.2rem', 
            fontWeight: '700', 
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Quiz Application
          </h1>
          <p style={{ fontSize: '1rem', color: '#666', lineHeight: '1.5' }}>
            Welcome back, {user.name}! Ready to test your knowledge?
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#667eea' }}>
              15
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Questions</div>
          </div>

          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#28a745' }}>
              30
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Minutes</div>
          </div>

          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#ffc107' }}>
              {user.quizAttempts || 0}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Attempts</div>
          </div>
        </div>

        <button 
          onClick={onStart} 
          className="btn btn-primary" 
          style={{ 
            width: '100%', 
            fontSize: '1.1rem', 
            padding: '14px',
            marginBottom: '20px'
          }}
        >
          Start Quiz
        </button>

        <div style={{ textAlign: 'center', color: '#666' }}>
          <p style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
            <strong>Instructions:</strong>
          </p>
          <ul style={{ 
            textAlign: 'left', 
            fontSize: '0.8rem', 
            lineHeight: '1.4',
            margin: '0',
            paddingLeft: '20px'
          }}>
            <li>You have 30 minutes to complete the quiz</li>
            <li>Navigate between questions using the question overview</li>
            <li>You can change your answers before submitting</li>
            <li>The quiz will auto-submit when time runs out</li>
            <li>Your results will be saved automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StartPage; 