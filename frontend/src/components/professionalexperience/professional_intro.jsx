import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import './professional_intro.css';

const ResumeReasonIntro = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('job-seeking');


  return (
    <div className="resume-builder">
      <Sidebar activeStep={3} />
      <div className="resume-reason-container">
        <div className="back-link" onClick={() => navigate(-1)}>
          ← Go Back
        </div>

        <div className="content-section">
          <h1>Why do you need a resume?</h1>
          <p className="subtitle">We'll show you a personalized experience based on your response.</p>
          
          <div className="button-group">
            <button 
              className={`option-btn ${selectedOption === 'job-seeking' ? 'active' : ''}`}
              onClick={() => setSelectedOption('job-seeking')}
            >
              Job Seeking
            </button>
            <button 
              className={`option-btn ${selectedOption === 'different-reason' ? 'active' : ''}`}
              onClick={() => setSelectedOption('different-reason')}
            >
              A Different Reason
            </button>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="skip-btn"
                onClick={() => navigate('/professional-experience/tips')}
            >
            Skip for now
          </button>
          <button 
            className="next-btn"
            onClick={() => navigate('/professional-experience/tips')}
            disabled={!selectedOption}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeReasonIntro;