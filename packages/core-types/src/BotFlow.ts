export interface BotFlow {
  nodes: BotNode[];
  edges: BotEdge[];
}

export interface BotNode {
  id: string;
  type: 'message' | 'options' | 'condition' | 'webhook' | 'handover';
  content?: string;
  options?: BotOption[];
  condition?: string;
  webhookUrl?: string;
}

export interface BotOption {
  label: string;
  next: string;
}

export interface BotEdge {
  from: string;
  to: string;
  condition?: string;
}

