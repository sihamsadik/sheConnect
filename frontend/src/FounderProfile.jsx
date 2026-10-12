import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  MessageSquare, 
  Share2, 
  Settings, 
  Trophy, 
  DollarSign, 
  Clock, 
  User, 
  Target, 
  GraduationCap, 
  Building2, 
  TrendingUp, 
  Briefcase,
  ArrowLeft,
  X,
  Loader2,
  AlertCircle,
  Plus,
  Heart
} from 'lucide-react';
import './FounderProfile.css';

function FounderProfile() {
  const [profile, setProfile] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    title: '',
    bio: ''
  });

  const isOwner = true; // Viewing own founder profile

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setError("Please log in to view your founder profile.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch profile endpoint
      const res = await fetch('/api/entrepreneur/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 401 || res.status === 403) {
        setError("Your session has expired. Please log in again.");
        setLoading(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditForm({
          name: data.name || '',
          title: data.title || '',
          bio: data.bio || ''
        });

        if (Array.isArray(data.ideas)) {
          setIdeas(data.ideas);
        }
      } else {
        // Fallback to dashboard and my-ideas endpoints
        const [dashRes, ideasRes] = await Promise.all([
          fetch('/api/entrepreneur/dashboard', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/entrepreneur/my-ideas', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (dashRes.ok) {
          const dashData = await dashRes.json();
          setProfile({
            name: dashData.user?.name || 'Entrepreneur',
            email: dashData.user?.email || '',
            role: typeof dashData.user?.role === 'object' ? dashData.user?.role?.name : dashData.user?.role,
            ideaCount: dashData.ideaCount || 0,
            totalLikes: dashData.totalLikes || 0,
            totalComments: dashData.totalComments || 0,
            bio: '',
            title: ''
          });
          setEditForm({
            name: dashData.user?.name || '',
            title: '',
            bio: ''
          });
        }

        if (ideasRes.ok) {
          const myIdeas = await ideasRes.json();
          setIdeas(Array.isArray(myIdeas) ? myIdeas : []);
        }
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Could not reach backend API at http://localhost:8080.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = () => {
    setEditForm({
      name: profile?.name || '',
      title: profile?.title || '',
      bio: profile?.bio || ''
    });
    setModalError(null);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setModalError(null);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setModalError("You are not logged in. Please log in again.");
      return;
    }

    if (!editForm.name.trim()) {
      setModalError("Full name is required.");
      return;
    }

    setIsSaving(true);
    setModalError(null);
    try {
      const res = await fetch('/api/entrepreneur/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editForm.name.trim(),
          title: editForm.title.trim(),
          bio: editForm.bio.trim()
        })
      });

      if (!res.ok) {
        let msg = "Failed to save profile changes.";
        try {
          const errData = await res.json();
          if (errData && errData.message) {
            msg = errData.message;
          }
        } catch (_) {}
        throw new Error(msg);
      }

      const updated = await res.json();
      setProfile(prev => ({
        ...prev,
        name: updated.name,
        title: updated.title,
        bio: updated.bio
      }));

      // Update user in localStorage so sidebar in dashboard updates too
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          localStorage.setItem('user', JSON.stringify({ 
            ...parsed, 
            name: updated.name,
            title: updated.title,
            bio: updated.bio
          }));
        } catch (e) {
          // Ignore
        }
      }

      setIsEditModalOpen(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 4000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setModalError(err.message || "Failed to save profile changes. Please ensure the backend is running.");
    } finally {
      setIsSaving(false);
    }
  };

  // Safe helpers
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

  const getIndustryName = (ind) => {
    if (!ind) return 'General';
    if (typeof ind === 'object') return ind.name || 'General';
    return String(ind);
  };

  const primaryIdea = ideas.length > 0 ? ideas[0] : null;
  const founderTitle = profile?.title 
    ? profile.title 
    : (primaryIdea ? `Founder & CEO at ${primaryIdea.title}` : 'Startup Founder & Builder');

  return (
    <div className="profile-layout">
      <div className="profile-container">

        {/* Top Back Navigation */}
        <div className="profile-nav-bar">
          <Link to="/dashboard" className="profile-back-link">
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {saveSuccess && (
          <div className="profile-success-banner animate-fade-in-up">
            <CheckCircle size={20} className="flex-shrink-0" />
            <span>Profile updated successfully!</span>
          </div>
        )}

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
            <p>Loading founder profile from backend...</p>
          </div>
        ) : (
          <>
            {/* Header & Identity Block */}
            <div className="profile-header-card animate-fade-in-up">
              <div className="avatar-container">
                <div className="profile-initials-avatar">
                  {getInitials(profile?.name)}
                </div>
                <div className="online-indicator" title="Online"></div>
              </div>
              
              <h1 className="profile-name">
                {profile?.name || 'Verified Entrepreneur'}
                <span className="verified-badge">
                  <CheckCircle className="verified-icon" size={16} />
                  Verified Builder
                </span>
              </h1>
              
              <p className="profile-title">{founderTitle}</p>
              
              <div className="profile-cta-row">
                {isOwner ? (
                  <>
                    <button 
                      className="btn-profile-primary"
                      onClick={handleOpenEditModal}
                    >
                      <Settings size={18} /> Edit Profile
                    </button>
                    <button 
                      className="btn-profile-outline"
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        alert("Profile link copied to clipboard!");
                      }}
                    >
                      <Share2 size={18} /> Share Profile
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-profile-primary">
                      <MessageSquare size={18} /> Connect
                    </button>
                    <button className="btn-profile-outline">
                      <Share2 size={18} /> Share
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Quick Stats Strip (Direct from Backend Database) */}
            <div className="stats-strip animate-fade-in-up delay-1">
              <div className="stat-badge">
                <div className="stat-icon-wrapper">
                  <Trophy size={24} />
                </div>
                <div className="stat-info">
                  <h4>{profile?.ideaCount ?? ideas.length} {profile?.ideaCount === 1 ? 'Startup' : 'Startups'}</h4>
                  <p>Published Ventures</p>
                </div>
              </div>

              <div className="stat-badge">
                <div className="stat-icon-wrapper">
                  <Heart size={24} />
                </div>
                <div className="stat-info">
                  <h4>{profile?.totalLikes ?? 0} Likes</h4>
                  <p>Community Endorsements</p>
                </div>
              </div>

              <div className="stat-badge">
                <div className="stat-icon-wrapper">
                  <MessageSquare size={24} />
                </div>
                <div className="stat-info">
                  <h4>{profile?.totalComments ?? 0} Comments</h4>
                  <p>Investor & Advisor Discussions</p>
                </div>
              </div>
            </div>

            {/* Short Bio */}
            <div className="profile-section animate-fade-in-up delay-2">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 className="section-title" style={{ margin: 0 }}>
                  <User className="section-icon" size={24} />
                  About Me
                </h2>
                <button 
                  onClick={handleOpenEditModal}
                  style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}
                >
                  Edit Bio
                </button>
              </div>
              <p className="bio-text">
                {profile?.bio && profile.bio.trim() ? (
                  profile.bio
                ) : (
                  <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>
                    No personal bio added yet. Click "Edit Profile" above to share your background, execution experience, and startup mission.
                  </span>
                )}
              </p>
            </div>

            {/* Current Focus Card (Real Active Startup Idea from Database) */}
            <div className="profile-section current-focus-card animate-fade-in-up delay-2">
              <div className="focus-header">
                <div className="company-info">
                  <h2 className="section-title" style={{ marginBottom: '8px' }}>
                    <Target className="section-icon" size={24} style={{ color: '#2563EB' }} />
                    Current Focus
                  </h2>
                  <h3>{primaryIdea ? primaryIdea.title : 'No Active Startup Listing'}</h3>
                  <p className="company-role">
                    {primaryIdea ? `Sector: ${getIndustryName(primaryIdea.industry)}` : 'Ready to launch'}
                  </p>
                </div>
                <span className="stage-badge">
                  {primaryIdea ? 'Active Venture' : 'Ideation'}
                </span>
              </div>
              
              {primaryIdea ? (
                <>
                  <h4 className="milestones-title">Venture Overview</h4>
                  <div className="milestones-list">
                    <div className="milestone-item">
                      <CheckCircle className="milestone-icon" size={18} />
                      <strong>Industry:</strong> {getIndustryName(primaryIdea.industry)}
                    </div>
                    {primaryIdea.lookingFor && primaryIdea.lookingFor.length > 0 && (
                      <div className="milestone-item">
                        <CheckCircle className="milestone-icon" size={18} />
                        <strong>Seeking:</strong> {primaryIdea.lookingFor.map(n => typeof n === 'object' ? n.name : n).join(', ')}
                      </div>
                    )}
                    <div className="milestone-item">
                      <CheckCircle className="milestone-icon" size={18} />
                      <strong>Community Traction:</strong> {primaryIdea.likeCount || 0} Likes & {primaryIdea.commentCount || 0} Comments
                    </div>
                  </div>
                </>
              ) : (
                <div className="empty-venture-box">
                  <p style={{ color: '#64748B', margin: '0 0 12px 0' }}>
                    You have not published any startup ideas yet. Create an idea to showcase your venture to investors.
                  </p>
                  <Link to="/create-idea" style={{ textDecoration: 'none' }}>
                    <button className="btn-profile-primary" style={{ display: 'inline-flex', padding: '8px 18px', fontSize: '0.88rem' }}>
                      <Plus size={16} /> Publish Your Startup Idea
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Startup Portfolio / Experience (Real Ideas from Database) */}
            <div className="profile-section animate-fade-in-up delay-3">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 className="section-title" style={{ margin: 0 }}>
                  <Briefcase className="section-icon" size={24} />
                  My Startup Ventures ({ideas.length})
                </h2>
                <Link to="/create-idea" style={{ textDecoration: 'none' }}>
                  <button className="btn-profile-primary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                    <Plus size={14} /> New Venture
                  </button>
                </Link>
              </div>
              
              {ideas.length === 0 ? (
                <div className="empty-venture-box">
                  <p style={{ color: '#64748B', margin: 0 }}>
                    No startup projects found in your portfolio.
                  </p>
                </div>
              ) : (
                <div className="timeline">
                  {ideas.map((idea, index) => (
                    <div key={idea.id || index} className="timeline-item">
                      <div className="timeline-logo">
                        <Building2 className="timeline-logo-icon" size={24} />
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <div className="timeline-title">
                            <h4>{idea.title}</h4>
                            <p>Founder & Creator · {getIndustryName(idea.industry)}</p>
                          </div>
                          <span className="timeline-date">
                            {idea.createdAt ? new Date(idea.createdAt).toLocaleDateString() : 'Active'}
                          </span>
                        </div>
                        <div className="timeline-details">
                          <span className="timeline-badge success">
                            {idea.likeCount || 0} Likes
                          </span>
                          <span className="timeline-badge">
                            {idea.commentCount || 0} Discussions
                          </span>
                          {idea.lookingFor && idea.lookingFor.map((n, i) => (
                            <span key={i} className="timeline-badge" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                              Needs: {typeof n === 'object' ? n.name : n}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </>
        )}

      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal-backdrop animate-fade-in">
          <div className="modal-card animate-fade-in-up">
            <div className="modal-header">
              <h3>Edit Founder Profile</h3>
              <button 
                className="modal-close-btn"
                onClick={handleCloseEditModal}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="modal-body">
                {modalError && (
                  <div className="modal-error-alert animate-fade-in">
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <div className="modal-group">
                  <label htmlFor="edit-name">Full Name</label>
                  <input 
                    type="text" 
                    id="edit-name"
                    className="modal-input"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Jane Doe"
                    required
                  />
                </div>

                <div className="modal-group">
                  <label htmlFor="edit-title">Professional Title</label>
                  <input 
                    type="text" 
                    id="edit-title"
                    className="modal-input"
                    placeholder="e.g. Founder & CEO, Product Lead"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="modal-group">
                  <label htmlFor="edit-bio">About Me (Bio)</label>
                  <textarea 
                    id="edit-bio"
                    className="modal-textarea"
                    placeholder="Describe your background, domain expertise, and founder journey..."
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    maxLength={1000}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8', textAlign: 'right' }}>
                    {editForm.bio.length} / 1000 characters
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-profile-outline"
                  onClick={handleCloseEditModal}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-profile-primary"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Loader2 size={16} className="animate-spin" /> Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FounderProfile;
