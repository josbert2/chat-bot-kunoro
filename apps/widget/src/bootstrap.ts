import { WidgetApiClient } from './api/client';
import { storage } from './utils/storage';
import { initWidgetUI } from './ui/widget-ui';
import { DEFAULT_COLORS, WidgetConfig } from './utils/theme';

export async function bootstrap() {
  // Leer data-key del script (compatible con data-app-id también)
  // En modo dev (ES modules), currentScript puede ser null, buscar el último script con data-app-id
  let script = document.currentScript as HTMLScriptElement;
  
  if (!script) {
    console.log('[Kunoro Widget] currentScript no disponible, buscando script con data-app-id...');
    const scripts = document.querySelectorAll('script[data-app-id], script[data-key]');
    script = scripts[scripts.length - 1] as HTMLScriptElement;
  }
  
  const siteKey = script?.getAttribute('data-key') || script?.getAttribute('data-app-id');
  const apiUrl = script?.getAttribute('data-api-url') || 'http://localhost:3001';
  
  // Leer colores desde data attributes (opcional)
  const dataBackground = script?.getAttribute('data-color-background');
  const dataAction = script?.getAttribute('data-color-action');

  console.log('[Kunoro Widget] Script encontrado:', {
    siteKey,
    apiUrl,
    dataBackground,
    dataAction,
    scriptSrc: script?.src
  });

  if (!siteKey) {
    console.error('[Kunoro Widget] Falta el atributo data-key o data-app-id en el script');
    return;
  }

  console.log(`[Kunoro Widget] Inicializando v1.0.0 para app: ${siteKey}`);

  try {
    // Obtener o crear visitorId
    let visitorId = storage.getVisitorId();
    
    // Inicializar cliente API
    const apiClient = new WidgetApiClient(siteKey, apiUrl);
    
    // Inicializar widget (obtener configuración, etc.)
    let config: WidgetConfig;
    
    try {
      const initData = await apiClient.init(visitorId);
      
      // Guardar visitorId si se generó uno nuevo
      if (initData.visitorId && initData.visitorId !== visitorId) {
        storage.setVisitorId(initData.visitorId);
        visitorId = initData.visitorId;
      }
      
      // Establecer el visitorId en el cliente API
      apiClient.setVisitorId(visitorId);
      
      config = initData.widgetConfig || { colors: DEFAULT_COLORS };
    } catch (apiError) {
      console.warn('[Kunoro Widget] No se pudo obtener configuración del API, usando valores por defecto:', apiError);
      
      // Asegurar que el visitorId está disponible incluso si falla el init
      if (!visitorId) {
        visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        storage.setVisitorId(visitorId);
      }
      apiClient.setVisitorId(visitorId);
      
      config = { colors: DEFAULT_COLORS };
    }
    
    // Los colores de data attributes tienen prioridad sobre los del API
    if (dataBackground || dataAction) {
      console.log('[Kunoro Widget] Usando colores de data attributes:', {
        dataBackground,
        dataAction,
        configColorsAntes: config.colors
      });
      config.colors = {
        background: dataBackground || config.colors?.background || DEFAULT_COLORS.background,
        action: dataAction || config.colors?.action || DEFAULT_COLORS.action,
      };
      console.log('[Kunoro Widget] Colores después de aplicar data attributes:', config.colors);
    }
    
    // Asegurar que siempre tenemos colores
    if (!config.colors) {
      console.log('[Kunoro Widget] No hay colores, usando defaults');
      config.colors = DEFAULT_COLORS;
    }

    console.log('[Kunoro Widget] Colores finales aplicados:', config.colors);

    // Inicializar UI del widget
    initWidgetUI({
      siteKey,
      visitorId,
      apiClient,
      config,
    });

    console.log('[Kunoro Widget] ✅ Widget cargado correctamente');
  } catch (error) {
    console.error('[Kunoro Widget] Error al inicializar:', error);
  }
}

