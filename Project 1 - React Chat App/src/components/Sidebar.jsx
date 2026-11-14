import React, { useState } from 'react';

export default function Sidebar({
  channels,
  activeChannelId,
  onSelectChannel,
  onAddChannel,
  currentUser,
  onUpdateUser,
  isRandomUserMode,
  onToggleRandomUserMode
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');

  // Profile Edit State
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editRole, setEditRole] = useState(currentUser.role);

  const handleCreateChannel = (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;
    onAddChannel(newChannelName.trim());
    setNewChannelName('');
    setShowAddModal(false);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    onUpdateUser(editName.trim(), editRole.trim());
    setShowEditProfileModal(false);
  };

  return (
    <aside className="chat-sidebar" aria-label="Sidebar">
      {/* Current User Profile Card with Edit Action */}
      <div
        className="sidebar-profile-card"
        onClick={() => {
          setEditName(currentUser.name);
          setEditRole(currentUser.role);
          setShowEditProfileModal(true);
        }}
        title="Click to edit your name and title"
        role="button"
        tabIndex={0}
      >
        <div className="profile-avatar-wrapper">
          <div
            className="profile-avatar"
            style={{ backgroundColor: currentUser.avatarBg, color: currentUser.avatarColor }}
          >
            {currentUser.initials}
          </div>
          <span className="profile-status-indicator" title="Online" />
        </div>
        <div className="profile-info">
          <div className="profile-name-row">
            <span className="profile-name">{currentUser.name}</span>
            <svg
              className="profile-edit-pencil-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
          <div className="profile-role">{currentUser.role}</div>
        </div>
      </div>

      {/* Conversations Section Header */}
      <div className="sidebar-section-header">
        <span className="sidebar-section-title">Conversations</span>
        <button
          type="button"
          className="sidebar-add-channel-btn"
          onClick={() => setShowAddModal(true)}
          title="Create New Channel"
          aria-label="Create New Channel"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </button>
      </div>

      {/* Channel List */}
      <nav className="sidebar-channels-list">
        {channels.map((channel) => {
          const isActive = channel.id === activeChannelId;
          return (
            <button
              key={channel.id}
              type="button"
              className={`sidebar-channel-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectChannel(channel.id)}
            >
              <span className="channel-hash">#</span>
              <span className="channel-name">{channel.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Sender Mode Setting Badge (Preserved & Untouched) */}
      <div className="sidebar-footer">
        <div className="sender-mode-card">
          <div className="sender-mode-label">
            <span>Sender:</span>
            <strong>{isRandomUserMode ? 'Random User' : currentUser.name}</strong>
          </div>
          <button
            type="button"
            className={`sender-mode-toggle ${isRandomUserMode ? 'active' : ''}`}
            onClick={onToggleRandomUserMode}
            title={isRandomUserMode ? `Switch to ${currentUser.name}` : 'Switch to Random User assignment'}
          >
            {isRandomUserMode ? 'Random ON' : `Default (${currentUser.initials})`}
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="channel-modal-backdrop" onClick={() => setShowEditProfileModal(false)}>
          <div className="channel-modal" onClick={(e) => e.stopPropagation()}>
            <div className="channel-modal-header">
              <h3>Edit Your Profile</h3>
              <button
                type="button"
                className="channel-modal-close"
                onClick={() => setShowEditProfileModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveProfile}>
              <div className="channel-modal-body">
                <label htmlFor="user-name-input">Your Full Name</label>
                <input
                  id="user-name-input"
                  type="text"
                  placeholder="e.g. Suhas Kowsick"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                  required
                />

                <label htmlFor="user-role-input" style={{ marginTop: '12px' }}>
                  Your Job Title / Role
                </label>
                <input
                  id="user-role-input"
                  type="text"
                  placeholder="e.g. Frontend Developer, UI Engineer"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  required
                />
              </div>
              <div className="channel-modal-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowEditProfileModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Channel Modal */}
      {showAddModal && (
        <div className="channel-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="channel-modal" onClick={(e) => e.stopPropagation()}>
            <div className="channel-modal-header">
              <h3>Create Channel</h3>
              <button
                type="button"
                className="channel-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateChannel}>
              <div className="channel-modal-body">
                <label htmlFor="channel-name-input">Channel Name</label>
                <input
                  id="channel-name-input"
                  type="text"
                  placeholder="e.g. Design Team, Announcements"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="channel-modal-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}
