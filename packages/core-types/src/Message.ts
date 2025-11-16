export interface Message {
  id: string;
  conversationId: string;
  authorType: 'agent' | 'visitor' | 'bot' | 'system';
  authorId?: string;
  content: string;
  createdAt: Date;
}

