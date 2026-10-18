import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Rocket, LayoutDashboard, Globe, Users, MessageSquare, Settings,
  Lightbulb, Search, Bell, Loader2, AlertCircle, X, CheckCircle,
  Edit3, Trash2, ChevronRight, User, Target, Calendar
} from 'lucide-react';
import './MyMentees.css';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {};
}

const STATUS_LABEL = { ACTIVE: 'Active', PENDING: 'Pending' };
const STATUS_CLASS = { ACTIVE: 'status--active', PENDING: 'status--pending' };

function MenteeCard({ mentee, onUpdateGoal, onEnd }) {
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalText, setGoalText] = useState(mentee.sprintGoal || '');
  const [saving, setSaving] = useState(false);

  const handleSaveGoal = async () => {
    setSaving(true);
    await onUpdateGoal(mentee.mentorshipId, goalText);
    setSaving(false);
    setEditingGoal(false);
  };

  return (
    <div className="mentee-card">
      <div className="mentee-card-header">
        <div className="mentee-avatar">{mentee.menteeInitials}</div>
        <div className="mentee-header-info">
          <h4 className="mentee-name">{mentee.menteeName}</h4>
          <p className="mentee-email">{mentee.menteeEmail}</p>
        </div>
        <span className={`mentee-status-badge ${STATUS_CLASS[mentee.status] || ''}`}>
          {STATUS_LABEL[mentee.status] || mentee.status}
        </span>
      </div>

      <div className="mentee-startup-row">
        <div className="mentee-startup-logo">
          {(mentee.startupName || 'SC').substring(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="mentee-startup-name">{mentee.startupName}</p>
          {mentee.startupIndustry && (
            <span className="mentee-industry-pill">{mentee.startupIndustry}</span>
          )}
        </div>
      </div>

      {mentee.requestMessage && (
        <p className="mentee-request-msg">"{mentee.requestMessage}"</p>
      )}

      <div className="mentee-goal-section">
        <div className="mentee-goal-label">
          <Target size={14} />
          <span>Sprint Goal</span>
          {!editingGoal && (
            <button className="goal-edit-btn" onClick={() => setEditingGoal(true)} title="Edit goal">
              <Edit3 size={13} />
            </button>
          )}
        </div>

        {editingGoal ? (
          <div className="goal-edit-row">
            <input
              className="goal-input"
              value={goalText}
              onChange={e => setGoalText(e.target.value)}
              placeholder="Set a sprint goal…"
              maxLength={500}
              autoFocus
            />
            <button className="goal-save-btn" onClick={handleSaveGoal} disabled={saving}>
              {saving ? <Loader2 size={14} className="spin" /> : <CheckCircle size={14} />}
            </button>
            <button className="goal-cancel-btn" onClick={() => { setEditingGoal(false); setGoalText(mentee.sprintGoal || ''); }}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <p className="mentee-goal-text">
            {mentee.sprintGoal || <span className="goal-empty">No goal set yet.</span>}
          </p>
        )}
      </div>

      <div className="mentee-card-footer">
        <span className="mentee-since">
          <Calendar size={13} />
          Since {mentee.createdAt ? new Date(mentee.createdAt).toLocaleDateString() : '—'}
        </span>
        <button
          className="btn-end-mentorship"
          onClick={() => onEnd(mentee.mentorshipId, mentee.menteeName)}
          title="End mentorship"
        >
          <Trash2 size={14} /> End
        </button>
      </div>
    </div>
  );
}

function MyMentees() {
  const navigate = useNavigate();
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [notice, setNotice] = useState(null);
  const [confirmEnd, setConfirmEnd] = useState(null); // { id, name }

  const fetchMentees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/advisor/mentees', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setMentees(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMentees(); }, [fetchMentees]);

  const handleUpdateGoal = async (mentorshipId, goal) => {
    try {
      const res = await fetch(`/api/advisor/mentees/${mentorshipId}/goal`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ goal })
      });
      if (!res.ok) throw new Error('Failed to update goal');
      const updated = await res.json();
      setMentees(prev => prev.map(m => m.mentorshipId === mentorshipId ? updated : m));
      setNotice({ type: 'success', text: 'Sprint goal updated.' });
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    }
  };

  const handleEndMentorship = async () => {
    if (!confirmEnd) return;
    try {
      const res = await fetch(`/api/advisor/mentees/${confirmEnd.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to end mentorship');
      setMentees(prev => prev.filter(m => m.mentorshipId !== confirmEnd.id));
      setNotice({ type: 'success', text: `Mentorship with ${confirmEnd.name} ended.` });
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    } finally {
      setConfirmEnd(null);
    }
  };

  const filtered = mentees.filter(m => {
    const matchSearch = !search ||
      m.menteeName.toLowerCase().includes(search.toLowerCase()) ||
      m.startupName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeCount = mentees.filter(m => m.status === 'ACTIVE').length;
  const pendingCount = mentees.filter(m => m.status === 'PENDING').length;

  return (
    <div className="advisor-layout">
      {/* Sidebar */}
      <aside className="advisor-sidebar">
        <div className="sidebar-logo">
          <Rocket className="sidebar-logo-icon" size={24} />
          <span>sheConnect</span>
        </div>
        <nav className="nav-links-sidebar">
          <Link to="/advisor" className="sidebar-link">
            <div className="sidebar-link-content">
              <LayoutDashboard className="sidebar-icon" size={20} /><span>Overview</span>
            </div>
          </Link>
          <Link to="/advisor" className="sidebar-link">
            <div className="sidebar-link-content">
              <Lightbulb className="sidebar-icon" size={20} /><span>Startup Ideas</span>
            </div>
          </Link>
          <Link to="/marketplace" className="sidebar-link">
            <div className="sidebar-link-content">
              <Globe className="sidebar-icon" size={20} /><span>Marketplace</span>
            </div>
          </Link>
          <Link to="/my-mentees" className="sidebar-link active">
            <div className="sidebar-link-content">
              <Users className="sidebar-icon" size={20} /><span>My Mentees</span>
            </div>
            {activeCount > 0 && <span className="badge-count">{activeCount}</span>}
          </Link>
          <Link to="#" className="sidebar-link">
            <div className="sidebar-link-content">
              <MessageSquare className="sidebar-icon" size={20} /><span>Messages</span>
            </div>
          </Link>
          <Link to="/advisor-settings" className="sidebar-link">
            <div className="sidebar-link-content">
              <Settings className="sidebar-icon" size={20} /><span>Settings</span>
            </div>
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="advisor-header">
          <div className="header-search">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search mentees or startups…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="header-actions">
            <button className="notification-btn"><Bell size={20} /></button>
          </div>
        </header>

        <div className="content-scroll">
          {/* Page header */}
          <div className="mentees-page-hero">
            <div>
              <h2 className="mentees-page-title"><Users size={22} /> My Mentees</h2>
              <p className="mentees-page-subtitle">Manage your active mentorships and track founder progress.</p>
            </div>
            <div className="mentees-hero-stats">
              <div className="mentees-hero-stat">
                <span className="mentees-stat-value">{activeCount}</span>
                <span className="mentees-stat-label">Active</span>
              </div>
              <div className="mentees-hero-stat">
                <span className="mentees-stat-value">{pendingCount}</span>
                <span className="mentees-stat-label">Pending</span>
              </div>
            </div>
          </div>

          {/* Notice */}
          {notice && (
            <div className={`mentees-notice ${notice.type}`}>
              {notice.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{notice.text}</span>
              <button onClick={() => setNotice(null)}><X size={14} /></button>
            </div>
          )}

          {/* Filters */}
          <div className="mentees-filters">
            <div className="mentees-search-wrap">
              <Search size={15} className="mentees-search-icon" />
              <input
                className="mentees-search-input"
                placeholder="Filter by name or startup…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && <button className="mentees-clear-btn" onClick={() => setSearch('')}><X size={13} /></button>}
            </div>
            <select
              className="mentees-status-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
            </select>
            {(search || statusFilter) && (
              <button className="mentees-reset-btn" onClick={() => { setSearch(''); setStatusFilter(''); }}>
                <X size={13} /> Clear
              </button>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="mentees-loading">
              <Loader2 size={32} className="spin" />
              <p>Loading mentees…</p>
            </div>
          ) : error ? (
            <div className="mentees-error">
              <AlertCircle size={28} />
              <p>{error}</p>
              <button className="btn-primary-blue" onClick={fetchMentees}>Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mentees-empty">
              <User size={48} />
              <p>{mentees.length === 0 ? 'No mentees yet. Offer mentorship from the Marketplace or Startup Ideas.' : 'No mentees match your filters.'}</p>
              {mentees.length === 0 && (
                <button className="btn-primary-blue" onClick={() => navigate('/marketplace')}>
                  Browse Marketplace <ChevronRight size={16} />
                </button>
              )}
            </div>
          ) : (
            <div className="mentees-grid">
              {filtered.map(m => (
                <MenteeCard
                  key={m.mentorshipId}
                  mentee={m}
                  onUpdateGoal={handleUpdateGoal}
                  onEnd={(id, name) => setConfirmEnd({ id, name })}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Confirm End Modal */}
      {confirmEnd && (
        <div className="mentees-modal-backdrop" onClick={() => setConfirmEnd(null)}>
          <div className="mentees-confirm-modal" onClick={e => e.stopPropagation()}>
            <h4>End Mentorship?</h4>
            <p>This will mark your mentorship with <strong>{confirmEnd.name}</strong> as completed. This cannot be undone.</p>
            <div className="confirm-modal-actions">
              <button className="btn-confirm-end" onClick={handleEndMentorship}>Yes, End It</button>
              <button className="btn-confirm-cancel" onClick={() => setConfirmEnd(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyMentees;
