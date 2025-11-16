export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  siteKey: string;
  domain?: string;
}

// WidgetConfig simple para proyectos (legacy)
export interface ProjectWidgetConfig {
  theme: 'light' | 'dark';
  primaryColor: string;
  position: 'bottom-left' | 'bottom-right';
  welcomeMessage?: string;
}

