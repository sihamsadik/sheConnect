import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket, LayoutDashboard, Globe, Users, MessageSquare, Settings,
  Lightbulb, Search, Bell, Loader2, AlertCircle, CheckCircle,
  User, MapPin, Briefcase, FileText, Tag, Lock, Eye, EyeOff, Save
} from 'lucide-react';
import './AdvisorSettings.css';

function getAuthHeaders(json = true) {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  if (json) headers['Content-Type'] = 'application/json';
  return headers;
}

function AdvisorSettings() {
  // ---- Profile form ----
  const [form, setForm] = useState({
    name: '', email: '', title: '', location: '', bio: '', focusIndustries: ''
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileNotice, setProfileNotice] = useState(null);

  // ---- Password form ----
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [pwNotice, setPwNotice] = useState(null);

  const fetchSettings = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const res = await fetch('/api/advisor/settings', { headers: getAuthHeaders(false) });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setForm({
        name: data.name || '',
        email: data.email || '',
        title: data.title || '',
        location: data.location || '',
        bio: data.bio || '',
        focusIndustries: data.focusIndustries || ''
      });
    } catch (err) {
      setProfileNotice({ type: 'error', text: err.message });
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleProfileChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (profileNotice) setProfileNotice(null);
  };

  const handleProfileSave = async e => {
    e.preventDefault();
    if (!form.name.trim()) {
      setProfileNotice({ type: 'error', text: 'Name is required.' });
      return;
    }
    setSavingProfile(true);
    setProfileNotice(null);
    try {
      const res = await fetch('/api/advisor/settings', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: form.name,
          title: form.title,
          location: form.location,
          bio: form.bio,
          focusIndustries: form.focusIndustries
        })
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const updated = await res.json();
      setForm(prev => ({ ...prev, ...updated }));
      // sync name in localStorage if stored
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const u = JSON.parse(stored);
          localStorage.setItem('user', JSON.stringify({ ...u, name: updated.name }));
        } catch (_) {}
      }
      setProfileNotice({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setProfileNotice({ type: 'error', text: err.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePwChange = e => {
    setPwForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (pwNotice) setPwNotice(null);
  };

  const handlePasswordSave = async e => {
    e.preventDefault();
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      setPwNotice({ type: 'error', text: 'All password fields are required.' });
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwNotice({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwNotice({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    setSavingPw(true);
    setPwNotice(null);
    try {
      const res = await fetch('/api/advisor/settings/password', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error: ${res.status}`);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwNotice({ type: 'success', text: 'Password changed successfully.' });
    } catch (err) {
      setPwNotice({ type: 'error', text: err.message });
    } finally {
      setSavingPw(false);
    }
  };

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
          <Link to="/my-mentees" className="sidebar-link">
            <div className="sidebar-link-content">
              <Users className="sidebar-icon" size={20} /><span>My Mentees</span>
            </div>
          </Link>
          <Link to="#" className="sidebar-link">
            <div className="sidebar-link-content">
              <MessageSquare className="sidebar-icon" size={20} /><span>Messages</span>
            </div>
          </Link>
          <Link to="/advisor-settings" className="sidebar-link active">
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
              <input type="text" className="search-input" placeholder="Search…" readOnly />
            </div>
          </div>
          <div className="header-actions">
            <button className="notification-btn"><Bell size={20} /></button>
          </div>
        </header>

        <div className="content-scroll">
          <div className="settings-page-hero">
            <h2 className="settings-page-title"><Settings size={22} /> Settings</h2>
            <p className="settings-page-subtitle">Manage your profile information and account security.</p>
          </div>

          {loadingProfile ? (
            <div className="settings-loading">
              <Loader2 size={32} className="spin" />
              <p>Loading your settings…</p>
            </div>
          ) : (
            <div className="settings-grid">

              {/* ---- Profile Section ---- */}
              <section className="settings-card">
                <div className="settings-card-header">
                  <User size={20} />
                  <h3>Profile Information</h3>
                </div>

                {profileNotice && (
                  <div className={`settings-notice ${profileNotice.type}`}>
                    {profileNotice.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                    <span>{profileNotice.text}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSave} className="settings-form">
                  <div className="settings-form-row">
                    <div className="settings-field">
                      <label><User size={14} /> Full Name</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleProfileChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="settings-field">
                      <label><Briefcase size={14} /> Title / Role</label>
                      <input
                        name="title"
                        value={form.title}
                        onChange={handleProfileChange}
                        placeholder="e.g. Startup Advisor & Angel Investor"
                      />
                    </div>
                  </div>

                  <div className="settings-form-row">
                    <div className="settings-field">
                      <label><MapPin size={14} /> Location</label>
                      <input
                        name="location"
                        value={form.location}
                        onChange={handleProfileChange}
                        placeholder="e.g. Nairobi, Kenya"
                      />
                    </div>
                    <div className="settings-field">
                      <label><Tag size={14} /> Focus Industries</label>
                      <input
                        name="focusIndustries"
                        value={form.focusIndustries}
                        onChange={handleProfileChange}
                        placeholder="e.g. FinTech, HealthTech, EdTech"
                      />
                      <span className="settings-field-hint">Comma-separated list</span>
                    </div>
                  </div>

                  <div className="settings-field settings-field--full">
                    <label><FileText size={14} /> Bio</label>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleProfileChange}
                      placeholder="Tell founders about your background, expertise, and advisory style…"
                      rows={4}
                      maxLength={1000}
                    />
                    <span className="settings-field-hint">{form.bio.length} / 1000</span>
                  </div>

                  <div className="settings-field settings-field--full settings-field--readonly">
                    <label>Email Address</label>
                    <input value={form.email} readOnly tabIndex={-1} />
                    <span className="settings-field-hint">Email cannot be changed here.</span>
                  </div>

                  <div className="settings-form-actions">
                    <button type="submit" className="btn-settings-save" disabled={savingProfile}>
                      {savingProfile ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                      {savingProfile ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </section>

              {/* ---- Password Section ---- */}
              <section className="settings-card">
                <div className="settings-card-header">
                  <Lock size={20} />
                  <h3>Change Password</h3>
                </div>

                {pwNotice && (
                  <div className={`settings-notice ${pwNotice.type}`}>
                    {pwNotice.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                    <span>{pwNotice.text}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordSave} className="settings-form">
                  <div className="settings-field settings-field--full">
                    <label>Current Password</label>
                    <div className="settings-pw-wrap">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        name="currentPassword"
                        value={pwForm.currentPassword}
                        onChange={handlePwChange}
                        placeholder="Enter your current password"
                        autoComplete="current-password"
                      />
                      <button type="button" className="pw-toggle" onClick={() => setShowCurrent(v => !v)}>
                        {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="settings-form-row">
                    <div className="settings-field">
                      <label>New Password</label>
                      <div className="settings-pw-wrap">
                        <input
                          type={showNew ? 'text' : 'password'}
                          name="newPassword"
                          value={pwForm.newPassword}
                          onChange={handlePwChange}
                          placeholder="Min. 6 characters"
                          autoComplete="new-password"
                        />
                        <button type="button" className="pw-toggle" onClick={() => setShowNew(v => !v)}>
                          {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="settings-field">
                      <label>Confirm New Password</label>
                      <div className="settings-pw-wrap">
                        <input
                          type="password"
                          name="confirmPassword"
                          value={pwForm.confirmPassword}
                          onChange={handlePwChange}
                          placeholder="Repeat new password"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="settings-form-actions">
                    <button type="submit" className="btn-settings-save" disabled={savingPw}>
                      {savingPw ? <Loader2 size={16} className="spin" /> : <Lock size={16} />}
                      {savingPw ? 'Updating…' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </section>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdvisorSettings;
