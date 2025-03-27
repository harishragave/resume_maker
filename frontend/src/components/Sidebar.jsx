import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ activeStep }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const steps = [
    { id: 1, text: 'Heading', route: '/heading' },
    { id: 2, text: 'Education', route: '/education/form' },
    { id: 3, text: 'Professional Experience', route: '/professional-experience/summary' },
    { id: 4, text: 'Skills', route: '/skills' },
    { id: 5, text: 'Summary', route: '/summary' },
    { id: 6, text: 'Finalize', route: '/finalize' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleStepClick = (route) => {
    navigate(route);
    setIsMobileMenuOpen(false);
  };

  return (
    <>

      {/* Sidebar/Mobile Menu */}
      <div className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="logo-uh desktop-only">
          <span className="my">my</span>
          <span className="perfect">perfect</span>
          <span className="resume">resume</span>
        </div>
        
        <div className="progress-steps">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`step 
                ${step.id === activeStep ? 'active' : ''} 
                ${step.id < activeStep ? 'completed' : ''}
                ${step.id > activeStep ? 'disabled' : ''}`
              }
              onClick={() => step.id <= activeStep && handleStepClick(step.route)}
            >
              <div className="step-container">
                <span className="step-number">
                  {step.id < activeStep ? '✓' : step.id}
                </span>
                <span className="step-text">{step.text}</span>
              </div>
              <div className="step-line"></div>
            </div>
          ))}
        </div>

        <div className="resume-completeness">
          <p>RESUME COMPLETENESS:</p>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${(activeStep - 1) * 20}%` }}
            ></div>
          </div>
          <span className="percentage">{(activeStep - 1) * 20}%</span>
        </div>

        <div className="footer desktop-only">
          <div className="footer-links">
            <a href="#">Terms & Conditions</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Accessibility</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="copyright">
            © 2024, Bold Limited. All rights reserved.
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={toggleMobileMenu}></div>
      )}c
    </>
  );
};

export default Sidebar; 