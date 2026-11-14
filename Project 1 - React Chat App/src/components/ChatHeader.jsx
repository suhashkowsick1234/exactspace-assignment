import React from 'react';

export default function ChatHeader({ activeChannel, onlineCount = 3 }) {
  const memberTotal = activeChannel.memberCount || 100;

  return (
    <header className="pubnub-chat-header">
      <div className="pubnub-header-left">
        <h2 className="channel-title">{activeChannel.name}</h2>
        <p className="channel-description">{activeChannel.description}</p>
      </div>

      <div className="pubnub-header-right">
        <div className="header-member-counter">
          <span className="count-text">
            {onlineCount} | {memberTotal}
          </span>
          <svg
            className="group-users-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
      </div>
    </header>
  );
}
