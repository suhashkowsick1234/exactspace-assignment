import React, { useState, useEffect, useRef, useMemo } from 'react';
import { EMOJI_CATEGORIES, ALL_EMOJIS, searchEmojis } from '../data/emojiData';

const SKIN_TONES = [
  { tone: '', color: '#FFC93E', label: 'Default' },
  { tone: '🏻', color: '#FADCBC', label: 'Light' },
  { tone: '🏼', color: '#E0BB95', label: 'Medium-Light' },
  { tone: '🏽', color: '#BF8F68', label: 'Medium' },
  { tone: '🏾', color: '#9B643D', label: 'Medium-Dark' },
  { tone: '🏿', color: '#594539', label: 'Dark' }
];

export default function EmojiPicker({ onSelectEmoji, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('smileys');
  const [hoveredEmoji, setHoveredEmoji] = useState(ALL_EMOJIS[0]);
  const [selectedSkinTone, setSelectedSkinTone] = useState(SKIN_TONES[0]);
  const [showSkinSelector, setShowSkinSelector] = useState(false);
  const [frequentlyUsed, setFrequentlyUsed] = useState(() => {
    try {
      const saved = localStorage.getItem('exactspace_chat_frequent_emojis');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['👋', '👍', '👏', '❤️', '😂', '🎉', '🔥', '✨', '🌊', '🚀', '😊', '💡'];
  });

  const pickerRef = useRef(null);
  const searchInputRef = useRef(null);
  const categoryRefs = useRef({});

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Close on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchEmojis(searchQuery);
  }, [searchQuery]);

  // Apply skin tone modifier to tone-supporting emojis (hands/people)
  const applySkinTone = (emojiChar) => {
    if (!selectedSkinTone.tone) return emojiChar;
    // Common hand gestures that take skin tone modifiers
    const toneEligible = ['👋', '👍', '👎', '👏', '🙌', '👐', '🙏', '✌️', '🤞', '🤟', '🤘', '👌', '🤌', '🤏', '👈', '👉', '👆', '👇', '👊', '✊', '🤛', '🤜', '💪', '🏄'];
    if (toneEligible.includes(emojiChar)) {
      return `${emojiChar}${selectedSkinTone.tone}`;
    }
    return emojiChar;
  };

  const handleEmojiClick = (item) => {
    const finalEmoji = applySkinTone(item.emoji);
    onSelectEmoji(finalEmoji);

    // Update frequently used
    const updated = [item.emoji, ...frequentlyUsed.filter((e) => e !== item.emoji)].slice(0, 18);
    setFrequentlyUsed(updated);
    try {
      localStorage.setItem('exactspace_chat_frequent_emojis', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const scrollToCategory = (catId) => {
    setActiveCategory(catId);
    setSearchQuery('');
    const targetElement = categoryRefs.current[catId];
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // SVG category icons matching image 3
  const renderCategoryIcon = (iconType) => {
    switch (iconType) {
      case 'recent':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      case 'smileys':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
            <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
          </svg>
        );
      case 'animals':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .18 1.583 1.956 2.062 3 2 1.04-.062 1.5-1.5 2.5-1.5.882 0 1.5 1.01 2 1.5" />
            <path d="M14 5.172C14 3.782 15.577 2.679 17.5 3c2.823.47 4.113 6.006 4 7-.18 1.583-1.956 2.062-3 2-1.04-.062-1.5-1.5-2.5-1.5-.882 0-1.5 1.01-2 1.5" />
            <path d="M8 14v.5a4 4 0 0 0 8 0V14" />
            <circle cx="9" cy="10" r="1" fill="currentColor" />
            <circle cx="15" cy="10" r="1" fill="currentColor" />
          </svg>
        );
      case 'food':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.5 2.5-1 3.5 3 .5 6 3 6 7a6.5 6.5 0 0 1-13 0c0-4 3-6.5 6-7-.5-1-1-2-1-3.5a4 4 0 0 1 4-4z" />
          </svg>
        );
      case 'activity':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20M2 12h20" />
            <path d="M4.93 4.93a10 10 0 0 1 14.14 0M4.93 19.07a10 10 0 0 0 14.14 0" />
          </svg>
        );
      case 'travel':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="8" rx="2" />
            <path d="M5 11l2-5h10l2 5" />
            <circle cx="7.5" cy="15.5" r="1.5" fill="currentColor" />
            <circle cx="16.5" cy="15.5" r="1.5" fill="currentColor" />
          </svg>
        );
      case 'objects':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
          </svg>
        );
      case 'symbols':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        );
      case 'flags':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dark-emoji-picker" ref={pickerRef} role="dialog" aria-label="Emoji Picker">
      {/* Category Icons Navigation Bar */}
      <div className="emoji-nav-bar">
        {EMOJI_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`emoji-nav-btn ${activeCategory === cat.id && !searchQuery ? 'active' : ''}`}
            onClick={() => scrollToCategory(cat.id)}
            title={cat.name}
            aria-label={cat.name}
          >
            {renderCategoryIcon(cat.icon)}
          </button>
        ))}
      </div>

      {/* Search Bar matching image 3 and image 4 */}
      <div className="emoji-search-container">
        <input
          ref={searchInputRef}
          type="text"
          className="emoji-search-input"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery ? (
          <button
            type="button"
            className="emoji-search-clear-btn"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        ) : (
          <span className="emoji-search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        )}
      </div>

      {/* Emoji Scroll Area */}
      <div className="emoji-scroll-area">
        {searchQuery.trim() ? (
          /* Search Results View */
          <div className="emoji-section">
            <div className="emoji-section-header">Search Results</div>
            {searchResults.length === 0 ? (
              <div className="emoji-no-results">No emojis found for "{searchQuery}"</div>
            ) : (
              <div className="emoji-grid-9col">
                {searchResults.map((item) => (
                  <button
                    key={`${item.emoji}-${item.name}`}
                    type="button"
                    className="emoji-btn"
                    onClick={() => handleEmojiClick(item)}
                    onMouseEnter={() => setHoveredEmoji(item)}
                    title={item.name}
                  >
                    {applySkinTone(item.emoji)}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Standard Categorized View */
          <>
            {/* Frequently Used */}
            <div
              className="emoji-section"
              ref={(el) => (categoryRefs.current['frequentlyUsed'] = el)}
            >
              <div className="emoji-section-header">Frequently Used</div>
              <div className="emoji-grid-9col">
                {frequentlyUsed.map((char) => {
                  const found = ALL_EMOJIS.find((e) => e.emoji === char) || {
                    emoji: char,
                    name: 'Emoji',
                    shortcode: `:${char}:`
                  };
                  return (
                    <button
                      key={`freq-${char}`}
                      type="button"
                      className="emoji-btn"
                      onClick={() => handleEmojiClick(found)}
                      onMouseEnter={() => setHoveredEmoji(found)}
                      title={found.name}
                    >
                      {applySkinTone(char)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* All other categories */}
            {EMOJI_CATEGORIES.filter((c) => c.id !== 'frequentlyUsed').map((cat) => {
              const catEmojis = ALL_EMOJIS.filter((e) => e.category === cat.id);
              if (catEmojis.length === 0) return null;
              return (
                <div
                  key={cat.id}
                  className="emoji-section"
                  ref={(el) => (categoryRefs.current[cat.id] = el)}
                >
                  <div className="emoji-section-header">{cat.name}</div>
                  <div className="emoji-grid-9col">
                    {catEmojis.map((item) => (
                      <button
                        key={`${cat.id}-${item.emoji}`}
                        type="button"
                        className="emoji-btn"
                        onClick={() => handleEmojiClick(item)}
                        onMouseEnter={() => setHoveredEmoji(item)}
                        title={item.name}
                      >
                        {applySkinTone(item.emoji)}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Bottom Footer Preview Bar matching image 3 and image 4 */}
      <div className="emoji-footer-preview">
        <div className="preview-left">
          <span className="preview-big-emoji">
            {hoveredEmoji ? applySkinTone(hoveredEmoji.emoji) : '👋'}
          </span>
          <div className="preview-text-block">
            <div className="preview-name">
              {hoveredEmoji ? hoveredEmoji.name : 'Waving Hand Sign'}
            </div>
            <div className="preview-shortcode">
              {hoveredEmoji ? hoveredEmoji.shortcode : ':wave:'}
            </div>
          </div>
        </div>

        {/* Skin Tone Selector */}
        <div className="skin-tone-wrapper">
          <button
            type="button"
            className="skin-tone-dot-btn"
            style={{ backgroundColor: selectedSkinTone.color }}
            onClick={() => setShowSkinSelector((prev) => !prev)}
            title={`Skin tone: ${selectedSkinTone.label}`}
            aria-label="Change skin tone"
          />
          {showSkinSelector && (
            <div className="skin-tone-palette">
              {SKIN_TONES.map((st) => (
                <button
                  key={st.label}
                  type="button"
                  className={`skin-tone-option ${selectedSkinTone.label === st.label ? 'active' : ''}`}
                  style={{ backgroundColor: st.color }}
                  onClick={() => {
                    setSelectedSkinTone(st);
                    setShowSkinSelector(false);
                  }}
                  title={st.label}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
