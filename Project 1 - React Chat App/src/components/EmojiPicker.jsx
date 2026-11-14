import React, { useEffect, useRef } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export default function EmojiPicker({ onSelectEmoji, onClose }) {
  const pickerRef = useRef(null);

  // Close when clicking outside or pressing Escape
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
    <div className="emoji-mart-popover-container" ref={pickerRef}>
      <Picker
        data={data}
        onEmojiSelect={(item) => {
          if (item && item.native) {
            onSelectEmoji(item.native);
          }
        }}
        theme="dark"
        autoFocus={true}
        searchPosition="sticky"
        previewPosition="bottom"
        skinTonePosition="preview"
        navPosition="top"
        perLine={9}
        maxFrequentRows={1}
      />
    </div>
  );
}
