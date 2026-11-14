import { useState, useCallback, useRef } from 'react';
import { fetchPhotosPage, INITIAL_DEMO_PHOTOS } from '../services/picsumApi';

export function useInfinitePhotos() {
  // Start with INITIAL_DEMO_PHOTOS initialized with likes: 0, hasLiked: false
  const [photos, setPhotos] = useState(() =>
    INITIAL_DEMO_PHOTOS.map((p) => ({ ...p, likes: 0, hasLiked: false }))
  );
  const [page, setPage] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const isFetchingRef = useRef(false);
  const seenIdsRef = useRef(new Set(INITIAL_DEMO_PHOTOS.map((p) => p.id)));
  const abortControllerRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || isLoading) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const data = await fetchPhotosPage(page, controller.signal);

      if (!data || data.length === 0) {
        setHasMore(false);
        setIsLoading(false);
        isFetchingRef.current = false;
        return;
      }

      const newPhotos = [];
      data.forEach((photo) => {
        if (!seenIdsRef.current.has(photo.id)) {
          seenIdsRef.current.add(photo.id);
          newPhotos.push({
            ...photo,
            likes: 0,
            hasLiked: false
          });
        }
      });

      if (newPhotos.length === 0) {
        setHasMore(false);
      } else {
        setPhotos((prev) => [...prev, ...newPhotos]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch photos.');
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [hasMore, isLoading, page]);

  const retry = useCallback(() => {
    loadMore();
  }, [loadMore]);

  /**
   * FIX 1: Strictly 1 like per person per picture.
   * If already liked, clicking again toggles it off (0 likes).
   * If not liked, increments to 1 like. Cannot exceed 1 like per person!
   */
  const likePhoto = useCallback((photoId) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) => {
        if (photo.id !== photoId) return photo;
        const alreadyLiked = Boolean(photo.hasLiked);
        if (alreadyLiked) {
          // Unlike: 1 -> 0
          return {
            ...photo,
            likes: Math.max(0, (photo.likes || 1) - 1),
            hasLiked: false
          };
        } else {
          // Like: strictly 1 like only per person!
          return {
            ...photo,
            likes: (photo.likes || 0) + 1,
            hasLiked: true
          };
        }
      })
    );
  }, []);

  return {
    photos,
    isLoading,
    error,
    hasMore,
    loadMore,
    retry,
    likePhoto
  };
}
