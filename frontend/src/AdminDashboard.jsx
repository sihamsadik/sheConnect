import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Lightbulb, 
  Tag, 
  TrendingUp, 
  Search, 
  Filter, 
  Trash2, 
  Edit2, 
  Plus, 
  Check, 
  X, 
  AlertCircle, 
  Loader2, 
  Compass, 
  LogOut, 
  Briefcase, 
  Rocket, 
  Layers, 
  ChevronRight, 
  MessageSquare, 
  ThumbsUp, 
  Calendar, 
  ExternalLink,
  Eye,
  CheckCircle2
} from 'lucide-react';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, ideas, industries
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Data states
  const [stats, setStats] = useState({
    totalUsers: 0,
    entrepreneursCount: 0,
    investorsCount: 0,
    advisorsCount: 0,
    adminsCount: 0,
    totalIdeas: 0,
    totalLikes: 0,
    totalComments: 0,
    totalInterests: 0
  });
  const [users, setUsers] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [industries, setIndustries] = useState([]);

  // Search & filter states
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [ideaSearch, setIdeaSearch] = useState('');
  const [ideaIndustryFilter, setIdeaIndustryFilter] = useState('ALL');

  // Modal states
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRoleToUpdate, setSelectedRoleToUpdate] = useState('');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const [selectedIdeaDetail, setSelectedIdeaDetail] = useState(null);

  const [newIndustryName, setNewIndustryName] = useState('');
  const [isAddingIndustry, setIsAddingIndustry] = useState(false);
  const [showAddIndustryModal, setShowAddIndustryModal] = useState(false);

  // Current logged in user
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setCurrentUser(u);
      } catch (e) {
        console.error(e);
      }
    }
    loadAdminData();
  }, []);

  const showNotification = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const loadAdminData = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          throw new Error("Access restricted: Administrator role required. Please log in as an administrator.");
        }
        throw new Error("Failed to load admin dashboard data.");
      }

      const data = await res.json();
      setStats(data.stats || {});
      setUsers(data.users || []);
      setIdeas(data.ideas || []);
      setIndustries(data.industries || []);
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
      setError(err.message || "Failed to connect to admin backend.");
    } finally {
      setLoading(false);
    }
  };

  // --- User Operations ---
  const handleOpenRoleModal = (user) => {
    setEditingUser(user);
    setSelectedRoleToUpdate(user.role || 'ENTREPRENEUR');
  };

  const handleSaveUserRole = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsUpdatingRole(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ role: selectedRoleToUpdate })
      });

      if (!res.ok) {
        throw new Error("Failed to update user role.");
      }

      const updated = await res.json();
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      setEditingUser(null);
      showNotification(`Role updated to ${updated.role} for ${updated.name}.`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update role.");
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This will remove all their ideas and platform interactions.`)) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (!res.ok) {
        throw new Error("Failed to delete user.");
      }

      setUsers(prev => prev.filter(u => u.id !== userId));
      // Refresh stats
      setStats(prev => ({
        ...prev,
        totalUsers: Math.max(0, (prev.totalUsers || 1) - 1)
      }));
      showNotification(`User "${userName}" was successfully deleted.`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not delete user.");
    }
  };

  // --- Idea Operations ---
  const handleDeleteIdea = async (ideaId, ideaTitle) => {
    if (!window.confirm(`Are you sure you want to remove idea "${ideaTitle}"? This will permanently delete the post.`)) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/admin/ideas/${ideaId}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (!res.ok) {
        throw new Error("Failed to delete startup idea.");
      }

      setIdeas(prev => prev.filter(i => i.id !== ideaId));
      setStats(prev => ({
        ...prev,
        totalIdeas: Math.max(0, (prev.totalIdeas || 1) - 1)
      }));
      if (selectedIdeaDetail?.id === ideaId) {
        setSelectedIdeaDetail(null);
      }
      showNotification(`Startup idea "${ideaTitle}" has been removed.`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not delete idea.");
    }
  };

  // --- Industry Operations ---
  const handleAddIndustry = async (e) => {
    e.preventDefault();
    if (!newIndustryName.trim()) return;

    setIsAddingIndustry(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/admin/industries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ name: newIndustryName.trim() })
      });

      if (!res.ok) {
        throw new Error("Failed to add industry category.");
      }

      const ind = await res.json();
      setIndustries(prev => {
        if (prev.some(item => item.id === ind.id)) return prev;
        return [...prev, { id: ind.id, name: ind.name, startupCount: 0 }];
      });
      setNewIndustryName('');
      setShowAddIndustryModal(false);
      showNotification(`Category "${ind.name}" added successfully.`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not add industry.");
    } finally {
      setIsAddingIndustry(false);
    }
  };

  const handleDeleteIndustry = async (indId, indName) => {
    if (!window.confirm(`Are you sure you want to remove category "${indName}"?`)) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/admin/industries/${indId}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (!res.ok) {
        throw new Error("Failed to delete industry category.");
      }

      setIndustries(prev => prev.filter(i => i.id !== indId));
      showNotification(`Category "${indName}" removed.`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not delete industry.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Filtered lists
  const filteredUsers = users.filter(u => {
    const matchesSearch = !userSearch.trim() || 
      (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.title && u.title.toLowerCase().includes(userSearch.toLowerCase()));

    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredIdeas = ideas.filter(i => {
    const matchesSearch = !ideaSearch.trim() ||
      (i.title && i.title.toLowerCase().includes(ideaSearch.toLowerCase())) ||
      (i.founderName && i.founderName.toLowerCase().includes(ideaSearch.toLowerCase())) ||
      (i.description && i.description.toLowerCase().includes(ideaSearch.toLowerCase()));

    const matchesIndustry = ideaIndustryFilter === 'ALL' || 
      (i.industry && i.industry.toUpperCase() === ideaIndustryFilter.toUpperCase());

    return matchesSearch && matchesIndustry;
  });

  const getRoleBadgeClass = (role) => {
    switch ((role || '').toUpperCase()) {
      case 'ADMIN': return 'role-badge-admin';
      case 'INVESTOR': return 'role-badge-investor';
      case 'ADVISOR': return 'role-badge-advisor';
      case 'ENTREPRENEUR': return 'role-badge-entrepreneur';
      default: return 'role-badge-default';
    }
  };

  const getUserInitials = (name) => {
    return (name || 'U')
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U';
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="brand-icon-box">
            <ShieldCheck size={26} className="text-brand-shield" />
          </div>
          <div className="brand-text">
            <h2>sheConnect</h2>
            <span className="brand-sub">Platform Admin</span>
          </div>
        </div>

        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <TrendingUp size={18} />
            <span>Overview & KPIs</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />
            <span>User Management</span>
            <span className="nav-badge">{users.length}</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'ideas' ? 'active' : ''}`}
            onClick={() => setActiveTab('ideas')}
          >
            <Lightbulb size={18} />
            <span>Startup Moderation</span>
            <span className="nav-badge">{ideas.length}</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'industries' ? 'active' : ''}`}
            onClick={() => setActiveTab('industries')}
          >
            <Tag size={18} />
            <span>Categories</span>
            <span className="nav-badge">{industries.length}</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">
              {getUserInitials(currentUser?.name || 'Admin')}
            </div>
            <div className="admin-details">
              <span className="admin-name">{currentUser?.name || 'Administrator'}</span>
              <span className="admin-role-tag">ROLE_ADMIN</span>
            </div>
          </div>

          <div className="sidebar-links-row">
            <Link to="/marketplace" className="sidebar-secondary-btn" title="View Marketplace">
              <Compass size={16} /> Marketplace
            </Link>
            <button onClick={handleLogout} className="sidebar-secondary-btn btn-logout" title="Log Out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="topbar-title-block">
            <h1>
              {activeTab === 'overview' && 'System Analytics & Platform Overview'}
              {activeTab === 'users' && 'User Directory & Access Control'}
              {activeTab === 'ideas' && 'Startup Moderation & Content Review'}
              {activeTab === 'industries' && 'Platform Categories & Sectors'}
            </h1>
            <p className="topbar-subtitle">
              Live database state across entrepreneurs, capital partners, and deal activity.
            </p>
          </div>

          <div className="topbar-actions">
            <button 
              className="btn-admin-refresh" 
              onClick={loadAdminData}
              disabled={loading}
            >
              {loading ? <Loader2 size={16} className="spinner" /> : <TrendingUp size={16} />}
              Refresh Data
            </button>
          </div>
        </header>

        {/* Global Alert Notification */}
        {actionSuccess && (
          <div className="admin-alert-banner success animate-slide-down">
            <CheckCircle2 size={18} />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="admin-alert-banner error">
            <AlertCircle size={18} />
            <div className="alert-content">
              <span>{error}</span>
              <button className="btn-alert-retry" onClick={loadAdminData}>Retry</button>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="admin-loading-screen">
            <Loader2 size={40} className="spinner text-primary" />
            <p>Fetching platform records...</p>
          </div>
        )}

        {/* TAB 1: OVERVIEW & KPIS */}
        {!loading && activeTab === 'overview' && (
          <div className="tab-overview animate-fade-in">
            {/* KPI Stat Cards */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon-box bg-blue">
                  <Users size={24} />
                </div>
                <div className="kpi-data">
                  <span className="kpi-label">Total Users</span>
                  <h3 className="kpi-value">{stats.totalUsers || 0}</h3>
                  <div className="kpi-sub-breakdown">
                    <span>{stats.entrepreneursCount || 0} Founders</span> • 
                    <span>{stats.investorsCount || 0} Investors</span> • 
                    <span>{stats.advisorsCount || 0} Mentors</span>
                  </div>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-box bg-purple">
                  <Rocket size={24} />
                </div>
                <div className="kpi-data">
                  <span className="kpi-label">Published Startups</span>
                  <h3 className="kpi-value">{stats.totalIdeas || 0}</h3>
                  <span className="kpi-subtext">Active ideas in ecosystem</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-box bg-emerald">
                  <TrendingUp size={24} />
                </div>
                <div className="kpi-data">
                  <span className="kpi-label">Deal Pipeline Interests</span>
                  <h3 className="kpi-value">{stats.totalInterests || 0}</h3>
                  <span className="kpi-subtext">Investor diligence & matches</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-box bg-amber">
                  <MessageSquare size={24} />
                </div>
                <div className="kpi-data">
                  <span className="kpi-label">Platform Engagement</span>
                  <h3 className="kpi-value">{(stats.totalLikes || 0) + (stats.totalComments || 0)}</h3>
                  <div className="kpi-sub-breakdown">
                    <span>{stats.totalLikes || 0} Likes</span> • 
                    <span>{stats.totalComments || 0} Comments</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Role Distribution Strip */}
            <div className="role-distribution-card">
              <div className="card-header">
                <h3>User Ecosystem Breakdown</h3>
                <span className="text-muted">Total accounts: {stats.totalUsers || 0}</span>
              </div>
              <div className="role-bars-container">
                <div className="role-stat-item">
                  <div className="role-stat-header">
                    <span className="role-name">Entrepreneurs</span>
                    <span className="role-count">{stats.entrepreneursCount || 0}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill bg-purple" 
                      style={{ width: `${stats.totalUsers ? ((stats.entrepreneursCount || 0) / stats.totalUsers) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="role-stat-item">
                  <div className="role-stat-header">
                    <span className="role-name">Investors</span>
                    <span className="role-count">{stats.investorsCount || 0}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill bg-blue" 
                      style={{ width: `${stats.totalUsers ? ((stats.investorsCount || 0) / stats.totalUsers) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="role-stat-item">
                  <div className="role-stat-header">
                    <span className="role-name">Advisors & Mentors</span>
                    <span className="role-count">{stats.advisorsCount || 0}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill bg-emerald" 
                      style={{ width: `${stats.totalUsers ? ((stats.advisorsCount || 0) / stats.totalUsers) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="role-stat-item">
                  <div className="role-stat-header">
                    <span className="role-name">Admins</span>
                    <span className="role-count">{stats.adminsCount || 0}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill bg-amber" 
                      style={{ width: `${stats.totalUsers ? ((stats.adminsCount || 0) / stats.totalUsers) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Two Column Feeds */}
            <div className="overview-two-col">
              {/* Recent Users Card */}
              <div className="overview-card">
                <div className="card-header">
                  <h3>Recent User Registrations</h3>
                  <button className="btn-link" onClick={() => setActiveTab('users')}>
                    View All ({users.length})
                  </button>
                </div>
                <div className="compact-user-list">
                  {users.slice(0, 5).map(u => (
                    <div key={u.id} className="compact-user-row">
                      <div className="compact-user-avatar">
                        {getUserInitials(u.name)}
                      </div>
                      <div className="compact-user-meta">
                        <span className="user-row-name">{u.name}</span>
                        <span className="user-row-email">{u.email}</span>
                      </div>
                      <span className={`role-badge ${getRoleBadgeClass(u.role)}`}>
                        {u.role}
                      </span>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <p className="empty-notice">No registered users found.</p>
                  )}
                </div>
              </div>

              {/* Recent Startups Card */}
              <div className="overview-card">
                <div className="card-header">
                  <h3>Latest Published Startups</h3>
                  <button className="btn-link" onClick={() => setActiveTab('ideas')}>
                    View All ({ideas.length})
                  </button>
                </div>
                <div className="compact-ideas-list">
                  {ideas.slice(0, 5).map(idea => (
                    <div key={idea.id} className="compact-idea-row">
                      <div className="compact-idea-info">
                        <span className="idea-row-title">{idea.title}</span>
                        <span className="idea-row-founder">by {idea.founderName} • {idea.industry}</span>
                      </div>
                      <div className="compact-idea-stats">
                        <span className="stat-pill"><ThumbsUp size={12} /> {idea.likesCount || 0}</span>
                        <span className="stat-pill"><MessageSquare size={12} /> {idea.commentsCount || 0}</span>
                      </div>
                    </div>
                  ))}
                  {ideas.length === 0 && (
                    <p className="empty-notice">No published startup ideas yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {!loading && activeTab === 'users' && (
          <div className="tab-users animate-fade-in">
            {/* Filter & Search Bar */}
            <div className="admin-filter-bar">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search by name, email, or title..." 
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                {userSearch && (
                  <button className="btn-clear-search" onClick={() => setUserSearch('')}>
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="filter-group">
                <Filter size={16} className="filter-icon" />
                <select 
                  value={userRoleFilter} 
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="role-select-filter"
                >
                  <option value="ALL">All Roles ({users.length})</option>
                  <option value="ENTREPRENEUR">Entrepreneurs</option>
                  <option value="INVESTOR">Investors</option>
                  <option value="ADVISOR">Advisors</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Title & Location</th>
                    <th>Startups</th>
                    <th>Joined</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="table-user-cell">
                          <div className="table-avatar">
                            {getUserInitials(user.name)}
                          </div>
                          <div>
                            <div className="table-user-name">{user.name}</div>
                            <div className="table-user-email">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <div className="table-title-cell">{user.title || '—'}</div>
                        <div className="table-location-cell">{user.location || '—'}</div>
                      </td>
                      <td>
                        <span className="badge-count">{user.ideasCount || 0}</span>
                      </td>
                      <td>
                        <span className="table-date">{user.createdAt || 'Recent'}</span>
                      </td>
                      <td>
                        <div className="table-actions-cell">
                          <button 
                            className="btn-action-edit"
                            title="Change Role"
                            onClick={() => handleOpenRoleModal(user)}
                          >
                            <Edit2 size={15} /> Role
                          </button>
                          <button 
                            className="btn-action-delete"
                            title="Delete User"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="table-empty-cell">
                        No users match the search filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: STARTUP MODERATION */}
        {!loading && activeTab === 'ideas' && (
          <div className="tab-ideas animate-fade-in">
            {/* Filter & Search Bar */}
            <div className="admin-filter-bar">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search by title, founder, description..." 
                  value={ideaSearch}
                  onChange={(e) => setIdeaSearch(e.target.value)}
                />
                {ideaSearch && (
                  <button className="btn-clear-search" onClick={() => setIdeaSearch('')}>
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="filter-group">
                <Filter size={16} className="filter-icon" />
                <select 
                  value={ideaIndustryFilter} 
                  onChange={(e) => setIdeaIndustryFilter(e.target.value)}
                  className="role-select-filter"
                >
                  <option value="ALL">All Industries</option>
                  {industries.map(ind => (
                    <option key={ind.id} value={ind.name}>{ind.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ideas Grid */}
            <div className="ideas-grid">
              {filteredIdeas.map(idea => (
                <div key={idea.id} className="admin-idea-card">
                  <div className="idea-card-header">
                    <span className="idea-industry-tag">{idea.industry}</span>
                    <div className="idea-header-actions">
                      <button 
                        className="btn-icon-action" 
                        title="View Details"
                        onClick={() => setSelectedIdeaDetail(idea)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="btn-icon-action btn-danger" 
                        title="Remove Idea"
                        onClick={() => handleDeleteIdea(idea.id, idea.title)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="idea-card-title">{idea.title}</h3>
                  <p className="idea-card-desc">{idea.description}</p>

                  <div className="idea-card-founder-row">
                    <div className="founder-badge">
                      <Rocket size={14} />
                      <span>{idea.founderName}</span>
                    </div>
                    {idea.founderEmail && (
                      <span className="founder-email-sub">{idea.founderEmail}</span>
                    )}
                  </div>

                  <div className="idea-card-footer">
                    <div className="engagement-indicators">
                      <span><ThumbsUp size={14} /> {idea.likesCount || 0}</span>
                      <span><MessageSquare size={14} /> {idea.commentsCount || 0}</span>
                    </div>
                    <span className="idea-date">{idea.createdAt || 'Recent'}</span>
                  </div>
                </div>
              ))}

              {filteredIdeas.length === 0 && (
                <div className="empty-ideas-state">
                  <Lightbulb size={40} className="empty-icon text-muted" />
                  <h4>No startups found</h4>
                  <p>Try modifying your search query or industry filter.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES & INDUSTRIES */}
        {!loading && activeTab === 'industries' && (
          <div className="tab-industries animate-fade-in">
            <div className="industries-top-bar">
              <div>
                <h2>Platform Industries</h2>
                <p className="text-muted">Managed industry verticals used to categorize startup ideas and pitch decks.</p>
              </div>
              <button 
                className="btn-add-primary"
                onClick={() => setShowAddIndustryModal(true)}
              >
                <Plus size={18} /> Add Category
              </button>
            </div>

            <div className="industries-grid">
              {industries.map(ind => (
                <div key={ind.id} className="industry-card">
                  <div className="industry-card-icon">
                    <Tag size={20} />
                  </div>
                  <div className="industry-card-content">
                    <h4>{ind.name}</h4>
                    <span className="industry-startup-count">
                      {ind.startupCount || 0} Startups registered
                    </span>
                  </div>
                  <button 
                    className="btn-delete-industry"
                    title="Remove Industry"
                    onClick={() => handleDeleteIndustry(ind.id, ind.name)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {industries.length === 0 && (
                <div className="empty-categories-box">
                  <Tag size={36} className="text-muted" />
                  <h4>No categories registered</h4>
                  <p>Click "Add Category" to initialize your platform sectors.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: CHANGE USER ROLE */}
      {editingUser && (
        <div className="modal-backdrop" onClick={() => setEditingUser(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Role for {editingUser.name}</h3>
              <button className="btn-close" onClick={() => setEditingUser(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUserRole}>
              <div className="modal-body">
                <p className="modal-hint">
                  Updating role will modify permissions and navigation access for this account ({editingUser.email}).
                </p>

                <div className="form-group">
                  <label className="form-label">Select Platform Role</label>
                  <select 
                    className="form-select"
                    value={selectedRoleToUpdate}
                    onChange={(e) => setSelectedRoleToUpdate(e.target.value)}
                    required
                  >
                    <option value="ENTREPRENEUR">ENTREPRENEUR (Build & Pitch Startups)</option>
                    <option value="INVESTOR">INVESTOR (Deal Pipeline & Term Sheets)</option>
                    <option value="ADVISOR">ADVISOR (Mentorship & Advisory)</option>
                    <option value="ADMIN">ADMIN (Full Platform Management)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-modal-cancel"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-modal-save"
                  disabled={isUpdatingRole}
                >
                  {isUpdatingRole ? 'Updating...' : 'Save Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: IDEA DETAIL INSPECTOR */}
      {selectedIdeaDetail && (
        <div className="modal-backdrop" onClick={() => setSelectedIdeaDetail(null)}>
          <div className="admin-modal-card modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="idea-industry-tag">{selectedIdeaDetail.industry}</span>
                <h3 style={{ marginTop: '8px' }}>{selectedIdeaDetail.title}</h3>
              </div>
              <button className="btn-close" onClick={() => setSelectedIdeaDetail(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-scroll">
              <div className="detail-meta-box">
                <div className="detail-meta-item">
                  <span className="meta-label">Founder</span>
                  <span className="meta-value">{selectedIdeaDetail.founderName} ({selectedIdeaDetail.founderEmail || 'No email'})</span>
                </div>
                <div className="detail-meta-item">
                  <span className="meta-label">Market</span>
                  <span className="meta-value">{selectedIdeaDetail.targetMarket}</span>
                </div>
                <div className="detail-meta-item">
                  <span className="meta-label">Engagement</span>
                  <span className="meta-value">{selectedIdeaDetail.likesCount || 0} Likes • {selectedIdeaDetail.commentsCount || 0} Comments</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Description & Executive Summary</h4>
                <p>{selectedIdeaDetail.description}</p>
              </div>

              <div className="detail-section">
                <h4>The Problem</h4>
                <p>{selectedIdeaDetail.problem}</p>
              </div>

              <div className="detail-section">
                <h4>The Solution</h4>
                <p>{selectedIdeaDetail.solution}</p>
              </div>

              {selectedIdeaDetail.lookingFor && selectedIdeaDetail.lookingFor.length > 0 && (
                <div className="detail-section">
                  <h4>Looking For</h4>
                  <div className="tag-cloud">
                    {selectedIdeaDetail.lookingFor.map((need, i) => (
                      <span key={i} className="need-pill">{need}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-modal-danger"
                onClick={() => handleDeleteIdea(selectedIdeaDetail.id, selectedIdeaDetail.title)}
              >
                <Trash2 size={16} /> Delete Startup
              </button>
              <button 
                type="button" 
                className="btn-modal-cancel"
                onClick={() => setSelectedIdeaDetail(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD INDUSTRY */}
      {showAddIndustryModal && (
        <div className="modal-backdrop" onClick={() => setShowAddIndustryModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Platform Category</h3>
              <button className="btn-close" onClick={() => setShowAddIndustryModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddIndustry}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category / Sector Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. AI / MACHINE LEARNING, CLEANTECH, CYBERSECURITY"
                    required
                    value={newIndustryName}
                    onChange={(e) => setNewIndustryName(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-modal-cancel"
                  onClick={() => setShowAddIndustryModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-modal-save"
                  disabled={isAddingIndustry}
                >
                  {isAddingIndustry ? 'Saving...' : 'Add Sector'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
