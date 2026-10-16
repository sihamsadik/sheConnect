import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FileText,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Building,
  DollarSign,
  User,
  Sparkles,
  RefreshCw,
  LogOut,
  Mail,
  ChevronDown
} from 'lucide-react';
import './InvestorDashboard.css';

function InvestorDashboard() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Live deals grouped by stage
  const [deals, setDeals] = useState({
    screening: [],
    diligence: [],
    partnerMeeting: [],
    termSheet: []
  });
  const [allDealsList, setAllDealsList] = useState([]);

  // Live stat metrics
  const [metrics, setMetrics] = useState({
    activeInboundDeals: 0,
    inActiveDiligence: 0,
    partnerMeetings: 0,
    totalDeployedOrCommitted: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState('');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState('');

  // Modals
  const [activeModalDeal, setActiveModalDeal] = useState(null);
  const [showLogDealModal, setShowLogDealModal] = useState(false);
  const [advancingDealId, setAdvancingDealId] = useState(null);

  // New deal form
  const [newDealForm, setNewDealForm] = useState({
    title: '',
    industry: 'Technology',
    pitch: '',
    ask: '$1.0M',
    founderName: '',
    founderEmail: ''
  });
  const [creatingDeal, setCreatingDeal] = useState(false);

  // Logged-in User
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
    fetchPipeline();
  }, []);

  const fetchPipeline = async () => {
    setError(null);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/investor/pipeline', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (!res.ok) {
        // Fallback to interactions ideas if pipeline endpoint encounters an error or permission differs
        try {
          const ideasRes = await fetch('/api/interactions/ideas', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          });
          if (ideasRes.ok) {
            const rawIdeas = await ideasRes.json();
            mapRawIdeasToPipeline(rawIdeas);
            return;
          }
        } catch (fbErr) {
          console.warn('Fallback to /api/interactions/ideas failed', fbErr);
        }
        throw new Error('Failed to load investor pipeline from backend');
      }

      const data = await res.json();
      
      const screening = data.dealsByStage?.screening || [];
      const diligence = data.dealsByStage?.diligence || [];
      const partnerMeeting = data.dealsByStage?.partnerMeeting || [];
      const termSheet = data.dealsByStage?.termSheet || [];

      setDeals({
        screening,
        diligence,
        partnerMeeting,
        termSheet
      });
      setAllDealsList(data.allDeals || []);

      setMetrics({
        activeInboundDeals: data.activeInboundDeals ?? screening.length,
        inActiveDiligence: data.inActiveDiligence ?? diligence.length,
        partnerMeetings: data.partnerMeetings ?? partnerMeeting.length,
        totalDeployedOrCommitted: (data.termSheetCount ?? termSheet.length)
      });

      setRecentActivity(data.recentActivity || []);
    } catch (err) {
      console.error('Error fetching pipeline:', err);
      setError(err.message || 'Could not load live pipeline');
      // Set empty clean deals
      setDeals({
        screening: [],
        diligence: [],
        partnerMeeting: [],
        termSheet: []
      });
      setAllDealsList([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const mapRawIdeasToPipeline = (ideas) => {
    if (!Array.isArray(ideas)) return;
    const mapped = ideas.map(i => ({
      id: i.id,
      startup: i.title || 'Untitled Startup',
      logo: (i.title || 'SC').substring(0, 2).toUpperCase(),
      pitch: i.problem || i.title,
      problem: i.problem,
      solution: i.solution,
      targetMarket: i.targetMarket,
      industry: i.industry || 'Technology',
      stage: 'SCREENING',
      stageClass: 'new',
      ask: 'Seed • Investor',
      founderName: i.user?.name || i.ideaAdmin?.name || 'Founder',
      founderEmail: i.user?.email || i.ideaAdmin?.email || '',
      founderInitials: ((i.user?.name || 'F').substring(0, 2)).toUpperCase(),
      likeCount: i.likeCount || 0,
      commentCount: i.commentCount || 0,
      likedByCurrentUser: !!i.likedByCurrentUser,
      interested: false
    }));

    setDeals({
      screening: mapped,
      diligence: [],
      partnerMeeting: [],
      termSheet: []
    });
    setAllDealsList(mapped);
    setMetrics({
      activeInboundDeals: mapped.length,
      inActiveDiligence: 0,
      partnerMeetings: 0,
      totalDeployedOrCommitted: 0
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPipeline();
  };

  const getNextStage = (currentStage) => {
    switch (currentStage?.toUpperCase()) {
      case 'SCREENING':
        return 'DILIGENCE';
      case 'DILIGENCE':
        return 'PARTNER_MEETING';
      case 'PARTNER_MEETING':
        return 'TERM_SHEET';
      default:
        return null;
    }
  };

  const getNextStageLabel = (currentStage) => {
    switch (currentStage?.toUpperCase()) {
      case 'SCREENING':
        return 'Start Diligence';
      case 'DILIGENCE':
        return 'Schedule Partner Meeting';
      case 'PARTNER_MEETING':
        return 'Issue Term Sheet';
      default:
        return 'Advance Stage';
    }
  };

  const handleAdvanceStage = async (deal) => {
    const nextStage = getNextStage(deal.stage);
    if (!nextStage) return;

    setAdvancingDealId(deal.id);
    const token = localStorage.getItem('token');

    // Optimistically update frontend state
    moveDealInState(deal.id, nextStage);

    try {
      const res = await fetch(`/api/investor/pipeline/${deal.id}/stage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          stage: nextStage,
          notes: `Moved to ${nextStage} stage on ${new Date().toLocaleDateString()}`
        })
      });

      if (!res.ok) {
        console.warn('Backend update failed, reverting optimistic move');
        fetchPipeline();
      } else {
        const updated = await res.json();
        // Sync modal if open
        if (activeModalDeal && activeModalDeal.id === deal.id) {
          setActiveModalDeal(prev => ({ ...prev, stage: updated.stage, stageClass: updated.stageClass }));
        }
      }
    } catch (err) {
      console.error('Error advancing stage:', err);
      fetchPipeline();
    } finally {
      setAdvancingDealId(null);
    }
  };

  const moveDealInState = (dealId, nextStage) => {
    const stageKeyMap = {
      'SCREENING': 'screening',
      'DILIGENCE': 'diligence',
      'PARTNER_MEETING': 'partnerMeeting',
      'TERM_SHEET': 'termSheet'
    };
    const targetKey = stageKeyMap[nextStage] || 'screening';

    let foundDeal = null;
    const newDeals = { ...deals };

    Object.keys(newDeals).forEach(col => {
      newDeals[col] = newDeals[col].filter(d => {
        if (d.id === dealId) {
          foundDeal = { 
            ...d, 
            stage: nextStage,
            stageClass: nextStage === 'TERM_SHEET' ? 'committed' : (nextStage === 'SCREENING' ? 'new' : 'reviewing')
          };
          return false;
        }
        return true;
      });
    });

    if (foundDeal && targetKey) {
      newDeals[targetKey] = [foundDeal, ...newDeals[targetKey]];
    }

    setDeals(newDeals);

    // Update metrics
    setMetrics({
      activeInboundDeals: newDeals.screening.length,
      inActiveDiligence: newDeals.diligence.length,
      partnerMeetings: newDeals.partnerMeeting.length,
      totalDeployedOrCommitted: newDeals.termSheet.length
    });
  };

  const handlePassDeal = async (deal) => {
    if (!window.confirm(`Are you sure you want to pass on "${deal.startup}"?`)) {
      return;
    }

    const token = localStorage.getItem('token');
    
    // Optimistically remove from all columns
    setDeals(prev => {
      const updated = {};
      Object.keys(prev).forEach(col => {
        updated[col] = prev[col].filter(d => d.id !== deal.id);
      });
      return updated;
    });
    setAllDealsList(prev => prev.filter(d => d.id !== deal.id));
    if (activeModalDeal && activeModalDeal.id === deal.id) {
      setActiveModalDeal(null);
    }

    try {
      await fetch(`/api/investor/pipeline/${deal.id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
    } catch (err) {
      console.error('Error passing deal:', err);
    }
  };

  const handleLogExternalDealSubmit = async (e) => {
    e.preventDefault();
    if (!newDealForm.title.trim()) return;

    setCreatingDeal(true);
    const token = localStorage.getItem('token');

    try {
      // 1. Create startup idea via entrepreneur/createstartup-ideas or local
      const res = await fetch('/api/entrepreneur/createstartup-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: newDealForm.title.trim(),
          industry: newDealForm.industry,
          problem: newDealForm.pitch.trim() || 'Logged external deal opportunity',
          solution: 'Proprietary technology / business solution',
          targetMarket: newDealForm.ask,
          lookingFor: ['INVESTOR']
        })
      });

      if (res.ok) {
        const createdIdea = await res.json();
        // Add to diligence or screening
        await fetch(`/api/investor/pipeline/${createdIdea.id}/stage`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ stage: 'SCREENING', notes: 'Logged manually by investor' })
        });
      }
      
      setShowLogDealModal(false);
      setNewDealForm({
        title: '',
        industry: 'Technology',
        pitch: '',
        ask: '$1.0M',
        founderName: '',
        founderEmail: ''
      });
      fetchPipeline();
    } catch (err) {
      console.error('Error logging external deal:', err);
    } finally {
      setCreatingDeal(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Filter helper
  const filterDeals = (dealArray) => {
    return dealArray.filter(deal => {
      const matchesSearch = !searchQuery.trim() || 
        deal.startup?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.pitch?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.founderName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector = !selectedSectorFilter || 
        deal.industry?.toLowerCase() === selectedSectorFilter.toLowerCase();

      const matchesStage = !selectedStageFilter || 
        deal.stage?.toLowerCase() === selectedStageFilter.toLowerCase();

      return matchesSearch && matchesSector && matchesStage;
    });
  };

  const filteredScreening = useMemo(() => filterDeals(deals.screening), [deals.screening, searchQuery, selectedSectorFilter, selectedStageFilter]);
  const filteredDiligence = useMemo(() => filterDeals(deals.diligence), [deals.diligence, searchQuery, selectedSectorFilter, selectedStageFilter]);
  const filteredPartnerMeeting = useMemo(() => filterDeals(deals.partnerMeeting), [deals.partnerMeeting, searchQuery, selectedSectorFilter, selectedStageFilter]);
  const filteredTermSheet = useMemo(() => filterDeals(deals.termSheet), [deals.termSheet, searchQuery, selectedSectorFilter, selectedStageFilter]);

  const allFilteredDeals = useMemo(() => {
    return [
      ...filteredScreening,
      ...filteredDiligence,
      ...filteredPartnerMeeting,
      ...filteredTermSheet
    ];
  }, [filteredScreening, filteredDiligence, filteredPartnerMeeting, filteredTermSheet]);

  const statMetrics = [
    { title: 'Active Inbound Deals', value: metrics.activeInboundDeals, icon: <Compass size={20} /> },
    { title: 'In Active Diligence', value: metrics.inActiveDiligence, icon: <FileText size={20} /> },
    { title: 'Partner Meetings', value: metrics.partnerMeetings, icon: <Calendar size={20} /> },
    { title: 'Term Sheet / Committed', value: metrics.totalDeployedOrCommitted, icon: <Briefcase size={20} /> },
  ];

  const userDisplayName = currentUser?.name || 'Investor Partner';
  const userInitials = (userDisplayName.split(' ').map(w => w[0]).join('') || 'IP').substring(0, 2).toUpperCase();

  return (
    <div className="investor-layout">
      {/* Sidebar */}
      <aside className="investor-sidebar">
        <div className="sidebar-logo">
          <Rocket className="sidebar-logo-icon" size={24} />
          <span>sheConnect</span>
        </div>
        
        <nav className="nav-links-sidebar">
          <Link to="/investor" className="sidebar-link active" onClick={fetchPipeline}>
            <div className="sidebar-link-content">
              <LayoutDashboard className="sidebar-icon" size={20} />
              <span>Deal Pipeline</span>
            </div>
          </Link>
          <Link to="/marketplace" className="sidebar-link">
            <div className="sidebar-link-content">
              <Compass className="sidebar-icon" size={20} />
              <span>Explore Startups</span>
            </div>
          </Link>
          <Link to="/investor-profile" className="sidebar-link">
            <div className="sidebar-link-content">
              <Briefcase className="sidebar-icon" size={20} />
              <span>Investor Profile</span>
            </div>
          </Link>
          <Link to="/marketplace" className="sidebar-link">
            <div className="sidebar-link-content">
              <MessageSquare className="sidebar-icon" size={20} />
              <span>Discussions</span>
            </div>
          </Link>
        </nav>

        <div className="investor-footer">
          <div className="investor-widget" onClick={() => navigate('/investor-profile')}>
            <div className="investor-avatar">
              {userInitials}
            </div>
            <div className="investor-info">
              <h5>{userDisplayName}</h5>
              <p>Active Investor</p>
            </div>
          </div>
          <button 
            className="btn-sidebar-logout" 
            onClick={handleLogout}
            title="Log Out"
          >
            <LogOut size={16} /> Log Out
          </button>
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
                placeholder="Search deals by startup, sector, founder..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            <select 
              className="filter-select"
              value={selectedStageFilter}
              onChange={(e) => setSelectedStageFilter(e.target.value)}
            >
              <option value="">All Pipeline Stages</option>
              <option value="screening">Screening</option>
              <option value="diligence">In Diligence</option>
              <option value="partner_meeting">Partner Meeting</option>
              <option value="term_sheet">Term Sheet</option>
            </select>
            
            <select 
              className="filter-select"
              value={selectedSectorFilter}
              onChange={(e) => setSelectedSectorFilter(e.target.value)}
            >
              <option value="">All Sectors</option>
              <option value="ai">AI / Machine Learning</option>
              <option value="fintech">FinTech</option>
              <option value="saas">B2B SaaS</option>
              <option value="healthtech">HealthTech</option>
              <option value="technology">Technology</option>
            </select>
          </div>
          
          <div className="header-actions">
            <button 
              className="notification-btn" 
              onClick={handleRefresh} 
              title="Refresh Pipeline"
              disabled={refreshing}
            >
              <RefreshCw size={18} className={refreshing ? 'spin-icon' : ''} />
            </button>
            <button 
              className="btn-primary-blue"
              onClick={() => setShowLogDealModal(true)}
            >
              <Plus size={18} />
              Log Deal
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
              <div>
                <h2 className="section-title">Deal Pipeline</h2>
                <p className="pipeline-subtitle">
                  {allFilteredDeals.length} active opportunities tracked across diligence phases
                </p>
              </div>
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

            {error && (
              <div className="pipeline-error-alert">
                <span>{error}</span>
                <button onClick={fetchPipeline} className="btn-retry">Retry</button>
              </div>
            )}

            {loading ? (
              <div className="pipeline-loading-container">
                <div className="spinner"></div>
                <p>Loading real deal flow and diligence pipeline...</p>
              </div>
            ) : (
              <>
                {/* Kanban Board */}
                {viewMode === 'kanban' && (
                  <div className="kanban-board">
                    {/* Screening Column */}
                    <div className="kanban-column">
                      <div className="column-header">
                        <span className="column-title">Screening</span>
                        <span className="column-count">{filteredScreening.length}</span>
                      </div>
                      {filteredScreening.length > 0 ? (
                        filteredScreening.map(deal => (
                          <DealCard 
                            key={deal.id} 
                            deal={deal} 
                            onAdvance={handleAdvanceStage}
                            onPass={handlePassDeal}
                            onOpenDetails={setActiveModalDeal}
                            isAdvancing={advancingDealId === deal.id}
                          />
                        ))
                      ) : (
                        <div className="empty-column-box">
                          <span>No deals in screening</span>
                        </div>
                      )}
                    </div>

                    {/* Diligence Column */}
                    <div className="kanban-column">
                      <div className="column-header">
                        <span className="column-title">In Diligence</span>
                        <span className="column-count">{filteredDiligence.length}</span>
                      </div>
                      {filteredDiligence.length > 0 ? (
                        filteredDiligence.map(deal => (
                          <DealCard 
                            key={deal.id} 
                            deal={deal} 
                            onAdvance={handleAdvanceStage}
                            onPass={handlePassDeal}
                            onOpenDetails={setActiveModalDeal}
                            isAdvancing={advancingDealId === deal.id}
                          />
                        ))
                      ) : (
                        <div className="empty-column-box">
                          <span>No deals in diligence</span>
                        </div>
                      )}
                    </div>

                    {/* Partner Meeting Column */}
                    <div className="kanban-column">
                      <div className="column-header">
                        <span className="column-title">Partner Meeting</span>
                        <span className="column-count">{filteredPartnerMeeting.length}</span>
                      </div>
                      {filteredPartnerMeeting.length > 0 ? (
                        filteredPartnerMeeting.map(deal => (
                          <DealCard 
                            key={deal.id} 
                            deal={deal} 
                            onAdvance={handleAdvanceStage}
                            onPass={handlePassDeal}
                            onOpenDetails={setActiveModalDeal}
                            isAdvancing={advancingDealId === deal.id}
                          />
                        ))
                      ) : (
                        <div className="empty-column-box">
                          <span>No partner meetings scheduled</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Term Sheet Column */}
                    <div className="kanban-column">
                      <div className="column-header">
                        <span className="column-title">Term Sheet</span>
                        <span className="column-count">{filteredTermSheet.length}</span>
                      </div>
                      {filteredTermSheet.length > 0 ? (
                        filteredTermSheet.map(deal => (
                          <DealCard 
                            key={deal.id} 
                            deal={deal} 
                            onAdvance={handleAdvanceStage}
                            onPass={handlePassDeal}
                            onOpenDetails={setActiveModalDeal}
                            isAdvancing={advancingDealId === deal.id}
                          />
                        ))
                      ) : (
                        <div className="empty-column-box highlight">
                          <span>Ready for term sheet offer</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* List View */}
                {viewMode === 'list' && (
                  <div className="list-view-container">
                    {allFilteredDeals.length > 0 ? (
                      <table className="deal-table">
                        <thead>
                          <tr>
                            <th>Startup</th>
                            <th>Industry</th>
                            <th>Current Stage</th>
                            <th>Target Ask</th>
                            <th>Founder</th>
                            <th className="text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allFilteredDeals.map(deal => (
                            <tr key={deal.id}>
                              <td>
                                <div className="table-startup-cell">
                                  <div className="startup-logo small">{deal.logo}</div>
                                  <div>
                                    <div className="table-startup-title">{deal.startup}</div>
                                    <div className="table-startup-pitch">{deal.pitch}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="industry-badge">{deal.industry}</span>
                              </td>
                              <td>
                                <span className={`stage-tag ${deal.stageClass || 'new'}`}>
                                  {deal.stage?.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="table-ask-cell">
                                {deal.ask}
                              </td>
                              <td>
                                <div className="table-founder-cell">
                                  <div className="founder-avatar-snippet">{deal.founderInitials}</div>
                                  <span>{deal.founderName}</span>
                                </div>
                              </td>
                              <td className="text-right">
                                <div className="table-actions-row">
                                  <button 
                                    className="btn-table-icon"
                                    onClick={() => setActiveModalDeal(deal)}
                                    title="View Full Details"
                                  >
                                    <FileText size={16} />
                                  </button>
                                  {getNextStage(deal.stage) && (
                                    <button 
                                      className="btn-table-action"
                                      onClick={() => handleAdvanceStage(deal)}
                                      disabled={advancingDealId === deal.id}
                                    >
                                      Advance <ArrowRight size={14} />
                                    </button>
                                  )}
                                  <button 
                                    className="btn-table-icon danger"
                                    onClick={() => handlePassDeal(deal)}
                                    title="Pass"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="empty-state-list">
                        <Compass size={40} className="empty-icon" />
                        <h3>No deals match your search criteria</h3>
                        <p>Try clearing filters or search for another sector or startup name.</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

          </div>

          {/* Right Rail / Quick Insight Panel */}
          <div className="right-rail">
            <div className="insight-card">
              <div className="insight-header">
                <h3>Active Diligence Focus</h3>
                <Calendar size={18} style={{color: '#94A3B8'}} />
              </div>
              <div className="schedule-list">
                {filteredDiligence.length > 0 || filteredPartnerMeeting.length > 0 ? (
                  [...filteredPartnerMeeting, ...filteredDiligence].slice(0, 4).map((d, idx) => (
                    <div key={d.id} className="schedule-item" onClick={() => setActiveModalDeal(d)}>
                      <div className="schedule-time">Phase {idx + 1}</div>
                      <div className="schedule-details">
                        <h5>{d.startup}</h5>
                        <p>{d.stage?.replace('_', ' ')} • {d.founderName}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-focus-deals">
                    <p>No active diligence deals right now. Advance screening deals to track them here.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-header">
                <h3>Pipeline Activity</h3>
                <MessageSquare size={18} style={{color: '#94A3B8'}} />
              </div>
              <div className="syndicate-list">
                {recentActivity.length > 0 ? (
                  recentActivity.map((act, i) => (
                    <div key={i} className="syndicate-item">
                      <div className="syndicate-avatar">{act.avatar || 'SC'}</div>
                      <div className="syndicate-content">
                        <p><strong>{act.startup}</strong>: {act.message}</p>
                        <span>Founder: {act.founder}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-focus-deals">
                    <p>Live pipeline updates will appear here as deals progress.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Deal Details Modal */}
      {activeModalDeal && (
        <div className="modal-backdrop" onClick={() => setActiveModalDeal(null)}>
          <div className="deal-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="deal-modal-header">
              <div className="deal-modal-title-box">
                <div className="startup-logo large">{activeModalDeal.logo}</div>
                <div>
                  <div className="deal-modal-top-meta">
                    <span className="industry-badge">{activeModalDeal.industry}</span>
                    <span className={`stage-tag ${activeModalDeal.stageClass || 'new'}`}>
                      {activeModalDeal.stage?.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="deal-modal-title">{activeModalDeal.startup}</h2>
                </div>
              </div>
              <button 
                className="btn-modal-close" 
                onClick={() => setActiveModalDeal(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="deal-modal-body">
              <div className="modal-section">
                <h4>Executive Pitch</h4>
                <p className="modal-text-content">{activeModalDeal.pitch}</p>
              </div>

              {activeModalDeal.problem && (
                <div className="modal-section">
                  <h4>The Problem</h4>
                  <p className="modal-text-content">{activeModalDeal.problem}</p>
                </div>
              )}

              {activeModalDeal.solution && (
                <div className="modal-section">
                  <h4>Proposed Solution</h4>
                  <p className="modal-text-content">{activeModalDeal.solution}</p>
                </div>
              )}

              <div className="modal-meta-grid">
                <div className="modal-meta-card">
                  <span className="meta-label">Target Ask</span>
                  <span className="meta-value">{activeModalDeal.ask}</span>
                </div>
                <div className="modal-meta-card">
                  <span className="meta-label">Lead Founder</span>
                  <span className="meta-value">{activeModalDeal.founderName}</span>
                </div>
                {activeModalDeal.founderEmail && (
                  <div className="modal-meta-card">
                    <span className="meta-label">Contact Email</span>
                    <a href={`mailto:${activeModalDeal.founderEmail}`} className="meta-email-link">
                      <Mail size={14} /> {activeModalDeal.founderEmail}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="deal-modal-footer">
              <button 
                className="btn-modal-pass"
                onClick={() => handlePassDeal(activeModalDeal)}
              >
                <X size={16} /> Pass on Deal
              </button>
              
              {getNextStage(activeModalDeal.stage) ? (
                <button 
                  className="btn-modal-advance"
                  onClick={() => handleAdvanceStage(activeModalDeal)}
                  disabled={advancingDealId === activeModalDeal.id}
                >
                  <ArrowRight size={16} />
                  {getNextStageLabel(activeModalDeal.stage)}
                </button>
              ) : (
                <span className="stage-completed-badge">
                  <Check size={16} /> Final Stage: Term Sheet
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Log External Deal Modal */}
      {showLogDealModal && (
        <div className="modal-backdrop" onClick={() => setShowLogDealModal(false)}>
          <div className="deal-modal-card log-deal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="deal-modal-header">
              <h3 className="deal-modal-title">Log Deal Opportunity</h3>
              <button className="btn-modal-close" onClick={() => setShowLogDealModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleLogExternalDealSubmit}>
              <div className="deal-modal-body">
                <div className="form-group">
                  <label className="form-label">Startup Title *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="e.g. HealthBridge AI"
                    value={newDealForm.title}
                    onChange={(e) => setNewDealForm({ ...newDealForm, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sector / Industry *</label>
                  <select 
                    className="form-select"
                    value={newDealForm.industry}
                    onChange={(e) => setNewDealForm({ ...newDealForm, industry: e.target.value })}
                  >
                    <option value="Technology">Technology</option>
                    <option value="FinTech">FinTech</option>
                    <option value="HealthTech">HealthTech</option>
                    <option value="AI">AI / Machine Learning</option>
                    <option value="B2B SaaS">B2B SaaS</option>
                    <option value="Web3">Web3</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Elevator Pitch / Problem *</label>
                  <textarea 
                    className="form-textarea" 
                    rows={3} 
                    required 
                    placeholder="Brief description of the market opportunity and problem solved..."
                    value={newDealForm.pitch}
                    onChange={(e) => setNewDealForm({ ...newDealForm, pitch: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Seeking Round / Ask</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. $1.5M Seed"
                    value={newDealForm.ask}
                    onChange={(e) => setNewDealForm({ ...newDealForm, ask: e.target.value })}
                  />
                </div>
              </div>

              <div className="deal-modal-footer">
                <button 
                  type="button" 
                  className="btn-modal-cancel" 
                  onClick={() => setShowLogDealModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-modal-submit"
                  disabled={creatingDeal}
                >
                  {creatingDeal ? 'Adding to Pipeline...' : 'Add to Screening'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function DealCard({ deal, onAdvance, onPass, onOpenDetails, isAdvancing }) {
  const getNextStage = (currentStage) => {
    switch (currentStage?.toUpperCase()) {
      case 'SCREENING': return 'DILIGENCE';
      case 'DILIGENCE': return 'PARTNER_MEETING';
      case 'PARTNER_MEETING': return 'TERM_SHEET';
      default: return null;
    }
  };

  const nextStage = getNextStage(deal.stage);

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
        <span className={`stage-tag ${deal.stageClass || 'new'}`}>
          {deal.stage?.replace('_', ' ')}
        </span>
      </div>
      
      <p className="elevator-pitch">{deal.pitch}</p>
      
      <div className="deal-meta">
        <div className="funding-ask">
          <span className="meta-label">Seeking</span>
          <span className="meta-value">{deal.ask}</span>
        </div>
        <div className="founder-avatar-snippet" title={`Founder: ${deal.founderName}`}>
          {deal.founderInitials}
        </div>
      </div>
      
      <div className="deal-actions">
        <button 
          className="btn-deal-action" 
          title="Pass on Deal"
          onClick={() => onPass(deal)}
        >
          <X size={16} />
        </button>
        <button 
          className="btn-deal-action" 
          title="View Full Details"
          onClick={() => onOpenDetails(deal)}
        >
          <FileText size={16} />
        </button>
        {nextStage ? (
          <button 
            className="btn-deal-action primary" 
            title={`Move to ${nextStage.replace('_', ' ')}`}
            onClick={() => onAdvance(deal)}
            disabled={isAdvancing}
          >
            <ArrowRight size={16} /> Advance
          </button>
        ) : (
          <span className="deal-action-committed">
            <Check size={14} /> Term Sheet
          </span>
        )}
      </div>
    </div>
  );
}

export default InvestorDashboard;
