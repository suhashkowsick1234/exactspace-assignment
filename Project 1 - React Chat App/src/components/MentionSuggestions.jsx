import React, { useEffect, useRef } from 'react';
import { USER_COLORS } from '../hooks/useChat';

export default function MentionSuggestions({
  suggestions,
  selectedIndex,
  onSelect,
  onSelectUser,
  query
}) {
  const listRef = useRef(null);
  const handleSelect = onSelect || onSelectUser;

  useEffect(() => {
    if (listRef.current && suggestions.length > 0) {
      const activeItem = listRef.current.children[selectedIndex + 1];
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, suggestions.length]);

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mention-dropdown" ref={listRef} role="listbox" aria-label="Suggested team members">
      <div className="mention-header">Matching team members</div>
      {suggestions.map((user, index) => {
        const isSelected = index === selectedIndex;
        const colors = USER_COLORS[user] || { bg: '#E5E7EB', text: '#374151', initials: user.slice(0, 2) };

        return (
          <div
            key={user}
            role="option"
            aria-selected={isSelected}
            className={`mention-item ${isSelected ? 'active' : ''}`}
            onMouseDown={(e) => {
              e.preventDefault();
              handleSelect(user);
            }}
          >
            <span
              className="mention-avatar-mini"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {colors.initials || user.slice(0, 2).toUpperCase()}
            </span>
            <div className="mention-name-col">
              <span className="mention-username">{user}</span>
              {colors.role && <span className="mention-user-role">{colors.role}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
