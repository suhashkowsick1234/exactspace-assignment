import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

export default function ChatWindow({ messages, onLike }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Smoothly scroll down when messages change
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <main className="chat-window" ref={containerRef} aria-label="Conversation thread">
      {messages.length === 0 ? (
        <div className="chat-empty-state">
          <div className="empty-icon">💬</div>
          <h3>No messages yet</h3>
          <p>Start the conversation! Type a message below and hit Send.</p>
        </div>
      ) : (
        <div className="chat-messages-list">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onLike={onLike}
            />
          ))}
          <div ref={bottomRef} style={{ height: 1 }} />
        </div>
      )}
    </main>
  );
}
