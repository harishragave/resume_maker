import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PersonalDetails.css';
import Sidebar from './Sidebar';

const PersonalDetails = () => {
  const navigate = useNavigate();
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    // Check if heading data exists in localStorage
    const headingData = JSON.parse(localStorage.getItem('headingData') || '{}');
    const requiredFields = ['firstName', 'surname', 'email', 'phone'];
    const isHeadingComplete = requiredFields.every(field => headingData[field]);
    setCanSkip(isHeadingComplete);
  }, []);

  const handleBack = () => {
    navigate('/heading');
  };

  const handleNext = () => {
    navigate('/education/intro'); // Navigate to education page
  };

  const [formData, setFormData] = useState({
    dateOfBirth: '',
    nationality: '',
    maritalStatus: '',
    visaStatus: '',
    gender: '',
    religion: '',
    passport: '',
    other: ''
  });

  const [showFields, setShowFields] = useState({
    gender: false,
    religion: false,
    passport: false,
    other: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleField = (field) => {
    setShowFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleDelete = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: ''
    }));
    setShowFields(prev => ({
      ...prev,
      [fieldName]: false
    }));
  };

  return (
    <div className="resume-builder">
      <Sidebar activeStep={1} />
      <div className="personal-details-container">
        <div className="back-link" onClick={handleBack}>
          ← Go Back
        </div>

        <h1>Personal Details</h1>
        <div className="info-text">
          <span className="info-icon">ℹ</span>
          This is an optional section, and an excellent opportunity to add relevant information.
        </div>

        <form className="details-form">
          <div className="form-row">
            <div className="form-group">
              <label>DATE OF BIRTH</label>
              <input
                type="text"
                name="dateOfBirth"
                placeholder="e.g. dd/mm/yyyy"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>NATIONALITY</label>
              <input
                type="text"
                name="nationality"
                placeholder="e.g. Indian"
                value={formData.nationality}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>MARITAL STATUS</label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleInputChange}
              >
                <option value="">e.g. Single</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
              </select>
            </div>
            <div className="form-group">
              <label>VISA STATUS</label>
              <input
                type="text"
                name="visaStatus"
                placeholder="e.g. Full working capabilities"
                value={formData.visaStatus}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="additional-section">
            <h2>Additional Information</h2>
            <div className="additional-buttons">
              {!showFields.gender && (
                <button type="button" onClick={() => toggleField('gender')}>
                  Gender +
                </button>
              )}
              {!showFields.religion && (
                <button type="button" onClick={() => toggleField('religion')}>
                  Religion +
                </button>
              )}
              {!showFields.passport && (
                <button type="button" onClick={() => toggleField('passport')}>
                  Passport +
                </button>
              )}
              {!showFields.other && (
                <button type="button" onClick={() => toggleField('other')}>
                  Other +
                </button>
              )}
            </div>

            {showFields.gender && (
              <div className="form-group additional-field">
                <div className="field-header">
                  <label>GENDER</label>
                  <button 
                    type="button" 
                    className="delete-btn"
                    onClick={() => handleDelete('gender')}
                    aria-label="Delete gender"
                  >
                    <span className="delete-icon">🗑️</span>
                  </button>
                </div>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}

            {showFields.religion && (
              <div className="form-group additional-field">
                <div className="field-header">
                  <label>RELIGION</label>
                  <button 
                    type="button" 
                    className="delete-btn"
                    onClick={() => handleDelete('religion')}
                    aria-label="Delete religion"
                  >
                    <span className="delete-icon">🗑️</span>
                  </button>
                </div>
                <input
                  type="text"
                  name="religion"
                  placeholder="Enter religion"
                  value={formData.religion}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {showFields.passport && (
              <div className="form-group additional-field">
                <div className="field-header">
                  <label>PASSPORT NUMBER</label>
                  <button 
                    type="button" 
                    className="delete-btn"
                    onClick={() => handleDelete('passport')}
                    aria-label="Delete passport number"
                  >
                    <span className="delete-icon">🗑️</span>
                  </button>
                </div>
                <input
                  type="text"
                  name="passport"
                  placeholder="Enter passport number"
                  value={formData.passport}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {showFields.other && (
              <div className="form-group additional-field">
                <div className="field-header">
                  <label>OTHER INFORMATION</label>
                  <button 
                    type="button" 
                    className="delete-btn"
                    onClick={() => handleDelete('other')}
                    aria-label="Delete other information"
                  >
                    <span className="delete-icon">🗑️</span>
                  </button>
                </div>
                <input
                  type="text"
                  name="other"
                  placeholder="Enter other information"
                  value={formData.other}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button 
              type="button" 
              className="skip-btn"
              onClick={handleNext}
            >
              Skip for now
            </button>
            <div className="right-buttons">
              <button type="button" className="preview-btn">
                Preview
              </button>
              <button 
                type="button" 
                className="next-btn"
                onClick={handleNext}
              >
                Next: Education
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalDetails; 