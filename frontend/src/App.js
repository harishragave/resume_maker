import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FirstPage from './components/FirstPage';
import LoginPage from './components/LoginPage';
import Heading from './components/heading';
import EducationIntro from './components/education/education_intro';
import Education from './components/education/Education';
import EducationSummary from './components/education/EducationSummary';
import ProfessionalIntro from './components/professionalexperience/professional_intro';
import ProfessionalTips from './components/professionalexperience/professional_tips';
import ProfessionalSummary from './components/professionalexperience/professionalsummary';
import ExperienceForm from './components/professionalexperience/ExperienceForm';
import Summary from './components/summary/Summary';
import Summarytips from './components/summary/Summarytips';
import SkillTips from './components/skills/SkillTips';
import SkillForm from './components/skills/SkillForm';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/heading" element={<Heading />} />
        <Route path="/education/intro" element={<EducationIntro />} />
        <Route path="/education/form" element={<Education />} />
        <Route path="/education/summary" element={<EducationSummary />} />
        <Route path="/professional-experience/intro" element={<ProfessionalIntro/>} />
        <Route path="/professional-experience/tips" element={<ProfessionalTips/>} />
        <Route path="/professional-experience/summary" element={<ProfessionalSummary/>} />
        <Route path="/professional-experience/form" element={<ExperienceForm/>} />
        <Route path="/skills" element={<SkillTips />} />
        <Route path="/skills/form" element={<SkillForm />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/Summarys/tips" element={<Summarytips />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;