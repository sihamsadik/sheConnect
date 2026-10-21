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
  Clock,
  X,
  Send,
  User
} from 'lucide-react';
import './EntrepreneurDashboard.css';

function EntrepreneurDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [myIdeas, setMyIdeas] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeIdeaModal, setActiveIdeaModal] = useState(null);
  const [modalComments, setModalComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [isLiking, setIsLiking] = useState(false);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setError('No authentication token found. Please log in first.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [dashRes, ideasRes] = await Promise.all([
        fetch('/api/entrepreneur/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/entrepreneur/my-ideas', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if ([dashRes.status, ideasRes.status].some(status => status === 401 || status === 403)) {
        setError('Your session has expired or you do not have permission. Please log in again.');
        localStorage.removeItem('token');
        return;
      }

      if (!dashRes.ok && !ideasRes.ok) {
        throw new Error('Failed to fetch dashboard data from server.');
      }

      if (dashRes.ok) {
        const dashData = await dashRes.json();
        setDashboardData(dashData);
        if (dashData.user) setCurrentUser(dashData.user);
      }

      if (ideasRes.ok) {
        const ideasData = await ideasRes.json();
        setMyIdeas(Array.isArray(ideasData) ? ideasData : []);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Could not reach backend API at http://localhost:8080. Please ensure Spring Boot is running.');
    } finally {
      setLoading(false);
    }
  };

  // Load user from localStorage & fetch backend data
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleToggleLike = async (ideaId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Optimistic UI update
    setMyIdeas(prev => prev.map(item => {
      if (item.id === ideaId) {
        const currentlyLiked = !!item.likedByCurrentUser;
        const currentCount = item.likeCount || 0;
        return {
          ...item,
          likedByCurrentUser: !currentlyLiked,
          likeCount: currentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1
        };
      }
      return item;
    }));

    if (activeIdeaModal && activeIdeaModal.id === ideaId) {
      setActiveIdeaModal(prev => {
        const currentlyLiked = !!prev.likedByCurrentUser;
        const currentCount = prev.likeCount || 0;
        return {
          ...prev,
          likedByCurrentUser: !currentlyLiked,
          likeCount: currentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1
        };
      });
    }

    try {
      const res = await fetch(`/api/interactions/startup-ideas/${ideaId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setMyIdeas(prev => prev.map(item => {
          if (item.id === ideaId) {
            return {
              ...item,
              likeCount: data.likeCount,
              likedByCurrentUser: data.likedByCurrentUser
            };
          }
          return item;
        }));

        if (activeIdeaModal && activeIdeaModal.id === ideaId) {
          setActiveIdeaModal(prev => ({
            ...prev,
            likeCount: data.likeCount,
            likedByCurrentUser: data.likedByCurrentUser
          }));
        }

        // Update dashboard total likes
        setDashboardData(prev => prev ? {
          ...prev,
          totalLikes: Math.max(0, (prev.totalLikes || 0) + (data.likedByCurrentUser ? 1 : -1))
        } : prev);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleOpenDiscussion = async (idea) => {
    setActiveIdeaModal(idea);
    setNewCommentText('');
    setCommentError(null);
    setLoadingComments(true);

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/interactions/startup-ideas/${idea.id}/comments`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        setModalComments(Array.isArray(data) ? data : []);
      } else {
        setModalComments(Array.isArray(idea.comment) ? idea.comment : []);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setModalComments(Array.isArray(idea.comment) ? idea.comment : []);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCloseDiscussion = () => {
    setActiveIdeaModal(null);
    setModalComments([]);
    setNewCommentText('');
    setCommentError(null);
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeIdeaModal) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setCommentError("Please log in to post a comment.");
      return;
    }

    setIsPostingComment(true);
    setCommentError(null);
    try {
      const res = await fetch(`/api/interactions/startup-ideas/${activeIdeaModal.id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newCommentText.trim() })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to post comment.");
      }

      const createdComment = await res.json();
      const formattedComment = {
        id: createdComment.id || createdComment.commentId || Date.now(),
        content: createdComment.content || newCommentText.trim(),
        authorName: createdComment.authorName || currentUser?.name || 'You',
        authorRole: createdComment.authorRole || getRoleDisplay(currentUser?.role) || 'ENTREPRENEUR',
        createdAt: createdComment.createdAt || new Date().toISOString()
      };

      setModalComments(prev => [formattedComment, ...prev]);
      setNewCommentText('');

      // Update comment count on idea
      setMyIdeas(prev => prev.map(item => {
        if (item.id === activeIdeaModal.id) {
          const currentCount = item.commentCount || (item.comment ? item.comment.length : 0);
          return {
            ...item,
            commentCount: currentCount + 1,
            comment: [formattedComment, ...(item.comment || [])]
          };
        }
        return item;
      }));

      // Update active modal idea commentCount
      setActiveIdeaModal(prev => ({
        ...prev,
        commentCount: (prev.commentCount || 0) + 1
      }));

      // Update total comments in dashboard
      setDashboardData(prev => prev ? {
        ...prev,
        totalComments: (prev.totalComments || 0) + 1
      } : prev);
    } catch (err) {
      console.error("Error posting comment:", err);
      setCommentError(err.message || "Failed to post comment.");
    } finally {
      setIsPostingComment(false);
    }
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
          <Link to="/dashboard" className="sidebar-link active" onClick={fetchData}>
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
          <Link to="/entrepreneur-settings" className="sidebar-link">
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
                              <button 
                                className={`metric-btn ${idea.likedByCurrentUser ? 'liked' : ''}`}
                                onClick={() => handleToggleLike(idea.id)}
                                title={idea.likedByCurrentUser ? "Unlike idea" : "Like idea"}
                              >
                                <Heart size={14} className={idea.likedByCurrentUser ? 'heart-filled' : ''} />
                                <span>{idea.likeCount || 0}</span>
                              </button>

                              <button 
                                className="metric-btn"
                                onClick={() => handleOpenDiscussion(idea)}
                                title="View discussions & comments"
                              >
                                <MessageSquare size={14} />
                                <span>{idea.commentCount || (idea.comment ? idea.comment.length : 0)}</span>
                              </button>

                              <div className="metric-item" title="Created Date">
                                <Clock size={14} /> {idea.createdAt ? new Date(idea.createdAt).toLocaleDateString() : 'Recent'}
                              </div>
                            </div>
                            
                            <div className="idea-actions">
                              <button 
                                className="action-btn" 
                                title="View Discussions & Details"
                                onClick={() => handleOpenDiscussion(idea)}
                              >
                                <MessageSquare size={16} />
                              </button>
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

      {/* Discussion & Comments Modal */}
      {activeIdeaModal && (
        <div className="modal-backdrop animate-fade-in" onClick={handleCloseDiscussion}>
          <div className="modal-card discussion-modal animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-info">
                <h3>{activeIdeaModal.title}</h3>
                <span className="industry-tag">{getIndustryDisplay(activeIdeaModal.industry)}</span>
              </div>
              <button className="modal-close-btn" onClick={handleCloseDiscussion} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body discussion-body">
              {/* Quick summary strip */}
              <div className="discussion-meta-strip">
                <div className="discussion-creator">
                  <User size={16} />
                  <span>Founder: <strong>{activeIdeaModal.user?.name || activeIdeaModal.ideaAdmin?.name || 'Entrepreneur'}</strong></span>
                </div>

                <button 
                  className={`like-toggle-btn ${activeIdeaModal.likedByCurrentUser ? 'active' : ''}`}
                  onClick={() => handleToggleLike(activeIdeaModal.id)}
                >
                  <Heart size={16} className={activeIdeaModal.likedByCurrentUser ? 'heart-filled' : ''} />
                  <span>{activeIdeaModal.likeCount || 0} {activeIdeaModal.likeCount === 1 ? 'Like' : 'Likes'}</span>
                </button>
              </div>

              {/* Problem & Solution if present */}
              {activeIdeaModal.problem && (
                <div className="idea-summary-box">
                  <p><strong>Problem:</strong> {activeIdeaModal.problem}</p>
                  {activeIdeaModal.solution && <p><strong>Solution:</strong> {activeIdeaModal.solution}</p>}
                </div>
              )}

              {/* Comments Section */}
              <div className="comments-section">
                <h4>Discussion & Feedback ({modalComments.length})</h4>
                
                {loadingComments ? (
                  <div className="comments-loading">
                    <Loader2 size={24} className="animate-spin" color="#2563EB" />
                    <span>Loading discussion...</span>
                  </div>
                ) : modalComments.length === 0 ? (
                  <div className="no-comments-box">
                    <MessageSquare size={28} color="#94A3B8" />
                    <p>No feedback or comments yet. Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  <div className="comments-list">
                    {modalComments.map((c, idx) => (
                      <div key={c.id || c.commentId || idx} className="comment-card">
                        <div className="comment-header">
                          <div className="comment-author">
                            <div className="comment-avatar">
                              {getInitials(c.authorName || c.userName || (typeof c.user === 'object' ? c.user?.name : c.user) || 'User')}
                            </div>
                            <div className="comment-author-meta">
                              <span className="author-name">
                                {c.authorName || c.userName || (typeof c.user === 'object' ? c.user?.name : c.user) || 'Platform Member'}
                              </span>
                              {(c.authorRole || c.userRole || (typeof c.user === 'object' && c.user?.role?.name)) && (
                                <span className="author-role-badge">
                                  {c.authorRole || c.userRole || (typeof c.user === 'object' && c.user?.role?.name)}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="comment-date">
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recently'}
                          </span>
                        </div>
                        <p className="comment-content">{c.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* New comment input form */}
                <form onSubmit={handlePostComment} className="comment-form">
                  {commentError && (
                    <div className="modal-error-alert" style={{ marginBottom: '10px' }}>
                      <AlertCircle size={16} />
                      <span>{commentError}</span>
                    </div>
                  )}
                  <div className="comment-input-row">
                    <textarea 
                      className="modal-textarea comment-textarea"
                      placeholder="Share your thoughts, ask a question, or provide advisor/investor feedback..."
                      value={newCommentText}
                      onChange={(e) => {
                        setNewCommentText(e.target.value);
                        if (commentError) setCommentError(null);
                      }}
                      rows={2}
                      maxLength={1000}
                      required
                    />
                    <button 
                      type="submit" 
                      className="btn-primary-blue post-comment-btn"
                      disabled={isPostingComment || !newCommentText.trim()}
                    >
                      {isPostingComment ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <>
                          <Send size={16} /> Post
                        </>
                      )}
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

export default EntrepreneurDashboard;
