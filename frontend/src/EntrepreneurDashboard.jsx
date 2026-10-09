import React from 'react';
import { Link } from 'react-router-dom';
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
  Award
} from 'lucide-react';
import './EntrepreneurDashboard.css';

function EntrepreneurDashboard() {
  const statMetrics = [
    { title: 'Total Ideas Posted', value: '3', icon: <Lightbulb size={20} />, change: null },
    { title: 'Total Likes', value: '148', icon: <Heart size={20} />, change: '+12%', isPositive: true },
    { title: 'Total Comments', value: '32', icon: <MessageSquare size={20} />, change: '+4%', isPositive: true },
    { title: 'Active Conversations', value: '5', icon: <UserCheck size={20} />, change: 'Steady', isPositive: null },
  ];

  const ideas = [
    {
      id: 1,
      title: 'EcoTech Smart Grid Solutions',
      industry: 'Clean Energy',
      status: 'Active',
      likes: 84,
      comments: 15,
      views: 320,
      image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 2,
      title: 'AI-Powered Health Assistant',
      industry: 'HealthTech',
      status: 'Active',
      likes: 64,
      comments: 17,
      views: 290,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 3,
      title: 'Decentralized Finance API',
      industry: 'FinTech',
      status: 'Draft',
      likes: 0,
      comments: 0,
      views: 0,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=100&q=80'
    }
  ];

  const activities = [
    {
      id: 1,
      type: 'investor',
      text: <span><strong>Sarah Jenkins</strong> (Angel Investor) viewed your EcoTech pitch deck.</span>,
      time: '2 hours ago',
      icon: <TrendingUp size={16} />
    },
    {
      id: 2,
      type: 'advisor',
      text: <span><strong>Dr. Alan Chen</strong> commented on your HealthTech idea.</span>,
      time: '5 hours ago',
      icon: <MessageSquare size={16} />
    },
    {
      id: 3,
      type: 'system',
      text: <span>Your <strong>FinTech API</strong> draft was auto-saved.</span>,
      time: 'Yesterday',
      icon: <Award size={16} />
    }
  ];

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
          <Link to="#" className="sidebar-link">
            <div className="sidebar-link-content">
              <Lightbulb className="sidebar-icon" size={20} />
              <span>My Ideas</span>
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

        <div className="sidebar-footer">
          <div className="founder-widget">
            <div className="founder-avatar">
              MJ
            </div>
            <div className="founder-info">
              <h5>Mia Johnson</h5>
              <p>Founder & CEO</p>
            </div>
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
              placeholder="Search ideas, investors, advisors..." 
            />
          </div>
          
          <div className="header-actions">
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>
            <button className="btn-primary-blue">
              <Plus size={18} />
              New Idea
            </button>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="content-scroll">
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
                    <span>{stat.change} vs last month</span>
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
                  <span className="stat-title">Recent Ideas</span>
                  <button className="action-btn"><MoreHorizontal size={18} /></button>
                </div>
                <div className="ideas-list">
                  {ideas.map(idea => (
                    <div key={idea.id} className="idea-item">
                      <div className="idea-thumbnail">
                        {idea.image ? (
                          <img src={idea.image} alt={idea.title} />
                        ) : (
                          <Lightbulb size={24} />
                        )}
                      </div>
                      
                      <div className="idea-details">
                        <h4 className="idea-title">{idea.title}</h4>
                        <div className="idea-meta">
                          <span className="industry-tag">{idea.industry}</span>
                        </div>
                      </div>
                      
                      <span className={`status-pill ${idea.status.toLowerCase()}`}>
                        {idea.status}
                      </span>
                      
                      <div className="idea-metrics">
                        <div className="metric-item">
                          <Heart size={14} /> {idea.likes}
                        </div>
                        <div className="metric-item">
                          <MessageSquare size={14} /> {idea.comments}
                        </div>
                        <div className="metric-item">
                          <Eye size={14} /> {idea.views}
                        </div>
                      </div>
                      
                      <div className="idea-actions">
                        <button className="action-btn" title="Edit Idea"><Edit3 size={16} /></button>
                        <button className="action-btn" title="More Options"><MoreHorizontal size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Callout & Activity Feed */}
            <div className="right-column">
              <div className="callout-banner">
                <div className="callout-content">
                  <h3 className="callout-title">Connect with Advisors</h3>
                  <p className="callout-desc">Get expert feedback on your pitch decks and business models to accelerate growth.</p>
                  <button className="callout-btn">Find an Advisor</button>
                </div>
              </div>

              <div className="activity-card">
                <h2 className="section-title">Recent Activity</h2>
                <div className="activity-list">
                  {activities.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className={`activity-icon ${activity.type}`}>
                        {activity.icon}
                      </div>
                      <div className="activity-content">
                        <p className="activity-text">{activity.text}</p>
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

export default EntrepreneurDashboard;
