export type WidgetColors = {
  background: string;
  action: string;
};

export type WidgetPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export type BusinessHours = {
  enabled: boolean;
  timezone: string;
  schedule: {
    [key: string]: { // 'monday', 'tuesday', etc.
      enabled: boolean;
      from: string; // "09:00"
      to: string;   // "18:00"
    };
  };
};

export type WidgetConfig = {
  colors: WidgetColors;
  position?: WidgetPosition;
  welcomeMessage?: string;
  offlineMessage?: string;
  businessHours?: BusinessHours;
  logoUrl?: string;
  brandName?: string;
  showPoweredBy?: boolean;
};

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const DEFAULT_WIDGET_COLORS: WidgetColors = {
  background: "#0F172A",
  action: "#2563EB",
};

export function getDefaultWidgetColors(): WidgetColors {
  return { ...DEFAULT_WIDGET_COLORS };
}

export function getDefaultWidgetConfig(): WidgetConfig {
  return {
    colors: getDefaultWidgetColors(),
    position: 'bottom-right',
    welcomeMessage: '¡Hola! ¿En qué podemos ayudarte?',
    offlineMessage: 'En este momento estamos offline, déjanos tu mensaje y te responderemos pronto.',
    brandName: 'Soporte',
    showPoweredBy: true,
    businessHours: {
      enabled: false,
      timezone: 'America/Santiago',
      schedule: {
        monday: { enabled: true, from: '09:00', to: '18:00' },
        tuesday: { enabled: true, from: '09:00', to: '18:00' },
        wednesday: { enabled: true, from: '09:00', to: '18:00' },
        thursday: { enabled: true, from: '09:00', to: '18:00' },
        friday: { enabled: true, from: '09:00', to: '18:00' },
        saturday: { enabled: false, from: '09:00', to: '18:00' },
        sunday: { enabled: false, from: '09:00', to: '18:00' },
      },
    },
  };
}

export function parseWidgetConfig(raw?: string | null): WidgetConfig {
  if (!raw) {
    return getDefaultWidgetConfig();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<WidgetConfig>;
    const defaults = getDefaultWidgetConfig();
    
    return {
      colors: {
        background: normalizeHexColor(parsed?.colors?.background, DEFAULT_WIDGET_COLORS.background),
        action: normalizeHexColor(parsed?.colors?.action, DEFAULT_WIDGET_COLORS.action),
      },
      position: parsed?.position || defaults.position,
      welcomeMessage: parsed?.welcomeMessage || defaults.welcomeMessage,
      offlineMessage: parsed?.offlineMessage || defaults.offlineMessage,
      brandName: parsed?.brandName || defaults.brandName,
      logoUrl: parsed?.logoUrl,
      showPoweredBy: parsed?.showPoweredBy !== undefined ? parsed.showPoweredBy : defaults.showPoweredBy,
      businessHours: parsed?.businessHours || defaults.businessHours,
    };
  } catch {
    return getDefaultWidgetConfig();
  }
}

export function serializeWidgetConfig(config: WidgetConfig): string {
  return JSON.stringify(config);
}

export function normalizeHexColor(value: string | undefined | null, fallback: string): string {
  if (typeof value !== "string") {
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
      .split("")
      .map((char) => char + char)
      .join("");
    return `#${expanded}`;
  }

  return upper;
}

export function isValidHexColor(value: string): boolean {
  return HEX_COLOR_REGEX.test(value.trim());
}

export function isDarkHexColor(value?: string | null): boolean {
  if (!value) return false;

  let hex = value.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(hex)) {
    return false;
  }

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.55;
}

