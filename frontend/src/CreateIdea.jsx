import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  HelpCircle,
  Briefcase,
  LineChart,
  Users,
  AlertCircle,
  Loader2
} from 'lucide-react';
import './CreateIdea.css';

function CreateIdea() {
  const navigate = useNavigate();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, lookingFor: role }));
    if (errorMessage) setErrorMessage('');
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

  const handlePublish = async () => {
    setErrorMessage('');
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage("Please log in as an entrepreneur first to publish an idea.");
      navigate('/login');
      return;
    }

    if (!formData.startupName.trim()) {
      setErrorMessage("Startup Name is required.");
      return;
    }
    if (!formData.industry) {
      setErrorMessage("Please select an Industry.");
      return;
    }
    if (!formData.problem.trim()) {
      setErrorMessage("The Problem description is required.");
      return;
    }
    if (!formData.solution.trim()) {
      setErrorMessage("The Solution description is required.");
      return;
    }
    if (!formData.market.trim()) {
      setErrorMessage("Target Market is required.");
      return;
    }

    const need = formData.lookingFor ? formData.lookingFor.toUpperCase() : 'BOTH';

    const payload = {
      title: formData.startupName.trim(),
      problem: formData.problem.trim(),
      solution: formData.solution.trim(),
      targetMarket: formData.market.trim(),
      industryName: formData.industry,
      description: formData.solution.trim() + " (Problem: " + formData.problem.trim() + ")",
      lookingFor: [need]
    };

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/entrepreneur/createstartup-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        let msg = "Failed to create startup idea.";
        if (response.status === 502) {
          msg = "Backend server (Spring Boot on port 8080) is not running or unreachable. Please start your Spring Boot application.";
        } else if (response.status === 401 || response.status === 403) {
          msg = "Your login session has expired. Please log in again.";
        } else if (data && data.message) {
          msg = data.message;
        }
        setErrorMessage(msg);
        setIsSubmitting(false);
        return;
      }

      // Successfully created idea! Navigate back to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error("Error creating startup idea:", err);
      setErrorMessage("Could not reach backend API at http://localhost:8080.");
    } finally {
      setIsSubmitting(false);
    }
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

      {errorMessage && (
        <div style={{ padding: '0 32px 16px 32px' }}>
          <div className="auth-error-alert" style={{ margin: 0 }}>
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Sticky Action Footer Bar */}
      <footer className="sticky-footer">
        <div className="footer-actions-left">
          <Link to="/dashboard">
            <button className="btn-ghost" type="button">Discard Idea</button>
          </Link>
        </div>
        <div className="footer-actions-right">
          <button className="btn-outline" type="button" onClick={() => alert("Draft saved locally.")}>Save Draft</button>
          <button 
            className="btn-primary-blue" 
            type="button" 
            onClick={handlePublish}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Loader2 size={16} className="animate-spin" /> Publishing...
              </span>
            ) : (
              'Publish Idea'
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default CreateIdea;
