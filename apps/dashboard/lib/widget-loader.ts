/**
 * Utilidad para cargar el widget en modo desarrollo o producción
 */

export async function loadWidget(config: {
  appId: string;
  background: string;
  action: string;
  apiUrl?: string;
  preferDev?: boolean;
}) {
  const { appId, background, action, apiUrl = 'http://localhost:3001', preferDev = true } = config;

  // Limpiar widget existente
  cleanupWidget();

  // Determinar qué fuente usar
  let widgetSrc = '/widget.js';
  let useDevServer = false;

  if (preferDev) {
    try {
      const devCheck = await fetch('http://localhost:3003', { method: 'HEAD' });
      if (devCheck.ok) {
        widgetSrc = 'http://localhost:3003/src/main.ts';
        useDevServer = true;
        console.log('✅ [Widget Loader] Usando servidor de desarrollo');
      } else {
        console.log('ℹ️ [Widget Loader] Servidor dev no disponible, usando build');
      }
    } catch {
      console.log('ℹ️ [Widget Loader] Servidor dev no disponible, usando build');
    }
  }

  // Crear script tag
  const script = document.createElement('script');
  
  if (useDevServer) {
    script.type = 'module';
  }
  
  script.src = widgetSrc;
  script.setAttribute('data-app-id', appId);
  script.setAttribute('data-api-url', apiUrl);
  script.setAttribute('data-color-background', background);
  script.setAttribute('data-color-action', action);
  script.async = true;

  document.body.appendChild(script);

  return {
    source: useDevServer ? 'dev' : 'prod',
    cleanup: cleanupWidget,
  };
}

export function cleanupWidget() {
  // Limpiar widget existente
  const existingWidget = document.getElementById('kunoro-chat-widget');
  if (existingWidget) {
    existingWidget.remove();
  }

  const existingStyles = document.getElementById('kunoro-widget-styles');
  if (existingStyles) {
    existingStyles.remove();
  }

  // Limpiar scripts existentes
  const existingScripts = document.querySelectorAll('script[data-app-id]');
  existingScripts.forEach(script => script.remove());
}

