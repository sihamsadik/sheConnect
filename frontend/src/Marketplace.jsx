import React, { useState } from 'react';
import { 
  Search,
  Grid,
  List as ListIcon,
  X,
  Bookmark,
  MessageSquare,
  Clock,
  PieChart
} from 'lucide-react';
import './Marketplace.css';

function Marketplace() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const opportunities = [
    {
      id: 1,
      startup: 'Lumina Analytics',
      logo: 'LA',
      stage: 'Seed',
      expertise: 'Looking for GTM Advisor',
      summary: 'We provide predictive foot-traffic analytics for brick-and-mortar retail.',
      problem: 'We have strong organic traction but lack a scalable outbound enterprise sales motion.',
      founder: 'Sarah Jenkins',
      founderInitials: 'SJ',
      commitment: '2 hrs / month',
      compensation: 'Advisory Equity 0.5%'
    },
    {
      id: 2,
      startup: 'Nexus API',
      logo: 'NX',
      stage: 'Series A',
      expertise: 'Looking for Technical Architecture',
      summary: 'Unified data aggregation layer for decentralized identity verification.',
      problem: 'Need guidance on scaling our open-source developer community and DevRel strategy.',
      founder: 'Marcus Reynolds',
      founderInitials: 'MR',
      commitment: 'Ad-hoc / Hourly',
      compensation: 'Retainer'
    },
    {
      id: 3,
      startup: 'EcoLogistics',
      logo: 'EL',
      stage: 'Pre-seed',
      expertise: 'Looking for Fundraising Prep',
      summary: 'Carbon-neutral supply chain optimization software for mid-market logistics.',
      problem: 'Preparing for our Seed round in Q3; need feedback on narrative and pitch deck.',
      founder: 'David Chen',
      founderInitials: 'DC',
      commitment: '1 hr / week',
      compensation: 'Pro Bono (Introductory)'
    }
  ];

  return (
    <div className="marketplace-layout">
      
      {/* Header & Search Strip */}
      <header className="marketplace-header">
        <div className="header-content">
          <h1 className="marketplace-title">Mentorship Marketplace</h1>
          <p className="marketplace-subtitle">Discover startups seeking your domain expertise.</p>
          
          <div className="search-strip">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                className="marketplace-search" 
                placeholder="Search startups, industries, or required expertise..." 
              />
            </div>
            
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid size={20} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <ListIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filter & Tag Bar */}
      <div className="filter-bar-container">
        <div className="filter-bar">
          <select className="filter-dropdown">
            <option value="">Industry Vertical</option>
            <option value="b2b">B2B SaaS</option>
            <option value="fintech">FinTech</option>
            <option value="healthtech">HealthTech</option>
            <option value="ai">AI / ML</option>
          </select>
          
          <select className="filter-dropdown">
            <option value="">Expertise Needed</option>
            <option value="gtm">GTM & Sales</option>
            <option value="product">Product Strategy</option>
            <option value="fundraising">Fundraising Prep</option>
            <option value="technical">Technical Architecture</option>
          </select>

          <select className="filter-dropdown">
            <option value="">Funding Stage</option>
            <option value="pre-seed">Pre-seed</option>
            <option value="seed">Seed</option>
            <option value="series-a">Series A</option>
          </select>

          <select className="filter-dropdown">
            <option value="">Engagement Type</option>
            <option value="advisory-board">Advisory Board</option>
            <option value="1on1">1-on-1 Mentorship</option>
          </select>

          <button className="reset-filter-btn">
            <X size={16} /> Clear Filters
          </button>
        </div>
      </div>

      {/* Opportunity Cards Grid */}
      <div className="marketplace-grid-container">
        <div className={`opportunity-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
          
          {opportunities.map(opp => (
            <div key={opp.id} className="opportunity-card">
              
              <div className="card-header">
                <div className="startup-logo">{opp.logo}</div>
                <div className="startup-info">
                  <div className="startup-name-row">
                    <h3 className="startup-name">{opp.startup}</h3>
                    <span className="stage-pill">{opp.stage}</span>
                  </div>
                </div>
              </div>

              <span className="seeking-badge">{opp.expertise}</span>
              
              <p className="elevator-summary">
                {opp.summary}
                <strong>Specific Challenge:</strong>
                {opp.problem}
              </p>

              <div className="founder-snippet">
                <div className="founder-snippet-avatar">{opp.founderInitials}</div>
                <div className="founder-snippet-info">
                  <p>{opp.founder}</p>
                  <span>Founder</span>
                </div>
              </div>

              <div className="terms-row">
                <span className="commitment-badge">
                  <Clock size={14} /> {opp.commitment}
                </span>
                <span className="commitment-badge">
                  <PieChart size={14} /> {opp.compensation}
                </span>
              </div>

              <div className="card-actions">
                <button className="btn-bookmark" title="Save for later">
                  <Bookmark size={20} />
                </button>
                <button className="btn-offer-mentorship">
                  <MessageSquare size={18} /> Offer Mentorship
                </button>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default Marketplace;
