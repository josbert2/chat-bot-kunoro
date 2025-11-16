export interface ThemeConfig {
  theme: 'light' | 'dark';
  primaryColor: string;
  position: 'bottom-left' | 'bottom-right';
  welcomeMessage?: string;
}

export const defaultTheme: ThemeConfig = {
  theme: 'light',
  primaryColor: '#3B82F6',
  position: 'bottom-right',
  welcomeMessage: '¡Hola! ¿En qué te ayudamos?',
};

export function applyTheme(config: ThemeConfig) {
  // TODO: Aplicar tema al widget
  console.log('Applying theme:', config);
}

