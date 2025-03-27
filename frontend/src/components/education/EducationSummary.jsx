import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import './EducationSummary.css';

const EducationSummary = () => {
  const navigate = useNavigate();
  const [educationList, setEducationList] = useState([]);
  const [showOptions, setShowOptions] = useState(null);

  useEffect(() => {
    // Load education list from localStorage
    const savedEducation = JSON.parse(localStorage.getItem('educationList') || '[]');
    setEducationList(savedEducation);
  }, []);

  const handleAddDegree = () => {
    navigate('/education/form');
  };

  const handleBack = () => {
    navigate('/education/intro');
  };

  const handleDelete = (id) => {
    const updatedList = educationList.filter(edu => edu.id !== id);
    setEducationList(updatedList);
    localStorage.setItem('educationList', JSON.stringify(updatedList));
    setShowOptions(null);
  };

  const handleEdit = (education) => {
    // Store the education to edit in localStorage
    localStorage.setItem('editEducation', JSON.stringify(education));
    navigate('/education/form', { state: { isEditing: true, educationId: education.id } });
  };

  const toggleOptions = (id) => {
    setShowOptions(showOptions === id ? null : id);
  };

  return (
    <div className="resume-builder">
      <Sidebar activeStep={2} />
      <div className="education-summary-container">
        <div className="header-section">
          <div className="back-link" onClick={handleBack}>
            ← Go Back
          </div>
          <div className="header-content">
            <h1>Education summary</h1>
            <button className="tips-button">
              <span className="tips-icon">💡</span>
              Tips
            </button>
          </div>
        </div>

        <div className="add-degree-button" onClick={handleAddDegree}>
          + Add another degree
        </div>

        <div className="education-list">
          {educationList.map((edu, index) => (
            <div key={edu.id} className="education-item">
              <div className="degree-number">{index + 1}</div>
              <div className="degree-content">
                <h3>{edu.degree} | {edu.field}</h3>
                <p>{edu.location} | {edu.date}</p>
                <div className="coursework-link">
                  + Add any additional coursework
                </div>
              </div>
              <div className="degree-actions">
                <button className="action-btn edit" onClick={() => handleEdit(edu)}>
                  <i className="edit-icon">✏️</i>
                </button>
                <button className="action-btn copy">
                  <i className="copy-icon">📋</i>
                </button>
                <button className="action-btn move">
                  <i className="move-icon">↕️</i>
                </button>
                <button 
                  className="action-btn more"
                  onClick={() => toggleOptions(edu.id)}
                >
                  <i className="more-icon">⋮</i>
                </button>
                {showOptions === edu.id && (
                  <div className="options-dropdown">
                    <button onClick={() => handleDelete(edu.id)}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <button className="preview-btn">
            Preview
          </button>
          <button 
            className="next-btn"
            onClick={() => navigate('/professional-experience/intro')}
          >
            Next: Professional experience
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationSummary; 