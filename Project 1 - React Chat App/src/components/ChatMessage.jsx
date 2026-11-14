import React, { memo } from 'react';
import { USER_COLORS } from '../hooks/useChat';

function formatMessageText(text) {
  const mentionRegex = /(@[A-Za-z0-9_ ]+?\b)/g;
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

function ChatMessage({ message, onLike, currentUserName }) {
  const { id, username, initials, avatarBg, text, likes = 0, likedBy = [], timestamp } = message;

  const fallbackUser = USER_COLORS[username] || {
    bg: '#64748B',
    text: '#FFFFFF',
    initials: username ? username.slice(0, 2).toUpperCase() : '??'
  };

  const displayInitials = initials || fallbackUser.initials;
  const displayBg = avatarBg || fallbackUser.bg;
  const hasLikedByMe = Array.isArray(likedBy) && likedBy.includes(currentUserName);

  return (
    <article className="pubnub-message-row" data-message-id={id}>
      {/* Sender Avatar */}
      <div
        className="message-avatar"
        style={{ backgroundColor: displayBg, color: '#FFFFFF' }}
        title={username}
      >
        {displayInitials}
      </div>

      {/* Message Content Area */}
      <div className="message-content-col">
        {/* Author & Timestamp Header */}
        <div className="message-header-line">
          <span className="message-author-name">{username}</span>
          {timestamp && <span className="message-timestamp">{timestamp}</span>}
        </div>

        {/* Message Bubble */}
        <div className="message-bubble-wrapper">
          <div className="message-bubble">
            <span className="bubble-text">{formatMessageText(text)}</span>
          </div>

          {/* Like Reaction Button (Strictly 1 like per person) */}
          <button
            type="button"
            className={`message-like-btn ${hasLikedByMe ? 'has-liked' : ''} ${likes > 0 ? 'active' : ''}`}
            onClick={() => onLike(id)}
            title={
              hasLikedByMe
                ? 'You liked this message (click to unlike)'
                : `Like this message (1 like per person)`
            }
            aria-label={
              hasLikedByMe
                ? 'Unlike message'
                : 'Like message'
            }
          >
            <svg
              className="like-svg-icon"
              viewBox="0 0 24 24"
              fill={hasLikedByMe ? '#3B82F6' : 'none'}
              stroke={hasLikedByMe ? '#3B82F6' : 'currentColor'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            {likes > 0 && <span className="like-counter-text">{likes}</span>}
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(ChatMessage);
