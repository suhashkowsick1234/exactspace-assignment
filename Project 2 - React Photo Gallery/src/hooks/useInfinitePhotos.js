import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPhotosPage } from '../services/picsumApi';

export function useInfinitePhotos() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Tracking refs to avoid race conditions and StrictMode double-triggers
  const isFetchingRef = useRef(false);
  const seenIdsRef = useRef(new Set());
  const abortControllerRef = useRef(null);

  const fetchPage = useCallback(async (pageToFetch) => {
    // Prevent simultaneous or redundant requests
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const data = await fetchPhotosPage(pageToFetch, 15, controller.signal);

      // Check for end of pagination (empty response)
      if (!data || data.length === 0) {
        setHasMore(false);
        setIsLoading(false);
        isFetchingRef.current = false;
        return;
      }

      // Filter out duplicate photos and initialize likes: 0
      const newPhotos = [];
      data.forEach((photo) => {
        if (!seenIdsRef.current.has(photo.id)) {
          seenIdsRef.current.add(photo.id);
          newPhotos.push({
            ...photo,
            likes: 0
          });
        }
      });

      if (newPhotos.length === 0) {
        // All photos in this page were duplicates or end reached
        setHasMore(false);
      } else {
        // Strictly append to existing photos (never replace!)
        setPhotos((prev) => [...prev, ...newPhotos]);
        // Increment page on success
        setPage(pageToFetch + 1);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch photos. Please check your network connection.');
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Initial load for Page 1
  useEffect(() => {
    fetchPage(1);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchPage]);

  // Triggered by IntersectionObserver when sentinel is visible
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && !error) {
      fetchPage(page);
    }
  }, [isLoading, hasMore, error, fetchPage, page]);

  // Retry fetching the current page after failure
  const retry = useCallback(() => {
    if (!isLoading) {
      fetchPage(page);
    }
  }, [isLoading, fetchPage, page]);

  // Individual photo like handler
  const likePhoto = useCallback((photoId) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo.id === photoId ? { ...photo, likes: photo.likes + 1 } : photo
      )
    );
  }, []);

  return {
    photos,
    isLoading,
    error,
    hasMore,
    loadMore,
    retry,
    likePhoto,
    isInitialLoading: isLoading && photos.length === 0
  };
}
