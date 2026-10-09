import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, 
  Eye, 
  EyeOff, 
  Mail,
  Lock
} from 'lucide-react';
import './Login.css';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt", formData);
    // Proceed with login logic
  };

  return (
    <div className="login-container">
      <div className="mesh-background"></div>

      <div className="login-card glass-panel animate-fade-in-up">
        
        <div className="login-header">
          <div className="logo-center">
            <Rocket className="logo-icon text-primary" size={28} />
            <span>sheConnect</span>
          </div>
          <p className="login-tagline">Welcome back. Log in to your account.</p>
        </div>

        <div className="social-logins">
          <button type="button" className="btn-social google-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          
          <button type="button" className="btn-social linkedin-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0077B5" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Continue with LinkedIn
          </button>
        </div>

        <div className="divider">
          <span>Or continue with email</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group floating-group">
            <input 
              type="email" 
              id="email" 
              name="email"
              placeholder=" " 
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="email">Email Address</label>
            <Mail className="input-icon" size={18} />
          </div>

          <div className="form-group floating-group">
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              name="password"
              placeholder=" " 
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="password">Password</label>
            <Lock className="input-icon" size={18} />
            <button 
              type="button" 
              className="toggle-password" 
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="form-actions">
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Keep me logged in
            </label>
            
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-primary full-width submit-btn">
            Log In
          </button>

          <div className="login-footer">
            <p>Don't have an account? <Link to="/signup" className="signup-link">Create an account</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
