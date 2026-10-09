import React from 'react';
import { 
  CheckCircle, 
  MessageSquare, 
  Share2, 
  Settings,
  Trophy,
  DollarSign,
  Clock,
  User,
  Target,
  GraduationCap,
  Building2,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import './FounderProfile.css';

function FounderProfile() {
  const isOwner = true; // Simulating owner view

  return (
    <div className="profile-layout">
      <div className="profile-container">
        
        {/* Header & Identity Block */}
        <div className="profile-header-card animate-fade-in-up">
          <div className="avatar-container">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80" 
              alt="Mia Johnson" 
              className="profile-avatar"
            />
            <div className="online-indicator" title="Online"></div>
          </div>
          
          <h1 className="profile-name">
            Mia Johnson
            <span className="verified-badge">
              <CheckCircle className="verified-icon" />
              Verified Builder
            </span>
          </h1>
          
          <p className="profile-title">Founder & CEO at Veridant Systems</p>
          
          <div className="profile-cta-row">
            {isOwner ? (
              <>
                <button className="btn-profile-primary">
                  <Settings size={18} /> Edit Profile
                </button>
                <button className="btn-profile-outline">
                  <Share2 size={18} /> Share
                </button>
              </>
            ) : (
              <>
                <button className="btn-profile-primary">
                  <MessageSquare size={18} /> Connect
                </button>
                <button className="btn-profile-outline">
                  <Share2 size={18} /> Share
                </button>
              </>
            )}
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="stats-strip animate-fade-in-up delay-1">
          <div className="stat-badge">
            <div className="stat-icon-wrapper">
              <Trophy size={24} />
            </div>
            <div className="stat-info">
              <h4>3 Exits</h4>
              <p>Successful Acquisitions</p>
            </div>
          </div>
          <div className="stat-badge">
            <div className="stat-icon-wrapper">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <h4>$12M</h4>
              <p>Capital Raised</p>
            </div>
          </div>
          <div className="stat-badge">
            <div className="stat-icon-wrapper">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <h4>12 Years</h4>
              <p>Startup Experience</p>
            </div>
          </div>
        </div>

        {/* Short Bio */}
        <div className="profile-section animate-fade-in-up delay-2">
          <h2 className="section-title">
            <User className="section-icon" size={24} />
            About Me
          </h2>
          <p className="bio-text">
            I am a serial entrepreneur and product builder with over a decade of experience scaling B2B SaaS platforms. 
            My technical background combined with strong go-to-market strategies has led to three successful exits. 
            Currently, I am focused on democratizing clean energy data through Veridant Systems. I am deeply passionate 
            about climate tech, AI-driven automation, and mentoring early-stage female founders.
          </p>
        </div>

        {/* Current Focus Card */}
        <div className="profile-section current-focus-card animate-fade-in-up delay-2">
          <div className="focus-header">
            <div className="company-info">
              <h2 className="section-title" style={{marginBottom: '8px'}}>
                <Target className="section-icon" size={24} style={{color: '#2563EB'}} />
                Current Focus
              </h2>
              <h3>Veridant Systems</h3>
              <p className="company-role">Founder & CEO</p>
            </div>
            <span className="stage-badge">Series A</span>
          </div>
          
          <h4 className="milestones-title">Active Milestones</h4>
          <div className="milestones-list">
            <div className="milestone-item">
              <CheckCircle className="milestone-icon" size={18} />
              Closed $4.5M Seed round led by GreenVentures.
            </div>
            <div className="milestone-item">
              <CheckCircle className="milestone-icon" size={18} />
              Launched enterprise API beta with 5 early-adopter clients.
            </div>
            <div className="milestone-item" style={{color: '#94A3B8'}}>
              <div style={{width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #CBD5E1'}}></div>
              Currently hiring VP of Engineering and Head of Sales.
            </div>
          </div>
        </div>

        {/* Past Startup Experience Timeline */}
        <div className="profile-section animate-fade-in-up delay-3">
          <h2 className="section-title">
            <Briefcase className="section-icon" size={24} />
            Startup Experience
          </h2>
          
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-logo">
                <Building2 className="timeline-logo-icon" size={24} />
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <div className="timeline-title">
                    <h4>DataSync IO</h4>
                    <p>Co-Founder & CTO</p>
                  </div>
                  <span className="timeline-date">2018 - 2022</span>
                </div>
                <div className="timeline-details">
                  <span className="timeline-badge success">Acquired by Salesforce</span>
                  <span className="timeline-badge"><DollarSign size={14} /> $7.5M Raised</span>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-logo">
                <TrendingUp className="timeline-logo-icon" size={24} />
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <div className="timeline-title">
                    <h4>MetricFlow</h4>
                    <p>Founder</p>
                  </div>
                  <span className="timeline-date">2015 - 2018</span>
                </div>
                <div className="timeline-details">
                  <span className="timeline-badge success">Acquired by Stripe</span>
                  <span className="timeline-badge">YC W16</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="profile-section animate-fade-in-up delay-3">
          <h2 className="section-title">
            <GraduationCap className="section-icon" size={24} />
            Education
          </h2>
          
          <div className="education-list">
            <div className="education-item">
              <div className="education-icon">
                <GraduationCap size={24} />
              </div>
              <div className="education-details">
                <h4>Stanford University</h4>
                <p className="degree">Master of Science, Computer Science</p>
                <p className="year">2013 - 2015</p>
              </div>
            </div>
            
            <div className="education-item">
              <div className="education-icon">
                <GraduationCap size={24} />
              </div>
              <div className="education-details">
                <h4>University of California, Berkeley</h4>
                <p className="degree">Bachelor of Business Administration</p>
                <p className="year">2009 - 2013</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FounderProfile;
