import React, { useMemo } from 'react';
import GalleryHeader from './components/GalleryHeader';
import PhotoList from './components/PhotoList';
import { useInfinitePhotos } from './hooks/useInfinitePhotos';
import './App.css';

export default function App() {
  const {
    photos,
    isLoading,
    error,
    hasMore,
    loadMore,
    retry,
    likePhoto
  } = useInfinitePhotos();

  // Aggregate total likes across gallery
  const totalLikes = useMemo(() => {
    return photos.reduce((acc, curr) => acc + (curr.likes || 0), 0);
  }, [photos]);

  return (
    <div className="gallery-app-root">
      <div className="gallery-layout-wrapper">
        <GalleryHeader
          totalPhotos={photos.length}
          totalLikes={totalLikes}
        />

        <PhotoList
          photos={photos}
          isLoading={isLoading}
          error={error}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onRetry={retry}
          onLikePhoto={likePhoto}
        />
      </div>
    </div>
  );
}
