import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

export default function ChatWindow({ messages, onLike, currentUserName }) {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main className="pubnub-chat-feed" ref={scrollRef} aria-label="Message Feed">
      {messages.length === 0 ? (
        <div className="empty-chat-state">
          <p>No messages in this channel yet.</p>
          <span className="empty-subtext">Send a message to start interacting!</span>
        </div>
      ) : (
        <div className="messages-stream">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onLike={onLike}
              currentUserName={currentUserName}
            />
          ))}
        </div>
      )}
    </main>
  );
}
