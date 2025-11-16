// Utilitarios para configuración de widget
// Copiado de @saas-chat/core-types para evitar problemas de resolución de módulos

export type WidgetColors = {
  background: string;
  action: string;
};

export type WidgetConfig = {
  colors: WidgetColors;
};

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const DEFAULT_WIDGET_COLORS: WidgetColors = {
  background: '#0F172A',
  action: '#2563EB',
};

export function getDefaultWidgetColors(): WidgetColors {
  return { ...DEFAULT_WIDGET_COLORS };
}

export function parseWidgetConfig(raw?: string | null): WidgetConfig {
  if (!raw) {
    return { colors: getDefaultWidgetColors() };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<WidgetConfig>;
    return {
      colors: {
        background: normalizeHexColor(parsed?.colors?.background, DEFAULT_WIDGET_COLORS.background),
        action: normalizeHexColor(parsed?.colors?.action, DEFAULT_WIDGET_COLORS.action),
      },
    };
  } catch {
    return { colors: getDefaultWidgetColors() };
  }
}

export function serializeWidgetConfig(config: WidgetConfig): string {
  return JSON.stringify(config);
}

export function normalizeHexColor(value: string | undefined | null, fallback: string): string {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  if (!HEX_COLOR_REGEX.test(trimmed)) {
    return fallback;
  }

  const upper = trimmed.toUpperCase();

  if (upper.length === 4) {
    const chars = upper.slice(1);
    const expanded = chars
      .split('')
      .map((char) => char + char)
      .join('');
    return `#${expanded}`;
  }

  return upper;
}

export function isValidHexColor(value: string): boolean {
  return HEX_COLOR_REGEX.test(value.trim());
}

