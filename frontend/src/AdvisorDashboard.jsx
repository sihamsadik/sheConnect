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
  AlertCircle
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

function AdvisorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // id of request being actioned

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

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

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

  // ---- Stat metrics derived from data ----
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
          <Link to="/advisor" className="sidebar-link active">
            <div className="sidebar-link-content">
              <LayoutDashboard className="sidebar-icon" size={20} />
              <span>Overview</span>
            </div>
          </Link>
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

          {/* Loading / Error states */}
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
        </div>
      </main>
    </div>
  );
}

export default AdvisorDashboard;
