import React from 'react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message-container" role="alert">
      <div className="error-icon" aria-hidden="true">⚠️</div>
      <div className="error-content">
        <h3 className="error-title">Unable to Load Photos</h3>
        <p className="error-description">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          className="retry-button"
          onClick={onRetry}
          aria-label="Retry loading photos"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

