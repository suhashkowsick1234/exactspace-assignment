# Project 1 — React Chat Application

A single-page, real-time-styled React chat application built as part of the **Exactspace UI Developer Internship Technical Assessment**.

---

## 🌟 Overview & Key Features

This application implements a clean, modern, and accessible messaging interface engineered strictly according to the assignment specification.

### Mandatory Features Implemented
- **Single-Page Chat Interface**:
  - `ChatHeader`: Displays active members (`Alan`, `Bob`, `Carol`, `Dean`, `Elin`), presence status, and real-time message counter.
  - `ChatWindow`: Auto-scrolling conversation feed rendering message bubbles with user avatars, formatted timestamps, and clear visual hierarchy.
  - `ChatInput`: Sleek message input with auto-growing multiline support, Enter-to-send shortcut, and Send button.
- **Random User Assignment**:
  - Every sent message is automatically assigned a random username strictly from `["Alan", "Bob", "Carol", "Dean", "Elin"]` using a reliable uniform random distribution.
- **Robust Message Validation**:
  - Empty messages and whitespace-only submissions are strictly prevented.
  - Supports keyboard sending via `Enter` while preserving `Shift + Enter` for multiline formatting.
  - Input field automatically resets and retains focus after dispatch.
- **Independent Like System**:
  - Every individual message card has its own dedicated like button positioned at the right end.
  - Initialized to 0 likes.
  - Increments by exactly 1 per click independently.
  - Handled via pure, immutable state updates (`setMessages(prev => prev.map(...))`).
- **UI/UX Excellence**:
  - Soft neutral background, crisp borders, subtle shadows, and indigo accents.
  - Color-coded avatars uniquely mapped to team members.
  - Fully responsive across mobile (375px, 430px), tablet (768px), and desktop (1366px, 1920px).

### Stretch Goals Implemented
- **Emoji Picker Support** (`EmojiPicker.jsx`):
  - Popover picker with categorized emojis (Smileys, Gestures, Reactions, Symbols).
  - Inserts directly at cursor position without disrupting user flow.
- **Interactive @mentions** (`MentionSuggestions.jsx`):
  - Typing `@` prompts an interactive autocomplete dropdown of the required team members.
  - Supports keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Tab`, `Escape`) and mouse selection.
  - Formats `@mentions` with a distinct highlighted pill in the message feed.

---

## 🏗️ Architecture & Component Hierarchy

```
src/
├── components/
│   ├── ChatHeader.jsx           # Channel header & participant badges
│   ├── ChatWindow.jsx           # Message feed & auto-scroll container
│   ├── ChatMessage.jsx          # Individual message card with like button
│   ├── ChatInput.jsx            # Textarea, action triggers & keyboard listeners
│   ├── EmojiPicker.jsx          # Categorized emoji selector
│   └── MentionSuggestions.jsx   # Keyboard-accessible @mention autocomplete
├── hooks/
│   └── useChat.js               # State management hook (messages, likes, user list)
├── App.jsx                      # Root container component
├── App.css                      # Chat layout, cards, animations & responsiveness
├── index.css                    # Design tokens & typography
└── main.jsx                     # Application bootstrap & StrictMode
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Installation

```bash
# Navigate to Project 1 directory
cd "Project 1 - React Chat App"

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

The application will be accessible at: `http://localhost:5173`

### Production Build

```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```
