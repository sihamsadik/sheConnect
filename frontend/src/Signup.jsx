import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  Briefcase, 
  LineChart, 
  CheckCircle2, 
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2
} from 'lucide-react';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const roles = [
    {
      id: 'entrepreneur',
      backendRole: 'ENTREPRENEUR',
      title: 'Entrepreneur',
      description: 'I want to build my startup and raise funds.',
      icon: <Rocket className="role-icon-svg" />
    },
    {
      id: 'investor',
      backendRole: 'INVESTOR',
      title: 'Investor',
      description: 'I want to discover and invest in startups.',
      icon: <Briefcase className="role-icon-svg" />
    },
    {
      id: 'advisor',
      backendRole: 'ADVISOR',
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
    if (errorMessage) setErrorMessage('');
  };

  const isStrongPassword = (pass) => {
    if (!pass || pass.length < 8) return false;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasDigit = /\d/.test(pass);
    const hasSpecial = /[!@#$%^&*()]/.test(pass);
    return hasUpper && hasLower && hasDigit && hasSpecial;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedRole) {
      setErrorMessage("Please select your role (Entrepreneur, Investor, or Advisor).");
      return;
    }

    if (!formData.name.trim()) {
      setErrorMessage("Full name is required.");
      return;
    }

    if (!isStrongPassword(formData.password)) {
      setErrorMessage("Password must be at least 8 characters long, and include an uppercase letter, lowercase letter, number, and special character (e.g. Test1234!).");
      return;
    }

    setIsLoading(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: selectedRole.toUpperCase()
    };

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        let errorText = "Registration failed. Please check your details.";
        if (data) {
          if (data.details && typeof data.details === 'object') {
            errorText = Object.values(data.details).join('. ');
          } else if (data.message) {
            errorText = data.message;
          }
        }
        setErrorMessage(errorText);
        setIsLoading(false);
        return;
      }

      // Success: Save auth tokens and user profile
      if (data) {
        if (data.token) localStorage.setItem('token', data.token);
        if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify({
          name: data.name || formData.name,
          email: data.email || formData.email,
          role: data.role || payload.role
        }));
      }

      // Redirect user to their corresponding role dashboard
      const targetRole = (data?.role || payload.role).toUpperCase();
      if (targetRole === 'INVESTOR') {
        navigate('/investor');
      } else if (targetRole === 'ADVISOR') {
        navigate('/advisor');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Signup network error:", err);
      setErrorMessage("Could not reach backend at http://localhost:8080. Please ensure the Spring Boot server is running.");
    } finally {
      setIsLoading(false);
    }
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

        {errorMessage && (
          <div className="auth-error-alert animate-fade-in-up">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="role-selection">
            {roles.map((role) => (
              <div 
                key={role.id}
                className={`role-option ${selectedRole === role.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedRole(role.id);
                  if (errorMessage) setErrorMessage('');
                }}
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
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              placeholder="e.g. Jane Doe" 
              value={formData.name}
              onChange={handleInputChange}
              required
            />
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
            <p className="field-hint">
              Must be at least 8 chars with uppercase, lowercase, number & special char (!@#$).
            </p>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary full-width submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="btn-loading-content">
                <Loader2 size={18} className="animate-spin" /> Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
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
