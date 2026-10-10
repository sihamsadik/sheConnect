import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, 
  LayoutDashboard, 
  Compass, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  Search, 
  Bell, 
  Plus, 
  Filter,
  Kanban,
  List,
  Calendar,
  X,
  Check,
  FileText
} from 'lucide-react';
import './InvestorDashboard.css';

function InvestorDashboard() {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'

  const statMetrics = [
    { title: 'Active Inbound Deals', value: '24', icon: <Compass size={20} /> },
    { title: 'In Active Diligence', value: '7', icon: <FileText size={20} /> },
    { title: 'Total Deployed', value: '$4.2M', icon: <Briefcase size={20} /> },
    { title: 'Upcoming Founder Calls', value: '3', icon: <Calendar size={20} /> },
  ];

  const deals = {
    screening: [
      {
        id: 1,
        startup: 'Aura Health',
        logo: 'AH',
        pitch: 'AI-driven personalized mental wellness platform for enterprise teams.',
        industry: 'HealthTech',
        stage: 'New',
        stageClass: 'new',
        ask: '$1.5M',
        founderInitials: 'JD'
      },
      {
        id: 2,
        startup: 'FinStream',
        logo: 'FS',
        pitch: 'Cross-border B2B payment rails for emerging markets.',
        industry: 'FinTech',
        stage: 'Reviewing',
        stageClass: 'reviewing',
        ask: '$2.0M',
        founderInitials: 'AK'
      }
    ],
    diligence: [
      {
        id: 3,
        startup: 'Nexus API',
        logo: 'NX',
        pitch: 'Unified API layer for decentralized identity verification.',
        industry: 'Web3',
        stage: 'Diligence',
        stageClass: 'new',
        ask: '$3.5M',
        founderInitials: 'MR'
      }
    ],
    partnerMeeting: [
      {
        id: 4,
        startup: 'EcoLogistics',
        logo: 'EL',
        pitch: 'Carbon-neutral supply chain optimization software.',
        industry: 'B2B SaaS',
        stage: 'Committed',
        stageClass: 'committed',
        ask: '$800K',
        founderInitials: 'SL'
      }
    ]
  };

  return (
    <div className="investor-layout">
      {/* Sidebar */}
      <aside className="investor-sidebar">
        <div className="sidebar-logo">
          <Rocket className="sidebar-logo-icon" size={24} />
          <span>sheConnect</span>
        </div>
        
        <nav className="nav-links-sidebar">
          <Link to="/investor" className="sidebar-link active">
            <div className="sidebar-link-content">
              <LayoutDashboard className="sidebar-icon" size={20} />
              <span>Pipeline</span>
            </div>
          </Link>
          <Link to="#" className="sidebar-link">
            <div className="sidebar-link-content">
              <Compass className="sidebar-icon" size={20} />
              <span>Explore Startups</span>
            </div>
          </Link>
          <Link to="#" className="sidebar-link">
            <div className="sidebar-link-content">
              <Briefcase className="sidebar-icon" size={20} />
              <span>Portfolio</span>
            </div>
          </Link>
          <Link to="#" className="sidebar-link">
            <div className="sidebar-link-content">
              <MessageSquare className="sidebar-icon" size={20} />
              <span>Messages</span>
            </div>
            <span className="badge-count">12</span>
          </Link>
          <Link to="#" className="sidebar-link">
            <div className="sidebar-link-content">
              <Settings className="sidebar-icon" size={20} />
              <span>Settings</span>
            </div>
          </Link>
        </nav>

        <div className="investor-footer">
          <div className="investor-widget">
            <div className="investor-avatar">
              VC
            </div>
            <div className="investor-info">
              <h5>Victoria Chen</h5>
              <p>Partner, BlueSky Capital</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="investor-header">
          <div className="header-filters">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search by startup, sector, founder..." 
              />
            </div>
            
            <select className="filter-select">
              <option value="">All Stages</option>
              <option value="pre-seed">Pre-Seed</option>
              <option value="seed">Seed</option>
              <option value="series-a">Series A</option>
            </select>
            
            <select className="filter-select">
              <option value="">All Sectors</option>
              <option value="ai">AI</option>
              <option value="fintech">FinTech</option>
              <option value="saas">B2B SaaS</option>
              <option value="health">HealthTech</option>
            </select>
          </div>
          
          <div className="header-actions">
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>
            <button className="btn-primary-blue">
              <Plus size={18} />
              Log External Deal
            </button>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="content-scroll">
          <div className="main-column">
            {/* Stat Cards Row */}
            <div className="stat-grid">
              {statMetrics.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-title">
                    <span>{stat.title}</span>
                    <div className="stat-icon">{stat.icon}</div>
                  </div>
                  <div className="stat-value">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Pipeline Header */}
            <div className="pipeline-header">
              <h2 className="section-title">Deal Pipeline</h2>
              <div className="view-switcher">
                <button 
                  className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                  onClick={() => setViewMode('kanban')}
                >
                  <Kanban size={16} /> Kanban
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={16} /> List
                </button>
              </div>
            </div>

            {/* Kanban Board */}
            {viewMode === 'kanban' && (
              <div className="kanban-board">
                {/* Screening Column */}
                <div className="kanban-column">
                  <div className="column-header">
                    <span className="column-title">Screening</span>
                    <span className="column-count">2</span>
                  </div>
                  {deals.screening.map(deal => <DealCard key={deal.id} deal={deal} />)}
                </div>

                {/* Diligence Column */}
                <div className="kanban-column">
                  <div className="column-header">
                    <span className="column-title">In Diligence</span>
                    <span className="column-count">1</span>
                  </div>
                  {deals.diligence.map(deal => <DealCard key={deal.id} deal={deal} />)}
                </div>

                {/* Partner Meeting Column */}
                <div className="kanban-column">
                  <div className="column-header">
                    <span className="column-title">Partner Meeting</span>
                    <span className="column-count">1</span>
                  </div>
                  {deals.partnerMeeting.map(deal => <DealCard key={deal.id} deal={deal} />)}
                </div>
                
                {/* Term Sheet Column */}
                <div className="kanban-column">
                  <div className="column-header">
                    <span className="column-title">Term Sheet</span>
                    <span className="column-count">0</span>
                  </div>
                  {/* Empty state for demo */}
                  <div style={{border: '2px dashed #E2E8F0', borderRadius: '12px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '0.9rem'}}>
                    Drop deals here
                  </div>
                </div>
              </div>
            )}
            
            {viewMode === 'list' && (
              <div style={{padding: '40px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', color: '#64748B'}}>
                List view component (placeholder)
              </div>
            )}

          </div>

          {/* Right Rail / Quick Insight Panel */}
          <div className="right-rail">
            <div className="insight-card">
              <div className="insight-header">
                <h3>Today's Calls</h3>
                <Calendar size={18} style={{color: '#94A3B8'}} />
              </div>
              <div className="schedule-list">
                <div className="schedule-item">
                  <div className="schedule-time">10:00 AM</div>
                  <div className="schedule-details">
                    <h5>Aura Health</h5>
                    <p>Initial Screening (JD)</p>
                  </div>
                </div>
                <div className="schedule-item">
                  <div className="schedule-time">1:30 PM</div>
                  <div className="schedule-details">
                    <h5>EcoLogistics</h5>
                    <p>Partner Review prep</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-header">
                <h3>Syndicate Updates</h3>
                <MessageSquare size={18} style={{color: '#94A3B8'}} />
              </div>
              <div className="syndicate-list">
                <div className="syndicate-item">
                  <div className="syndicate-avatar">AL</div>
                  <div className="syndicate-content">
                    <p><strong>Alex L.</strong> added a diligence note on <strong>Nexus API</strong>.</p>
                    <span>1 hour ago</span>
                  </div>
                </div>
                <div className="syndicate-item">
                  <div className="syndicate-avatar">RJ</div>
                  <div className="syndicate-content">
                    <p><strong>Ryan J.</strong> passed on <strong>CloudScale</strong>.</p>
                    <span>3 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function DealCard({ deal }) {
  return (
    <div className="deal-card">
      <div className="deal-card-header">
        <div className="deal-info">
          <div className="startup-logo">{deal.logo}</div>
          <div>
            <h4 className="deal-title">{deal.startup}</h4>
            <span className="industry-badge">{deal.industry}</span>
          </div>
        </div>
        <span className={`stage-tag ${deal.stageClass}`}>{deal.stage}</span>
      </div>
      
      <p className="elevator-pitch">{deal.pitch}</p>
      
      <div className="deal-meta">
        <div className="funding-ask">
          <span className="meta-label">Seeking</span>
          <span className="meta-value">{deal.ask}</span>
        </div>
        <div className="founder-avatar-snippet" title="Founder">
          {deal.founderInitials}
        </div>
      </div>
      
      <div className="deal-actions">
        <button className="btn-deal-action" title="Pass">
          <X size={16} />
        </button>
        <button className="btn-deal-action" title="Request Deck">
          <FileText size={16} />
        </button>
        <button className="btn-deal-action primary" title="Schedule Call">
          <Calendar size={16} /> Call
        </button>
      </div>
    </div>
  );
}

export default InvestorDashboard;
