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

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) return;

    // 900px pre-fetch margin: triggers well in advance so next photos appear instantly
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoading && !error) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '900px',
        threshold: 0.05
      }
    );

    observer.observe(sentinelEl);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, error, onLoadMore]);

  return (
    <div className="photo-gallery-list">
      {/* 1 Column Photo Feed */}
      <div className="photo-feed-column">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onLike={onLikePhoto}
          />
        ))}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <LoadingIndicator text="Loading more photos..." />
      )}

      {/* Error Message with Retry */}
      {error && !isLoading && (
        <ErrorMessage message={error} onRetry={onRetry} />
      )}

      {/* End of results */}
      {!hasMore && photos.length > 0 && !isLoading && (
        <div className="gallery-end-notice">
          <p>No more photos to load.</p>
        </div>
      )}

      {/* Sentinel Element for IntersectionObserver */}
      {hasMore && !error && (
        <div
          ref={sentinelRef}
          className="gallery-sentinel"
          style={{ height: '30px', width: '100%', margin: '20px 0' }}
        />
      )}
    </div>
  );
}
