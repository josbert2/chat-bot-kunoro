export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  siteKey: string;
  domain?: string;
}

export interface WidgetConfig {
  theme: 'light' | 'dark';
  primaryColor: string;
  position: 'bottom-left' | 'bottom-right';
  welcomeMessage?: string;
}

