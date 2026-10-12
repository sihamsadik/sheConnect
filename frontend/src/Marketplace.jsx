import React, { useState, useEffect } from 'react';
import { 
  Search,
  Grid,
  List as ListIcon,
  X,
  Bookmark,
  MessageSquare,
  Clock,
  PieChart,
  Heart,
  Send,
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';
import './Marketplace.css';

function Marketplace() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  // Discussion / comment modal state
  const [activeIdeaModal, setActiveIdeaModal] = useState(null);
  const [modalComments, setModalComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    fetchMarketplaceIdeas();
  }, []);

  const fetchMarketplaceIdeas = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/interactions/ideas', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(idea => ({
            id: idea.id,
            startup: idea.title,
            logo: (idea.title || 'SC').substring(0, 2).toUpperCase(),
            stage: 'Active',
            industry: typeof idea.industry === 'object' ? idea.industry?.name : (idea.industry || 'Tech'),
            expertise: idea.lookingFor && idea.lookingFor.length > 0 ? `Seeking ${idea.lookingFor.join(', ')}` : 'Seeking Mentorship',
            summary: idea.description || idea.solution || 'Building high-impact technology.',
            problem: idea.problem || 'Scaling product, refining go-to-market strategy, and securing partners.',
            founder: idea.user?.name || idea.ideaAdmin?.name || 'Verified Founder',
            founderInitials: ((idea.user?.name || idea.ideaAdmin?.name || 'VF').split(' ').map(n => n[0]).join('')).substring(0, 2).toUpperCase(),
            commitment: 'Flexible',
            compensation: 'Advisory / Network',
            likeCount: idea.likeCount || 0,
            likedByCurrentUser: !!idea.likedByCurrentUser,
            commentCount: idea.commentCount || (idea.comment ? idea.comment.length : 0),
            comments: idea.comment || []
          }));
          setOpportunities(mapped);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Could not load backend ideas, displaying defaults:", err);
    }

    // Default curated fallback opportunities
    setOpportunities([
      {
        id: 101,
        startup: 'Lumina Analytics',
        logo: 'LA',
        stage: 'Seed',
        industry: 'FinTech',
        expertise: 'Looking for GTM Advisor',
        summary: 'We provide predictive foot-traffic analytics for brick-and-mortar retail.',
        problem: 'We have strong organic traction but lack a scalable outbound enterprise sales motion.',
        founder: 'Sarah Jenkins',
        founderInitials: 'SJ',
        commitment: '2 hrs / month',
        compensation: 'Advisory Equity 0.5%',
        likeCount: 14,
        likedByCurrentUser: false,
        commentCount: 3,
        comments: []
      },
      {
        id: 102,
        startup: 'Nexus API',
        logo: 'NX',
        stage: 'Series A',
        industry: 'Web3',
        expertise: 'Looking for Technical Architecture',
        summary: 'Unified data aggregation layer for decentralized identity verification.',
        problem: 'Need guidance on scaling our open-source developer community and DevRel strategy.',
        founder: 'Marcus Reynolds',
        founderInitials: 'MR',
        commitment: 'Ad-hoc / Hourly',
        compensation: 'Retainer',
        likeCount: 28,
        likedByCurrentUser: false,
        commentCount: 5,
        comments: []
      },
      {
        id: 103,
        startup: 'EcoLogistics',
        logo: 'EL',
        stage: 'Pre-seed',
        industry: 'B2B SaaS',
        expertise: 'Looking for Fundraising Prep',
        summary: 'Carbon-neutral supply chain optimization software for mid-market logistics.',
        problem: 'Preparing for our Seed round in Q3; need feedback on narrative and pitch deck.',
        founder: 'David Chen',
        founderInitials: 'DC',
        commitment: '1 hr / week',
        compensation: 'Pro Bono (Introductory)',
        likeCount: 9,
        likedByCurrentUser: false,
        commentCount: 2,
        comments: []
      }
    ]);
    setLoading(false);
  };

  const handleToggleLike = async (ideaId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to like ideas.");
      return;
    }

    // Optimistic toggle
    setOpportunities(prev => prev.map(opp => {
      if (opp.id === ideaId) {
        const currentlyLiked = !!opp.likedByCurrentUser;
        return {
          ...opp,
          likedByCurrentUser: !currentlyLiked,
          likeCount: currentlyLiked ? Math.max(0, opp.likeCount - 1) : opp.likeCount + 1
        };
      }
      return opp;
    }));

    if (activeIdeaModal && activeIdeaModal.id === ideaId) {
      setActiveIdeaModal(prev => {
        const currentlyLiked = !!prev.likedByCurrentUser;
        return {
          ...prev,
          likedByCurrentUser: !currentlyLiked,
          likeCount: currentlyLiked ? Math.max(0, prev.likeCount - 1) : prev.likeCount + 1
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
        setOpportunities(prev => prev.map(opp => {
          if (opp.id === ideaId) {
            return {
              ...opp,
              likeCount: data.likeCount,
              likedByCurrentUser: data.likedByCurrentUser
            };
          }
          return opp;
        }));
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleOpenDiscussion = async (opp) => {
    setActiveIdeaModal(opp);
    setNewCommentText('');
    setCommentError(null);
    setLoadingComments(true);

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/interactions/startup-ideas/${opp.id}/comments`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        setModalComments(Array.isArray(data) ? data : []);
      } else {
        setModalComments(opp.comments || []);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setModalComments(opp.comments || []);
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
      setCommentError("Please log in to post feedback or advisory notes.");
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

      const created = await res.json();
      const userStored = localStorage.getItem('user');
      const currentUser = userStored ? JSON.parse(userStored) : null;

      const formatted = {
        id: created.id || created.commentId || Date.now(),
        content: created.content || newCommentText.trim(),
        authorName: created.authorName || currentUser?.name || 'Advisor',
        authorRole: created.authorRole || currentUser?.role || 'ADVISOR',
        createdAt: created.createdAt || new Date().toISOString()
      };

      setModalComments(prev => [formatted, ...prev]);
      setNewCommentText('');

      // Update count on opportunity card
      setOpportunities(prev => prev.map(item => {
        if (item.id === activeIdeaModal.id) {
          return {
            ...item,
            commentCount: (item.commentCount || 0) + 1
          };
        }
        return item;
      }));

      setActiveIdeaModal(prev => ({
        ...prev,
        commentCount: (prev.commentCount || 0) + 1
      }));
    } catch (err) {
      console.error("Error posting comment:", err);
      setCommentError(err.message || "Failed to post comment.");
    } finally {
      setIsPostingComment(false);
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = !searchQuery || 
      opp.startup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.expertise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = !selectedIndustry || opp.industry?.toLowerCase() === selectedIndustry.toLowerCase();
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="marketplace-layout">
      
      {/* Header & Search Strip */}
      <header className="marketplace-header">
        <div className="header-content">
          <h1 className="marketplace-title">Mentorship Marketplace</h1>
          <p className="marketplace-subtitle">Discover vetted startups seeking strategic guidance, advisory, and investment.</p>
          
          <div className="search-strip">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                className="marketplace-search" 
                placeholder="Search startups, industries, or required expertise..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid size={20} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <ListIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filter & Tag Bar */}
      <div className="filter-bar-container">
        <div className="filter-bar">
          <select 
            className="filter-dropdown"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          >
            <option value="">All Industries</option>
            <option value="FinTech">FinTech</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="B2B SaaS">B2B SaaS</option>
            <option value="Web3">Web3</option>
          </select>

          <button 
            className="reset-filter-btn"
            onClick={() => {
              setSearchQuery('');
              setSelectedIndustry('');
            }}
          >
            <X size={16} /> Clear Filters
          </button>
        </div>
      </div>

      {/* Opportunity Cards Grid */}
      <div className="marketplace-grid-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748B' }}>
            <Loader2 size={32} className="animate-spin" color="#2563EB" style={{ margin: '0 auto 12px' }} />
            <p>Loading startup ventures...</p>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748B' }}>
            <p>No startup opportunities match your filter criteria.</p>
          </div>
        ) : (
          <div className={`opportunity-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
            {filteredOpportunities.map(opp => (
              <div key={opp.id} className="opportunity-card" onClick={() => handleOpenDiscussion(opp)}>
                
                <div className="card-header">
                  <div className="startup-logo">{opp.logo}</div>
                  <div className="startup-info">
                    <div className="startup-name-row">
                      <h3 className="startup-name">{opp.startup}</h3>
                      <span className="stage-pill">{opp.industry || opp.stage}</span>
                    </div>
                  </div>
                </div>

                <span className="seeking-badge">{opp.expertise}</span>
                
                <p className="elevator-summary">
                  {opp.summary}
                  <strong>Specific Challenge:</strong>
                  {opp.problem}
                </p>

                <div className="founder-snippet">
                  <div className="founder-snippet-avatar">{opp.founderInitials}</div>
                  <div className="founder-snippet-info">
                    <p>{opp.founder}</p>
                    <span>Founder</span>
                  </div>
                </div>

                <div className="terms-row">
                  <span className="commitment-badge">
                    <Clock size={14} /> {opp.commitment}
                  </span>
                  <span className="commitment-badge">
                    <PieChart size={14} /> {opp.compensation}
                  </span>
                </div>

                <div className="card-actions">
                  <button 
                    className={`btn-marketplace-like ${opp.likedByCurrentUser ? 'liked' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLike(opp.id);
                    }}
                    title={opp.likedByCurrentUser ? "Unlike" : "Like"}
                  >
                    <Heart size={18} className={opp.likedByCurrentUser ? 'heart-filled' : ''} />
                    <span>{opp.likeCount || 0}</span>
                  </button>

                  <button 
                    className="btn-offer-mentorship"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDiscussion(opp);
                    }}
                  >
                    <MessageSquare size={18} /> Discussion ({opp.commentCount || 0})
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Discussion & Comments Modal */}
      {activeIdeaModal && (
        <div className="modal-backdrop animate-fade-in" onClick={handleCloseDiscussion}>
          <div className="modal-card discussion-modal animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-info">
                <h3>{activeIdeaModal.startup || activeIdeaModal.title}</h3>
                <span className="stage-pill">{activeIdeaModal.industry || 'Startup'}</span>
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
                  <span>Founder: <strong>{activeIdeaModal.founder || 'Entrepreneur'}</strong></span>
                </div>

                <button 
                  className={`like-toggle-btn ${activeIdeaModal.likedByCurrentUser ? 'active' : ''}`}
                  onClick={() => handleToggleLike(activeIdeaModal.id)}
                >
                  <Heart size={16} className={activeIdeaModal.likedByCurrentUser ? 'heart-filled' : ''} />
                  <span>{activeIdeaModal.likeCount || 0} {activeIdeaModal.likeCount === 1 ? 'Like' : 'Likes'}</span>
                </button>
              </div>

              {/* Problem & Solution */}
              <div className="idea-summary-box">
                <p><strong>Overview:</strong> {activeIdeaModal.summary}</p>
                {activeIdeaModal.problem && <p><strong>Challenge:</strong> {activeIdeaModal.problem}</p>}
              </div>

              {/* Comments Section */}
              <div className="comments-section">
                <h4>Feedback & Advisory Discussions ({modalComments.length})</h4>
                
                {loadingComments ? (
                  <div className="comments-loading">
                    <Loader2 size={24} className="animate-spin" color="#2563EB" />
                    <span>Loading discussion...</span>
                  </div>
                ) : modalComments.length === 0 ? (
                  <div className="no-comments-box">
                    <MessageSquare size={28} color="#94A3B8" />
                    <p>No feedback or notes posted yet. Offer guidance or share thoughts with this founder!</p>
                  </div>
                ) : (
                  <div className="comments-list">
                    {modalComments.map((c, idx) => (
                      <div key={c.id || c.commentId || idx} className="comment-card">
                        <div className="comment-header">
                          <div className="comment-author">
                            <div className="comment-avatar">
                              {((c.authorName || c.userName || 'AD').substring(0, 2)).toUpperCase()}
                            </div>
                            <div className="comment-author-meta">
                              <span className="author-name">
                                {c.authorName || c.userName || 'Advisor / Investor'}
                              </span>
                              {(c.authorRole || c.userRole) && (
                                <span className="author-role-badge">
                                  {c.authorRole || c.userRole}
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

                {/* Comment input form */}
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
                      placeholder="Offer strategic guidance, ask a question, or leave feedback for this founder..."
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

export default Marketplace;
