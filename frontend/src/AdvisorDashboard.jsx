import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket,
  LayoutDashboard,
  Globe,
  Users,
  MessageSquare,
  Settings,
  Search,
  Bell,
  Calendar,
  Clock,
  Inbox,
  Video,
  FileText,
  Target,
  ChevronRight,
  Loader2,
  AlertCircle,
  Lightbulb,
  Bookmark,
  Heart,
  X,
  Send,
  Filter,
  TrendingUp,
  User,
  Sparkles,
  Eye
} from 'lucide-react';
import './AdvisorDashboard.css';

const API_BASE = '/api/advisor';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---- Helper: activity icon by type ----
function ActivityIcon({ type }) {
  if (type === 'milestone') return <Target size={16} />;
  if (type === 'document') return <FileText size={16} />;
  return <ChevronRight size={16} />;
}

// ---- Startup Idea Card ----
function IdeaCard({ idea, onOfferMentorship, offeringId, onOpenDetail }) {
  const needsAdvisor = idea.needsAdvisor;
  return (
    <div
      className={`idea-card ${needsAdvisor ? 'idea-card--priority' : ''}`}
      onClick={() => onOpenDetail(idea)}
    >
      {needsAdvisor && (
        <div className="idea-priority-ribbon">
          <Sparkles size={12} /> Seeking Advisor
        </div>
      )}
      <div className="idea-card-header">
        <div className="idea-logo">{idea.logo}</div>
        <div className="idea-header-info">
          <h4 className="idea-title">{idea.title}</h4>
          <span className="idea-industry-pill">{idea.industry}</span>
        </div>
      </div>

      <p className="idea-summary">{idea.summary}</p>

      {idea.lookingFor && idea.lookingFor.length > 0 && (
        <div className="idea-looking-for">
          <span className="looking-for-label">Looking for:</span>
          {idea.lookingFor.map((tag, i) => (
            <span key={i} className="looking-for-tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="idea-footer">
        <div className="idea-founder">
          <div className="idea-founder-avatar">{idea.founderInitials}</div>
          <span className="idea-founder-name">{idea.founder}</span>
        </div>
        <div className="idea-card-actions">
          <button
            className="idea-action-btn idea-action-btn--view"
            onClick={(e) => { e.stopPropagation(); onOpenDetail(idea); }}
            title="View details"
          >
            <Eye size={15} />
          </button>
          <button
            className={`idea-action-btn idea-action-btn--mentor ${idea.mentorshipOffered ? 'offered' : ''}`}
            disabled={offeringId === idea.id || idea.mentorshipOffered}
            onClick={(e) => { e.stopPropagation(); onOfferMentorship(idea); }}
            title={idea.mentorshipOffered ? 'Mentorship offered' : 'Offer mentorship'}
          >
            {offeringId === idea.id ? (
              <Loader2 size={15} className="spin" />
            ) : (
              <Bookmark size={15} />
            )}
            {idea.mentorshipOffered ? 'Offered' : 'Offer'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdvisorDashboard() {
  const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'ideas'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // ---- Ideas section state ----
  const [ideasTab, setIdeasTab] = useState('needs-advisor'); // 'needs-advisor' | 'explore'
  const [ideas, setIdeas] = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [ideasError, setIdeasError] = useState(null);
  const [ideaSearch, setIdeaSearch] = useState('');
  const [ideaIndustry, setIdeaIndustry] = useState('');
  const [offeringId, setOfferingId] = useState(null);
  const [offerNotice, setOfferNotice] = useState(null);

  // ---- Idea detail modal ----
  const [activeIdea, setActiveIdea] = useState(null);
  const [modalComments, setModalComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/dashboard`, {
        headers: { ...getAuthHeaders() }
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchIdeas = useCallback(async () => {
    setIdeasLoading(true);
    setIdeasError(null);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/interactions/ideas', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || `Server error: ${res.status}`);
      }

      const raw = await res.json();

      if (!Array.isArray(raw)) {
        throw new Error('Unexpected response format from server.');
      }

      const mapped = raw.map(idea => {
        const lookingFor = Array.isArray(idea.lookingFor) ? idea.lookingFor : [];
        // Detect if this idea specifically needs an advisor/mentor
        const needsAdvisor = lookingFor.some(
          tag => tag.toLowerCase().includes('advis') || tag.toLowerCase().includes('mentor')
        );

        // Resolve founder name: user or ideaAdmin (both are LoginResponse objects from backend)
        const founderName =
          idea.user?.name ||
          idea.ideaAdmin?.name ||
          'Verified Founder';

        const founderInitials = founderName
          .split(' ')
          .map(n => n[0] || '')
          .join('')
          .substring(0, 2)
          .toUpperCase() || 'VF';

        return {
          id: idea.id,
          title: idea.title || 'Untitled Idea',
          logo: (idea.title || 'SC').substring(0, 2).toUpperCase(),
          industry: idea.industry || 'General',
          summary: idea.description || idea.solution || 'No description provided.',
          problem: idea.problem || '',
          solution: idea.solution || '',
          lookingFor,
          needsAdvisor,
          founder: founderName,
          founderInitials,
          likeCount: idea.likeCount || 0,
          likedByCurrentUser: !!idea.likedByCurrentUser,
          commentCount: idea.commentCount || 0,
          mentorshipOffered: false
        };
      });

      setIdeas(mapped);
    } catch (err) {
      console.error('Failed to load startup ideas:', err);
      setIdeasError(err.message || 'Could not load startup ideas. Please ensure the server is running.');
    } finally {
      setIdeasLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (activeSection === 'ideas') {
      fetchIdeas();
    }
  }, [activeSection, fetchIdeas]);

  const handleRequest = async (id, action) => {
    setActionLoading(id + action);
    try {
      const res = await fetch(`${API_BASE}/requests/${id}/${action}`, {
        method: 'POST',
        headers: { ...getAuthHeaders() }
      });
      if (!res.ok) throw new Error('Action failed');
      await fetchDashboard();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleOfferMentorship = async (idea) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setOfferNotice({ type: 'error', text: 'Please log in as an advisor to offer mentorship.' });
      return;
    }
    setOfferingId(idea.id);
    setOfferNotice(null);
    try {
      const res = await fetch(`/api/interactions/startup-ideas/${idea.id}/mentorship-offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: `I would like to offer mentorship to ${idea.title}.` })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || 'Could not save mentorship offer.');
      }
      setIdeas(prev => prev.map(i => i.id === idea.id ? { ...i, mentorshipOffered: true } : i));
      if (activeIdea?.id === idea.id) setActiveIdea(prev => ({ ...prev, mentorshipOffered: true }));
      setOfferNotice({ type: 'success', text: `Mentorship offer sent to ${idea.title}! It appears in your active mentorships.` });
    } catch (err) {
      setOfferNotice({ type: 'error', text: err.message || 'Could not save mentorship offer.' });
    } finally {
      setOfferingId(null);
    }
  };

  const handleOpenDetail = async (idea) => {
    setActiveIdea(idea);
    setCommentText('');
    setCommentError(null);
    setLoadingComments(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/interactions/startup-ideas/${idea.id}/comments`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setModalComments(Array.isArray(data) ? data : []);
      } else {
        setModalComments([]);
      }
    } catch {
      setModalComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCloseDetail = () => {
    setActiveIdea(null);
    setModalComments([]);
    setCommentText('');
    setCommentError(null);
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !activeIdea) return;
    const token = localStorage.getItem('token');
    if (!token) { setCommentError('Please log in to post advisory notes.'); return; }
    setPostingComment(true);
    setCommentError(null);
    try {
      const res = await fetch(`/api/interactions/startup-ideas/${activeIdea.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: commentText.trim() })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || 'Failed to post comment.');
      }
      const created = await res.json();
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const formatted = {
        id: created.id || Date.now(),
        content: created.content || commentText.trim(),
        authorName: created.authorName || currentUser?.name || 'Advisor',
        authorRole: created.authorRole || 'ADVISOR',
        createdAt: created.createdAt || new Date().toISOString()
      };
      setModalComments(prev => [formatted, ...prev]);
      setCommentText('');
      setIdeas(prev => prev.map(i => i.id === activeIdea.id ? { ...i, commentCount: i.commentCount + 1 } : i));
    } catch (err) {
      setCommentError(err.message || 'Failed to post comment.');
    } finally {
      setPostingComment(false);
    }
  };

  // ---- Filtered ideas ----
  const displayedIdeas = ideas.filter(idea => {
    const matchesSearch = !ideaSearch ||
      idea.title.toLowerCase().includes(ideaSearch.toLowerCase()) ||
      idea.summary.toLowerCase().includes(ideaSearch.toLowerCase()) ||
      idea.industry.toLowerCase().includes(ideaSearch.toLowerCase());
    const matchesIndustry = !ideaIndustry || idea.industry.toLowerCase() === ideaIndustry.toLowerCase();
    const matchesTab = ideasTab === 'explore' || idea.needsAdvisor;
    return matchesSearch && matchesIndustry && matchesTab;
  });

  const needsAdvisorCount = ideas.filter(i => i.needsAdvisor).length;

  // ---- Stat metrics ----
  const statMetrics = data ? [
    { title: 'Active Mentees / Startups', value: data.activeMentees, icon: <Users size={20} /> },
    { title: 'Advisory Hours (Month)', value: data.advisoryHoursThisMonth, icon: <Clock size={20} /> },
    { title: 'Pending Requests', value: data.pendingRequests, icon: <Inbox size={20} /> },
    { title: 'Upcoming Sessions', value: data.upcomingSessionsCount, icon: <Calendar size={20} /> },
  ] : [];

  return (
    <div className="advisor-layout">
      {/* Sidebar */}
      <aside className="advisor-sidebar">
        <div className="sidebar-logo">
          <Rocket className="sidebar-logo-icon" size={24} />
          <span>sheConnect</span>
        </div>

        <nav className="nav-links-sidebar">
          <button
            className={`sidebar-link ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <div className="sidebar-link-content">
              <LayoutDashboard className="sidebar-icon" size={20} />
              <span>Overview</span>
            </div>
          </button>
          <button
            className={`sidebar-link ${activeSection === 'ideas' ? 'active' : ''}`}
            onClick={() => setActiveSection('ideas')}
          >
            <div className="sidebar-link-content">
              <Lightbulb className="sidebar-icon" size={20} />
              <span>Startup Ideas</span>
            </div>
            {needsAdvisorCount > 0 && (
              <span className="badge-count">{needsAdvisorCount}</span>
            )}
          </button>
          <Link to="#" className="sidebar-link">
            <div className="sidebar-link-content">
              <Globe className="sidebar-icon" size={20} />
              <span>Marketplace</span>
            </div>
          </Link>
          <Link to="#" className="sidebar-link">
            <div className="sidebar-link-content">
              <Users className="sidebar-icon" size={20} />
              <span>My Mentees</span>
            </div>
          </Link>
          <Link to="#" className="sidebar-link">
            <div className="sidebar-link-content">
              <MessageSquare className="sidebar-icon" size={20} />
              <span>Messages</span>
            </div>
            <span className="badge-count">5</span>
          </Link>
          <Link to="#" className="sidebar-link">
            <div className="sidebar-link-content">
              <Settings className="sidebar-icon" size={20} />
              <span>Settings</span>
            </div>
          </Link>
        </nav>

        <div className="advisor-footer">
          <div className="advisor-widget">
            <div className="advisor-profile-snippet">
              <div className="advisor-avatar">
                {data ? data.advisorInitials : '??'}
              </div>
              <div className="advisor-info">
                <h5>{data ? data.advisorName : '—'}</h5>
                <p>{data ? data.advisorTitle : '—'}</p>
              </div>
            </div>
            <div className="advisor-status-toggle">
              <span>Accepting Startups</span>
              <div className="status-indicator">
                <div className={`status-dot ${data?.acceptingStartups ? '' : 'inactive'}`}></div>
                {data?.acceptingStartups ? 'Active' : 'Paused'}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="advisor-header">
          <div className="header-search">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search mentees, startups, topics..."
              />
            </div>
          </div>

          <div className="header-actions">
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>
            <button className="btn-primary-blue">
              <Calendar size={18} />
              Update Availability
            </button>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="content-scroll">

          {/* ============ OVERVIEW SECTION ============ */}
          {activeSection === 'overview' && (
            <>
              {loading && (
                <div className="advisor-loading">
                  <Loader2 size={32} className="spin" />
                  <p>Loading your dashboard…</p>
                </div>
              )}

              {error && !loading && (
                <div className="advisor-error">
                  <AlertCircle size={24} />
                  <p>Failed to load dashboard: {error}</p>
                  <button className="btn-primary-blue" onClick={fetchDashboard}>Retry</button>
                </div>
              )}

              {data && !loading && (
                <>
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

                  {/* Main Two-Column Grid */}
                  <div className="dashboard-grid">
                    {/* Left Column (65%) */}
                    <div className="grid-left">
                      {/* Upcoming Advisory Sessions */}
                      <div className="section-card">
                        <div className="section-header">
                          <h3>Upcoming Advisory Sessions</h3>
                        </div>
                        <div className="session-list">
                          {data.upcomingSessions && data.upcomingSessions.length > 0 ? (
                            data.upcomingSessions.map(session => (
                              <div key={session.id} className="session-card">
                                <div className="session-time-badge">
                                  <span className="session-day">{session.day}</span>
                                  <span className="session-time">{session.time}</span>
                                </div>
                                <div className="session-details">
                                  <div className="session-founder">
                                    <div className="founder-avatar">{session.founder.charAt(0)}</div>
                                    <span className="founder-name">{session.founder}</span>
                                    <span className="session-startup">• {session.startup}</span>
                                  </div>
                                  <div className="session-agenda">{session.agenda}</div>
                                </div>
                                <div className="session-actions">
                                  <button className="btn-join">
                                    <Video size={16} /> Join Meeting
                                  </button>
                                  <button className="btn-reschedule">Reschedule</button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="empty-state">No upcoming sessions scheduled.</p>
                          )}
                        </div>
                      </div>

                      {/* Active Mentorships Table */}
                      <div className="section-card">
                        <div className="section-header">
                          <h3>Active Mentorships</h3>
                        </div>
                        {data.activeMentorships && data.activeMentorships.length > 0 ? (
                          <table className="mentorship-table">
                            <thead>
                              <tr>
                                <th>Startup / Founder</th>
                                <th>Status</th>
                                <th>Current Sprint Goal</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.activeMentorships.map(mentorship => (
                                <tr key={mentorship.id}>
                                  <td>
                                    <div className="table-startup-info">
                                      <div className="table-logo">{mentorship.logo}</div>
                                      <div className="table-startup-details">
                                        <h5>{mentorship.startup}</h5>
                                        <p>{mentorship.founder}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <span className={`status-badge ${mentorship.statusClass}`}>
                                      {mentorship.status}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="sprint-goal" title={mentorship.sprintGoal}>
                                      {mentorship.sprintGoal}
                                    </div>
                                  </td>
                                  <td>
                                    <button className="btn-icon" title="Message Founder">
                                      <MessageSquare size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="empty-state">No active mentorships yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Right Column (35%) */}
                    <div className="grid-right">
                      {/* Inbound Advisory Requests */}
                      <div className="section-card">
                        <div className="section-header">
                          <h3>Inbound Requests</h3>
                        </div>
                        <div className="request-list">
                          {data.pendingRequestList && data.pendingRequestList.length > 0 ? (
                            data.pendingRequestList.map(req => (
                              <div key={req.id} className="request-card">
                                <div className="request-header">
                                  <div>
                                    <h4 className="request-title">{req.startup}</h4>
                                    <p className="request-subtitle">{req.founder}</p>
                                  </div>
                                  <span className="badge-pending">Pending Review</span>
                                </div>
                                <p className="request-message">"{req.message}"</p>
                                <div className="request-actions">
                                  <button
                                    className="btn-req-accept"
                                    disabled={!!actionLoading}
                                    onClick={() => handleRequest(req.id, 'accept')}
                                  >
                                    {actionLoading === req.id + 'accept' ? <Loader2 size={14} className="spin" /> : 'Accept'}
                                  </button>
                                  <button
                                    className="btn-req-decline"
                                    disabled={!!actionLoading}
                                    onClick={() => handleRequest(req.id, 'decline')}
                                  >
                                    {actionLoading === req.id + 'decline' ? <Loader2 size={14} className="spin" /> : 'Decline'}
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="empty-state">No pending requests.</p>
                          )}
                        </div>
                      </div>

                      {/* Recent Activity Feed */}
                      <div className="section-card">
                        <div className="section-header">
                          <h3>Recent Activity</h3>
                        </div>
                        <div className="activity-feed">
                          {data.recentActivity && data.recentActivity.length > 0 ? (
                            data.recentActivity.map(activity => (
                              <div key={activity.id} className="activity-item">
                                <div className="activity-icon-wrapper">
                                  <ActivityIcon type={activity.type} />
                                </div>
                                <div className="activity-content">
                                  <p dangerouslySetInnerHTML={{ __html: activity.content.replace(/"([^"]*)"/g, '<strong>"$1"</strong>') }}></p>
                                  <span className="activity-time">{activity.time}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="empty-state">No recent activity.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ============ STARTUP IDEAS SECTION ============ */}
          {activeSection === 'ideas' && (
            <div className="ideas-section">

              {/* Section Hero */}
              <div className="ideas-section-hero">
                <div className="ideas-hero-text">
                  <h2 className="ideas-section-title">
                    <Lightbulb size={24} className="ideas-title-icon" />
                    Startup Ideas
                  </h2>
                  <p className="ideas-section-subtitle">
                    Discover startups seeking your expertise, or explore the ecosystem to stay ahead of the curve.
                  </p>
                </div>
                <div className="ideas-hero-stats">
                  <div className="ideas-hero-stat">
                    <span className="ideas-hero-stat-value">{ideas.filter(i => i.needsAdvisor).length}</span>
                    <span className="ideas-hero-stat-label">Need Advisor</span>
                  </div>
                  <div className="ideas-hero-stat">
                    <span className="ideas-hero-stat-value">{ideas.length}</span>
                    <span className="ideas-hero-stat-label">Total Ideas</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="ideas-tabs">
                <button
                  className={`ideas-tab ${ideasTab === 'needs-advisor' ? 'active' : ''}`}
                  onClick={() => setIdeasTab('needs-advisor')}
                >
                  <Sparkles size={16} />
                  Needs Advisor
                  {ideas.filter(i => i.needsAdvisor).length > 0 && (
                    <span className="tab-badge">{ideas.filter(i => i.needsAdvisor).length}</span>
                  )}
                </button>
                <button
                  className={`ideas-tab ${ideasTab === 'explore' ? 'active' : ''}`}
                  onClick={() => setIdeasTab('explore')}
                >
                  <TrendingUp size={16} />
                  Explore All
                  <span className="tab-badge tab-badge--neutral">{ideas.length}</span>
                </button>
              </div>

              {/* Tab description */}
              <div className="ideas-tab-desc">
                {ideasTab === 'needs-advisor' ? (
                  <p>
                    <strong>These startups are actively looking for an advisor.</strong> Offer mentorship to connect and start a conversation.
                  </p>
                ) : (
                  <p>
                    <strong>Browse all startup ideas</strong> on the platform — learn from the ecosystem and track competitors in your domain.
                  </p>
                )}
              </div>

              {/* Filters */}
              <div className="ideas-filters">
                <div className="ideas-search-wrapper">
                  <Search size={16} className="ideas-search-icon" />
                  <input
                    type="text"
                    className="ideas-search-input"
                    placeholder="Search by name, industry or description…"
                    value={ideaSearch}
                    onChange={e => setIdeaSearch(e.target.value)}
                  />
                  {ideaSearch && (
                    <button className="ideas-search-clear" onClick={() => setIdeaSearch('')}>
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="ideas-filter-right">
                  <Filter size={16} className="filter-icon-label" />
                  <select
                    className="ideas-industry-select"
                    value={ideaIndustry}
                    onChange={e => setIdeaIndustry(e.target.value)}
                  >
                    <option value="">All Industries</option>
                    <option value="FinTech">FinTech</option>
                    <option value="HealthTech">HealthTech</option>
                    <option value="EdTech">EdTech</option>
                    <option value="B2B SaaS">B2B SaaS</option>
                    <option value="Web3">Web3</option>
                    <option value="AgriTech">AgriTech</option>
                    <option value="Tech">Tech</option>
                  </select>
                  {(ideaSearch || ideaIndustry) && (
                    <button className="ideas-reset-btn" onClick={() => { setIdeaSearch(''); setIdeaIndustry(''); }}>
                      <X size={14} /> Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Notice Banner */}
              {offerNotice && (
                <div className={`ideas-notice ${offerNotice.type}`}>
                  {offerNotice.type === 'error' ? <AlertCircle size={16} /> : <Sparkles size={16} />}
                  <span>{offerNotice.text}</span>
                  <button className="ideas-notice-close" onClick={() => setOfferNotice(null)}><X size={14} /></button>
                </div>
              )}

              {/* Ideas Grid */}
              {ideasLoading ? (
                <div className="ideas-loading">
                  <Loader2 size={32} className="spin" />
                  <p>Loading startup ideas…</p>
                </div>
              ) : ideasError ? (
                <div className="ideas-error">
                  <AlertCircle size={24} />
                  <p>{ideasError}</p>
                  <button className="btn-primary-blue" onClick={fetchIdeas}>Retry</button>
                </div>
              ) : displayedIdeas.length === 0 ? (
                <div className="ideas-empty">
                  <Lightbulb size={40} />
                  <p>
                    {ideasTab === 'needs-advisor'
                      ? 'No startups are currently seeking an advisor that match your filters.'
                      : 'No startup ideas match your filters.'}
                  </p>
                  <button className="btn-primary-blue" onClick={() => { setIdeaSearch(''); setIdeaIndustry(''); }}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="ideas-grid">
                  {displayedIdeas.map(idea => (
                    <IdeaCard
                      key={idea.id}
                      idea={idea}
                      onOfferMentorship={handleOfferMentorship}
                      offeringId={offeringId}
                      onOpenDetail={handleOpenDetail}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ============ IDEA DETAIL MODAL ============ */}
      {activeIdea && (
        <div className="idea-modal-backdrop" onClick={handleCloseDetail}>
          <div className="idea-modal" onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="idea-modal-header">
              <div className="idea-modal-header-left">
                <div className="idea-modal-logo">{activeIdea.logo}</div>
                <div>
                  <h3 className="idea-modal-title">{activeIdea.title}</h3>
                  <div className="idea-modal-meta">
                    <span className="idea-industry-pill">{activeIdea.industry}</span>
                    {activeIdea.needsAdvisor && (
                      <span className="idea-seeking-badge">
                        <Sparkles size={12} /> Seeking Advisor
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="idea-modal-close" onClick={handleCloseDetail} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="idea-modal-body">
              {/* Info Strip */}
              <div className="idea-modal-info-strip">
                <div className="idea-modal-founder">
                  <User size={14} />
                  <span>Founder: <strong>{activeIdea.founder}</strong></span>
                </div>
                <div className="idea-modal-counts">
                  <span><Heart size={14} /> {activeIdea.likeCount}</span>
                  <span><MessageSquare size={14} /> {activeIdea.commentCount}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="idea-modal-summary-box">
                <p><strong>Overview:</strong> {activeIdea.summary}</p>
                {activeIdea.problem && <p><strong>Challenge:</strong> {activeIdea.problem}</p>}
              </div>

              {/* Looking For */}
              {activeIdea.lookingFor?.length > 0 && (
                <div className="idea-modal-looking-for">
                  <span className="looking-for-label">Looking for:</span>
                  {activeIdea.lookingFor.map((tag, i) => (
                    <span key={i} className="looking-for-tag">{tag}</span>
                  ))}
                </div>
              )}

              {/* Offer Mentorship CTA */}
              <div className="idea-modal-cta">
                <button
                  className={`btn-modal-mentor ${activeIdea.mentorshipOffered ? 'offered' : ''}`}
                  disabled={offeringId === activeIdea.id || activeIdea.mentorshipOffered}
                  onClick={() => handleOfferMentorship(activeIdea)}
                >
                  {offeringId === activeIdea.id ? (
                    <><Loader2 size={16} className="spin" /> Sending…</>
                  ) : activeIdea.mentorshipOffered ? (
                    <><Bookmark size={16} /> Mentorship Offered ✓</>
                  ) : (
                    <><Bookmark size={16} /> Offer Mentorship</>
                  )}
                </button>
              </div>

              {/* Advisory Notes / Comments */}
              <div className="idea-modal-comments">
                <h4 className="idea-modal-comments-title">
                  Advisory Notes &amp; Discussions
                  <span className="comment-count-badge">{modalComments.length}</span>
                </h4>

                {loadingComments ? (
                  <div className="comments-loading-state">
                    <Loader2 size={22} className="spin" /> Loading…
                  </div>
                ) : modalComments.length === 0 ? (
                  <div className="comments-empty-state">
                    <MessageSquare size={28} />
                    <p>No advisory notes yet. Be the first to share guidance!</p>
                  </div>
                ) : (
                  <div className="comments-list">
                    {modalComments.map((c, idx) => (
                      <div key={c.id || idx} className="comment-item">
                        <div className="comment-item-avatar">
                          {((c.authorName || 'AD').substring(0, 2)).toUpperCase()}
                        </div>
                        <div className="comment-item-body">
                          <div className="comment-item-meta">
                            <span className="comment-author-name">{c.authorName || 'Advisor'}</span>
                            {c.authorRole && (
                              <span className="comment-role-badge">{c.authorRole}</span>
                            )}
                            <span className="comment-date">
                              {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recently'}
                            </span>
                          </div>
                          <p className="comment-text">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Form */}
                <form onSubmit={handlePostComment} className="idea-comment-form">
                  {commentError && (
                    <div className="comment-form-error">
                      <AlertCircle size={14} /> {commentError}
                    </div>
                  )}
                  <div className="comment-form-row">
                    <textarea
                      className="comment-textarea"
                      placeholder="Share advisory guidance, strategic feedback, or ask a question…"
                      value={commentText}
                      onChange={e => { setCommentText(e.target.value); if (commentError) setCommentError(null); }}
                      rows={3}
                      maxLength={1000}
                      required
                    />
                    <button
                      type="submit"
                      className="btn-post-comment"
                      disabled={postingComment || !commentText.trim()}
                    >
                      {postingComment ? <Loader2 size={16} className="spin" /> : <><Send size={15} /> Post</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvisorDashboard;
