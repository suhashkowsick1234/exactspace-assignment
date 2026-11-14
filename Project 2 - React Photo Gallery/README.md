# Project 2 — React Photo Gallery with Infinite Scrolling

A single-page, infinite scrolling photo gallery engineered as part of the **Exactspace UI Developer Internship Technical Assessment**.

---

## 🌟 Overview & Key Features

This application showcases a high-performance, single-column photography feed powered by the live, paginated **Lorem Picsum JSON API** with genuine browser `IntersectionObserver` infinite scrolling.

### Mandatory Features Implemented
- **Picsum API Integration**:
  - Connects to `https://picsum.photos/v2/list?page={page}&limit=15`.
  - Begins on page 1 and dynamically loads consecutive pages on demand.
  - Dynamically detects the end of the catalogue when an empty array is returned (`data.length === 0`).
  - Strict mapping of official API fields: `id`, `author`, and `download_url`.
  - Uses `id` as the unique, stable React list key.
  - Uses the official `download_url` as the image source.
- **Single-Column Photo Feed Layout**:
  - Purpose-built single-column feed optimized for photography.
  - Each photo card prominently displays the photo, author badge/initials, photo ID tag, and full-resolution link.
  - High-fidelity image presentation with responsive aspect ratios (`aspect-ratio: 4/3`, `object-fit: cover`) to avoid distortion or stretching.
  - Smooth shimmer skeleton placeholder state while images download.
- **Font Awesome Thumbs-Up Integration**:
  - Implemented using official `@fortawesome/react-fontawesome`, `@fortawesome/free-solid-svg-icons`, and `@fortawesome/free-regular-svg-icons`.
  - Dynamic icon state (regular outline for initial, solid with brand accent upon like).
- **Independent Like System**:
  - Every individual photo card features its own like counter, initialized to 0.
  - Each click increases that specific photo's like count by exactly 1.
  - Repeated clicks are fully supported.
  - Likes are completely isolated—liking one photo never affects other cards.
  - Aggregated live gallery like counter displayed in the sticky header.
  - Implemented via pure, immutable state updates (`setPhotos(prev => prev.map(...))`).
- **Robust Infinite Scrolling via IntersectionObserver**:
  - Dedicated bottom sentinel element observed via the native browser `IntersectionObserver` API.
  - Pre-fetches subsequent pages seamlessly with a 250px viewport margin before the user reaches the bottom.
  - Strictly appends new photos to the existing state without replacing prior items.
  - Prevents concurrent duplicate requests using state and ref flags (`isFetchingRef`).
  - Automatic deduplication of photo records by ID.
  - Observer cleanup on component unmount to prevent memory leaks.
  - Safe against React 18 StrictMode double-invocations in development.
  - Graceful fallback for legacy environments lacking `IntersectionObserver`.
- **Comprehensive Error Handling & Loading States**:
  - `LoadingIndicator.jsx`: Visual spinner ring and contextual loading text for initial and pagination fetches.
  - `ErrorMessage.jsx`: User-friendly error alert with a functional "Try Again" retry action that resumes pagination without skipping pages.
  - Visual indicator when the end of the gallery is reached.

---

## 🏗️ Architecture & Component Hierarchy

```
src/
├── components/
│   ├── GalleryHeader.jsx       # Sticky header with branding & aggregate metrics
│   ├── PhotoCard.jsx           # Individual photo card with Font Awesome like button
│   ├── PhotoList.jsx           # Single-column feed & IntersectionObserver sentinel
│   ├── LoadingIndicator.jsx    # Animated spinner & status feedback
│   └── ErrorMessage.jsx        # API error banner with retry trigger
├── hooks/
│   └── useInfinitePhotos.js    # Custom infinite scroll & pagination hook
├── services/
│   └── picsumApi.js            # Pure async API client for Lorem Picsum endpoints
├── App.jsx                     # Root application coordinator
├── App.css                     # Feed styles, skeleton shimmer & responsiveness
├── index.css                   # Global reset, typography & color variables
└── main.jsx                    # Application entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Installation

```bash
# Navigate to Project 2 directory
cd "Project 2 - React Photo Gallery"

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

The application will be accessible at: `http://localhost:5174`

### Production Build

```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

