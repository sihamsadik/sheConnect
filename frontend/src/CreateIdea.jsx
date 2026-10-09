import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, 
  HelpCircle,
  Briefcase,
  LineChart,
  Users
} from 'lucide-react';
import './CreateIdea.css';

function CreateIdea() {
  const [formData, setFormData] = useState({
    startupName: '',
    industry: '',
    problem: '',
    solution: '',
    market: '',
    lookingFor: '',
    fundingRequired: ''
  });

  const [activeStep, setActiveStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, lookingFor: role }));
  };

  // Determine active step based on scroll or form completion (simplified logic for UI mockup)
  const isStepCompleted = (step) => {
    if (step === 1) return formData.startupName !== '' && formData.industry !== '';
    if (step === 2) return formData.problem !== '' && formData.solution !== '' && formData.market !== '';
    return false;
  };

  const formatCurrency = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value) {
      value = parseInt(value, 10).toLocaleString('en-US');
    }
    setFormData(prev => ({ ...prev, fundingRequired: value }));
  };

  return (
    <div className="create-idea-layout">
      {/* Top Minimal Bar */}
      <header className="top-bar">
        <div className="top-bar-left">
          <Link to="/dashboard" className="brand-logo">
            <Rocket className="brand-icon" size={22} />
            <span>sheConnect</span>
          </Link>
          <div className="draft-status">
            <span className="dot bg-gray-400 w-2 h-2 rounded-full inline-block"></span>
            Saved as draft 2m ago
          </div>
        </div>
        <div className="top-bar-right">
          <button className="help-btn">
            <HelpCircle size={18} />
            Help & Guidelines
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="form-container">
        
        {/* Left Column (Stepper) */}
        <div className="stepper-column">
          <div className="stepper">
            <div className={`step-item ${activeStep >= 1 ? 'active' : ''} ${isStepCompleted(1) ? 'completed' : ''}`}>
              <div className="step-indicator">1</div>
              <div className="step-content">
                <span className="step-title">Basic Info</span>
              </div>
            </div>
            <div className={`step-item ${activeStep >= 2 ? 'active' : ''} ${isStepCompleted(2) ? 'completed' : ''}`}>
              <div className="step-indicator">2</div>
              <div className="step-content">
                <span className="step-title">The Pitch</span>
              </div>
            </div>
            <div className={`step-item ${activeStep >= 3 ? 'active' : ''}`}>
              <div className="step-indicator">3</div>
              <div className="step-content">
                <span className="step-title">Requirements</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Area */}
        <div className="main-form-area">
          
          {/* Section 1: Basic Information */}
          <section className="form-section" onMouseEnter={() => setActiveStep(1)}>
            <h2 className="form-section-title">Basic Information</h2>
            
            <div className="input-group">
              <label htmlFor="startupName" className="input-label">Startup Name</label>
              <input 
                type="text" 
                id="startupName" 
                name="startupName" 
                className="form-input" 
                placeholder="Enter your startup or project name"
                value={formData.startupName}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="industry" className="input-label">Industry / Vertical</label>
              <select 
                id="industry" 
                name="industry" 
                className="form-select"
                value={formData.industry}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select an industry</option>
                <option value="FinTech">FinTech</option>
                <option value="HealthTech">HealthTech</option>
                <option value="Clean Energy">Clean Energy</option>
                <option value="SaaS">SaaS</option>
                <option value="EdTech">EdTech</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </section>

          {/* Section 2: The Pitch */}
          <section className="form-section" onMouseEnter={() => setActiveStep(2)}>
            <h2 className="form-section-title">The Pitch</h2>
            
            <div className="input-group">
              <label htmlFor="problem" className="input-label">
                The Problem <span className="input-help">(Max 300 words)</span>
              </label>
              <textarea 
                id="problem" 
                name="problem" 
                className="form-textarea" 
                placeholder="Describe the pain point or gap in the market you are addressing..."
                value={formData.problem}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="solution" className="input-label">
                The Solution <span className="input-help">(Max 300 words)</span>
              </label>
              <textarea 
                id="solution" 
                name="solution" 
                className="form-textarea" 
                placeholder="Explain how your product or service solves this problem..."
                value={formData.solution}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="market" className="input-label">Target Market</label>
              <textarea 
                id="market" 
                name="market" 
                className="form-textarea" 
                placeholder="Define your primary customer segments and market size..."
                value={formData.market}
                onChange={handleInputChange}
              />
            </div>
          </section>

          {/* Section 3: Requirements */}
          <section className="form-section" onMouseEnter={() => setActiveStep(3)}>
            <h2 className="form-section-title">Requirements</h2>
            
            <div className="input-group">
              <label className="input-label">What are you looking for?</label>
              <div className="role-cards-grid">
                <div 
                  className={`role-card ${formData.lookingFor === 'Investor' ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect('Investor')}
                >
                  <Briefcase className="role-card-icon" size={24} />
                  <span className="role-card-title">Investor</span>
                </div>
                <div 
                  className={`role-card ${formData.lookingFor === 'Advisor' ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect('Advisor')}
                >
                  <LineChart className="role-card-icon" size={24} />
                  <span className="role-card-title">Advisor</span>
                </div>
                <div 
                  className={`role-card ${formData.lookingFor === 'Both' ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect('Both')}
                >
                  <Users className="role-card-icon" size={24} />
                  <span className="role-card-title">Both</span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="fundingRequired" className="input-label">Funding Required</label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">$</span>
                <input 
                  type="text" 
                  id="fundingRequired" 
                  name="fundingRequired" 
                  className="form-input currency-input" 
                  placeholder="0"
                  value={formData.fundingRequired}
                  onChange={formatCurrency}
                />
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Sticky Action Footer Bar */}
      <footer className="sticky-footer">
        <div className="footer-actions-left">
          <Link to="/dashboard">
            <button className="btn-ghost">Discard Idea</button>
          </Link>
        </div>
        <div className="footer-actions-right">
          <button className="btn-outline">Save Draft</button>
          <button className="btn-primary-blue">Publish Idea</button>
        </div>
      </footer>
    </div>
  );
}

export default CreateIdea;
