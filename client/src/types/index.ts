export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  inviteCode: string;
  members?: Array<{
    user: User | string;
    role: 'admin' | 'member';
  }>;
}

export interface Channel {
  id: string;
  name: string;
  workspace: string;
  isPrivate: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | string;
  channel: string;
  workspace: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface TypingEvent {
  channelId: string;
  userName: string;
  isTyping: boolean;
}

export interface MessagePayload {
  channelId: string;
  workspaceId: string;
  content: string;
}

export interface PaginatedMessages {
  messages: Message[];
  pagination: {
    totalMessages: number;
    currentPage: number;
    totalPages: number;
  };
}
