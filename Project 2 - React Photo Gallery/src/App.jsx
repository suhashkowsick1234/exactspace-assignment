import React from 'react';
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

  return (
    <div className="photo-gallery-app">
      <div className="photo-gallery-container">
        <GalleryHeader />
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
