import React, { useState, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

function PhotoCard({ photo, onLike }) {
  const { id, author, download_url, likes = 0, hasLiked = false } = photo;
  const [hasError, setHasError] = useState(false);

  // Safe fallback image if download_url fails
  const imgSrc = hasError
    ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
    : download_url;

  return (
    <article className="photo-gallery-row" data-photo-id={id}>
      {/* Left Thumbnail with clean modern framing */}
      <div className="photo-thumb-container">
        <img
          src={imgSrc}
          alt={`Captured by ${author}`}
          className="photo-thumb-image"
          loading="lazy"
          onError={() => {
            if (!hasError) {
              setHasError(true);
            }
          }}
        />
      </div>

      {/* Right Information & Action Column */}
      <div className="photo-info-col">
        <span className="photo-author-label">Author: {author}</span>

        {/* 1 Like per person button */}
        <button
          type="button"
          className={`thumbs-up-btn ${hasLiked ? 'has-liked' : ''}`}
          onClick={() => onLike(id)}
          title={hasLiked ? 'You liked this (click to unlike)' : 'Like (strictly 1 like per person)'}
          aria-label={hasLiked ? 'Unlike photo' : 'Like photo'}
        >
          <FontAwesomeIcon icon={faThumbsUp} className="fa-thumbs-up-icon" />
          <span className="thumbs-up-counter">{likes}</span>
        </button>
      </div>
    </article>
  );
}

export default memo(PhotoCard);
