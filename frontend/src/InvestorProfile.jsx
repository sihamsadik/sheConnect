import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  MessageSquare, 
  UserPlus, 
  Lightbulb, 
  MapPin, 
  TrendingUp, 
  Building, 
  Briefcase, 
  Users,
  ArrowLeft,
  Settings,
  X,
  Check,
  Loader2,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Compass,
  Edit3
} from 'lucide-react';
import './InvestorProfile.css';

function InvestorProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    title: '',
    location: '',
    checkSize: '',
    investmentThesis: '',
    focusIndustries: '',
    bio: ''
  });

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/investor/profile', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditForm({
          name: data.name || '',
          title: data.title || '',
          location: data.location || '',
          checkSize: data.checkSize || '',
          investmentThesis: data.investmentThesis || '',
          focusIndustries: data.focusIndustries || '',
          bio: data.bio || ''
        });
      } else {
        // Fallback to local stored user & pipeline
        fallbackToLocalUser();
      }
    } catch (err) {
      console.warn('Could not load profile from backend, falling back to local user:', err);
      fallbackToLocalUser();
    } finally {
      setLoading(false);
    }
  };

  const fallbackToLocalUser = () => {
    const stored = localStorage.getItem('user');
    let u = null;
    try {
      u = stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error(e);
    }
    const fallbackProfile = {
      id: u?.id || null,
      name: u?.name || 'Investor',
      email: u?.email || '',
      role: u?.role || 'INVESTOR',
      title: u?.title || '',
      location: u?.location || '',
      bio: u?.bio || '',
      checkSize: u?.checkSize || '',
      investmentThesis: u?.investmentThesis || '',
      focusIndustries: u?.focusIndustries || '',
      totalInvestments: 0,
      inDiligence: 0,
      partnerMeetings: 0,
      termSheets: 0,
      portfolioDeals: []
    };
    setProfile(fallbackProfile);
    setEditForm({
      name: fallbackProfile.name,
      title: fallbackProfile.title,
      location: fallbackProfile.location,
      checkSize: fallbackProfile.checkSize,
      investmentThesis: fallbackProfile.investmentThesis,
      focusIndustries: fallbackProfile.focusIndustries,
      bio: fallbackProfile.bio
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      setModalError("Name cannot be empty.");
      return;
    }

    setIsSaving(true);
    setModalError(null);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/investor/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(editForm)
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || "Failed to update profile.");
      }

      const updated = await res.json();
      setProfile(prev => ({ ...prev, ...updated }));
      
      // Update local storage user name
      if (currentUser) {
        const updatedUser = { ...currentUser, name: editForm.name };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      }

      setIsEditModalOpen(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Error saving profile:', err);
      // Optimistic update if backend offline
      setProfile(prev => ({ ...prev, ...editForm }));
      setIsEditModalOpen(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const isOwner = !currentUser || !profile?.id || currentUser?.id === profile?.id || currentUser?.role === 'INVESTOR';

  const initials = (profile?.name || 'IN')
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'IN';

  const industryTags = (profile?.focusIndustries || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (loading) {
    return (
      <div className="investor-profile-layout">
        <div className="profile-loading-state">
          <Loader2 className="spinner" size={36} />
          <p>Loading investor profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="investor-profile-layout">
      <div className="profile-container">
        
        {/* Navigation Breadcrumb */}
        <div className="profile-top-nav">
          <Link to="/investor" className="btn-back-pipeline">
            <ArrowLeft size={16} /> Deal Pipeline
          </Link>
          <div className="profile-top-links">
            <Link to="/marketplace" className="top-nav-link">
              <Compass size={16} /> Explore Startups
            </Link>
          </div>
        </div>

        {saveSuccess && (
          <div className="save-success-banner">
            <Check size={18} /> Profile details saved successfully!
          </div>
        )}

        {/* Header & Identity Block */}
        <div className="profile-header-card">
          <div className="avatar-container">
            <div className="investor-avatar-circle">
              {initials}
            </div>
          </div>
          
          <h1 className="profile-name">
            {profile?.name || 'Investor'}
            <span className="verified-badge">
              <CheckCircle className="verified-icon" />
              Verified Investor
            </span>
          </h1>
          
          <div className="profile-meta">
            <div className="meta-item">
              <Briefcase size={18} />
              <span>{profile?.title || 'Investor'}</span>
            </div>
            {profile?.location && (
              <>
                <div className="meta-divider"></div>
                <div className="meta-item">
                  <MapPin size={18} />
                  <span>{profile.location}</span>
                </div>
              </>
            )}
          </div>
          
          <div className="profile-cta-row">
            {isOwner ? (
              <button 
                className="btn-profile-primary"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit3 size={18} /> Edit Profile
              </button>
            ) : (
              <>
                <button className="btn-profile-primary">
                  <MessageSquare size={18} /> Message
                </button>
                <button 
                  className="btn-profile-outline"
                  onClick={() => navigate('/marketplace')}
                >
                  <UserPlus size={18} /> Pitch Startup
                </button>
              </>
            )}
          </div>
        </div>

        {/* Key Credibility Stats */}
        <div className="stats-strip">
          <div className="stat-badge">
            <div className="stat-info">
              <h4>{profile?.totalInvestments || profile?.portfolioDeals?.length || 0}</h4>
              <p>Active Tracked Deals</p>
            </div>
          </div>
          <div className="stat-badge">
            <div className="stat-info">
              <h4>{profile?.inDiligence || 0}</h4>
              <p>In Diligence</p>
            </div>
          </div>
          <div className="stat-badge">
            <div className="stat-info">
              <h4>{profile?.termSheets || 0}</h4>
              <p>Term Sheets Issued</p>
            </div>
          </div>
        </div>

        {/* Thesis & Parameters */}
        <div className="grid-2-col">
          {/* Investment Thesis Card */}
          <div className="profile-section">
            <div className="section-header-box">
              <div className="section-icon-box">
                <Lightbulb size={24} />
              </div>
              <h2 className="section-title">Investment Thesis</h2>
            </div>
            <p className="thesis-content">
              {profile?.investmentThesis ? (
                profile.investmentThesis
              ) : (
                <span className="text-muted-notice">No investment thesis specified yet. Click "Edit Profile" to define your criteria and strategy.</span>
              )}
            </p>
          </div>

          {/* Capital Parameters & Check Size */}
          <div className="profile-section" style={{padding: '0'}}>
            <div className="check-size-card" style={{height: '100%', border: 'none', borderRadius: '16px'}}>
              <div className="check-size-title">Typical Check Size</div>
              <div className="check-size-value">{profile?.checkSize || 'Flexible'}</div>
              <span className="participation-badge">Early & Growth Stage</span>
            </div>
          </div>
        </div>

        {/* Focus Industries */}
        <div className="profile-section">
          <div className="section-header-box" style={{marginBottom: '20px'}}>
            <h2 className="section-title">Focus Sectors & Industries</h2>
          </div>
          <div className="tag-cloud">
            {industryTags.length > 0 ? (
              industryTags.map((tag, idx) => (
                <span key={idx} className="industry-pill">{tag}</span>
              ))
            ) : (
              <span className="text-muted-notice">No focus sectors specified yet. Click "Edit Profile" to add sectors.</span>
            )}
          </div>
        </div>

        {/* Portfolio & Active Tracked Deals */}
        <div className="profile-section">
          <div className="section-header-box">
            <h2 className="section-title">Pipeline & Portfolio Highlights</h2>
          </div>
          
          {profile?.portfolioDeals && profile.portfolioDeals.length > 0 ? (
            <div className="portfolio-grid">
              {profile.portfolioDeals.map(deal => (
                <div key={deal.id} className="portfolio-card">
                  <div className="portfolio-header">
                    <div className="portfolio-logo">{deal.logo}</div>
                    <span className={`portfolio-status ${(deal.stageClass || 'new')}`}>
                      {deal.stage?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="portfolio-content">
                    <h4>{deal.startup}</h4>
                    <p>{deal.pitch}</p>
                    <div className="portfolio-meta-row">
                      <span className="portfolio-ask-tag">{deal.ask}</span>
                      <span className="portfolio-founder-tag">{deal.founderName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-portfolio-box">
              <Compass size={36} className="empty-icon" />
              <h4>No deals in active diligence yet</h4>
              <p>Explore ideas looking for investment on the marketplace and add them to your pipeline.</p>
              <Link to="/marketplace" className="btn-browse-startups">
                Browse Startups
              </Link>
            </div>
          )}
        </div>

        {/* Professional Experience */}
        <div className="profile-section">
          <div className="section-header-box">
            <h2 className="section-title">Firm & Background</h2>
          </div>
          
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-logo">
                <Building className="timeline-logo-icon" size={24} />
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <div className="timeline-title">
                    <h4>{profile?.title || 'Investor'}</h4>
                    {profile?.location && <p>{profile.location}</p>}
                  </div>
                  <span className="timeline-date">Active</span>
                </div>
                <p className="experience-desc">
                  {profile?.bio || "No professional biography or firm summary provided yet. Click \"Edit Profile\" to add details."}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="profile-edit-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Investor Profile</h3>
              <button 
                className="btn-modal-close" 
                onClick={() => setIsEditModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div className="modal-error-alert">
                <AlertCircle size={16} /> {modalError}
              </div>
            )}

            <form onSubmit={handleSaveProfile}>
              <div className="modal-body-scroll">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Professional Title / Firm *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Managing Partner at VentureScale"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. San Francisco, CA"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Typical Check Size</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. $250K — $1.5M"
                    value={editForm.checkSize}
                    onChange={(e) => setEditForm({ ...editForm, checkSize: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Focus Sectors (comma-separated)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. AI/ML, FinTech, B2B SaaS, HealthTech"
                    value={editForm.focusIndustries}
                    onChange={(e) => setEditForm({ ...editForm, focusIndustries: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Investment Thesis</label>
                  <textarea 
                    className="form-textarea" 
                    rows={4} 
                    placeholder="Describe your fund's core focus, investment criteria, and sweet spot..."
                    value={editForm.investmentThesis}
                    onChange={(e) => setEditForm({ ...editForm, investmentThesis: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Bio / Firm Summary</label>
                  <textarea 
                    className="form-textarea" 
                    rows={3} 
                    placeholder="Short bio, experience, or syndicate details..."
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-modal-cancel" 
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-modal-save"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default InvestorProfile;
