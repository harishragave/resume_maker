import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import './professional_tips.css';

const EducationIntro = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/professional-experience/summary');
  };

  return (
    <div className="resume-builder">
      <Sidebar activeStep={3} />
      <div className="education-intro-container">
        <div className="back-link">
          ← Go Back
        </div>

        <div className="content-section">
          <div className="left-content">
            
            <h1>
            Now, let's update your<br/>
              <span className="highlight">work history</span>
            </h1>
            <div className="info-text">
              <h3>Here's what you need to know:</h3>
              <p>We’ll help you improve this section, update your work history, and highlight your most recent experience.</p>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="preview-btn"
            onClick={() => {/* Handle preview */}}
          >
            Preview
          </button>
          <button 
            className="next-btn"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationIntro;