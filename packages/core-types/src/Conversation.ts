export interface Conversation {
  id: string;
  workspaceId: string;
  projectId?: string;
  endUserId?: string;
  status: 'open' | 'pending' | 'closed';
  channel: 'web' | 'whatsapp' | 'instagram' | 'facebook' | 'email';
  createdAt: Date;
  updatedAt: Date;
}

