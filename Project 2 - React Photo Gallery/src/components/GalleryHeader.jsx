import React from 'react';

export default function GalleryHeader({ totalPhotos = 0, totalLikes = 0 }) {
  return (
    <header className="gallery-header">
      <div className="gallery-header-content">
        <div className="gallery-branding">
          <div className="gallery-logo-icon" aria-hidden="true">📸</div>
          <div>
            <h1 className="gallery-title">Picsum Photo Feed</h1>
            <p className="gallery-subtitle">
              Infinite scrolling photography feed powered by the Lorem Picsum API
            </p>
          </div>
        </div>

        <div className="gallery-stats">
          <div className="stat-pill" title="Total photos loaded">
            <span className="stat-label">Photos:</span>
            <span className="stat-value">{totalPhotos}</span>
          </div>
          <div className="stat-pill" title="Total community likes">
            <span className="stat-label">Total Likes:</span>
            <span className="stat-value">{totalLikes}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
