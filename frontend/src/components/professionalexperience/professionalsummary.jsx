import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import './professionalsummary.css';

const ProfessionalSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(null);
  const [experiences, setExperiences] = useState([
  ]);
  
  // Refs for drag and drop
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state?.savedExperience) {
      const savedExp = location.state.savedExperience;
      
      // Update existing experience or add new one
      setExperiences(prevExperiences => {
        const existingIndex = prevExperiences.findIndex(exp => exp.id === savedExp.id);
        
        if (existingIndex !== -1) {
          // Update existing experience
          const updatedExperiences = [...prevExperiences];
          updatedExperiences[existingIndex] = savedExp;
          return updatedExperiences;
        } else {
          // Add new experience
          return [...prevExperiences, savedExp];
        }
      });

      // Show success message
      if (location.state.message) {
        setSuccessMessage(location.state.message);
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }

      // Clear the location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleAddExperience = (experienceType) => {
    const newExperience = {
      id: experiences.length + 1,
      title: experienceType,
      status: 'not_started',
      description: []
    };
    setExperiences([...experiences, newExperience]);
    setShowPopup(false);
  };

  const handleCopyExperience = (exp) => {
    const copiedExperience = {
      ...exp,
      id: experiences.length + 1,
      title: `${exp.title} (Copy)`
    };
    setExperiences([...experiences, copiedExperience]);
    setShowOptionsMenu(null);
  };

  const handleDeleteExperience = (id) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
    setShowOptionsMenu(null);
  };

  const handleMoveExperience = (id, direction) => {
    const currentIndex = experiences.findIndex(exp => exp.id === id);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === experiences.length - 1)
    ) {
      return;
    }

    const newExperiences = [...experiences];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newExperiences[currentIndex], newExperiences[newIndex]] = 
    [newExperiences[newIndex], newExperiences[currentIndex]];
    
    setExperiences(newExperiences);
    setShowOptionsMenu(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    dragItem.current = index;
    e.target.classList.add('dragging');
  };

  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
    e.target.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.target.classList.remove('drag-over');
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    // Reorder the items
    const newExperiences = [...experiences];
    const draggedItemContent = newExperiences[dragItem.current];
    newExperiences.splice(dragItem.current, 1);
    newExperiences.splice(dragOverItem.current, 0, draggedItemContent);
    
    // Update the IDs to reflect the new order
    newExperiences.forEach((exp, index) => {
      exp.id = index + 1;
    });
    
    setExperiences(newExperiences);
    
    // Reset the refs
    dragItem.current = null;
    dragOverItem.current = null;
    
    // Remove drag-over class from all items
    document.querySelectorAll('.experience-card').forEach(item => {
      item.classList.remove('drag-over');
    });
  };

  const experienceOptions = [
    "Internship",
    "Volunteer",
    "Teacher's Assistant",
    "Tutor",
    "Babysitter or Nanny",
    "Waitress or Waiter"
  ];

  const handleStartClick = (experienceId) => {
    navigate('/professional-experience/form', { 
      state: { experienceId: experienceId }
    });
  };

  const formatDate = (month, year) => {
    return `${month} ${year}`;
  };

  const formatExperienceDate = (exp) => {
    const startDate = formatDate(exp.startMonth, exp.startYear);
    if (exp.currentlyWork) {
      return `${startDate} - Present`;
    }
    return `${startDate} - ${formatDate(exp.endMonth, exp.endYear)}`;
  };

  return (
    <div className="page-container">
      <Sidebar activeStep={3} />
      <div className="main-content">
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        <div className="header-section">
          <button className="go-back-btn">← Go Back</button>
          <h1>Professional experience summary</h1>
          <div className="tips-icon">💡 Tips</div>
        </div>

        <div className="add-experience-section">
          <button 
            className="add-more-btn"
            onClick={() => setShowPopup(true)}
          >
            + Add More Experience
          </button>
        </div>

        {experiences.map((exp, index) => (
          <div 
            key={exp.id} 
            className="experience-card"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="experience-number">{exp.id}</div>
            <div className="experience-content">
              <div className="experience-header">
                <div className="title-status">
                  <h3>{exp.title}</h3>
                  {exp.status === 'not_started' && <span className="status">Not Started</span>}
                </div>
                <div className="action-buttons">
                  {exp.status === 'completed' ? (
                    <>
                      <button className="action-btn">✏️</button>
                      <button 
                        className="action-btn"
                        onClick={() => handleCopyExperience(exp)}
                      >
                        📋
                      </button>
                      <div className="options-menu-container">
                        <button 
                          className="action-btn"
                          onClick={() => setShowOptionsMenu(exp.id)}
                        >
                          ⋮
                        </button>
                        {showOptionsMenu === exp.id && (
                          <div className="options-menu">
                            <button onClick={() => handleMoveExperience(exp.id, 'up')}>
                              Move Up
                            </button>
                            <button onClick={() => handleMoveExperience(exp.id, 'down')}>
                              Move Down
                            </button>
                            <button 
                              className="delete-option"
                              onClick={() => handleDeleteExperience(exp.id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <button 
                      className="start-btn"
                      onClick={() => handleStartClick(exp.id)}
                    >
                      Start →
                    </button>
                  )}
                </div>
              </div>
              {exp.status === 'completed' && (
                <>
                  <div className="experience-details">
                    <h4 className="organization">{exp.organization}</h4>
                    <div className="location-info">
                      <span>{exp.location}</span>
                      {exp.isRemote && <span className="remote-tag">Remote</span>}
                    </div>
                    <p className="experience-date">{formatExperienceDate(exp)}</p>
                  </div>
                  <ul className="experience-description">
                    {exp.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  <button className="show-more-btn">Show More ▼</button>
                </>
              )}
            </div>
          </div>
        ))}

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <div className="popup-header">
                <h2>Do you want to add any of these?</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowPopup(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="options-container">
                {experienceOptions.map((option, index) => (
                  <button
                    key={index}
                    className="option-btn"
                    onClick={() => handleAddExperience(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="add-own-section">
                <button className="add-own-btn">+ Add your own</button>
              </div>

              <button className="add-btn">ADD</button>
            </div>
          </div>
        )}

        <div className="navigation-buttons">
          <button className="preview-btn">Preview</button>
          <button 
            className="next-btn"
            onClick={() => navigate("/skills")}
          >
            Next: Skills
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSummary;
