import { useState, useCallback } from 'react';

export const USER_LIST = ['Alan', 'Bob', 'Carol', 'Dean', 'Elin'];

// Deterministic color assignment for consistent avatars
export const USER_COLORS = {
  Alan: { bg: '#E0E7FF', text: '#3730A3', border: '#C7D2FE' },
  Bob: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' },
  Carol: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
  Dean: { bg: '#FCE7F3', text: '#9D174D', border: '#FBCFE8' },
  Elin: { bg: '#F3E8FF', text: '#6B21A8', border: '#E9D5FF' }
};

export const INITIAL_MESSAGES = [
  {
    id: 'msg-init-1',
    username: 'Alan',
    text: 'Hello team! Welcome to the new ExactSpace collaboration workspace.',
    likes: 2,
    timestamp: '10:00 AM'
  },
  {
    id: 'msg-init-2',
    username: 'Bob',
    text: 'Great to be here! Working on the frontend engineering assignment components.',
    likes: 1,
    timestamp: '10:02 AM'
  },
  {
    id: 'msg-init-3',
    username: 'Carol',
    text: 'Feel free to test sending messages, @mentions (like @Dean or @Elin), and emoji reactions!',
    likes: 3,
    timestamp: '10:05 AM'
  }
];

export function useChat(initialMessages = INITIAL_MESSAGES) {
  const [messages, setMessages] = useState(initialMessages);

  const sendMessage = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    // Pick random username from user_list as mandated
    const randomIndex = Math.floor(Math.random() * USER_LIST.length);
    const assignedUser = USER_LIST[randomIndex];

    const newMessage = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      username: assignedUser,
      text: trimmed,
      likes: 0,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMessage]);
    return true;
  }, []);

  const likeMessage = useCallback((messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, likes: msg.likes + 1 } : msg
      )
    );
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    likeMessage,
    clearMessages,
    userList: USER_LIST
  };
}
