import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './heading.css';
import Sidebar from './Sidebar';
import PersonalDetails from './PersonalDetails';

const Heading = () => {
  const navigate = useNavigate();
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    pinCode: '',
    linkedin: '',
    website: '',
    drivingLicense: ''
  });

  const [showFields, setShowFields] = useState({
    linkedin: false,
    website: false,
    drivingLicense: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load saved data if it exists
    const savedData = localStorage.getItem('headingData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);
    localStorage.setItem('headingData', JSON.stringify(newFormData));
  };

  const handleStepClick = (stepId, route) => {
    navigate(route);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/personal-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.surname,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.city}, ${formData.country}, ${formData.pinCode}`,
          linkedin_url: formData.linkedin,
          website_url: formData.website,
          driving_license: formData.drivingLicense
        })
      });

      if (response.ok) {
        console.log('Personal info saved successfully');
        navigate('/education/intro');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save personal info');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    // Validate required fields
    const requiredFields = ['firstName', 'surname', 'email', 'phone'];
    const isValid = requiredFields.every(field => formData[field]);
    
    if (isValid) {
      localStorage.setItem('headingData', JSON.stringify(formData));
      handleSubmit();
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    if (showPersonalDetails) {
      setShowPersonalDetails(false);
    } else {
      navigate('/');
    }
  };

  const toggleField = (fieldName) => {
    setShowFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
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

  const handlePersonalDetails = () => {
    setShowPersonalDetails(true);
  };

  if (showPersonalDetails) {
    return <PersonalDetails onBack={() => setShowPersonalDetails(false)} />;
  }

  return (
    <div className="resume-builder">
      <Sidebar 
        activeStep={1}
        onStepClick={handleStepClick}
      />
      <div className="main-content">
        <div className="back-link" onClick={handleBack}>← Go Back</div>
        
        <h1>What's the best way for employers to contact you?</h1>
        <p>We suggest including an email and phone number.</p>

        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          {/* First Name and Surname row */}
          <div className="form-row">
            <div className="form-group">
              <label>FIRST NAME</label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="e.g. Saanvi" 
              />
            </div>
            <div className="form-group">
              <label>SURNAME</label>
              <input 
                type="text" 
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                placeholder="e.g. Patel" 
              />
            </div>
          </div>

          {/* City and Country row */}
          <div className="form-row">
            <div className="form-group">
              <label>CITY</label>
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g. New Delhi" 
              />
            </div>
            <div className="form-group">
              <label>COUNTRY</label>
              <input 
                type="text" 
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="e.g. India" 
              />
            </div>
          </div>

          {/* Pin Code row */}
          <div className="form-row">
            <div className="form-group">
              <label>PIN CODE</label>
              <input 
                type="text" 
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
                placeholder="e.g. 110034" 
              />
            </div>
          </div>

          {/* Phone and Email row */}
          <div className="form-row">
            <div className="form-group">
              <label>PHONE</label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. +91 22 1234 5677" 
              />
            </div>
            <div className="form-group">
              <label>EMAIL *</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g. spatel@sample.in" 
                required 
              />
            </div>
          </div>

          {/* Additional Fields Section */}
          <div className="additional-fields">
            {showFields.linkedin && (
              <div className="form-row">
                <div className="form-group full-width">
                  <label>LINKEDIN</label>
                  <div className="input-with-delete">
                    <input 
                      type="text" 
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="e.g linkedin.com/in/username" 
                    />
                    <button 
                      type="button" 
                      className="delete-btn"
                      onClick={() => handleDelete('linkedin')}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showFields.website && (
              <div className="form-row">
                <div className="form-group full-width">
                  <label>WEBSITE</label>
                  <div className="input-with-delete">
                    <input 
                      type="text" 
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="e.g www.myportfolio.com" 
                    />
                    <button 
                      type="button" 
                      className="delete-btn"
                      onClick={() => handleDelete('website')}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showFields.drivingLicense && (
              <div className="form-row">
                <div className="form-group full-width">
                  <label>DRIVING LICENSE</label>
                  <div className="input-with-delete">
                    <input 
                      type="text" 
                      name="drivingLicense"
                      value={formData.drivingLicense}
                      onChange={handleInputChange}
                      placeholder="e.g DL-1234567890" 
                    />
                    <button 
                      type="button" 
                      className="delete-btn"
                      onClick={() => handleDelete('drivingLicense')}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="additional-info">
            <p>Add additional information to your resume (optional)</p>
            <div className="info-buttons">
              {!showFields.linkedin && (
                <button type="button" className="info-btn" onClick={() => toggleField('linkedin')}>
                  LinkedIn +
                </button>
              )}
              {!showFields.website && (
                <button type="button" className="info-btn" onClick={() => toggleField('website')}>
                  Website +
                </button>
              )}
              {!showFields.drivingLicense && (
                <button type="button" className="info-btn" onClick={() => toggleField('drivingLicense')}>
                  Driving licence +
                </button>
              )}
            </div>
          </div>

          <div className="bottom-actions">
            {error && <div className="error-message">{error}</div>}
            <button 
              type="button" 
              className="personal-details-btn"
              onClick={handlePersonalDetails}
            >
              Optional: Personal details
            </button>
            
            <div className="form-actions">
              <button type="button" className="preview-btn">Preview</button>
              <button 
                type="button" 
                className="next-btn" 
                onClick={handleNext}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Next: Education'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Heading;