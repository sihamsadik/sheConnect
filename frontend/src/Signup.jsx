import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  Briefcase, 
  LineChart, 
  CheckCircle2, 
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const roles = [
    {
      id: 'entrepreneur',
      title: 'Entrepreneur',
      description: 'I want to build my startup and raise funds.',
      icon: <Rocket className="role-icon-svg" />
    },
    {
      id: 'investor',
      title: 'Investor',
      description: 'I want to discover and invest in startups.',
      icon: <Briefcase className="role-icon-svg" />
    },
    {
      id: 'advisor',
      title: 'Advisor',
      description: 'I want to mentor startups and share expertise.',
      icon: <LineChart className="role-icon-svg" />
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRole) {
      alert("Please select a role to continue.");
      return;
    }
    console.log("Signup attempt", { role: selectedRole, ...formData });
    // Proceed with signup logic
  };

  return (
    <div className="signup-container">
      <div className="signup-background">
        <div className="glow-orb orb-top-left"></div>
        <div className="glow-orb orb-bottom-right"></div>
      </div>

      <div className="signup-card glass-panel animate-fade-in-up">
        
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="signup-header">
          <div className="logo-small">
            <Rocket className="logo-icon text-primary" size={24} />
            <span>sheConnect</span>
          </div>
          <h2 className="signup-title">Join Platform</h2>
          <p className="signup-subtitle">Select your role to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="role-selection">
            {roles.map((role) => (
              <div 
                key={role.id}
                className={`role-option ${selectedRole === role.id ? 'selected' : ''}`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="role-icon-container">
                  {role.icon}
                </div>
                <div className="role-details">
                  <h4 className="role-title">{role.title}</h4>
                  <p className="role-desc">{role.description}</p>
                </div>
                <div className="role-check">
                  {selectedRole === role.id && <CheckCircle2 className="check-icon" />}
                </div>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label htmlFor="email">Work Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              placeholder="you@company.com" 
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                name="password"
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary full-width submit-btn">
            Continue
          </button>

          <p className="terms-text">
            By continuing, you agree to sheConnect's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>

          <div className="signup-footer">
            <p>Already have an account? <Link to="/login" className="login-link">Log In</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
