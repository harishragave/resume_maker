import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import './skillTips.css';

const SkillTips = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Sidebar activeStep={3} />
      <div className="main-content">
        <div className="back-section">
          <button 
            className="go-back-btn"
            onClick={() => navigate('/professional-experience')}
          >
            ← Go Back
          </button>
        </div>

        <div className="content-section">
          <h1>Next, let's take care of your <span className="highlight">Skills</span></h1>
          
          <div className="description">
            <p>Employers scan skills for relevant keywords.</p>
            <p>We'll help you choose the best ones.</p>
          </div>

          <div className="ai-feature">
            <div className="ai-icon">🤖</div>
            <div className="ai-text">
              <h3>Our AI now makes writing easier!</h3>
              <p>We'll help you fix mistakes or rephrase sentences to suit your needs.</p>
            </div>
          </div>
        </div>

        <div className="navigation-buttons">
          <button 
            className="preview-btn"
            onClick={() => navigate('/skills/preview')}
          >
            Preview
          </button>
          <button 
            className="next-btn"
            onClick={() => navigate('/skills/form')}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillTips; 