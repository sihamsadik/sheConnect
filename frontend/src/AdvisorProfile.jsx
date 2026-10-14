import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  CheckCircle,
  MessageSquare,
  MapPin,
  Users,
  CalendarDays,
  Target,
  Briefcase,
  Loader2,
  AlertCircle
} from 'lucide-react';
import './AdvisorProfile.css';

function AdvisorProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const url = id ? `/api/advisor/profile/${id}` : '/api/advisor/profile/me';

    fetch(url, { headers })
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="advisor-profile-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={32} className="spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="advisor-profile-layout" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '60px' }}>
        <AlertCircle size={32} />
        <p>{error || 'Advisor not found.'}</p>
      </div>
    );
  }

  const industries = profile.focusIndustries
    ? profile.focusIndustries.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="advisor-profile-layout">
      <div className="profile-container">

        {/* Header & Identity Block */}
        <div className="profile-header-card">
          <div className="avatar-container">
            <div className="profile-avatar" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontSize: '2rem', fontWeight: 700,
              width: '100%', height: '100%', borderRadius: '50%'
            }}>
              {profile.initials}
            </div>
          </div>

          <h1 className="profile-name">
            {profile.name}
            <span className="verified-badge">
              <CheckCircle className="verified-icon" />
              Verified Advisor
            </span>
          </h1>

          <div className="profile-meta">
            {profile.title && (
              <div className="meta-item">
                <Briefcase size={18} />
                <span>{profile.title}</span>
              </div>
            )}
            {profile.location && (
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
            {!profile.owner && (
              <>
                <button className="btn-profile-primary">
                  <CalendarDays size={18} /> Request Advisory
                </button>
                <button className="btn-profile-outline">
                  <MessageSquare size={18} /> Message
                </button>
              </>
            )}
          </div>
        </div>

        {/* Key Credibility Stats */}
        <div className="stats-strip">
          <div className="stat-badge">
            <div className="stat-info">
              <h4>{profile.startupsAdvised}</h4>
              <p>Active Mentees</p>
            </div>
          </div>
        </div>

        {/* About / Bio */}
        {profile.bio && (
          <div className="profile-section approach-section">
            <div className="section-header-box">
              <div className="section-icon-box">
                <Target size={24} />
              </div>
              <h2 className="section-title">About</h2>
            </div>
            <div className="approach-content">
              <p>{profile.bio}</p>
            </div>
          </div>
        )}

        {/* Focus Industries */}
        {industries.length > 0 && (
          <div className="profile-section">
            <div className="section-header-box" style={{ marginBottom: '20px' }}>
              <h2 className="section-title">Focus Industries</h2>
            </div>
            <div className="tag-cloud">
              {industries.map((ind, i) => (
                <span key={i} className="expertise-pill">{ind}</span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdvisorProfile;
