import React, { useEffect, useRef } from 'react';
import PhotoCard from './PhotoCard';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';

export default function PhotoList({
  photos,
  isLoading,
  error,
  hasMore,
  onLoadMore,
  onRetry,
  onLikePhoto
}) {
  const sentinelRef = useRef(null);

  // IntersectionObserver implementation for infinite scrolling
  useEffect(() => {
    // If IntersectionObserver is not available in environment, exit early
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        // When sentinel enters viewport and we can load more photos
        if (firstEntry.isIntersecting && hasMore && !isLoading && !error) {
          onLoadMore();
        }
      },
      {
        root: null, // viewport
        rootMargin: '250px', // Pre-fetch slightly before reaching exact bottom
        threshold: 0.1
      }
    );

    observer.observe(sentinelEl);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, error, onLoadMore]);

  return (
    <main className="gallery-main-container">
      {/* Photo Cards Single Column Feed */}
      <div className="photo-feed" role="feed" aria-label="Photo gallery feed">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onLike={onLikePhoto}
          />
        ))}
      </div>

      {/* Loading state indicator */}
      {isLoading && (
        <LoadingIndicator
          text={photos.length === 0 ? 'Fetching initial photos...' : 'Loading next page of photos...'}
        />
      )}

      {/* Error state with retry action */}
      {error && !isLoading && (
        <ErrorMessage message={error} onRetry={onRetry} />
      )}

      {/* End of results message */}
      {!hasMore && photos.length > 0 && !isLoading && (
        <div className="end-of-gallery-notice">
          <span className="end-icon">✨</span>
          <h3>You have reached the end</h3>
          <p>All available photos have been loaded from the Picsum catalogue.</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && photos.length === 0 && (
        <div className="empty-gallery-notice">
          <p>No photos available at the moment.</p>
          {onRetry && (
            <button type="button" className="retry-button" onClick={onRetry}>
              Refresh
            </button>
          )}
        </div>
      )}

      {/* IntersectionObserver Sentinel Element */}
      {hasMore && !error && (
        <div
          ref={sentinelRef}
          className="sentinel-anchor"
          style={{ height: '20px', width: '100%', margin: '10px 0' }}
          aria-hidden="true"
        />
      )}

      {/* Fallback button if IntersectionObserver is unavailable or fails to trigger */}
      {typeof IntersectionObserver === 'undefined' && hasMore && !isLoading && (
        <div className="manual-load-fallback">
          <button
            type="button"
            className="manual-load-more-btn"
            onClick={onLoadMore}
          >
            Load More Photos
          </button>
        </div>
      )}
    </main>
  );
}
