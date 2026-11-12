import React, { useState, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as faThumbsUpSolid } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbsUpRegular } from '@fortawesome/free-regular-svg-icons';

function PhotoCard({ photo, onLike }) {
  const { id, author, download_url, likes } = photo;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Author initials for avatar
  const authorInitials = author
    ? author
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'PH';

  return (
    <article className="photo-card" data-photo-id={id}>
      {/* Header with author info */}
      <div className="photo-card-header">
        <div className="author-avatar" aria-hidden="true">
          {authorInitials}
        </div>
        <div className="author-info">
          <h2 className="author-name">{author}</h2>
          <span className="photo-id-tag">Photo #{id}</span>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="photo-media-container">
        {!imageLoaded && !imageError && (
          <div className="image-skeleton" aria-label="Loading image...">
            <div className="skeleton-shimmer"></div>
          </div>
        )}

        {imageError ? (
          <div className="image-fallback">
            <span className="fallback-icon">⚠️</span>
            <p>Image preview unavailable</p>
          </div>
        ) : (
          <img
            src={download_url}
            alt={`Captured by ${author}`}
            className={`photo-image ${imageLoaded ? 'loaded' : 'loading'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageLoaded(true);
              setImageError(true);
            }}
          />
        )}
      </div>

      {/* Photo Footer with Font Awesome Thumbs-Up Like Action */}
      <div className="photo-card-footer">
        <div className="photo-actions">
          <button
            type="button"
            className={`like-action-btn ${likes > 0 ? 'active' : ''}`}
            onClick={() => onLike(id)}
            title={`Like photo by ${author}`}
            aria-label={`Like photo by ${author}. Currently has ${likes} likes.`}
          >
            <FontAwesomeIcon
              icon={likes > 0 ? faThumbsUpSolid : faThumbsUpRegular}
              className="thumbs-up-icon"
            />
            <span className="like-counter-text">
              {likes} {likes === 1 ? 'Like' : 'Likes'}
            </span>
          </button>
        </div>

        <div className="photo-meta-info">
          <a
            href={download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="view-original-link"
            title="Open full resolution image in new tab"
          >
            Full Res ↗
          </a>
        </div>
      </div>
    </article>
  );
}

export default memo(PhotoCard);
