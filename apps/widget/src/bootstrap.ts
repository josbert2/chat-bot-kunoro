import { WidgetApiClient } from './api/client';
import { storage } from './utils/storage';
import { initWidgetUI } from './ui/widget-ui';

export async function bootstrap() {
  // Leer data-key del script (compatible con data-app-id también)
  const script = document.currentScript as HTMLScriptElement;
  const siteKey = script?.getAttribute('data-key') || script?.getAttribute('data-app-id');
  const apiUrl = script?.getAttribute('data-api-url') || 'http://localhost:3001';

  if (!siteKey) {
    console.error('[SaaS Chat Widget] Falta el atributo data-key o data-app-id en el script');
    return;
  }

  console.log(`[SaaS Chat Widget] Inicializando para app: ${siteKey}`);

  try {
    // Obtener o crear visitorId
    let visitorId = storage.getVisitorId();
    
    // Inicializar cliente API
    const apiClient = new WidgetApiClient(siteKey, apiUrl);
    
    // Inicializar widget (obtener configuración, etc.)
    const initData = await apiClient.init(visitorId);
    
    // Guardar visitorId si se generó uno nuevo
    if (initData.visitorId && initData.visitorId !== visitorId) {
      storage.setVisitorId(initData.visitorId);
      visitorId = initData.visitorId;
    }

    // Inicializar UI del widget
    initWidgetUI({
      siteKey,
      visitorId,
      apiClient,
      config: initData.widgetConfig || {},
    });

    console.log('[SaaS Chat Widget] ✅ Widget cargado correctamente');
  } catch (error) {
    console.error('[SaaS Chat Widget] Error al inicializar:', error);
  }
}

