import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from './EmojiPicker';
import MentionSuggestions from './MentionSuggestions';
import { USER_LIST } from '../hooks/useChat';

export default function ChatInput({ onSendMessage }) {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mentionState, setMentionState] = useState({
    active: false,
    query: '',
    startIndex: -1,
    selectedIndex: 0
  });

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Compute matching users for mention
  const filteredSuggestions = mentionState.active
    ? USER_LIST.filter((user) =>
        user.toLowerCase().includes(mentionState.query.toLowerCase())
      )
    : [];

  // Detect '@' at current cursor
  const checkMentionTrigger = (text, cursorPosition) => {
    const textBeforeCursor = text.slice(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (
      lastAtIndex !== -1 &&
      (lastAtIndex === 0 || /\s/.test(textBeforeCursor[lastAtIndex - 1]))
    ) {
      const query = textBeforeCursor.slice(lastAtIndex + 1);
      // Valid mention query shouldn't contain newlines
      if (!/[\r\n]/.test(query) && query.length <= 25) {
        setMentionState({
          active: true,
          query,
          startIndex: lastAtIndex,
          selectedIndex: 0
        });
        return;
      }
    }

    setMentionState({
      active: false,
      query: '',
      startIndex: -1,
      selectedIndex: 0
    });
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    setInputText(value);
    checkMentionTrigger(value, cursorPos);
  };

  const insertMention = (username) => {
    const cursorPos = inputRef.current?.selectionStart || inputText.length;
    const beforeMention = inputText.slice(0, mentionState.startIndex);
    const afterMention = inputText.slice(cursorPos);
    const newText = `${beforeMention}@${username} ${afterMention}`;

    setInputText(newText);
    setMentionState({
      active: false,
      query: '',
      startIndex: -1,
      selectedIndex: 0
    });

    setTimeout(() => {
      if (inputRef.current) {
        const nextPos = beforeMention.length + username.length + 2;
        inputRef.current.focus();
        inputRef.current.setSelectionRange(nextPos, nextPos);
      }
    }, 0);
  };

  const handleSelectEmoji = (emoji) => {
    const cursorPos = inputRef.current?.selectionStart ?? inputText.length;
    const before = inputText.slice(0, cursorPos);
    const after = inputText.slice(cursorPos);
    const newText = `${before}${emoji}${after}`;

    setInputText(newText);

    setTimeout(() => {
      if (inputRef.current) {
        const nextPos = cursorPos + emoji.length;
        inputRef.current.focus();
        inputRef.current.setSelectionRange(nextPos, nextPos);
      }
    }, 0);
  };

  const handleKeyDown = (e) => {
    // If mention suggestions are open, route navigation keys
    if (mentionState.active && filteredSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionState((prev) => ({
          ...prev,
          selectedIndex: (prev.selectedIndex + 1) % filteredSuggestions.length
        }));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionState((prev) => ({
          ...prev,
          selectedIndex: (prev.selectedIndex - 1 + filteredSuggestions.length) % filteredSuggestions.length
        }));
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertMention(filteredSuggestions[mentionState.selectedIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setMentionState({ active: false, query: '', startIndex: -1, selectedIndex: 0 });
        return;
      }
    }

    // Normal sending with Enter (Shift+Enter for newline)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const sent = onSendMessage(inputText);
    if (sent) {
      setInputText('');
      setMentionState({ active: false, query: '', startIndex: -1, selectedIndex: 0 });
      setShowEmojiPicker(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <footer className="pubnub-chat-input-area" ref={containerRef}>
      {/* Mention suggestions dropdown */}
      {mentionState.active && filteredSuggestions.length > 0 && (
        <MentionSuggestions
          suggestions={filteredSuggestions}
          selectedIndex={mentionState.selectedIndex}
          onSelect={insertMention}
        />
      )}

      {/* Floating Dark Emoji Picker */}
      {showEmojiPicker && (
        <div className="emoji-picker-anchor">
          <EmojiPicker
            onSelectEmoji={handleSelectEmoji}
            onClose={() => setShowEmojiPicker(false)}
          />
        </div>
      )}

      {/* Input container */}
      <div className="chat-input-pill-container">
        <input
          ref={inputRef}
          type="text"
          className="chat-main-text-input"
          placeholder="Type Message"
          value={inputText}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {/* Emoji Trigger Icon Button matching image 1 & 2 */}
        <button
          type="button"
          className={`input-emoji-trigger-btn ${showEmojiPicker ? 'active' : ''}`}
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          title="Add emoji"
          aria-label="Add emoji"
        >
          <svg
            className="input-emoji-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
            <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
          </svg>
        </button>

        {/* Mobile / Quick Send Button when text is present */}
        {inputText.trim().length > 0 && (
          <button
            type="button"
            className="input-send-trigger-btn"
            onClick={handleSend}
            title="Send message (Enter)"
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="send-svg-icon">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        )}
      </div>
    </footer>
  );
}
