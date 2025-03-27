import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import './education_intro.css';

const EducationIntro = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/education/summary');
  };

  return (
    <div className="resume-builder">
      <Sidebar activeStep={2} />
      <div className="education-intro-container">
        <div className="back-link">
          ← Go Back
        </div>

        <div className="content-section">
          <div className="left-content">
            <h1>
              Let's update your<br/>
              <span className="highlight">Education</span>
            </h1>
            <div className="info-text">
              <h3>Here's what you need to know:</h3>
              <p>Include only the most current and relevant info about your education.</p>
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