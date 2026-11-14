import React from 'react';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { useChat } from './hooks/useChat';
import './App.css';

export default function App() {
  const {
    messages,
    channels,
    activeChannel,
    activeChannelId,
    setActiveChannelId,
    currentUser,
    updateCurrentUser,
    isRandomUserMode,
    setIsRandomUserMode,
    sendMessage,
    likeMessage,
    addChannel
  } = useChat();

  return (
    <div className="pubnub-app-container">
      <div className="pubnub-chat-shell">
        {/* Left Navigation Sidebar */}
        <Sidebar
          channels={channels}
          activeChannelId={activeChannelId}
          onSelectChannel={setActiveChannelId}
          onAddChannel={addChannel}
          currentUser={currentUser}
          onUpdateUser={updateCurrentUser}
          isRandomUserMode={isRandomUserMode}
          onToggleRandomUserMode={() => setIsRandomUserMode((prev) => !prev)}
        />

        {/* Right Main Chat Panel */}
        <div className="pubnub-main-chat">
          <ChatHeader activeChannel={activeChannel} onlineCount={3} />
          <ChatWindow
            messages={messages}
            onLike={likeMessage}
            currentUserName={currentUser.name}
          />
          <ChatInput onSendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
}
