import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { FaStar } from 'react-icons/fa';
import './skillForm.css';

const SkillForm = () => {
  const navigate = useNavigate();
  const [skillDescription, setSkillDescription] = useState('');
  const [skillRatings, setSkillRatings] = useState({});
  const [currentSkill, setCurrentSkill] = useState('');
  const [skills, setSkills] = useState([]);
  const [ReactQuill, setReactQuill] = useState(null);

  useEffect(() => {
    // Dynamically import ReactQuill on client-side only
    import('react-quill').then((module) => {
      setReactQuill(() => module.default);
    });
  }, []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link',
    'clean'
  ];

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ]
  };

  const handleSkillAdd = (e) => {
    e.preventDefault();
    if (currentSkill.trim()) {
      setSkills([...skills, currentSkill.trim()]);
      setSkillRatings({
        ...skillRatings,
        [currentSkill.trim()]: 0
      });
      setCurrentSkill('');
    }
  };

  const handleRatingChange = (skill, rating) => {
    setSkillRatings({
      ...skillRatings,
      [skill]: rating
    });
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
    const newRatings = { ...skillRatings };
    delete newRatings[skillToRemove];
    setSkillRatings(newRatings);
  };

  return (
    <div className="page-container">
      <Sidebar activeStep={3} />
      <div className="main-content">
        <div className="back-section">
          <button 
            className="go-back-btn"
            onClick={() => navigate('/skills')}
          >
            ← Go Back
          </button>
        </div>

        <div className="form-container">
          <div className="left-section">
            <div className="editor-section">
              <h3>Skill Description</h3>
              {ReactQuill ? (
                <ReactQuill 
                  value={skillDescription}
                  onChange={setSkillDescription}
                  modules={modules}
                  formats={formats}
                  className="quill-editor"
                />
              ) : (
                <div>Loading editor...</div>
              )}
            </div>

            <div className="skills-rating-section">
              <h3>Skills Rating</h3>
              {skills.map((skill) => (
                <div key={skill} className="skill-rating-item">
                  <div className="skill-rating-header">
                    <span>{skill}</span>
                    <button 
                      className="remove-skill-btn"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="star-rating">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={`star ${index < skillRatings[skill] ? 'filled' : ''}`}
                        onClick={() => handleRatingChange(skill, index + 1)}
                      />
                    ))}
                    <span className="skill-level">
                      {getSkillLevel(skillRatings[skill])}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="right-section">
            <div className="input-section">
              <h3>Add Skills</h3>
              <form onSubmit={handleSkillAdd}>
                <div className="input-group">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    placeholder="Enter a skill"
                    className="skill-input"
                  />
                  <button type="submit" className="add-skill-btn">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="navigation-buttons">
          <button className="preview-btn">
            Preview
          </button>
          <button 
            className="save-btn"
            onClick={() => navigate('/skills/summary')}
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get skill level based on rating
const getSkillLevel = (rating) => {
  if (rating === 5) return 'Expert';
  if (rating === 4) return 'Advanced';
  if (rating === 3) return 'Intermediate';
  if (rating === 2) return 'Basic';
  if (rating === 1) return 'Beginner';
  return 'Not Rated';
};

export default SkillForm; 