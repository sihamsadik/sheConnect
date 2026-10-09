import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Lightbulb, 
  Briefcase, 
  UserPlus, 
  MessageSquare, 
  TrendingUp, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import './LandingPage.css';
import { Link } from 'react-router-dom';

function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled glass-panel' : ''}`}>
        <div className="container nav-content">
          <div className="logo">
            <Rocket className="logo-icon" />
            <span>sheConnect</span>
          </div>
          
          <div className="nav-links desktop-only">
            <a href="#about" className="nav-link">About</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#success-stories" className="nav-link">Success Stories</a>
          </div>

          <div className="nav-actions desktop-only">
            <Link to="/login" className="btn btn-ghost">Log in</Link>
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
          </div>

          <button 
            className="mobile-menu-btn mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu glass-panel animate-fade-in-up">
            <a href="#about" className="mobile-nav-link">About</a>
            <a href="#pricing" className="mobile-nav-link">Pricing</a>
            <a href="#success-stories" className="mobile-nav-link">Success Stories</a>
            <div className="mobile-nav-actions">
              <Link to="/login" className="btn btn-ghost full-width">Log in</Link>
              <Link to="/signup" className="btn btn-primary full-width">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-background">
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
        </div>
        
        <div className="container hero-content">
          <div className="hero-text-section animate-fade-in-up">
            <span className="badge">Welcome to the future of collaboration</span>
            <h1 className="hero-title">
              Where Ideas Meet <br />
              <span className="gradient-text">Investment and Expertise</span>
            </h1>
            <p className="hero-description">
              The premier ecosystem platform connecting visionary entrepreneurs, 
              strategic investors, and seasoned advisors to build the next generation of startups.
            </p>
            
            <div className="role-selector">
              <p className="role-label">Choose your path:</p>
              <div className="role-buttons">
                <button className="btn-role btn-role-entrepreneur group">
                  <span className="role-icon-wrapper"><Lightbulb className="role-icon" /></span>
                  <span className="role-text">I am an Entrepreneur</span>
                  <ChevronRight className="role-arrow group-hover:translate-x-1" />
                </button>
                <button className="btn-role btn-role-investor group">
                  <span className="role-icon-wrapper"><TrendingUp className="role-icon" /></span>
                  <span className="role-text">I am an Investor</span>
                  <ChevronRight className="role-arrow group-hover:translate-x-1" />
                </button>
                <button className="btn-role btn-role-advisor group">
                  <span className="role-icon-wrapper"><Briefcase className="role-icon" /></span>
                  <span className="role-text">I am an Advisor</span>
                  <ChevronRight className="role-arrow group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="hero-visual animate-fade-in-up delay-2">
            <div className="glass-panel dashboard-preview">
              <div className="dashboard-header">
                <div className="dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
              </div>
              <div className="dashboard-body">
                <div className="mock-chart">
                  <div className="chart-bar h-60"></div>
                  <div className="chart-bar h-80"></div>
                  <div className="chart-bar h-40"></div>
                  <div className="chart-bar h-100 primary"></div>
                  <div className="chart-bar h-70"></div>
                </div>
                <div className="mock-cards">
                  <div className="mock-card"></div>
                  <div className="mock-card"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="section-header text-center animate-fade-in-up">
            <h2 className="section-title">3 Simple Steps to Success</h2>
            <p className="section-description">
              Join our ecosystem and accelerate your startup journey with our streamlined process.
            </p>
          </div>

          <div className="process-cards">
            {/* Step 1 */}
            <div className="process-card glass-panel animate-fade-in-up delay-1">
              <div className="step-number">01</div>
              <div className="icon-container">
                <UserPlus size={32} />
              </div>
              <h3 className="card-title">Create Profile</h3>
              <p className="card-description">
                Sign up and build a comprehensive profile highlighting your skills, goals, or investment thesis.
              </p>
            </div>

            {/* Step 2 */}
            <div className="process-card glass-panel animate-fade-in-up delay-2">
              <div className="step-number">02</div>
              <div className="icon-container primary">
                <MessageSquare size={32} />
              </div>
              <h3 className="card-title">Connect</h3>
              <p className="card-description">
                Use our intelligent matchmaking to discover and engage with the right partners for your venture.
              </p>
            </div>

            {/* Step 3 */}
            <div className="process-card glass-panel animate-fade-in-up delay-3">
              <div className="step-number">03</div>
              <div className="icon-container success">
                <TrendingUp size={32} />
              </div>
              <h3 className="card-title">Scale</h3>
              <p className="card-description">
                Collaborate securely, secure funding, get expert advice, and grow your startup to new heights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">
                <Rocket className="logo-icon" />
                <span>sheConnect</span>
              </div>
              <p className="footer-tagline">
                Empowering the next generation of startups through meaningful connections.
              </p>
            </div>
            
            <div className="footer-links">
              <h4>Platform</h4>
              <a href="#">Entrepreneurs</a>
              <a href="#">Investors</a>
              <a href="#">Advisors</a>
              <a href="#">Pricing</a>
            </div>
            
            <div className="footer-links">
              <h4>Resources</h4>
              <a href="#">Blog</a>
              <a href="#">Success Stories</a>
              <a href="#">Help Center</a>
              <a href="#">Guidelines</a>
            </div>
            
            <div className="footer-links">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} sheConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
