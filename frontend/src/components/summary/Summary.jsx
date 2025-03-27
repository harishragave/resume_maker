import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import './Summary.css'
import { FaSearch, FaPlus, FaCheck, FaTimes, FaBold, FaItalic, FaUnderline, FaUndo, FaRedo } from "react-icons/fa";

function Summary() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSummaries, setSelectedSummaries] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [keywordSuggestions, setKeywordSuggestions] = useState([]);
    const [editorContent, setEditorContent] = useState('');
    const [editorHistory, setEditorHistory] = useState(['']);
    const [historyIndex, setHistoryIndex] = useState(0);
    const editorRef = useRef(null);
    
    const jobDescriptions = [
    {
      id: 1,
      title: "Healthcare Professional",
      keywords: ["healthcare", "medical", "patient care", "clinical"],
      description:
        "Offering strong interpersonal skills and commitment to learning and development in healthcare settings. Contributes foundational understanding of medical practices and case management principles while quickly adapting to new systems and processes. Ready to use and develop clinical assessment and patient advocacy skills in [Desired Position] role.",
    },
    {
      id: 2,
      title: "Patient Care Specialist",
      keywords: ["patient", "care", "healthcare", "empathetic", "communication"],
      description:
        "Energetic and compassionate, with knack for empathetic patient care and effective communication. Possesses solid understanding of medical terminology and case management software, enhancing patient outcomes and coordination of care. Dedicated to making meaningful impact through comprehensive patient assessments and personalized care plans.",
    },
    {
      id: 3,
      title: "Software Developer",
      keywords: ["software", "developer", "javascript", "react", "coding", "programming"],
      description:
        "Detail-oriented software developer with expertise in modern web technologies and a passion for creating elegant solutions to complex problems. Proficient in JavaScript, React, and Node.js with a strong foundation in computer science principles. Committed to writing clean, maintainable code and staying current with industry best practices.",
    },
    {
      id: 4,
      title: "Data Analyst",
      keywords: ["data", "analyst", "analytics", "SQL", "Excel", "Python", "visualization"],
      description:
        "Results-driven data analyst with strong analytical thinking and problem-solving abilities. Experienced in collecting, organizing, and analyzing large datasets to identify trends and deliver actionable insights. Proficient in SQL, Excel, Python, and data visualization tools with excellent communication skills to present findings clearly to non-technical stakeholders.",
    },
    {
      id: 5,
      title: "Marketing Specialist",
      keywords: ["marketing", "digital", "social media", "content", "SEO", "SEM"],
      description:
        "Creative marketing professional with expertise in digital marketing strategies and campaign management. Skilled in social media management, content creation, and SEO/SEM tactics that drive engagement and conversion. Analytical thinker who leverages data to optimize marketing efforts and achieve measurable results across multiple channels.",
    },
    {
      id: 6,
      title: "Project Manager",
      keywords: ["project", "manager", "agile", "leadership", "stakeholder", "budget", "timeline"],
      description:
        "Organized and methodical project manager with proven ability to lead cross-functional teams and deliver projects on time and within budget. Experienced in agile methodologies, risk management, and resource allocation. Strong communicator who excels at stakeholder management and adapting to changing priorities while maintaining focus on strategic objectives.",
    }
  ];
    
    // Initialize filtered jobs on component mount
    useEffect(() => {
        setFilteredJobs(jobDescriptions);
    }, []);
    
    // Filter jobs when search term changes
    useEffect(() => {
        // Filter suggestions and jobs based on search term
        if (searchTerm.trim() === '') {
            setFilteredJobs(jobDescriptions);
            setKeywordSuggestions([]);
            setShowSuggestions(false);
        } else {
            const term = searchTerm.toLowerCase();
            
            // Filter jobs that match the search term
            const filtered = jobDescriptions.filter(job => 
                job.title.toLowerCase().includes(term) || 
                job.description.toLowerCase().includes(term) ||
                job.keywords.some(keyword => keyword.toLowerCase().includes(term))
            );
            
            // Generate keyword suggestions
            const allKeywords = jobDescriptions.flatMap(job => job.keywords);
            const uniqueKeywords = [...new Set(allKeywords)];
            const matchingKeywords = uniqueKeywords.filter(keyword => 
                keyword.toLowerCase().includes(term)
            ).slice(0, 5); // Limit to 5 suggestions
            
            setFilteredJobs(filtered);
            setKeywordSuggestions(matchingKeywords);
            setShowSuggestions(matchingKeywords.length > 0);
        }
    }, [searchTerm]);
    
    // Initialize history and editor content
    useEffect(() => {
        // Set initial empty content for history tracking
        setEditorHistory(['']);
        setHistoryIndex(0);
    }, []);
    
    // Listen for new selections
    useEffect(() => {
        const newlySelectedId = selectedSummaries.length > 0 ? 
            selectedSummaries[selectedSummaries.length - 1] : null;
        
        if (newlySelectedId) {
            const selectedJob = jobDescriptions.find(job => job.id === newlySelectedId);
            if (selectedJob) {
                // Format content to ensure it's wrapped in paragraphs
                const formattedContent = formatContentWithParagraphs(selectedJob.description);
                
                // If there's already content in the editor, append the new content
                // Otherwise, set it as the initial content
                if (editorContent && editorContent.trim() !== '') {
                    const newContent = editorContent + '<div class="summary-divider"></div>' + formattedContent;
                    setEditorContent(newContent);
                    
                    // Add to history
                    const newHistory = editorHistory.slice(0, historyIndex + 1);
                    setEditorHistory([...newHistory, newContent]);
                    setHistoryIndex(newHistory.length);
                } else {
                    setEditorContent(formattedContent);
                    // Reset history when setting initial content
                    setEditorHistory([formattedContent]);
                    setHistoryIndex(0);
                }
            }
        }
    }, [selectedSummaries]);
    
    // Format plain text into paragraphs for proper HTML rendering
    const formatContentWithParagraphs = (text) => {
        if (!text) return '';
        
        // Split by double newlines to identify paragraphs
        const paragraphs = text.split(/\n\n+/);
        
        // Format each paragraph with proper HTML
        return paragraphs
            .map(para => {
                // Skip empty paragraphs
                if (!para.trim()) return '';
                
                // Format single newlines as <br> tags
                const lines = para.split(/\n/)
                    .map(line => line.trim())
                    .filter(line => line);
                
                if (lines.length === 0) return '';
                
                // Join lines with <br> tags for single line breaks
                return `<p>${lines.join('<br>')}</p>`;
            })
            .filter(para => para)
            .join('');
    };
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    
    const handleSelectSummary = (id) => {
        // Check if the summary is already selected
        if (selectedSummaries.includes(id)) {
            // If clicking on an already selected summary, deselect it
            setSelectedSummaries(selectedSummaries.filter(summaryId => summaryId !== id));
            
            // If we're deselecting all summaries, clear the editor
            if (selectedSummaries.length === 1) {
                setEditorContent('');
                setEditorHistory(['']);
                setHistoryIndex(0);
            }
        } else {
            // If selecting a new summary, add it to the list of selected summaries
            setSelectedSummaries([...selectedSummaries, id]);
        }
    };
    
    const clearAllSelections = () => {
        setSelectedSummaries([]);
        setEditorContent('');
        setEditorHistory(['']);
        setHistoryIndex(0);
    };
    
    const handleClearSearch = () => {
        setSearchTerm('');
        setShowSuggestions(false);
    };
    
    const handleSelectSuggestion = (suggestion) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
    };
    
    const handleEditorChange = (e) => {
        const newContent = e.target.innerHTML;
        setEditorContent(newContent);
        
        // Add to history if content has changed
        if (newContent !== editorHistory[historyIndex]) {
            // Remove any future history if we're in the middle of the history
            const newHistory = editorHistory.slice(0, historyIndex + 1);
            setEditorHistory([...newHistory, newContent]);
            setHistoryIndex(newHistory.length);
        }
    };
    
    const applyFormatting = (command, value = null) => {
        document.execCommand(command, false, value);
        // Focus back on the editor after applying formatting
        if (editorRef.current) {
            editorRef.current.focus();
        }
        
        // Update history after formatting
        const updatedContent = editorRef.current.innerHTML;
        if (updatedContent !== editorHistory[historyIndex]) {
            const newHistory = editorHistory.slice(0, historyIndex + 1);
            setEditorHistory([...newHistory, updatedContent]);
            setHistoryIndex(newHistory.length);
        }
    };
    
    // Create a new paragraph
    const createNewParagraph = () => {
        if (editorRef.current) {
            // Insert new paragraph
            document.execCommand('insertParagraph', false, null);
            editorRef.current.focus();
            
            // Update history
            const updatedContent = editorRef.current.innerHTML;
            if (updatedContent !== editorHistory[historyIndex]) {
                const newHistory = editorHistory.slice(0, historyIndex + 1);
                setEditorHistory([...newHistory, updatedContent]);
                setHistoryIndex(newHistory.length);
            }
        }
    };
    
    const handleKeyDown = (e) => {
        // Handle keyboard shortcuts
        if (e.ctrlKey) {
            switch (e.key) {
                case 'b':
                    e.preventDefault();
                    applyFormatting('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    applyFormatting('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    applyFormatting('underline');
                    break;
                case 'z':
                    e.preventDefault();
                    handleUndo();
                    break;
                case 'y':
                    e.preventDefault();
                    handleRedo();
                    break;
                default:
                    break;
            }
        }
    };
    
    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setEditorContent(editorHistory[historyIndex - 1]);
        }
    };
    
    const handleRedo = () => {
        if (historyIndex < editorHistory.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setEditorContent(editorHistory[historyIndex + 1]);
        }
    };
    
    return (
        <div className="tips-container">
            <Sidebar activeStep={5} />
            <button onClick={() => navigate('/Summarys/tips')} className="back-button">
                <span>←</span>Go Back
            </button>
            
            <h1 className="summary-title">Briefly tell us about your background</h1>
            <p1 className="summary-text">Choose from our pre-written examples below or write your own.</p1>
            
            <div className="summary-layout">
                <div className="summary-content">
                    <div className="unified-container">
                        <div className="search-container">
                            <div className="search-box">
                                <FaSearch className="search-icon" />
                                <input 
                                    type="text" 
                                    className="search-input" 
                                    placeholder="Search for a summary by job title or keyword"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                {searchTerm && (
                                    <button className="clear-search" onClick={handleClearSearch}>
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                            {showSuggestions && (
                                <div className="suggestions">
                                    {keywordSuggestions.map((suggestion, index) => (
                                        <div 
                                            key={index} 
                                            className="suggestion-item"
                                            onClick={() => handleSelectSuggestion(suggestion)}
                                        >
                                            {suggestion}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="recommendations-header">
                            <div className="recommendations-title">Expert Recommended Summaries</div>
                            <div className="recommendations-count">
                                {filteredJobs.length} options
                                {selectedSummaries.length > 0 && (
                                    <button 
                                        className="clear-all-button" 
                                        onClick={clearAllSelections}
                                        title="Clear all selections"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="scrollable-container">
                            {filteredJobs.length > 0 ? (
                                <div className="job-descriptions">
                                    {filteredJobs.map((job) => (
                                        <div key={job.id} className={`job-card ${selectedSummaries.includes(job.id) ? 'selected' : ''}`}>
                                            <div className="job-card-content">
                                                <div 
                                                    className="select-circle" 
                                                    onClick={() => handleSelectSummary(job.id)}
                                                >
                                                    {selectedSummaries.includes(job.id) ? <FaCheck /> : <FaPlus />}
                                                </div>
                                                <div className="job-text">
                                                    <h3>{job.title}</h3>
                                                    <p>{job.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-results">
                                    <p>No matching summaries found.</p>
                                    <p>Try different keywords or browse all options by clearing your search.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Text Editor Component - Always visible */}
                <div className="editor-container">
                    <div className="editor-header">
                        <h3>Edit Your Summary</h3>
                        <div className="formatting-toolbar">
                            <button 
                                className="format-button" 
                                onClick={() => applyFormatting('bold')}
                                title="Bold (Ctrl+B)"
                            >
                                <FaBold />
                            </button>
                            <button 
                                className="format-button" 
                                onClick={() => applyFormatting('italic')}
                                title="Italic (Ctrl+I)"
                            >
                                <FaItalic />
                            </button>
                            <button 
                                className="format-button" 
                                onClick={() => applyFormatting('underline')}
                                title="Underline (Ctrl+U)"
                            >
                                <FaUnderline />
                            </button>
                            <button 
                                className="format-button" 
                                onClick={createNewParagraph}
                                title="New Paragraph"
                            >
                                ¶
                            </button>
                            <div className="divider"></div>
                            <button 
                                className={`format-button ${historyIndex <= 0 ? 'disabled' : ''}`}
                                onClick={handleUndo}
                                disabled={historyIndex <= 0}
                                title="Undo (Ctrl+Z)"
                            >
                                <FaUndo />
                            </button>
                            <button 
                                className={`format-button ${historyIndex >= editorHistory.length - 1 ? 'disabled' : ''}`}
                                onClick={handleRedo}
                                disabled={historyIndex >= editorHistory.length - 1}
                                title="Redo (Ctrl+Y)"
                            >
                                <FaRedo />
                            </button>
                        </div>
                    </div>
                    <div 
                        ref={editorRef}
                        className="editor-area" 
                        contentEditable={true}
                        dangerouslySetInnerHTML={{ __html: editorContent }}
                        onInput={handleEditorChange}
                        onKeyDown={handleKeyDown}
                        data-placeholder="Select a summary or write your own..."
                    ></div>
                    <div className="editor-footer">
                        <button className="save-button">Save & Continue</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Summary;