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

  const textareaRef = useRef(null);

  // Compute matching users for mention
  const filteredSuggestions = mentionState.active
    ? USER_LIST.filter((user) =>
        user.toLowerCase().startsWith(mentionState.query.toLowerCase())
      )
    : [];

  // Detect '@' at current cursor
  const checkMentionTrigger = (text, cursorPosition) => {
    const textBeforeCursor = text.slice(0, cursorPosition);
    // Find last '@' that is either at the beginning or preceded by whitespace
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (
      lastAtIndex !== -1 &&
      (lastAtIndex === 0 || /\s/.test(textBeforeCursor[lastAtIndex - 1]))
    ) {
      const query = textBeforeCursor.slice(lastAtIndex + 1);
      // Valid mention query shouldn't contain spaces
      if (!/\s/.test(query)) {
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
    const cursorPos = textareaRef.current?.selectionStart || inputText.length;
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

    // Restore focus and cursor position after inserted mention
    setTimeout(() => {
      if (textareaRef.current) {
        const nextPos = beforeMention.length + username.length + 2; // @ + name + space
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(nextPos, nextPos);
      }
    }, 0);
  };

  const handleSelectEmoji = (emoji) => {
    const cursorPos = textareaRef.current?.selectionStart || inputText.length;
    const before = inputText.slice(0, cursorPos);
    const after = inputText.slice(cursorPos);
    const newText = `${before}${emoji}${after}`;

    setInputText(newText);
    setShowEmojiPicker(false);

    setTimeout(() => {
      if (textareaRef.current) {
        const nextPos = cursorPos + emoji.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(nextPos, nextPos);
      }
    }, 0);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const sent = onSendMessage(inputText);
    if (sent) {
      setInputText('');
      setMentionState({
        active: false,
        query: '',
        startIndex: -1,
        selectedIndex: 0
      });
      setShowEmojiPicker(false);
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e) => {
    // If mention suggestions dropdown is open
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
          selectedIndex:
            (prev.selectedIndex - 1 + filteredSuggestions.length) %
            filteredSuggestions.length
        }));
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const selectedUser = filteredSuggestions[mentionState.selectedIndex];
        if (selectedUser) {
          insertMention(selectedUser);
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setMentionState({
          active: false,
          query: '',
          startIndex: -1,
          selectedIndex: 0
        });
        return;
      }
    }

    // Normal Enter sends, Shift+Enter adds newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputBlur = () => {
    // Delay closing mention to allow mouse click to register
    setTimeout(() => {
      setMentionState((prev) => ({ ...prev, active: false }));
    }, 200);
  };

  const isSendDisabled = !inputText.trim();

  return (
    <footer className="chat-input-area">
      {/* Mention Suggestions Popover */}
      {mentionState.active && (
        <MentionSuggestions
          suggestions={filteredSuggestions}
          selectedIndex={mentionState.selectedIndex}
          onSelectUser={insertMention}
          query={mentionState.query}
        />
      )}

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <EmojiPicker
          onSelectEmoji={handleSelectEmoji}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}

      <div className="chat-input-container">
        <button
          type="button"
          className={`chat-action-btn emoji-trigger-btn ${showEmojiPicker ? 'active' : ''}`}
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          title="Add Emoji"
          aria-label="Toggle emoji selector"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          className="chat-textarea"
          placeholder="Type a message... (Type @ to mention team members, Shift+Enter for new line)"
          value={inputText}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          rows={1}
          aria-label="Message text"
        />

        <button
          type="button"
          className="chat-send-btn"
          disabled={isSendDisabled}
          onClick={handleSend}
          title="Send message (Enter)"
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          <span className="send-text">Send</span>
        </button>
      </div>

      <div className="chat-input-helper">
        <span>Press <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for newline, <kbd>@</kbd> to mention. Random username assigned on send.</span>
      </div>
    </footer>
  );
}
