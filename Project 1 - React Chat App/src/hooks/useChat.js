import { useState, useCallback, useMemo } from 'react';

export const DEFAULT_USER = {
  id: 'user-me',
  name: 'Suhas Kowsick',
  role: 'UI Developer',
  initials: 'SK',
  avatarBg: '#3B82F6',
  avatarColor: '#FFFFFF'
};

export const CHANNELS = [
  {
    id: 'poland-office',
    name: 'Poland Office',
    description: 'Poland regional office chatter & updates',
    memberCount: 42
  },
  {
    id: 'introductions',
    name: 'Introductions',
    description: 'This Channel Is For Company Wide Chatter',
    memberCount: 100
  },
  {
    id: 'india-office',
    name: 'India Office',
    description: 'India regional office updates & team events',
    memberCount: 68
  }
];

export const ALL_USERS = [
  { name: 'Suhas Kowsick', role: 'UI Developer', initials: 'SK', bg: '#3B82F6', color: '#FFFFFF' },
  { name: 'Gregory Goolsby', role: 'Product Lead', initials: 'GG', bg: '#84CC16', color: '#FFFFFF' },
  { name: 'Elin Emmanuel', role: 'Lead Architect', initials: 'EE', bg: '#F87171', color: '#FFFFFF' },
  { name: 'PubNub Bot', role: 'Automated Bot', initials: 'PN', bg: '#EF4444', color: '#FFFFFF' },
  { name: 'Alan', role: 'Frontend Engineer', initials: 'AL', bg: '#6366F1', color: '#FFFFFF' },
  { name: 'Bob', role: 'DevOps Engineer', initials: 'BO', bg: '#10B981', color: '#FFFFFF' },
  { name: 'Carol', role: 'UI/UX Designer', initials: 'CA', bg: '#F59E0B', color: '#FFFFFF' },
  { name: 'Dean', role: 'Full Stack Dev', initials: 'DE', bg: '#EC4899', color: '#FFFFFF' }
];

export const USER_LIST = ALL_USERS.map((u) => u.name);

export const USER_COLORS = ALL_USERS.reduce((acc, user) => {
  acc[user.name] = { bg: user.bg, text: user.color, initials: user.initials, role: user.role };
  return acc;
}, {});

export const INITIAL_MESSAGES = [
  {
    id: 'msg-demo-1',
    channelId: 'introductions',
    username: 'PubNub Bot',
    initials: 'PN',
    avatarBg: '#EF4444',
    text: 'Welcome to Team Chat. 👏👏 Send a message now to start interacting with other users in the app. ⬇️',
    likes: 0,
    likedBy: [],
    timestamp: '12:16'
  },
  {
    id: 'msg-demo-2',
    channelId: 'introductions',
    username: 'Gregory Goolsby',
    initials: 'GG',
    avatarBg: '#84CC16',
    text: 'Hey everyone!',
    likes: 1,
    likedBy: ['Elin Emmanuel'],
    timestamp: '17:28'
  },
  {
    id: 'msg-demo-3',
    channelId: 'introductions',
    username: 'Elin Emmanuel',
    initials: 'EE',
    avatarBg: '#F87171',
    text: 'Oh hi, Gregory! Glad to see everyone around...',
    likes: 0,
    likedBy: [],
    timestamp: '17:30'
  },
  {
    id: 'msg-demo-4',
    channelId: 'introductions',
    username: 'Suhas Kowsick',
    initials: 'SK',
    avatarBg: '#3B82F6',
    text: 'Hi all! Nice to see you 👏',
    likes: 1,
    likedBy: ['Gregory Goolsby'],
    timestamp: '17:31'
  },
  {
    id: 'msg-demo-poland-1',
    channelId: 'poland-office',
    username: 'Gregory Goolsby',
    initials: 'GG',
    avatarBg: '#84CC16',
    text: 'Dzień dobry Poland team! Sync meeting in 15 minutes in room A.',
    likes: 2,
    likedBy: ['Elin Emmanuel', 'Suhas Kowsick'],
    timestamp: '11:15'
  },
  {
    id: 'msg-demo-india-1',
    channelId: 'india-office',
    username: 'Elin Emmanuel',
    initials: 'EE',
    avatarBg: '#F87171',
    text: 'Namaste India office! Don’t forget to submit your weekly sprint reports by 5 PM.',
    likes: 3,
    likedBy: ['Alan', 'Bob', 'Gregory Goolsby'],
    timestamp: '14:20'
  }
];

