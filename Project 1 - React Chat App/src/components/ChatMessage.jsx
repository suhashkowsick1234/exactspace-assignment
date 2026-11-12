import React, { memo } from 'react';
import { USER_COLORS } from '../hooks/useChat';

function formatMessageText(text) {
  // Regex to detect @Username mentions
  const mentionRegex = /(@[A-Za-z0-9_]+)/g;
  const parts = text.split(mentionRegex);

  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      return (
        <span key={index} className="mention-tag">
          {part}
        </span>
      );
    }
    return part;
  });
}

function ChatMessage({ message, onLike }) {
  const { id, username, text, likes, timestamp } = message;
  const userColors = USER_COLORS[username] || { bg: '#E5E7EB', text: '#374151', border: '#D1D5DB' };
  const initial = username ? username.charAt(0).toUpperCase() : '?';

  return (
    <article className="chat-message-row" data-message-id={id}>
      <div
        className="user-avatar"
        style={{
          backgroundColor: userColors.bg,
          color: userColors.text,
          borderColor: userColors.border
        }}
        title={`Avatar for ${username}`}
        aria-hidden="true"
      >
        {initial}
      </div>

      <div className="message-content-wrapper">
        <div className="message-meta">
          <span className="message-author" style={{ color: userColors.text }}>
            {username}
          </span>
          {timestamp && <span className="message-time">{timestamp}</span>}
        </div>

        <div className="message-body">
          <p className="message-text">{formatMessageText(text)}</p>
        </div>
      </div>

      <div className="message-actions">
        <button
          type="button"
          className={`like-button ${likes > 0 ? 'liked' : ''}`}
          onClick={() => onLike(id)}
          title={`Like this message by ${username}`}
          aria-label={`Like message by ${username}. Current likes: ${likes}`}
        >
          <svg
            className="like-icon"
            viewBox="0 0 24 24"
            fill={likes > 0 ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
          </svg>
          <span className="like-count">{likes}</span>
        </button>
      </div>
    </article>
  );
}

export default memo(ChatMessage);
