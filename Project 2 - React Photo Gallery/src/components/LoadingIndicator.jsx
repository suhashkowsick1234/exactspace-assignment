import React from 'react';

export default function LoadingIndicator({ text = 'Loading more inspiring photos...' }) {
  return (
    <div className="loading-indicator-container" role="status" aria-live="polite">
      <div className="spinner-ring" aria-hidden="true"></div>
      <p className="loading-text">{text}</p>
    </div>
  );
}