export function useChat(initialMessages = INITIAL_MESSAGES) {
  const [messages, setMessages] = useState(initialMessages);
  const [activeChannelId, setActiveChannelId] = useState('introductions');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('exactspace_chat_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_USER;
  });
  const [isRandomUserMode, setIsRandomUserMode] = useState(false);

  const activeChannel = useMemo(() => {
    return CHANNELS.find((ch) => ch.id === activeChannelId) || CHANNELS[1];
  }, [activeChannelId]);

  const channelMessages = useMemo(() => {
    return messages.filter((m) => m.channelId === activeChannelId);
  }, [messages, activeChannelId]);

  // Update current user name and role
  const updateCurrentUser = useCallback((newName, newRole) => {
    if (!newName || !newName.trim()) return;
    const cleanName = newName.trim();
    const cleanRole = newRole && newRole.trim() ? newRole.trim() : 'Developer';
    const words = cleanName.split(' ').filter(Boolean);
    const initials = words.length > 1
      ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
      : cleanName.slice(0, 2).toUpperCase();

    const updated = {
      id: 'user-me',
      name: cleanName,
      role: cleanRole,
      initials,
      avatarBg: '#3B82F6',
      avatarColor: '#FFFFFF'
    };

    setCurrentUser(updated);

    // Also update any previous messages by old name to new name
    setMessages((prev) =>
      prev.map((msg) =>
        msg.username === currentUser.name || msg.username === 'Rolande Raimondi'
          ? { ...msg, username: cleanName, initials, avatarBg: '#3B82F6' }
          : msg
      )
    );

    try {
      localStorage.setItem('exactspace_chat_user_profile', JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, [currentUser.name]);

  // Send message as Current User (or random user if toggled)
  const sendMessage = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    let assignedUser = currentUser.name;
    let assignedInitials = currentUser.initials;
    let assignedBg = currentUser.avatarBg;

    if (isRandomUserMode) {
      const randomIndex = Math.floor(Math.random() * ALL_USERS.length);
      const chosen = ALL_USERS[randomIndex];
      assignedUser = chosen.name;
      assignedInitials = chosen.initials;
      assignedBg = chosen.bg;
    }

    const newMessage = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      channelId: activeChannelId,
      username: assignedUser,
      initials: assignedInitials,
      avatarBg: assignedBg,
      text: trimmed,
      likes: 0,
      likedBy: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMessage]);
    return true;
  }, [activeChannelId, currentUser, isRandomUserMode]);

  // Strictly 1 like per person
  const likeMessage = useCallback((messageId) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        const currentLikedBy = Array.isArray(msg.likedBy) ? msg.likedBy : [];
        const hasLiked = currentLikedBy.includes(currentUser.name);

        if (hasLiked) {
          return {
            ...msg,
            likes: Math.max(0, (msg.likes || 1) - 1),
            likedBy: currentLikedBy.filter((name) => name !== currentUser.name)
          };
        } else {
          return {
            ...msg,
            likes: (msg.likes || 0) + 1,
            likedBy: [...currentLikedBy, currentUser.name]
          };
        }
      })
    );
  }, [currentUser.name]);

  const addChannel = useCallback((name) => {
    if (!name || !name.trim()) return;
    const cleanName = name.trim();
    const id = cleanName.toLowerCase().replace(/\s+/g, '-');
    if (CHANNELS.some((c) => c.id === id)) {
      setActiveChannelId(id);
      return;
    }
    CHANNELS.push({
      id,
      name: cleanName,
      description: `Discussions for #${cleanName}`,
      memberCount: 1
    });
    setActiveChannelId(id);
  }, []);

  return {
    messages: channelMessages,
    allMessages: messages,
    channels: CHANNELS,
    activeChannel,
    activeChannelId,
    setActiveChannelId,
    currentUser,
    updateCurrentUser,
    isRandomUserMode,
    setIsRandomUserMode,
    sendMessage,
    likeMessage,
    addChannel,
    userList: USER_LIST,
    allUsers: ALL_USERS
  };
}
