


import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './Dashboard.css';

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
    code?: { language: string; content: string; filename?: string };
  }>;
  isSaved?: boolean;
  userId?: string;
}

type AnyProject = {
  id: string;
  name: string;
  type: 'web' | 'mobile' | 'desktop' | 'chat' | string;
  status?: string;
  isDeployed?: boolean;
  url?: string;
  env?: string;
  deployedAt?: string;
  [k: string]: any;
};

const Dashboard: React.FC = () => {
  const { projects, createProject, loading, getProjects } = useProject();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--ca-primary', '#1e3c61');
    r.style.setProperty('--ca-accent', '#61c4ca');
    r.style.setProperty('--ca-secondary', '#2c99b7');
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; chatId: string; chatTitle: string }>({ show: false, chatId: '', chatTitle: '' });
  const [chatQuery, setChatQuery] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [greeting, setGreeting] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoverZone, setHoverZone] = useState(false);

  useEffect(() => {
    getProjects();
    loadChatHistory();
    
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, [getProjects]);
useEffect(() => {
  if (!user) return;
  getProjects();
  loadChatHistory();
  const hour = new Date().getHours();
  if (hour < 12) setGreeting('Good morning');
  else if (hour < 18) setGreeting('Good afternoon');
  else setGreeting('Good evening');
}, [getProjects, user]);

  /** ---------------- Chat History (ALL chats with >=1 message) ---------------- */
  const loadChatHistory = () => {
    try {
      const saved = localStorage.getItem('chatHistory');
      if (!saved) { setChatHistory([]); return; }
      const history: ChatHistoryItem[] = JSON.parse(saved);

      // belongs to current user (+ backward compatibility)
      const userChats = history.filter(chat =>
        chat.userId === user?.id ||
        (chat.userId === undefined && chat.id && localStorage.getItem(`chat_${user?.id}_${chat.id}`) !== null)
      );

      // >>> ONLY chats with at least ONE message <<<
      const valid = userChats.filter(c => Array.isArray(c.messages) && c.messages.length > 0);

      // title fix for untitled
      const updated = valid.map(c => {
        if ((!c.title || c.title === 'Untitled' || c.title === 'Untitled Chat Project') && c.messages?.length) {
          const firstUser = c.messages.find(m => m.role === 'user');
          const src = firstUser?.content || c.messages[0]?.content || '';
          const t = src.trim();
          return { ...c, title: t ? (t.length > 60 ? t.slice(0, 60) + '…' : t) : 'Untitled Chat' };
        }
        return c;
      });

      setChatHistory(updated);

      // persist title fixes back
      try {
        const allHistory: ChatHistoryItem[] = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        const merged = allHistory.map(c => updated.find(u => u.id === c.id) || c);
        localStorage.setItem('chatHistory', JSON.stringify(merged));
      } catch {}
    } catch (e) {
      console.error('Error loading chat history:', e);
      setChatHistory([]);
    }
  };

  // Helper to save a chat only if it has messages
  const saveChatHistory = (newChat: ChatHistoryItem) => {
    try {
      // >>> DO NOT SAVE if 0 messages <<<
      if (!newChat.messages?.length) return;

      const chatWithUserId = { ...newChat, userId: user?.id };
      const idx = chatHistory.findIndex(c => c.id === newChat.id);
      const updated = idx >= 0 ? Object.assign([...chatHistory], { [idx]: chatWithUserId }) : [chatWithUserId, ...chatHistory];
      setChatHistory(updated);

      try {
        const all: ChatHistoryItem[] = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        const gidx = all.findIndex(c => c.id === newChat.id);
        if (gidx >= 0) all[gidx] = chatWithUserId; else all.push(chatWithUserId);
        localStorage.setItem('chatHistory', JSON.stringify(all));
      } catch (e) {
        console.error('Error updating global chat history:', e);
      }

      localStorage.setItem(`chat_${user?.id}_${newChat.id}`, JSON.stringify(chatWithUserId));
      getProjects();
    } catch (e) {
      console.error('Error saving chat history:', e);
    }
  };

  const handleStartChat = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      createProject({

name: 'Untitled Chat Project', 
      type: 'chat', 
      description: 'Project created from chat',
      status: 'active',
      files: []
    }
        
      )
        .then(newProject => {
          if (!newProject) return;

          // >>> DO NOT save a new chat here (0 user messages) <<<
          // It will appear in chat history only after it has at least one message
          window.location.href = `/chat/${newProject.id}`;
        });
    }, 500);
  }, [createProject]);

  const handleChatHistoryClick = (chatId: string) => { 
    setIsAnimating(true);
    setTimeout(() => {
      window.location.href = `/chat/${chatId}`;
    }, 300);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso); return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const formatTime = (iso: string) => {
    const d = new Date(iso); return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const getFirstUserMessage = (messages: any[]) => {
    const um = messages?.find((m: any) => m.role === 'user'); if (!um) return '';
    const words = um.content.trim().split(/\s+/); return words.slice(0, 10).join(' ') + (words.length > 10 ? '…' : '');
  };

  const deleteChatHistory = (chatId: string) => {
    try {
      setChatHistory(prev => prev.filter(c => c.id !== chatId));
      try {
        const all: ChatHistoryItem[] = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        localStorage.setItem('chatHistory', JSON.stringify(all.filter(c => c.id !== chatId)));
      } catch {}
      localStorage.removeItem(`chat_${user?.id}_${chatId}`);
      setDeleteConfirmation({ show: false, chatId: '', chatTitle: '' });
    } catch (e) {
      console.error('Error deleting chat history:', e);
    }
  };

  /** ---------------- ONLY deployed projects in dashboard ---------------- */
  const isDeployedProject = (p: AnyProject) =>
    (p.type !== 'chat') && (p.isDeployed === true || p.status === 'deployed' || !!p.url);

  const deployedProjects = useMemo(() => {
    if (!projects) return [];
    return (projects as AnyProject[])
      .filter(isDeployedProject)
      .sort((a, b) => {
        const ad = a.deployedAt ? new Date(a.deployedAt).getTime() : 0;
        const bd = b.deployedAt ? new Date(b.deployedAt).getTime() : 0;
        return bd - ad;
      });
  }, [projects]);

  const allChatsSorted = useMemo(() => {
    const list = [...chatHistory];
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return list;
  }, [chatHistory]);

  const filteredChats = useMemo(() => {
    const q = chatQuery.trim().toLowerCase();
    if (!q) return allChatsSorted;
    return allChatsSorted.filter(c =>
      (c.title?.toLowerCase().includes(q)) ||
      (c.messages || []).some(m => m.content?.toLowerCase().includes(q))
    );
  }, [allChatsSorted, chatQuery]);

  const ProjectRow: React.FC<{ p: AnyProject }> = ({ p }) => {
    const env = p.env?.toUpperCase() || 'PROD';
    const when = p.deployedAt ? formatDate(p.deployedAt) : '';
    const time = p.deployedAt ? formatTime(p.deployedAt) : '';

    return (
      <div className="project-row card hoverable" onClick={() => p.url && window.open(p.url, '_blank')}>
        <div className="row-left">
          <div className="proj-avatar" aria-hidden>🚀</div>
          <div className="proj-info">
            <div className="proj-title">
              <span className="name" title={p.name}>{p.name}</span>
              <span className="badge env">{env}</span>
              {p.url && <span className="badge link">Live</span>}
            </div>
            <div className="proj-meta">
              <span className="pill">{p.type}</span>
              <span className="dot">•</span>
              <span className="muted">{when} {time && <span>• {time}</span>}</span>
            </div>
          </div>
        </div>
        <div className="row-right">
          {p.url ? (
            <a className="btn tiny ghost" href={p.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>Open</a>
          ) : (
            <span className="muted small">No URL</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`dashboard-container ${theme} ${isAnimating ? 'animating' : ''}`}>
      {/* Background Animation */}
      <div className="bg-animation">
        <div className="floating-shape shape-1" key="shape-1"></div>
        <div className="floating-shape shape-2" key="shape-2"></div>
        <div className="floating-shape shape-3" key="shape-3"></div>
        <div className="floating-shape shape-4" key="shape-4"></div>
        <div className="floating-shape shape-5" key="shape-5"></div>
      </div>

      {/* Hover Zone - Left edge trigger */}
      <div 
        className={`hover-zone ${hoverZone ? 'active' : ''}`}
        onMouseEnter={() => {
          setHoverZone(true);
          setSidebarOpen(true);
        }}
      />

      {/* Sidebar Toggle Button */}
      <button 
        className={`sidebar-toggle ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarOpen ? 'open' : ''} ${theme}`}
        onMouseLeave={() => {
          setSidebarOpen(false);
          setHoverZone(false);
        }}
        aria-label="Sidebar"
      >
        <div className="sidebar-content">
          {/* Profile */}
          <div className="sidebar-profile card">
            <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase() || '👤'}</div>
            <div>
              <h3 className="profile-name">{user?.name || 'Guest'}</h3>
              <p className="profile-email">{user?.email || ''}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="sidebar-actions">
            <button className={`btn tone ${theme}`} onClick={toggleTheme}>
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
            <button className="btn primary" onClick={handleStartChat}>💬 New Chat</button>
          </div>

          {/* Search */}
          <div className="chat-search">
            <input
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
              placeholder="Search chats…"
              aria-label="Search chat history"
            />
          </div>

          {/* Chat History */}
          <div className="sidebar-section-title">Chat History</div>
          <div className="sidebar-chat-history">
            <div className="chat-history-list">
              {filteredChats.length ? filteredChats.map(chat => (
                <div
                  key={chat.id}
                  className="chat-history-item card hoverable"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleChatHistoryClick(chat.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChatHistoryClick(chat.id)}
                >
                  <div className="chat-row-top">
                    <div className="chat-title">
                      {chat.title || 'Untitled Chat'}
                      {chat.isSaved && <span className="badge saved">Saved</span>}
                    </div>
                    <button
                      className="icon-btn"
                      title="Delete chat"
                      aria-label="Delete chat"
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirmation({ show: true, chatId: chat.id, chatTitle: chat.title || 'Untitled Chat' }); }}
                    >🗑️</button>
                  </div>
                  <div className="chat-row-meta">
                    <span className="meta">{formatDate(chat.timestamp)}</span>
                    <span className="dot">•</span>
                    <span className="meta">{formatTime(chat.timestamp)}</span>
                  </div>
                  <div className="chat-preview">{getFirstUserMessage(chat.messages)}</div>
                </div>
              )) : <div className="no-history">No chats found</div>}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="content-wrapper">
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''} ${theme}`}>
          <header className="dashboard-header">
            <div className="brand">
              <div className="logo-container">
                <div className="logo">
                  <span className="logo-text">Code</span>
                  <span className="logo-accent">Alchemy</span>
                </div>
                <div className="logo-icon">⚗️</div>
              </div>
              <div className="tagline-container">
                <div className="tagline marquee" aria-label="where ideas turn into code magic">
                  <span className="marquee-track">where ideas turn into code magic&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span className="marquee-track" aria-hidden>where ideas turn into code magic&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </div>
              </div>
            </div>
            <div className="header-actions">
              <button className="btn primary solid" onClick={handleStartChat}>+ New Chat</button>
            </div>
          </header>

          <div className="dashboard-body">
            {/* Welcome Section */}
            <div className="welcome-section">
              <h1 className="welcome-title">{greeting}, {user?.name || 'Developer'}!</h1>
              <p className="welcome-subtitle">Ready to transform your ideas into code magic today?</p>
            </div>

            {/* Navigation Tabs */}
            <div className="nav-tabs-container">
              <div className="nav-tabs">
                <button 
                  className={`nav-tab ${activeSection === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveSection('overview')}
                >
                  <span className="tab-icon">📊</span>
                  <span>Overview</span>
                </button>
                <button 
                  className={`nav-tab ${activeSection === 'projects' ? 'active' : ''}`}
                  onClick={() => setActiveSection('projects')}
                >
                  <span className="tab-icon">🚀</span>
                  <span>Deployed Projects</span>
                </button>
                <button 
                  className={`nav-tab ${activeSection === 'chats' ? 'active' : ''}`}
                  onClick={() => setActiveSection('chats')}
                >
                  <span className="tab-icon">💬</span>
                  <span>Chats</span>
                </button>
              </div>
            </div>

            {/* Overview Section */}
            {activeSection === 'overview' && (
              <>
                {/* KPIs */}
                <section className="stats-container">
                  <div className="stats-grid">
                    <div className="stat-card card" key="stat-deployed">
                      <div className="stat-icon">🚀</div>
                      <h3>Deployed</h3>
                      <p className="stat-num">{deployedProjects.length}</p>
                      <div className="stat-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{width: `${Math.min(deployedProjects.length * 10, 100)}%`}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="stat-card card" key="stat-chats">
                      <div className="stat-icon">💬</div>
                      <h3>Chats</h3>
                      <p className="stat-num">{chatHistory.length}</p>
                      <div className="stat-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{width: `${Math.min(chatHistory.length * 5, 100)}%`}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="stat-card card" key="stat-live-urls">
                      <div className="stat-icon">🌐</div>
                      <h3>Live URLs</h3>
                      <p className="stat-num">{deployedProjects.filter(p => p.url).length}</p>
                      <div className="stat-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{width: `${Math.min(deployedProjects.filter(p => p.url).length * 15, 100)}%`}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="stat-card card" key="stat-environments">
                      <div className="stat-icon">🔧</div>
                      <h3>Environments</h3>
                      <p className="stat-num">{new Set(deployedProjects.map(p => (p.env || 'prod').toLowerCase())).size}</p>
                      <div className="stat-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{width: `${Math.min(new Set(deployedProjects.map(p => (p.env || 'prod').toLowerCase())).size * 20, 100)}%`}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Recent Activity */}
                <section className="activity-container">
                  <div className="section-head">
                    <h2>Recent Activity</h2>
                    <div className="section-sub">Your latest deployments and chats</div>
                  </div>
                  <div className="activity-list">
                    {deployedProjects.slice(0, 3).map(p => (
                      <div key={p.id} className="activity-item card">
                        <div className="activity-icon">🚀</div>
                        <div className="activity-content">
                          <div className="activity-title">{p.name} deployed</div>
                          <div className="activity-meta">{formatDate(p.deployedAt || '')} at {formatTime(p.deployedAt || '')}</div>
                        </div>
                        {p.url && (
                          <a className="btn tiny primary" href={p.url} target="_blank" rel="noreferrer">View</a>
                        )}
                      </div>
                    ))}
                    {chatHistory.slice(0, 3).map(chat => (
                      <div key={chat.id} className="activity-item card">
                        <div className="activity-icon">💬</div>
                        <div className="activity-content">
                          <div className="activity-title">{chat.title}</div>
                          <div className="activity-meta">{formatDate(chat.timestamp)} at {formatTime(chat.timestamp)}</div>
                        </div>
                        <button 
                          className="btn tiny primary" 
                          onClick={() => handleChatHistoryClick(chat.id)}
                        >
                          Open
                        </button>
                      </div>
                    ))}
                    {deployedProjects.length === 0 && chatHistory.length === 0 && (
                      <div className="empty-state card">
                        <div className="empty-icon">🔍</div>
                        <h3>No activity yet</h3>
                        <p>Start a chat to build and deploy your first app.</p>
                        <button className="btn primary" onClick={handleStartChat}>Start New Chat</button>
                      </div>
                    )}
                  </div>
                </section>

                {/* Quick Actions */}
                <section className="quick-actions">
                  <div className="section-head">
                    <h2>Quick Actions</h2>
                    <div className="section-sub">Get started with these common tasks</div>
                  </div>
                  <div className="action-cards">
                    <div className="action-card card" key="action-new-chat" onClick={handleStartChat}>
                      <div className="action-icon">💬</div>
                      <h3>Start New Chat</h3>
                      <p>Create a new conversation to build your project</p>
                    </div>
                    <div className="action-card card" key="action-templates">
                      <div className="action-icon">📚</div>
                      <h3>Browse Templates</h3>
                      <p>Explore project templates to get started quickly</p>
                    </div>
                    <div className="action-card card" key="action-documentation">
                      <div className="action-icon">📖</div>
                      <h3>View Documentation</h3>
                      <p>Learn how to make the most of CodeAlchemy</p>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Projects Section - ONLY DEPLOYED PROJECTS */}
            {activeSection === 'projects' && (
              <section className="projects-container">
                <div className="section-head">
                  <h2>Deployed Projects</h2>
                  <div className="section-sub">Only live deployments are shown here</div>
                </div>

                {loading ? (
                  <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Loading projects…</p>
                  </div>
                ) : deployedProjects.length === 0 ? (
                  <div className="empty-state card">
                    <div className="empty-icon">🚧</div>
                    <h3>No deployed projects</h3>
                    <p>Start a chat to build and deploy your first app.</p>
                    <button className="btn primary" onClick={handleStartChat}>Start New Chat</button>
                  </div>
                ) : (
                  <div className="project-rows">
                    {deployedProjects.map(p => <ProjectRow key={p.id} p={p} />)}
                  </div>
                )}
              </section>
            )}

            {/* Chats Section */}
            {activeSection === 'chats' && (
              <section className="chats-container">
                <div className="section-head">
                  <h2>Chat History</h2>
                  <div className="section-sub">All your conversations with CodeAlchemy</div>
                </div>

                {chatHistory.length === 0 ? (
                  <div className="empty-state card">
                    <div className="empty-icon">💬</div>
                    <h3>No chats yet</h3>
                    <p>Start your first conversation with CodeAlchemy.</p>
                    <button className="btn primary" onClick={handleStartChat}>Start New Chat</button>
                  </div>
                ) : (
                  <div className="chat-rows">
                    {allChatsSorted.map(chat => (
                      <div 
                        key={chat.id} 
                        className="chat-row card hoverable"
                        onClick={() => handleChatHistoryClick(chat.id)}
                      >
                        <div className="chat-row-left">
                          <div className="chat-avatar" aria-hidden>💬</div>
                          <div className="chat-info">
                            <div className="chat-title">
                              {chat.title || 'Untitled Chat'}
                              {chat.isSaved && <span className="badge saved">Saved</span>}
                            </div>
                            <div className="chat-meta">
                              <span className="meta">{formatDate(chat.timestamp)}</span>
                              <span className="dot">•</span>
                              <span className="meta">{formatTime(chat.timestamp)}</span>
                              <span className="dot">•</span>
                              <span className="meta">{chat.messages.length} messages</span>
                            </div>
                            <div className="chat-preview">{getFirstUserMessage(chat.messages)}</div>
                          </div>
                        </div>
                        <div className="chat-row-right">
                          <button
                            className="icon-btn"
                            title="Delete chat"
                            aria-label="Delete chat"
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmation({ show: true, chatId: chat.id, chatTitle: chat.title || 'Untitled Chat' }); }}
                          >🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmation.show && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <h3>Delete Chat</h3>
            <p>Are you sure you want to delete "{deleteConfirmation.chatTitle}"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn danger" onClick={() => deleteChatHistory(deleteConfirmation.chatId)}>Delete</button>
              <button className="btn" onClick={() => setDeleteConfirmation({ show: false, chatId: '', chatTitle: '' })}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;



