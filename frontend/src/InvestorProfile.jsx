import React from 'react';
import { 
  CheckCircle, 
  MessageSquare, 
  UserPlus, 
  Lightbulb,
  MapPin,
  TrendingUp,
  Building,
  Briefcase,
  Users
} from 'lucide-react';
import './InvestorProfile.css';

function InvestorProfile() {
  const isOwner = false; // Simulating public view

  return (
    <div className="investor-profile-layout">
      <div className="profile-container">
        
        {/* Header & Identity Block */}
        <div className="profile-header-card">
          <div className="avatar-container">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80" 
              alt="Marcus Reynolds" 
              className="profile-avatar"
            />
          </div>
          
          <h1 className="profile-name">
            Marcus Reynolds
            <span className="verified-badge">
              <CheckCircle className="verified-icon" />
              Verified Investor
            </span>
          </h1>
          
          <div className="profile-meta">
            <div className="meta-item">
              <Briefcase size={18} />
              <span>Managing Partner at VentureScale</span>
            </div>
            <div className="meta-divider"></div>
            <div className="meta-item">
              <MapPin size={18} />
              <span>San Francisco, CA</span>
            </div>
          </div>
          
          <div className="profile-cta-row">
            <button className="btn-profile-primary">
              <MessageSquare size={18} /> Message
            </button>
            <button className="btn-profile-outline">
              <UserPlus size={18} /> Follow / Pitch
            </button>
          </div>
        </div>

        {/* Key Credibility Stats */}
        <div className="stats-strip">
          <div className="stat-badge">
            <div className="stat-info">
              <h4>42</h4>
              <p>Total Investments</p>
            </div>
          </div>
          <div className="stat-badge">
            <div className="stat-info">
              <h4>12</h4>
              <p>Exits</p>
            </div>
          </div>
          <div className="stat-badge">
            <div className="stat-info">
              <h4>8</h4>
              <p>Board Seats</p>
            </div>
          </div>
        </div>

        {/* Thesis & Parameters */}
        <div className="grid-2-col">
          {/* Investment Thesis Card */}
          <div className="profile-section">
            <div className="section-header-box">
              <div className="section-icon-box">
                <Lightbulb size={24} />
              </div>
              <h2 className="section-title">Investment Thesis</h2>
            </div>
            <p className="thesis-content">
              At VentureScale, we back highly technical founders building category-defining infrastructure, DevTools, and applied AI applications. We look for product-obsessed teams that have deep domain expertise and a clear, contrarian view on how their market will evolve over the next decade. 
              <br/><br/>
              We prefer to engage at the Seed or Series A stage, once there is early evidence of product-market fit or a passionate open-source community.
            </p>
          </div>

          {/* Capital Parameters & Check Size */}
          <div className="profile-section" style={{padding: '0'}}>
            <div className="check-size-card" style={{height: '100%', border: 'none', borderRadius: '16px'}}>
              <div className="check-size-title">Typical Check Size</div>
              <div className="check-size-value">$250K — $1.5M</div>
              <span className="participation-badge">Lead or Co-Lead Preferred</span>
            </div>
          </div>
        </div>

        {/* Focus Industries */}
        <div className="profile-section">
          <div className="section-header-box" style={{marginBottom: '20px'}}>
            <h2 className="section-title">Focus Industries</h2>
          </div>
          <div className="tag-cloud">
            <span className="industry-pill">DevTools</span>
            <span className="industry-pill">Cybersecurity</span>
            <span className="industry-pill">B2B SaaS</span>
            <span className="industry-pill">AI/ML</span>
            <span className="industry-pill">Cloud Infrastructure</span>
          </div>
        </div>

        {/* Portfolio Highlights */}
        <div className="profile-section">
          <div className="section-header-box">
            <h2 className="section-title">Portfolio Highlights</h2>
          </div>
          
          <div className="portfolio-grid">
            <div className="portfolio-card">
              <div className="portfolio-header">
                <div className="portfolio-logo">CS</div>
                <span className="portfolio-status">Series B</span>
              </div>
              <div className="portfolio-content">
                <h4>CloudScale</h4>
                <p>Serverless database infrastructure for edge applications.</p>
              </div>
            </div>

            <div className="portfolio-card">
              <div className="portfolio-header">
                <div className="portfolio-logo">NX</div>
                <span className="portfolio-status ipo">IPO</span>
              </div>
              <div className="portfolio-content">
                <h4>Nexus API</h4>
                <p>Unified data aggregation for fintech applications.</p>
              </div>
            </div>

            <div className="portfolio-card">
              <div className="portfolio-header">
                <div className="portfolio-logo">AH</div>
                <span className="portfolio-status">Acquired</span>
              </div>
              <div className="portfolio-content">
                <h4>Aura Health</h4>
                <p>AI-driven patient triage software for regional hospitals.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Experience */}
        <div className="profile-section">
          <div className="section-header-box">
            <h2 className="section-title">Professional Experience</h2>
          </div>
          
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-logo">
                <Building className="timeline-logo-icon" size={24} />
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <div className="timeline-title">
                    <h4>VentureScale</h4>
                    <p>Managing Partner</p>
                  </div>
                  <span className="timeline-date">2018 - Present</span>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-logo">
                <Users className="timeline-logo-icon" size={24} />
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <div className="timeline-title">
                    <h4>Accel Partners</h4>
                    <p>Principal</p>
                  </div>
                  <span className="timeline-date">2014 - 2018</span>
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
                    <h4>DataDog</h4>
                    <p>Early Engineer / Product Manager</p>
                  </div>
                  <span className="timeline-date">2010 - 2014</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default InvestorProfile;
