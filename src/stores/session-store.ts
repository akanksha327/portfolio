import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Session {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'pending' | 'completed';
  mentor: string;
  student: string;
  createdAt: Date;
  scheduledAt?: Date;
  language: string;
  problem: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  avatar?: string;
  isOwn: boolean;
}

export interface Activity {
  id: string;
  type: 'session' | 'code' | 'message' | 'achievement';
  description: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  type: 'session' | 'message' | 'achievement';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
}

interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  activeSessionId: string | null; // Single source of truth for active session
  messages: Message[];
  activities: Activity[];
  notifications: Notification[];
  code: string;
  language: string;
  output: string;
  isRunning: boolean;
  user: {
    name: string;
    email: string;
    role: 'mentor' | 'student';
    avatar: string;
  };
  setSessions: (sessions: Session[]) => void;
  addSession: (session: Session) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  setCurrentSession: (session: Session | null) => void;
  setActiveSessionId: (id: string | null) => void; // Set active session
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  addActivity: (activity: Activity) => void;
  setActivities: (activities: Activity[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setOutput: (output: string) => void;
  setIsRunning: (isRunning: boolean) => void;
  updateUser: (user: Partial<SessionState['user']>) => void;
}

// Mock data for demo - Only ONE session can be active at a time
const mockSessions: Session[] = [
  {
    id: 'sess-1',
    title: 'Binary Search Mastery',
    description: 'Understanding binary search algorithms and implementations',
    status: 'pending',
    mentor: 'Sarah Chen',
    student: 'Alex Johnson',
    createdAt: new Date(Date.now() - 3600000),
    language: 'javascript',
    problem: 'Find target in sorted array with O(log n) complexity',
  },
  {
    id: 'sess-2',
    title: 'Dynamic Programming Intro',
    description: 'Learn the fundamentals of dynamic programming',
    status: 'pending',
    mentor: 'Mike Rodriguez',
    student: 'Emma Wilson',
    createdAt: new Date(Date.now() - 86400000),
    scheduledAt: new Date(Date.now() + 3600000),
    language: 'python',
    problem: 'Solve the classic fibonacci problem efficiently',
  },
  {
    id: 'sess-3',
    title: 'Graph Traversal',
    description: 'BFS and DFS implementation patterns',
    status: 'completed',
    mentor: 'Sarah Chen',
    student: 'Alex Johnson',
    createdAt: new Date(Date.now() - 172800000),
    language: 'java',
    problem: 'Implement BFS and DFS for graph traversal',
  },
  {
    id: 'sess-4',
    title: 'System Design Basics',
    description: 'Introduction to scalable system architecture',
    status: 'pending',
    mentor: 'David Kim',
    student: 'Chris Lee',
    createdAt: new Date(Date.now() - 7200000),
    language: 'javascript',
    problem: 'Design a URL shortener service',
  },
  {
    id: 'sess-5',
    title: 'React Hooks Deep Dive',
    description: 'Advanced patterns with React hooks',
    status: 'pending',
    mentor: 'Lisa Wang',
    student: 'Jordan Taylor',
    createdAt: new Date(Date.now() - 259200000),
    scheduledAt: new Date(Date.now() + 86400000),
    language: 'typescript',
    problem: 'Build a custom useDebounce hook',
  },
];

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    sender: 'Sarah Chen',
    content: 'Let\'s start by understanding the binary search approach. Do you know why it\'s O(log n)?',
    timestamp: new Date(Date.now() - 1800000),
    isOwn: false,
  },
  {
    id: 'msg-2',
    sender: 'You',
    content: 'Yes! We eliminate half of the remaining elements with each comparison.',
    timestamp: new Date(Date.now() - 1740000),
    isOwn: true,
  },
  {
    id: 'msg-3',
    sender: 'Sarah Chen',
    content: 'Exactly! Now let\'s implement it. Try writing the code in the editor.',
    timestamp: new Date(Date.now() - 1680000),
    isOwn: false,
  },
  {
    id: 'msg-4',
    sender: 'You',
    content: 'I\'ve written the basic implementation. Can you review it?',
    timestamp: new Date(Date.now() - 1200000),
    isOwn: true,
  },
];

const mockActivities: Activity[] = [
  {
    id: 'act-1',
    type: 'session',
    description: 'Completed "Graph Traversal" session with Sarah Chen',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 'act-2',
    type: 'code',
    description: 'Solved Binary Search problem in JavaScript',
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: 'act-3',
    type: 'achievement',
    description: 'Earned "Problem Solver" badge',
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: 'act-4',
    type: 'message',
    description: 'New message from Mike Rodriguez',
    timestamp: new Date(Date.now() - 172800000),
  },
  {
    id: 'act-5',
    type: 'session',
    description: 'Scheduled "Dynamic Programming Intro" for tomorrow',
    timestamp: new Date(Date.now() - 259200000),
  },
];

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'session',
    title: 'Session Starting Soon',
    description: 'Binary Search Mastery starts in 15 minutes',
    timestamp: new Date(),
    read: false,
  },
  {
    id: 'notif-2',
    type: 'message',
    title: 'New Message',
    description: 'Sarah Chen sent you a message',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
  },
  {
    id: 'notif-3',
    type: 'achievement',
    title: 'Achievement Unlocked',
    description: 'You earned the "Problem Solver" badge!',
    timestamp: new Date(Date.now() - 86400000),
    read: true,
  },
];

// Boilerplate code only - NO solution pre-filled
const defaultCode = `/**
 * Problem: Binary Search
 * Find target in a sorted array with O(log n) complexity
 * 
 * @param {number[]} arr - Sorted array of numbers
 * @param {number} target - Value to find
 * @return {number} - Index of target, or -1 if not found
 */
function binarySearch(arr, target) {
  // Write your code here
  
}

// Test your solution
const arr = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(arr, 7)); // Expected: 3
console.log(binarySearch(arr, 4)); // Expected: -1
`;

export const useSessionStore = create<SessionState>((set) => ({
  sessions: mockSessions,
  currentSession: mockSessions[0],
  activeSessionId: null, // No session is active by default - only ONE can be active
  messages: mockMessages,
  activities: mockActivities,
  notifications: mockNotifications,
  code: defaultCode,
  language: 'javascript',
  output: '',
  isRunning: false,
  user: {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    role: 'student',
    avatar: '',
  },
  setSessions: (sessions) => set({ sessions }),
  addSession: (session) => set((state) => ({ sessions: [...state.sessions, session] })),
  updateSession: (id, updates) => set((state) => ({
    sessions: state.sessions.map(s => s.id === id ? { ...s, ...updates } : s),
  })),
  setCurrentSession: (session) => set({ currentSession: session }),
  setActiveSessionId: (id) => set({ activeSessionId: id }), // Only one active session
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  addActivity: (activity) => set((state) => ({ activities: [activity, ...state.activities] })),
  setActivities: (activities) => set({ activities }),
  addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
  })),
  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setOutput: (output) => set({ output }),
  setIsRunning: (isRunning) => set({ isRunning }),
  updateUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
}));
