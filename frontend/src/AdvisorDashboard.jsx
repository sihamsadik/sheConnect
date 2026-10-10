import React from 'react';
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
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import './AdvisorDashboard.css';

function AdvisorDashboard() {
  const statMetrics = [
    { title: 'Active Mentees / Startups', value: '6', icon: <Users size={20} /> },
    { title: 'Advisory Hours (Month)', value: '14.5', icon: <Clock size={20} /> },
    { title: 'Pending Requests', value: '3', icon: <Inbox size={20} /> },
    { title: 'Upcoming Sessions', value: '4', icon: <Calendar size={20} /> },
  ];

  const upcomingSessions = [
    {
      id: 1,
      day: 'Today',
      time: '2:00 PM',
      founder: 'Sarah Jenkins',
      startup: 'Lumina Analytics',
      agenda: 'Go-to-Market Strategy Review'
    },
    {
      id: 2,
      day: 'Tomorrow',
      time: '10:30 AM',
      founder: 'David Chen',
      startup: 'EcoLogistics',
      agenda: 'Series A Deck Feedback'
    }
  ];

  const activeMentorships = [
    {
      id: 1,
      startup: 'Aura Health',
      logo: 'AH',
      founder: 'Mia Johnson',
      status: 'Active Advisory',
      statusClass: 'active-equity',
      sprintGoal: 'Finalize enterprise pricing model'
    },
    {
      id: 2,
      startup: 'FinStream',
      logo: 'FS',
      founder: 'Alex Kumar',
      status: 'Mentorship',
      statusClass: 'active-equity',
      sprintGoal: 'Hiring first engineering lead'
    }
  ];

  const pendingRequests = [
    {
      id: 1,
      startup: 'Nexus API',
      founder: 'Marcus R.',
      message: 'Looking for guidance on scaling our open-source developer community and developer relations strategy.'
    },
    {
      id: 2,
      startup: 'CloudScale',
      founder: 'Elena P.',
      message: 'We are raising our seed round and would love your feedback on our technical architecture slides.'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'milestone',
      content: 'Aura Health completed sprint goal: "Finalize enterprise pricing model".',
      time: '2 hours ago',
      icon: <Target size={16} />
    },
    {
      id: 2,
      type: 'document',
      content: 'EcoLogistics uploaded "Draft Deck v3" for review.',
      time: '5 hours ago',
      icon: <FileText size={16} />
    }
  ];

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
              <div className="advisor-avatar">EP</div>
              <div className="advisor-info">
                <h5>Elena Patterson</h5>
                <p>Growth Advisor</p>
              </div>
            </div>
            <div className="advisor-status-toggle">
              <span>Accepting Startups</span>
              <div className="status-indicator">
                <div className="status-dot"></div>
                Active
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
                  {upcomingSessions.map(session => (
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
                  ))}
                </div>
              </div>

              {/* Active Mentorships Table */}
              <div className="section-card">
                <div className="section-header">
                  <h3>Active Mentorships</h3>
                </div>
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
                    {activeMentorships.map(mentorship => (
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
                  {pendingRequests.map(req => (
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
                        <button className="btn-req-accept">Accept</button>
                        <button className="btn-req-decline">Decline</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="section-card">
                <div className="section-header">
                  <h3>Recent Activity</h3>
                </div>
                <div className="activity-feed">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon-wrapper">
                        {activity.icon}
                      </div>
                      <div className="activity-content">
                        <p dangerouslySetInnerHTML={{ __html: activity.content.replace(/"([^"]*)"/g, '<strong>"$1"</strong>') }}></p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdvisorDashboard;
