# Exactspace UI Developer Internship Assignment

A technical assessment submission for the **Exactspace Frontend / UI Developer Internship**. This repository contains two production-quality, independently runnable React applications built strictly to specification.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Project 1 — React Chat App](#-project-1--react-chat-app)
- [Project 2 — React Photo Gallery](#-project-2--react-photo-gallery)
- [Technologies Used](#-technologies-used)
- [Repository Structure](#-repository-structure)
- [Getting Started & Installation](#-getting-started--installation)
- [Running Each Project Independently](#-running-each-project-independently)
- [Testing & Quality Verification](#-testing--quality-verification)
- [Screenshots & Visual Preview](#-screenshots--visual-preview)
- [GitHub Repository Information](#-github-repository-information)

---

## 🌟 Overview

This monorepo-style assignment submission contains two independent React applications engineered with clean component design, immutable state patterns, custom hooks, and modern CSS:

1. **Project 1 - React Chat App**: An interactive collaboration chat interface featuring random user assignment, message validation, individual like counters, emoji picker, and @mentions autocomplete.
2. **Project 2 - React Photo Gallery**: A responsive single-column photography feed powered by the Lorem Picsum paginated API, native `IntersectionObserver` infinite scrolling, Font Awesome like reactions, and resilient error recovery.

---

## 💬 Project 1 — React Chat App

### Overview
A modern, single-page messaging workspace allowing users to submit messages, engage in a conversation thread, and like individual messages independently.

### Key Features
- **Deterministic & Accessible Chat UI**:
  - `ChatHeader`: Displays active participants (`Alan`, `Bob`, `Carol`, `Dean`, `Elin`), status badge, and live message counter.
  - `ChatWindow`: Auto-scrolling conversation feed with colored avatar badges, formatted timestamps, and responsive bubble layouts.
  - `ChatInput`: Auto-expanding message input, keyboard dispatch (`Enter` sends, `Shift + Enter` inserts newlines), and action buttons.
- **Random User Assignment**:
  - Every sent message is assigned a random user selected from:
    ```js
    const user_list = ["Alan", "Bob", "Carol", "Dean", "Elin"];
    ```
- **Rigorous Message Validation**:
  - Rejects empty strings and whitespace-only submissions.
  - Clears input and restores focus cleanly upon sending.
- **Independent Like System**:
  - Every message has an individual like button on the right edge.
  - Initialized to 0, increments by 1 per click, and operates via pure immutable React state updates (`setMessages(prev => prev.map(...))`).
- **Emoji Picker Support** (`EmojiPicker.jsx`):
  - Popover modal featuring categorized emojis (Smileys, Gestures, Hearts, Work/Tech) inserted at cursor position.
- **Interactive @mentions** (`MentionSuggestions.jsx`):
  - Typing `@` triggers an autocomplete dropdown filtered against the exact team member list.
  - Full keyboard (`ArrowUp`, `ArrowDown`, `Enter`, `Tab`, `Escape`) and mouse support with highlighted mention badges in messages.

---

## 📸 Project 2 — React Photo Gallery

### Overview
A clean, editorial-style single-column photo gallery consuming the paginated Lorem Picsum API with genuine infinite scrolling powered by the browser `IntersectionObserver` API.

### Key Features
- **Picsum API Integration**:
  - Connects to `https://picsum.photos/v2/list?page={page}&limit=15`.
  - Increments page dynamically without hardcoding upper bounds until an empty array (`data.length === 0`) signals the catalogue end.
  - Accurately binds `id`, `author`, and `download_url`.
- **Single-Column Feed**:
  - Large-format photo presentation preserving original aspect ratios (`aspect-ratio: 4/3`, `object-fit: cover`).
  - Shimmer skeleton placeholder animations during image download.
- **Font Awesome Thumbs-Up Integration**:
  - Integrated via `@fortawesome/react-fontawesome` with dynamic solid/regular states.
- **Independent Like System**:
  - Every photo has an independent like counter initialized to 0.
  - Repeated clicks increment only that photo's count without impacting any other photo.
- **Reliable Infinite Scrolling via IntersectionObserver**:
  - Dedicated sentinel element pre-loads subsequent pages 250px before reaching the bottom.
  - Strictly appends new photos to existing records.
  - Guarded against concurrent duplicate requests and StrictMode re-mounts via `isFetchingRef`.
  - Memory leak protection via proper observer cleanup in `useEffect`.
- **Fault-Tolerant Error Handling**:
  - Visual spinner ring for loading states.
  - User-friendly error alert with a functional "Try Again" retry button.
  - Visual end-of-catalogue indicator when all images are retrieved.

---

## 🛠️ Technologies Used

- **Framework**: React 18 (Functional Components, Hooks)
- **Tooling & Bundler**: Vite (Fast HMR, optimized production rollups)
- **Icons**:
  - Font Awesome (`@fortawesome/react-fontawesome`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons`) for Project 2
  - Modern Inline Accessible SVGs for Project 1
- **Styling**: Vanilla CSS3 (Custom Properties / Design Tokens, Flexbox, Grid, Shimmer Animations, Media Queries)
- **Web APIs**: `IntersectionObserver`, `fetch`, `AbortController`, `crypto.randomUUID`

---

## 📂 Repository Structure

```
assignment/
├── Project 1 - React Chat App/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── EmojiPicker.jsx
│   │   │   └── MentionSuggestions.jsx
│   │   ├── hooks/
│   │   │   └── useChat.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── README.md
│
├── Project 2 - React Photo Gallery/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GalleryHeader.jsx
│   │   │   ├── PhotoCard.jsx
│   │   │   ├── PhotoList.jsx
│   │   │   ├── LoadingIndicator.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── hooks/
│   │   │   └── useInfinitePhotos.js
│   │   ├── services/
│   │   │   └── picsumApi.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── README.md
│
└── README.md
```

---

## ⚡ Getting Started & Installation

Each project is completely self-contained with its own independent `package.json` and dependencies.

### Step 1: Clone the repository
```bash
git clone https://github.com/exactspace-ui-assignment/exactspace-ui-assignment.git
cd exactspace-ui-assignment
```

### Step 2: Install Project 1
```bash
cd "Project 1 - React Chat App"
npm install
cd ..
```

### Step 3: Install Project 2
```bash
cd "Project 2 - React Photo Gallery"
npm install
cd ..
```

---

## ▶️ Running Each Project Independently

### Run Project 1 (React Chat App)
```bash
cd "Project 1 - React Chat App"
npm run dev
```
> Opens at `http://localhost:5173`

### Run Project 2 (React Photo Gallery)
```bash
cd "Project 2 - React Photo Gallery"
npm run dev
```
> Opens at `http://localhost:5174`

---

## 🧪 Testing & Quality Verification

### Production Build Verification
Both projects have verified production builds:

```bash
# Verify Chat App build
cd "Project 1 - React Chat App"
npm run build

# Verify Photo Gallery build
cd "Project 2 - React Photo Gallery"
npm run build
```

### Requirement Verification Matrix

| Requirement | Project | Status | Verification Detail |
|---|---|---|---|
| Single-page chat interface | Project 1 | ✅ Completed | Header, conversation feed, input field, responsive layout |
| Random user assignment (`Alan`, `Bob`, `Carol`, `Dean`, `Elin`) | Project 1 | ✅ Completed | Uniform random pick verified in `useChat.js` |
| Empty / whitespace message validation | Project 1 | ✅ Completed | Trim check blocks dispatch; Enter sends; Shift+Enter newline |
| Independent message likes | Project 1 | ✅ Completed | Isolated like buttons increment by exactly 1 without cross-mutation |
| Emoji picker stretch goal | Project 1 | ✅ Completed | Categorized picker inserts into input cleanly |
| @mentions stretch goal | Project 1 | ✅ Completed | Autocomplete dropdown with keyboard + mouse navigation |
| Picsum API pagination | Project 2 | ✅ Completed | Pages 1, 2, 3... dynamically fetched; stops on empty array |
| download_url image source | Project 2 | ✅ Completed | Binds `download_url` directly; unique `id` key |
| Single-column photo feed | Project 2 | ✅ Completed | Clean column layout with author metadata |
| Font Awesome thumbs-up icon | Project 2 | ✅ Completed | Official Font Awesome React components integrated |
| Independent photo likes | Project 2 | ✅ Completed | Isolated like counter per photo card |
| IntersectionObserver infinite scrolling | Project 2 | ✅ Completed | Sentinel observer appends next page reliably; unmount cleanup |
| Loading, error & retry handling | Project 2 | ✅ Completed | Spinner ring, error card with functional retry button |

---

## 🖼️ Screenshots & Visual Preview

### Project 1: React Chat App
- **Clean Message Bubbles**: User avatar badges, author names, timestamps, and right-aligned like counters.
- **Interactive Autocomplete**: Popover menu displaying `@Alan`, `@Bob`, `@Carol`, `@Dean`, `@Elin` upon typing `@`.
- **Emoji Selector**: Categorized grid popover providing instant emoji reactions.

### Project 2: React Photo Gallery
- **Editorial Single-Column Feed**: High-resolution photography cards with author tags and full-resolution view links.
- **Font Awesome Reactions**: Thumbs-up button with active accent state and live aggregate counter.
- **Infinite Sentinel**: Seamless next-page pre-loading with spinner ring.

---

## 📦 GitHub Repository Information

- **Repository Name**: `exactspace-ui-assignment`
- **Structure**: Root folder containing `Project 1 - React Chat App/`, `Project 2 - React Photo Gallery/`, and root `README.md`.
- **Clean Distribution**: Excludes `node_modules`, build artifacts, or environment secrets via standard `.gitignore` rules.
- **Submission Note**: Ready for final review.
