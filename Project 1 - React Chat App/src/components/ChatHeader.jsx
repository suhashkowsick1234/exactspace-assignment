import React from 'react';
import { USER_LIST } from '../hooks/useChat';

export default function ChatHeader({ messageCount = 0 }) {
  return (
    <header className="chat-header">
      <div className="chat-header-main">
        <div className="chat-header-title-row">
          <div className="chat-channel-icon" aria-hidden="true">#</div>
          <div>
            <h1 className="chat-title">Team Collaboration Chat</h1>
            <p className="chat-subtitle">
              <span className="status-indicator" title="Active" aria-hidden="true"></span>
              <span className="status-text">{USER_LIST.length} Active Members</span>
              <span className="dot-separator">•</span>
              <span className="message-counter">{messageCount} {messageCount === 1 ? 'message' : 'messages'}</span>
            </p>
          </div>
        </div>

        <div className="chat-header-members" title="Available team members">
          {USER_LIST.map((user) => (
            <span key={user} className="member-badge" title={`${user} (online)`}>
              {user}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
