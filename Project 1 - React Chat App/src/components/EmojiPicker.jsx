import React, { useEffect, useRef } from 'react';

const EMOJI_CATEGORIES = [
  {
    name: 'Smileys & Emotion',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😎', '🤩', '🥳', '🤔', '🤫', '🤗']
  },
  {
    name: 'Gestures & People',
    emojis: ['👍', '👎', '👏', '🙌', '👐', '🤝', '👊', '✊', '✌️', '🤞', '🤟', '🤘', '👌', '🤌', '👈', '👉', '👆', '👇', '🙏', '💪']
  },
  {
    name: 'Reactions & Hearts',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '🔥', '✨', '⭐', '🎉']
  },
  {
    name: 'Symbols & Work',
    emojis: ['🚀', '💻', '💡', '✅', '❌', '⚠️', '🎯', '📌', '📊', '📈', '☕', '⚡', '🛠️', '📝', '🔔', '💬']
  }
];

export default function EmojiPicker({ onSelectEmoji, onClose }) {
  const pickerRef = useRef(null);

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

  return (
    <div className="emoji-picker-popover" ref={pickerRef} role="dialog" aria-label="Emoji Picker">
      <div className="emoji-picker-header">
        <span className="emoji-picker-title">Pick an emoji</span>
        <button
          type="button"
          className="emoji-picker-close-btn"
          onClick={onClose}
          aria-label="Close emoji picker"
        >
          ✕
        </button>
      </div>

      <div className="emoji-picker-content">
        {EMOJI_CATEGORIES.map((category) => (
          <div key={category.name} className="emoji-category-block">
            <span className="emoji-category-title">{category.name}</span>
            <div className="emoji-grid">
              {category.emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="emoji-grid-btn"
                  onClick={() => {
                    onSelectEmoji(emoji);
                  }}
                  title={emoji}
                  aria-label={`Insert ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
