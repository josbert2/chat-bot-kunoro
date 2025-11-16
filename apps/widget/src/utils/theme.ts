export interface WidgetColors {
  background: string;
  action: string;
}

export interface WidgetConfig {
  colors: WidgetColors;
  welcomeMessage?: string;
  position?: 'bottom-left' | 'bottom-right';
}

export const DEFAULT_COLORS: WidgetColors = {
  background: '#0F172A',
  action: '#2563EB',
};

export function isColorDark(hexColor: string): boolean {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.55;
}

export function getTextColor(backgroundColor: string): string {
  return isColorDark(backgroundColor) ? '#ffffff' : '#111827';
}

