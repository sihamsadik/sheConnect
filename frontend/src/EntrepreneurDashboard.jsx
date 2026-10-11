import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  LayoutDashboard, 
  Lightbulb, 
  MessageSquare, 
  Settings, 
  Search, 
  Bell, 
  Plus, 
  Heart, 
  Eye, 
  MoreHorizontal, 
  Edit3,
  TrendingUp,
  UserCheck,
  Award,
  LogOut,
  Loader2,
  AlertCircle,
  Clock
} from 'lucide-react';
import './EntrepreneurDashboard.css';

function EntrepreneurDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [myIdeas, setMyIdeas] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Load user from localStorage & fetch backend data
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }

    if (!token) {
      setLoading(false);
      setError("No authentication token found. Please log in first.");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch dashboard overview KPIs and basic user idea summaries
        const [dashRes, ideasRes] = await Promise.all([
          fetch('/api/entrepreneur/dashboard', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('/api/entrepreneur/my-ideas', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        if (dashRes.status === 401 || dashRes.status === 403 || ideasRes.status === 401 || ideasRes.status === 403) {
          setError("Your session has expired or you do not have permission. Please log in again.");
          localStorage.removeItem('token');
          setLoading(false);
          return;
        }

        if (!dashRes.ok && !ideasRes.ok) {
          throw new Error("Failed to fetch dashboard data from server.");
        }

        if (dashRes.ok) {
          const dashData = await dashRes.json();
          setDashboardData(dashData);
          if (dashData.user) {
            setCurrentUser(dashData.user);
          }
        }

        if (ideasRes.ok) {
          const ideasData = await ideasRes.json();
          setMyIdeas(Array.isArray(ideasData) ? ideasData : []);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Could not reach backend API at http://localhost:8080. Please ensure Spring Boot is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Safe display helpers to prevent rendering raw object entities as React children
  const getRoleDisplay = (role) => {
    if (!role) return 'Founder';
    if (typeof role === 'object' && role !== null) return role.name || 'Founder';
    return String(role);
  };

  const getIndustryDisplay = (ind) => {
    if (!ind) return 'Tech';
    if (typeof ind === 'object' && ind !== null) return ind.name || 'Tech';
    return String(ind);
  };

  const getNeedDisplay = (need) => {
    if (!need) return '';
    if (typeof need === 'object' && need !== null) return need.name || '';
    return String(need);
  };

  // Helper to get initials safely
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'E';
    return name
      .trim()
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'E';
  };

  // Dynamic KPI Metrics directly from backend
  const statMetrics = [
    { 
      title: 'Total Ideas Posted', 
      value: dashboardData?.ideaCount ?? myIdeas.length ?? 0, 
      icon: <Lightbulb size={20} />, 
      change: null 
    },
    { 
      title: 'Total Likes', 
      value: dashboardData?.totalLikes ?? myIdeas.reduce((sum, i) => sum + (i.likeCount || 0), 0), 
      icon: <Heart size={20} />, 
      change: dashboardData?.totalLikes ? '+12%' : null, 
      isPositive: true 
    },
    { 
      title: 'Total Comments', 
      value: dashboardData?.totalComments ?? myIdeas.reduce((sum, i) => sum + (i.commentCount || 0), 0), 
      icon: <MessageSquare size={20} />, 
      change: dashboardData?.totalComments ? '+4%' : null, 
      isPositive: true 
    },
    { 
      title: 'Engagement Rate', 
      value: dashboardData?.engagementRate ? `${dashboardData.engagementRate.toFixed(1)}%` : '0%', 
      icon: <UserCheck size={20} />, 
      change: 'Calculated live', 
      isPositive: null 
    },
  ];

  // Derive recent activities from real comments on user ideas
  const realActivities = [];
  myIdeas.forEach(idea => {
    if (idea.comment && Array.isArray(idea.comment)) {
      idea.comment.forEach(c => {
        const authorName = typeof c.user === 'object' && c.user !== null ? (c.user.name || 'A platform member') : (c.user || 'A platform member');
        realActivities.push({
          id: `comment-${c.id}`,
          type: 'advisor',
          text: (
            <span>
              <strong>{authorName}</strong> commented on your idea <em>"{idea.title}"</em>.
            </span>
          ),
          time: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recently',
          icon: <MessageSquare size={16} />
        });
      });
    }
    if (idea.likeCount && idea.likeCount > 0) {
      realActivities.push({
        id: `like-${idea.id}`,
        type: 'investor',
        text: (
          <span>
            Your idea <strong>"{idea.title}"</strong> received <strong>{idea.likeCount}</strong> likes from the ecosystem.
          </span>
        ),
        time: idea.updatedAt ? new Date(idea.updatedAt).toLocaleDateString() : 'Recently',
        icon: <TrendingUp size={16} />
      });
    }
  });

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Rocket className="sidebar-logo-icon" size={24} />
          <span>sheConnect</span>
        </div>
        
        <nav className="nav-links-sidebar">
          <Link to="/dashboard" className="sidebar-link active">
            <div className="sidebar-link-content">
              <LayoutDashboard className="sidebar-icon" size={20} />
              <span>Overview</span>
            </div>
          </Link>
          <Link to="/profile" className="sidebar-link">
            <div className="sidebar-link-content">
              <Lightbulb className="sidebar-icon" size={20} />
              <span>My Profile</span>
            </div>
          </Link>
          <Link to="#" className="sidebar-link">
            <div className="sidebar-link-content">
              <MessageSquare className="sidebar-icon" size={20} />
              <span>Messages</span>
            </div>
            {dashboardData?.totalComments > 0 && (
              <span className="badge-count">{dashboardData.totalComments}</span>
            )}
          </Link>
          <Link to="#" className="sidebar-link">
            <div className="sidebar-link-content">
              <Settings className="sidebar-icon" size={20} />
              <span>Settings</span>
            </div>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="founder-widget">
            <div className="founder-left">
              <div className="founder-avatar">
                {getInitials(currentUser?.name)}
              </div>
              <div className="founder-info">
                <h5>{currentUser?.name || 'Entrepreneur'}</h5>
                <p>{getRoleDisplay(currentUser?.role)}</p>
              </div>
            </div>
            <button 
              className="btn-sidebar-logout" 
              onClick={handleLogout} 
              title="Log Out"
              aria-label="Log Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search your ideas..." 
            />
          </div>
          
          <div className="header-actions">
            <button className="notification-btn" aria-label="Notifications">
              <Bell size={20} />
              {realActivities.length > 0 && <span className="notification-dot"></span>}
            </button>
            <Link to="/create-idea" style={{ textDecoration: 'none' }}>
              <button className="btn-primary-blue">
                <Plus size={18} />
                New Idea
              </button>
            </Link>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="content-scroll">
          
          {error && (
            <div className="dashboard-error-alert animate-fade-in-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
              <Link to="/login" style={{ color: '#B91C1C', fontWeight: 600, textDecoration: 'underline' }}>
                Log in
              </Link>
            </div>
          )}

          {loading ? (
            <div className="dashboard-loader">
              <Loader2 size={36} className="animate-spin" color="#2563EB" />
              <p>Loading your startup dashboard from backend...</p>
            </div>
          ) : (
            <>
              {/* Stat Cards Row */}
              <div className="stat-grid">
                {statMetrics.map((stat, index) => (
                  <div key={index} className="stat-card">
                    <div className="stat-header">
                      <span className="stat-title">{stat.title}</span>
                      <div className="stat-icon">{stat.icon}</div>
                    </div>
                    <div className="stat-value">{stat.value}</div>
                    {stat.change && (
                      <div className={`stat-change ${stat.isPositive ? 'positive' : 'neutral'}`}>
                        {stat.isPositive ? <TrendingUp size={14} /> : null}
                        <span>{stat.change}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="dashboard-grid">
                {/* Left Column: My Startup Ideas */}
                <div className="left-column">
                  <h2 className="section-title">My Startup Ideas</h2>
                  
                  <div className="ideas-card">
                    <div className="ideas-header">
                      <span className="stat-title">Published Startups ({myIdeas.length})</span>
                      <Link to="/create-idea">
                        <button className="btn-primary-blue" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                          <Plus size={14} /> Add Idea
                        </button>
                      </Link>
                    </div>

                    <div className="ideas-list">
                      {myIdeas.length === 0 ? (
                        <div className="empty-ideas-state">
                          <div className="empty-icon-wrap">
                            <Lightbulb size={28} />
                          </div>
                          <h3 className="empty-title">No Startup Ideas Yet</h3>
                          <p className="empty-desc">
                            You haven't published any startup ideas to the ecosystem feed yet. Post your idea to start receiving interest from investors and advisors.
                          </p>
                          <Link to="/create-idea" style={{ textDecoration: 'none' }}>
                            <button className="btn-primary-blue" style={{ marginTop: '8px' }}>
                              <Plus size={16} /> Post Your First Idea
                            </button>
                          </Link>
                        </div>
                      ) : (
                        myIdeas.map(idea => (
                          <div key={idea.id} className="idea-item">
                            <div className="idea-thumbnail">
                              <Lightbulb size={24} />
                            </div>
                            
                            <div className="idea-details">
                              <h4 className="idea-title">{idea.title}</h4>
                              <div className="idea-meta">
                                <span className="industry-tag">{getIndustryDisplay(idea.industry)}</span>
                                {idea.lookingFor && idea.lookingFor.map((need, idx) => (
                                  <span key={idx} className="industry-tag" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                                    Needs: {getNeedDisplay(need)}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <span className="status-pill active">
                              Active
                            </span>
                            
                            <div className="idea-metrics">
                              <div className="metric-item" title="Total Likes">
                                <Heart size={14} /> {idea.likeCount || 0}
                              </div>
                              <div className="metric-item" title="Comments">
                                <MessageSquare size={14} /> {idea.commentCount || (idea.comment ? idea.comment.length : 0)}
                              </div>
                              <div className="metric-item" title="Created Date">
                                <Clock size={14} /> {idea.createdAt ? new Date(idea.createdAt).toLocaleDateString() : 'Recent'}
                              </div>
                            </div>
                            
                            <div className="idea-actions">
                              <button className="action-btn" title="Idea Details"><Edit3 size={16} /></button>
                              <button className="action-btn" title="More Options"><MoreHorizontal size={16} /></button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Callout & Activity Feed */}
                <div className="right-column">
                  <div className="callout-banner">
                    <div className="callout-content">
                      <h3 className="callout-title">Connect with Advisors</h3>
                      <p className="callout-desc">
                        Get expert guidance on your pitch deck, enterprise pricing, and fundraising strategy.
                      </p>
                      <Link to="/marketplace" style={{ textDecoration: 'none' }}>
                        <button className="callout-btn">Browse Marketplace</button>
                      </Link>
                    </div>
                  </div>

                  <div className="activity-card">
                    <h2 className="section-title">Recent Activity</h2>
                    <div className="activity-list">
                      {realActivities.length === 0 ? (
                        <div style={{ padding: '24px 16px', textAlign: 'center', color: '#64748B', fontSize: '0.9rem' }}>
                          <Award size={32} style={{ color: '#CBD5E1', marginBottom: '8px' }} />
                          <p style={{ margin: 0 }}>No recent activity yet.</p>
                          <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>
                            Likes and comments from investors and advisors will show up here.
                          </p>
                        </div>
                      ) : (
                        realActivities.map(activity => (
                          <div key={activity.id} className="activity-item">
                            <div className={`activity-icon ${activity.type}`}>
                              {activity.icon}
                            </div>
                            <div className="activity-content">
                              <p className="activity-text">{activity.text}</p>
                              <span className="activity-time">{activity.time}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}

export default EntrepreneurDashboard;
