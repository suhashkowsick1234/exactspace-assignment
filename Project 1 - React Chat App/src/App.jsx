import React from 'react';
import ChatHeader from './components/ChatHeader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { useChat } from './hooks/useChat';
import './App.css';

export default function App() {
  const { messages, sendMessage, likeMessage } = useChat();

  return (
    <div className="chat-app-root">
      <div className="chat-card-container">
        <ChatHeader messageCount={messages.length} />
        <ChatWindow messages={messages} onLike={likeMessage} />
        <ChatInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
}
