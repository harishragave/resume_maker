import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import './Summarytips.css';

const Summarytips = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Sidebar activeStep={5} />
      <div className="main-content">
        <div className="header-section">
          <button 
            className="go-back-btn"
            onClick={() => navigate('/skills')}
          >
            ← Go Back
          </button>
          <h1>Summary</h1>
          <div className="tips-icon">💡 Tips</div>
        </div>

        <div className="tips-content">
          <h2 className="sub-heading">Let's write your professional summary</h2>
          <p className="description">
            A good summary grabs recruiters' attention and encourages them to read more.
            <br />
            We'll help you write a compelling one.
          </p>
        </div>

        <div className="navigation-buttons">
          <button 
            className="preview-btn"
            onClick={() => navigate('/summary/preview')}
          >
            Preview
          </button>
          <button 
            className="next-btn"
            onClick={() => navigate('/summary')}
          >
            Next: Add Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default Summarytips;