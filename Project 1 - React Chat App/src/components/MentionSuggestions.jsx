import React, { useEffect, useRef } from 'react';
import { USER_COLORS } from '../hooks/useChat';

export default function MentionSuggestions({
  suggestions,
  selectedIndex,
  onSelectUser,
  query
}) {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current && suggestions.length > 0) {
      const activeItem = listRef.current.children[selectedIndex];
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, suggestions.length]);

  if (suggestions.length === 0) {
    return (
      <div className="mention-dropdown no-matches" role="listbox">
        <div className="mention-item-empty">No matching users found for "{query}"</div>
      </div>
    );
  }

  return (
    <div className="mention-dropdown" ref={listRef} role="listbox" aria-label="Suggested team members">
      <div className="mention-header">Matching team members</div>
      {suggestions.map((user, index) => {
        const isSelected = index === selectedIndex;
        const colors = USER_COLORS[user] || { bg: '#E5E7EB', text: '#374151' };

        return (
          <div
            key={user}
            role="option"
            aria-selected={isSelected}
            className={`mention-item ${isSelected ? 'active' : ''}`}
            onMouseDown={(e) => {
              // Use onMouseDown so it fires before input blur
              e.preventDefault();
              onSelectUser(user);
            }}
          >
            <span
              className="mention-avatar-mini"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {user.charAt(0)}
            </span>
            <span className="mention-username">{user}</span>
            <span className="mention-tag-hint">@{user}</span>
          </div>
        );
      })}
    </div>
  );
}
