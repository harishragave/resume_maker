import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import './ExperienceForm.css';

const ExperienceForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const experienceId = location.state?.experienceId;

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    location: '',
    isRemote: false,
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    currentlyWork: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // You can use the experienceId to load existing data if needed
  useEffect(() => {
    if (experienceId) {
      // Load experience data if needed
      // setFormData(...)
    }
  }, [experienceId]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.startMonth || !formData.startYear) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.currentlyWork && (!formData.endMonth || !formData.endYear)) {
      newErrors.endDate = 'End date is required';
    }
    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        // Create the experience object
        const savedExperience = {
          id: experienceId,
          title: formData.title,
          organization: formData.organization,
          location: formData.location,
          isRemote: formData.isRemote,
          startMonth: formData.startMonth,
          startYear: formData.startYear,
          endMonth: formData.endMonth,
          endYear: formData.endYear,
          currentlyWork: formData.currentlyWork,
          status: 'completed',
          description: [] // You can add description fields if needed
        };

        // Navigate back with the saved experience data
        navigate('/professional-experience/summary', {
          state: { 
            message: 'Experience saved successfully',
            savedExperience: savedExperience
          }
        });
      } catch (error) {
        console.error('Error saving experience:', error);
        setErrors({ submit: 'Failed to save experience. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="page-container">
      <Sidebar activeStep={3} />
      <div className="main-content">
        <div className="header-section">
          <button 
            className="go-back-btn" 
            onClick={() => navigate('/professional-experience')}
          >
            ← Go Back
          </button>
          <h1>Tell us about your experience</h1>
          <div className="tips-icon">💡 Tips</div>
        </div>

        <p className="subtitle">Start with your most recent experience and work backward.</p>

        <form className="experience-form" onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="title">
              WHAT WAS YOUR TITLE? <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="organization">WHO DID YOU DO THIS FOR?</label>
            <input
              type="text"
              id="organization"
              placeholder="Person, organization, company, or family business you worked for."
              value={formData.organization}
              onChange={(e) => setFormData({...formData, organization: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">LOCATION</label>
            <input
              type="text"
              id="location"
              placeholder="e.g. New Delhi, India"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
            <div className="remote-checkbox">
              <input
                type="checkbox"
                id="remote"
                checked={formData.isRemote}
                onChange={(e) => setFormData({...formData, isRemote: e.target.checked})}
              />
              <label htmlFor="remote">Remote</label>
              <span className="info-icon">ℹ️</span>
            </div>
          </div>

          <div className="date-section">
            <div className="form-group">
              <label>START DATE</label>
              <div className="date-inputs">
                <select 
                  value={formData.startMonth}
                  onChange={(e) => setFormData({...formData, startMonth: e.target.value})}
                >
                  <option value="">Month</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
                <select
                  value={formData.startYear}
                  onChange={(e) => setFormData({...formData, startYear: e.target.value})}
                >
                  <option value="">Year</option>
                  {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>END DATE</label>
              <div className="date-inputs">
                <select
                  value={formData.endMonth}
                  onChange={(e) => setFormData({...formData, endMonth: e.target.value})}
                  disabled={formData.currentlyWork}
                >
                  <option value="">Month</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
                <select
                  value={formData.endYear}
                  onChange={(e) => setFormData({...formData, endYear: e.target.value})}
                  disabled={formData.currentlyWork}
                >
                  <option value="">Year</option>
                  {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="current-work-checkbox">
                <input
                  type="checkbox"
                  id="currentlyWork"
                  checked={formData.currentlyWork}
                  onChange={(e) => setFormData({...formData, currentlyWork: e.target.checked})}
                />
                <label htmlFor="currentlyWork">I currently work here</label>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}

          <div className="navigation-buttons">
            <button 
              type="button" 
              className="preview-btn"
              onClick={() => {/* Handle preview */}}
            >
              Preview
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExperienceForm; 