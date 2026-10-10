import React from 'react';
import { 
  CheckCircle, 
  MessageSquare, 
  MapPin,
  TrendingUp,
  Building,
  Users,
  CalendarDays,
  Target,
  Award,
  Briefcase,
  Quote,
  Star
} from 'lucide-react';
import './AdvisorProfile.css';

function AdvisorProfile() {
  const isOwner = false; // Simulating public view

  return (
    <div className="advisor-profile-layout">
      <div className="profile-container">
        
        {/* Header & Identity Block */}
        <div className="profile-header-card">
          <div className="avatar-container">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80" 
              alt="Elena Patterson" 
              className="profile-avatar"
            />
          </div>
          
          <h1 className="profile-name">
            Elena Patterson
            <span className="verified-badge">
              <CheckCircle className="verified-icon" />
              Verified Advisor
            </span>
          </h1>
          
          <div className="profile-meta">
            <div className="meta-item">
              <Briefcase size={18} />
              <span>Former VP of Growth at TechCo · Advisor & Angel</span>
            </div>
            <div className="meta-divider"></div>
            <div className="meta-item">
              <MapPin size={18} />
              <span>Austin, TX</span>
            </div>
          </div>

          <div className="availability-pill">
            <div className="availability-dot"></div>
            Available for 1 new startup
          </div>
          
          <div className="profile-cta-row">
            <button className="btn-profile-primary">
              <CalendarDays size={18} /> Request Advisory
            </button>
            <button className="btn-profile-outline">
              <MessageSquare size={18} /> Message
            </button>
          </div>
        </div>

        {/* Key Credibility Stats */}
        <div className="stats-strip">
          <div className="stat-badge">
            <div className="stat-info">
              <h4>28</h4>
              <p>Startups Advised</p>
            </div>
          </div>
          <div className="stat-badge">
            <div className="stat-info">
              <h4>5</h4>
              <p>Exits Mentored</p>
            </div>
          </div>
          <div className="stat-badge">
            <div className="stat-info">
              <h4>15+</h4>
              <p>Years Operating Exp.</p>
            </div>
          </div>
        </div>

        {/* About & Advisory Approach */}
        <div className="profile-section approach-section">
          <div className="section-header-box">
            <div className="section-icon-box">
              <Target size={24} />
            </div>
            <h2 className="section-title">Advisory Approach</h2>
          </div>
          <div className="approach-content">
            <p>
              I partner with Seed and Series A founders to build scalable revenue engines and optimize organizational structures. Having taken two companies from $0 to $50M ARR as an early operator, I focus entirely on actionable, tactical execution rather than high-level theory.
            </p>
            <p>
              My standard advisory engagement involves bi-weekly 1-on-1 strategy sessions, asynchronous slack support for critical blockers, and direct introductions to my network of Series B+ investors when the time is right. I believe in rolling up my sleeves and reviewing pitch decks, compensation plans, and GTM playbooks directly with founders.
            </p>
          </div>
        </div>

        {/* Areas of Expertise */}
        <div className="profile-section">
          <div className="section-header-box" style={{marginBottom: '20px'}}>
            <h2 className="section-title">Areas of Expertise</h2>
          </div>
          <div className="tag-cloud">
            <span className="expertise-pill">B2B Sales Strategy</span>
            <span className="expertise-pill">Enterprise GTM</span>
            <span className="expertise-pill">Fundraising Pitch Decks</span>
            <span className="expertise-pill">Org Scaling & Hiring</span>
            <span className="expertise-pill">Pricing Models</span>
          </div>
        </div>

        {/* Executive Experience Timeline */}
        <div className="profile-section">
          <div className="section-header-box">
            <h2 className="section-title">Executive Experience</h2>
          </div>
          
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-logo">
                TC
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <div className="timeline-title">
                    <h4>TechCo (Acquired by Oracle)</h4>
                    <p>VP of Growth</p>
                  </div>
                  <span className="timeline-date">2018 - 2023</span>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-logo">
                <TrendingUp size={24} />
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <div className="timeline-title">
                    <h4>ScaleWorks</h4>
                    <p>Director of Enterprise Sales</p>
                  </div>
                  <span className="timeline-date">2014 - 2018</span>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-logo">
                <Building size={24} />
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <div className="timeline-title">
                    <h4>CloudMetrics</h4>
                    <p>Early Account Executive</p>
                  </div>
                  <span className="timeline-date">2010 - 2014</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mentored Startups & Testimonials */}
        <div className="profile-section">
          <div className="section-header-box">
            <h2 className="section-title">Mentorship Track Record</h2>
          </div>
          
          <div className="testimonial-grid">
            
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-company">
                  <div className="company-logo">AH</div>
                  <div className="company-info">
                    <h5>Aura Health</h5>
                    <span>HealthTech</span>
                  </div>
                </div>
                <div className="outcome-badge">Helped raise $4M Seed</div>
              </div>
              
              <div className="quote-content">
                <Quote size={20} className="quote-icon" />
                <div className="star-rating">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <p className="quote-text">
                  "Elena’s tactical advice on our enterprise pricing tier completely transformed our Seed narrative. She isn't just an advisor; she feels like an extension of our founding team. We closed our round 3x oversubscribed largely due to her network intros."
                </p>
                <div className="quote-author">
                  <div className="author-avatar">MJ</div>
                  <div className="author-info">
                    <p>Mia Johnson</p>
                    <span>Founder & CEO</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-company">
                  <div className="company-logo">FS</div>
                  <div className="company-info">
                    <h5>FinStream</h5>
                    <span>FinTech</span>
                  </div>
                </div>
                <div className="outcome-badge">Scaled from $0 to $1M ARR</div>
              </div>
              
              <div className="quote-content">
                <Quote size={20} className="quote-icon" />
                <div className="star-rating">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <p className="quote-text">
                  "We brought Elena on to help build our initial sales motion. Her frameworks for outbound prospecting and hiring our first Account Executive were invaluable. Highly recommend her to any technical founders who need GTM muscle."
                </p>
                <div className="quote-author">
                  <div className="author-avatar">AK</div>
                  <div className="author-info">
                    <p>Alex Kumar</p>
                    <span>Co-Founder</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AdvisorProfile;
