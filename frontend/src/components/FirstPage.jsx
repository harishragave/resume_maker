import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FirstPage.css';
import resumeIcon from '../assets/resume-icon.png';

const FirstPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="header">
        <div className="login-icon" onClick={() => navigate('/login')}>
          <svg width="2" height="2" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>
      </div>

      <div className="content">
        <div className="left-content">
          <h1 className="title">Create your professional resume with ease</h1>
          <div className="steps">
            <div className="intro-step">
              <span className="step-number">1</span>
              <div className="step-text">
                <span className="action">Pick</span> a template design
                <div>from our collection</div>
              </div>
            </div>

            <div className="intro-step">
              <span className="step-number">2</span>
              <div className="step-text">
                <span className="action">Fill in</span> your details with
                <div>industry-specific bullet points</div>
              </div>
            </div>

            <div className="intro-step">
              <span className="step-number">3</span>
              <div className="step-text">
                <span className="action">Customize</span> the details and wrap
                <div>it up. You're ready to send!</div>
              </div>
            </div>
          </div>
        </div>

        <div className="center-content">
          <div className="resume-container">
            <img src={resumeIcon} alt="Resume Preview" className="resume-preview" />
            <div className="checkmark-circle">✓</div>
          </div>
          <button 
            className="next-button" 
            onClick={() => navigate('/heading')}
          >
            Create My Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirstPage; 