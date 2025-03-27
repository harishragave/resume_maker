import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Education.css';
import Sidebar from '../Sidebar';
import DOMPurify from 'dompurify';

const Education = () => {
  const navigate = useNavigate();
  const [educationData, setEducationData] = useState({
    schoolName: '',
    schoolLocation: '',
    degree: '',
    otherDegree: '',
    fieldOfStudy: '',
    graduationMonth: '',
    graduationYear: '',
    description: ''
  });

  const [showAchievements, setShowAchievements] = useState(false);
  const [description, setDescription] = useState('');
  const [showEducationalAchievements, setShowEducationalAchievements] = useState(false);
  const [showPrizesScholarship, setShowPrizesScholarship] = useState(false);
  const [showCoursework, setShowCoursework] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [showStudyAbroad, setShowStudyAbroad] = useState(false);
  const [showApprenticeships, setShowApprenticeships] = useState(false);
  const [showMajorProjects, setShowMajorProjects] = useState(false);
  const [selectedAchievements, setSelectedAchievements] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEducationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBack = () => {
    navigate('/education/intro');
  };

  const handleNext = () => {
    // Create the education entry with proper degree handling
    const degreeToUse = educationData.degree === 'other' 
      ? educationData.otherDegree 
      : educationData.degree;

    const newEducation = {
      id: Date.now(),
      degree: `${degreeToUse} - ${educationData.schoolName}`,
      field: educationData.fieldOfStudy,
      location: educationData.schoolLocation,
      date: `${educationData.graduationMonth} ${educationData.graduationYear}`
    };

    // Get existing education list from localStorage
    const existingEducation = JSON.parse(localStorage.getItem('educationList') || '[]');
    
    // Add new education to the list
    const updatedEducation = [...existingEducation, newEducation];
    
    // Save to localStorage
    localStorage.setItem('educationList', JSON.stringify(updatedEducation));

    // Navigate to summary page
    navigate('/education/summary');
  };

  const getAchievementFormat = (achievement) => {
    switch (achievement) {
      case 'Honours':
        return `• Honours [Semester, year]`;
      case 'Graduation with Distinction':
        return `• Graduation with Distinction [Semester, year]`;
      case 'Number GPA/CGPA':
        return `• [Number] GPA/CGPA`;
      case 'Grade Letter GPA/CGPA':
        return `• Final Grade [Letter]`;
      case 'Percentage GPA/CGPA':
        return `• Final Grade [Number]%`;
      case 'Ranking':
        return `• Ranked [Number]% in Class`;
      case 'Awards':
        return `• Recipient of [Award Name], [Semester, year]`;
      case 'Scholarship':
        return `• [Scholarship Name], [Year Awarded] from [Awarding Body]`;
      case 'Athletic or other awards':
        return `• [Scholarship Name], [Year Awarded] from [Awarding Body] for [Reason for Award]`;
      case 'Relevant Coursework':
        return `• Completed Coursework: [Course Title], [Year]`;
      case 'Professional Development':
        return `• Professional Development Studies: [Area of Study], [Year]`;
      case 'College coursework':
        return `• Completed College-level Coursework: [Area of Study], [School Name]`;
      case 'Club Membership':
        return `• Member of [Club Name], [Year] to [Year]`;
      case 'Club or Program Representative':
        return `• [Position], [Program or Club], [Year] to [Year]`;
      case 'Sorority or Fraternity Membership':
        return `• Member of [Sorority or Fraternity], [Year]`;
      case 'Captain or Leadership':
        return `• [Captain or Leader] of [Team Name]`;
      case 'Sports Participation':
        return `• [Position] for [Team Name], [Year] to [Year]`;
      case 'Study Abroad':
        return `• Study Abroad: [Subject] - [School Name], [Location], [Year] to [Year]`;
      case 'Apprenticeship':
        return `• [Apprenticeship Name], [Organization Name], Completed [Year]`;
      case 'Internship':
        return `• [Internship Name], [Organization Name], Completed [Year]`;
      case 'Thesis Paper':
        return `• Thesis Paper: [Thesis Title]`;
      case 'Capstone Project':
        return `• [Project Name], [Your Role and Brief Project Description] - Capstone Project`;
      case 'Research Project':
        return `• [Project Name], [Project Results Statement] - Research Project`;
      case 'Dissertation':
        return `• Dissertation: [Dissertation Title]`;      
      default:
        return `• ${achievement} [ ]`;
    }
  };

  const handleAchievementClick = (achievement) => {
    const isSelected = selectedAchievements.includes(achievement);
    
    if (isSelected) {
      // Remove from selected achievements
      setSelectedAchievements(selectedAchievements.filter(item => item !== achievement));
      
      // Remove from description using the formatted line
      const achievementLine = getAchievementFormat(achievement);
      setDescription(prev => 
        prev.split('\n')
           .filter(line => !line.includes(achievementLine))
           .join('\n')
      );
    } else {
      // Add to selected achievements
      setSelectedAchievements([...selectedAchievements, achievement]);
      
      // Add to description at the top with proper format
      const newEntry = getAchievementFormat(achievement);
      setDescription(prev => {
        if (!prev) return newEntry;
        return newEntry + '\n' + prev;
      });
    }
  };

  const handleFormat = (command) => {
    const textarea = document.querySelector('.editor-container textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    if (start === end) {
      // No text selected
      return;
    }

    let formattedText = '';
    switch (command) {
      case 'bold':
        formattedText = `<b>${selectedText}</b>`;
        break;
      case 'italic':
        formattedText = `<i>${selectedText}</i>`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      default:
        return;
    }

    // Create new text with formatting
    const newText = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    
    // Update both the textarea value and the description state
    textarea.value = newText;
    setDescription(newText);
  };

  return (
    <div className="resume-builder">
      <Sidebar activeStep={2} />
      <div className="education-container">
        <div className="back-link" onClick={handleBack}>
          ← Go Back
        </div>

        <h1>Tell us about your education</h1>
        <p className="subtitle">
          Enter your education experience so far, even if you are a current student or did not graduate.
        </p>

        <form className="education-form">
          <div className="form-row">
            <div className="form-group">
              <label>SCHOOL NAME *</label>
              <input
                type="text"
                name="schoolName"
                placeholder="e.g. Oxford Software Institute & Oxford School of English"
                value={educationData.schoolName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>SCHOOL LOCATION</label>
              <input
                type="text"
                name="schoolLocation"
                placeholder="e.g. New Delhi, India"
                value={educationData.schoolLocation}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>DEGREE</label>
              <select
                name="degree"
                value={educationData.degree}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="high_school">High School Diploma</option>
                <option value="associate">Associate's Degree</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="phd">Ph.D.</option>
                <option value="diploma">Diploma</option>
                <option value="certification">Professional Certification</option>
                <option value="trade">Trade School Certificate</option>
                <option value="vocational">Vocational Training</option>
                <option value="postgraduate">Postgraduate Diploma</option>
                <option value="doctorate">Doctorate</option>
                <option value="mphil">M.Phil.</option>
                <option value="professional">Professional Degree (MD, JD, etc.)</option>
                <option value="technical">Technical Certificate</option>
                <option value="foundation">Foundation Degree</option>
                <option value="higher_national">Higher National Diploma (HND)</option>
                <option value="graduate">Graduate Certificate</option>
                <option value="executive">Executive Education</option>
                <option value="other">Other</option>
              </select>
              {educationData.degree === 'other' && (
                <input
                  type="text"
                  name="otherDegree"
                  value={educationData.otherDegree}
                  onChange={handleInputChange}
                  placeholder="Enter your degree name"
                  className="other-degree-input"
                  required
                />
              )}
            </div>
            <div className="form-group">
              <label>FIELD OF STUDY</label>
              <input
                type="text"
                name="fieldOfStudy"
                placeholder="e.g. Financial Accounting"
                value={educationData.fieldOfStudy}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>GRADUATION DATE (OR EXPECTED GRADUATION DATE)</label>
              <div className="date-inputs">
                <select
                  name="graduationMonth"
                  value={educationData.graduationMonth}
                  onChange={handleInputChange}
                >
                  <option value="">Month</option>
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                <select
                  name="graduationYear"
                  value={educationData.graduationYear}
                  onChange={handleInputChange}
                >
                  <option value="">Year</option>
                  <option value="2027">2027</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>
                  <option value="2017">2017</option>
                  <option value="2016">2016</option>
                  <option value="2015">2015</option>
                  <option value="2014">2014</option>
                  <option value="2013">2013</option>
                  <option value="2012">2012</option>
                  <option value="2011">2011</option>
                  <option value="2010">2010</option>
                  <option value="2009">2009</option>
                  <option value="2008">2008</option>
                  <option value="2007">2007</option>
                  <option value="2006">2006</option>
                  <option value="2005">2005</option>
                  <option value="2004">2004</option>
                  <option value="2003">2003</option>
                  <option value="2002">2002</option>
                  <option value="2001">2001</option>
                  <option value="2000">2000</option>
                  <option value="1999">1999</option>
                  <option value="1998">1998</option>
                </select>
              </div>
            </div>
          </div>

          <div className="additional-section">
            <div className="coursework-header" onClick={() => setShowAchievements(!showAchievements)}>
              <div className="header-content">
                <span className={`arrow-icon ${showAchievements ? 'open' : ''}`}>▼</span>
                <span>Add any additional coursework you're proud to showcase</span>
              </div>
              <div className="sample-link">Look here for sample resume references</div>
            </div>

            <div className="pro-tip">
              <span className="tip-icon">💡</span>
              <p>
                If your bachelor's degree is in progress, you can include international exchange, educational achievements or any certification that corresponds to your desired job. An above-average grade, rank or CGPA (8.0 or higher) would be good to add too.
              </p>
            </div>

            {showAchievements && (
              <div className="achievements-content mobile-scroll">
                <div className="content-columns">
                  <div className="left-column">
                    <h3>Ready-to-use-examples</h3>
                    <div className="main-content-box">
                      <div className="scrollable-achievements">
                        <div className="section-box">
                          <div className="section-header" onClick={() => setShowEducationalAchievements(!showEducationalAchievements)}>
                            <span>Educational Achievements</span>
                            <span className={`arrow-icon ${showEducationalAchievements ? 'open' : ''}`}>▼</span>
                          </div>
                          {showEducationalAchievements && (
                            <div className="section-content">
                              <div className="achievement-items">
                                <p>Would you like to include any honours, rank or CGPA score?</p>
                                
                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Honours')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Honours') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Honours') ? '✓' : ''}
                                    </span>
                                    <span>Honours</span>
                                  </div>
                                </div>

                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Graduation with Distinction')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Graduation with Distinction') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Graduation with Distinction') ? '✓' : ''}
                                    </span>
                                    <span>Graduation with Distinction</span>
                                  </div>
                                </div>

                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Number GPA/CGPA')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Number GPA/CGPA') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Number GPA/CGPA') ? '✓' : ''}
                                    </span>
                                    <span>Number GPA/CGPA</span>
                                  </div>
                                </div>

                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Grade Letter GPA/CGPA')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Grade Letter GPA/CGPA') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Grade Letter GPA/CGPA') ? '✓' : ''}
                                    </span>
                                    <span>Grade Letter GPA/CGPA</span>
                                  </div>
                                </div>

                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Percentage GPA/CGPA')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Percentage GPA/CGPA') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Percentage GPA/CGPA') ? '✓' : ''}
                                    </span>
                                    <span>Percentage GPA/CGPA</span>
                                  </div>
                                </div>

                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Ranking')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Ranking') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Ranking') ? '✓' : ''}
                                    </span>
                                    <span>Ranking</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="section-box">
                          <div className="section-header" onClick={() => setShowPrizesScholarship(!showPrizesScholarship)}>
                            <span>Prizes and Scholarship</span>
                            <span className={`arrow-icon ${showPrizesScholarship ? 'open' : ''}`}>▼</span>
                          </div>
                          {showPrizesScholarship && (
                            <div className="section-content">
                              <div className="achievement-items">
                                <p>Have you received awards and grants?</p>
                                
                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Awards')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Awards') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Awards') ? '✓' : ''}
                                    </span>
                                    <span>Awards</span>
                                  </div>
                                </div>

                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Scholarship')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Scholarship') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Scholarship') ? '✓' : ''}
                                    </span>
                                    <span>Scholarship</span>
                                  </div>
                                </div>

                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Athletic or other awards')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Athletic or other awards') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Athletic or other awards') ? '✓' : ''}
                                    </span>
                                    <span>Athletic or other awards</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="section-box">
                          <div className="section-header" onClick={() => setShowCoursework(!showCoursework)}>
                            <span>Coursework and Professional Development</span>
                            <span className={`arrow-icon ${showCoursework ? 'open' : ''}`}>▼</span>
                          </div>
                          {showCoursework && (
                            <div className="section-content">
                              <div className="achievement-items">
                                <p>Would you like to include any completed courses that are relevant to your desired job?</p>
                                
                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Relevant Coursework')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Relevant Coursework') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Relevant Coursework') ? '✓' : ''}
                                    </span>
                                    <span>Relevant Coursework</span>
                                  </div>
                                </div>

                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Professional Development')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Professional Development') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Professional Development') ? '✓' : ''}
                                    </span>
                                    <span>Professional Development</span>
                                  </div>
                                </div>

                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('College coursework')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('College coursework') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('College coursework') ? '✓' : ''}
                                    </span>
                                    <span>College coursework</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="section-box">
                          <div className="section-header" onClick={() => setShowActivities(!showActivities)}>
                            <span>Activities and Organizations</span>
                            <span className={`arrow-icon ${showActivities ? 'open' : ''}`}>▼</span>
                          </div>
                          {showActivities && (
                            <div className="section-content">
                              <div className="achievement-items">
                                <p>Have you been a team player in a group or an organization?</p>
                                
                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Club Membership')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Club Membership') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Club Membership') ? '✓' : ''}
                                    </span>
                                    <span>Club Membership</span>
                                  </div>
                                </div>

                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Club or Program Representative')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Club or Program Representative') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Club or Program Representative') ? '✓' : ''}
                                    </span>
                                    <span>Club or Program Representative</span>
                                  </div>
                                </div>

                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Sorority or Fraternity Membership')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Sorority or Fraternity Membership') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Sorority or Fraternity Membership') ? '✓' : ''}
                                    </span>
                                    <span>Sorority or Fraternity Membership</span>
                                  </div>
                                </div>

                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Captain or Leadership')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Captain or Leadership') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Captain or Leadership') ? '✓' : ''}
                                    </span>
                                    <span>Captain or Leadership</span>
                                  </div>
                                </div>

                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Sports Participation')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Sports Participation') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Sports Participation') ? '✓' : ''}
                                    </span>
                                    <span>Sports Participation</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="section-box">
                          <div className="section-header" onClick={() => setShowStudyAbroad(!showStudyAbroad)}>
                            <span>Study Abroad</span>
                            <span className={`arrow-icon ${showStudyAbroad ? 'open' : ''}`}>▼</span>
                          </div>
                          {showStudyAbroad && (
                            <div className="section-content">
                              <div className="achievement-items">
                                <p>Have you studied overseas? Include your international educational experience here</p>
                                
                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Study Abroad')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Study Abroad') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Study Abroad') ? '✓' : ''}
                                    </span>
                                    <span>Study Abroad</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="section-box">
                          <div className="section-header" onClick={() => setShowApprenticeships(!showApprenticeships)}>
                            <span>Apprenticeship and Internship</span>
                            <span className={`arrow-icon ${showApprenticeships ? 'open' : ''}`}>▼</span>
                          </div>
                          {showApprenticeships && (
                            <div className="section-content">
                              <div className="achievement-items">
                                <p>Have you had hands-on experience developing skills that are relevant to your desired job?</p>

                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Apprenticeship')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Apprenticeship') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Apprenticeship') ? '✓' : ''}
                                    </span>
                                    <span>Apprenticeship</span>
                                  </div>
                                </div>

                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Internship')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Internship') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Internship') ? '✓' : ''}
                                    </span>
                                    <span>Internship</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="section-box">
                          <div className="section-header" onClick={() => setShowMajorProjects(!showMajorProjects)}>
                            <span>Major Projects</span>
                            <span className={`arrow-icon ${showMajorProjects ? 'open' : ''}`}>▼</span>
                          </div>
                          {showMajorProjects && (
                            <div className="section-content">
                              <div className="achievement-items">
                                <p>What noteworthy projects would you like to list?</p>
                                
                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Thesis Paper')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Thesis Paper') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Thesis Paper') ? '✓' : ''}
                                    </span>
                                    <span>Thesis Paper</span>
                                  </div>
                                </div>

                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Capstone Project')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Capstone Project') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Capstone Project') ? '✓' : ''}
                                    </span>
                                    <span>Capstone Project</span>
                                  </div>
                                </div>

                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Research Project')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Research Project') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Research Project') ? '✓' : ''}
                                    </span>
                                    <span>Research Project</span>
                                  </div>
                                </div>

                                <div className="subsection-box">
                                  <div 
                                    className="achievement-option"
                                    onClick={() => handleAchievementClick('Dissertation')}
                                  >
                                    <span className={`plus-icon ${selectedAchievements.includes('Dissertation') ? 'selected' : ''}`}>
                                      {selectedAchievements.includes('Dissertation') ? '✓' : ''}
                                    </span>
                                    <span>Dissertation</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="right-column">
                    <h3>EDUCATION DESCRIPTION</h3>
                    <div className="main-content-box">
                      <div className="editor-container">
                        <div className="editor-toolbar">
                          <button 
                            type="button"
                            className="toolbar-btn bold" 
                            onClick={() => handleFormat('bold')}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            B
                          </button>
                          <button 
                            type="button"
                            className="toolbar-btn italic"
                            onClick={() => handleFormat('italic')}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            I
                          </button>
                          <button 
                            type="button"
                            className="toolbar-btn underline"
                            onClick={() => handleFormat('underline')}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            U
                          </button>
                          <button className="toolbar-btn list">•</button>
                          <button className="toolbar-btn">A</button>
                          <button className="toolbar-btn">↺</button>
                          <button className="toolbar-btn">↻</button>
                        </div>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="form-control"
                          placeholder="Description"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button type="button" className="preview-btn">
              Preview
            </button>
            <button 
              type="button" 
              className="next-btn"
              onClick={handleNext}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Education;
