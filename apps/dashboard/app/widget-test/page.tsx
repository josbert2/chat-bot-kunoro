"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function WidgetTestPage() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [widgetSource, setWidgetSource] = useState<'dev' | 'prod'>('dev'); // Default a DEV
  const [devServerAvailable, setDevServerAvailable] = useState<boolean | null>(null);
  
  const appId = searchParams.get("appId") || "demo";
  const background = searchParams.get("background") || "#0F172A";
  const action = searchParams.get("action") || "#2563EB";

  console.log('🎨 [Widget Test] Colores recibidos de URL:', {
    appId,
    background,
    action,
    searchParams: Object.fromEntries(searchParams.entries())
  });

  useEffect(() => {
    setMounted(true);
    // Detectar si el servidor de desarrollo está corriendo
    checkDevServer();
  }, []);

  async function checkDevServer() {
    try {
      const response = await fetch('http://localhost:3003', { method: 'HEAD' });
      setDevServerAvailable(response.ok);
      if (!response.ok) {
        console.warn('⚠️ Servidor de desarrollo no disponible, usando build');
        setWidgetSource('prod');
      } else {
        console.log('✅ Servidor de desarrollo detectado en puerto 3003');
      }
    } catch (error) {
      console.warn('⚠️ Servidor de desarrollo no disponible, usando build');
      setDevServerAvailable(false);
      setWidgetSource('prod');
    }
  }

  useEffect(() => {
    if (!mounted) return;

    console.log(`🔄 [Widget Test] Cargando widget en modo ${widgetSource}...`, { appId, background, action });

    // Limpiar completamente el widget anterior
    const cleanup = () => {
      // Limpiar widget DOM
      const existingWidget = document.getElementById('kunoro-chat-widget');
      if (existingWidget) {
        console.log('🧹 [Widget Test] Removiendo widget existente');
        existingWidget.remove();
      }

      // Limpiar estilos
      const existingStyles = document.getElementById('kunoro-widget-styles');
      if (existingStyles) {
        console.log('🧹 [Widget Test] Removiendo estilos existentes');
        existingStyles.remove();
      }

      // Limpiar scripts
      const existingScripts = document.querySelectorAll('script[data-app-id], script[data-key]');
      existingScripts.forEach(script => {
        console.log('🧹 [Widget Test] Removiendo script', script.src);
        script.remove();
      });

      // Limpiar API global del widget
      if ((window as any).KunoroWidget) {
        console.log('🧹 [Widget Test] Limpiando API global');
        delete (window as any).KunoroWidget;
      }
    };

    cleanup();

    // Pequeño delay para asegurar cleanup completo
    const timeoutId = setTimeout(() => {
      console.log('📦 [Widget Test] Creando nuevo script del widget...');
      
      // Cargar el widget con las configuraciones
      const script = document.createElement('script');
      
      // Usar widget del servidor de desarrollo o el build
      if (widgetSource === 'dev') {
        script.type = 'module';
        script.src = 'http://localhost:3003/src/main.ts?' + Date.now(); // Cache bust
        console.log('📦 [Widget Test] Cargando desde servidor de desarrollo');
      } else {
        script.src = '/widget.js?' + Date.now(); // Cache bust
        console.log('📦 [Widget Test] Cargando desde build compilado');
      }
      
      script.setAttribute('data-app-id', appId);
      script.setAttribute('data-api-url', 'http://localhost:3001');
      script.setAttribute('data-color-background', background);
      script.setAttribute('data-color-action', action);

      console.log('📦 [Widget Test] Data attributes del script:', {
        'data-app-id': appId,
        'data-color-background': background,
        'data-color-action': action
      });

      script.onload = () => {
        console.log('✅ [Widget Test] Widget cargado exitosamente');
      };

      script.onerror = (error) => {
        console.error('❌ [Widget Test] Error cargando widget:', error);
      };

      document.body.appendChild(script);
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      console.log('🧹 [Widget Test] Limpieza en unmount');
    };
  }, [mounted, appId, background, action, widgetSource]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Cargando preview...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Vista Previa del Widget
              </h1>
              <p className="text-sm text-slate-600">
                Esta es una demostración en vivo de cómo se verá el widget en tu sitio web.
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setWidgetSource('prod')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  widgetSource === 'prod'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Build
              </button>
              <button
                onClick={() => setWidgetSource('dev')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  widgetSource === 'dev'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Dev
              </button>
            </div>
          </div>
          
          {widgetSource === 'dev' && devServerAvailable && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <svg className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-emerald-900">
                ✅ Conectado al servidor de desarrollo (puerto 3003). Los cambios se recargarán automáticamente.
              </p>
            </div>
          )}
          
          {widgetSource === 'dev' && devServerAvailable === false && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-amber-900">
                ⚠️ Servidor de desarrollo no disponible. Inicia <code className="bg-amber-100 px-1 py-0.5 rounded">pnpm dev</code> en <code className="bg-amber-100 px-1 py-0.5 rounded">apps/widget</code> o usa el modo "Build".
              </p>
            </div>
          )}
          
          {widgetSource === 'prod' && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-blue-900">
                Usando widget compilado desde <code className="bg-blue-100 px-1 py-0.5 rounded">/public/widget.js</code>
              </p>
            </div>
          )}
        </header>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Configuración Actual
          </h2>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                App ID
              </p>
              <p className="text-sm font-mono text-slate-900 bg-slate-100 px-3 py-2 rounded-lg">
                {appId}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Color de Fondo
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="h-8 w-8 rounded-lg border-2 border-slate-200 shadow-sm"
                  style={{ backgroundColor: background }}
                />
                <p className="text-sm font-mono text-slate-900 bg-slate-100 px-3 py-2 rounded-lg flex-1">
                  {background}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Color de Acción
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="h-8 w-8 rounded-lg border-2 border-slate-200 shadow-sm"
                  style={{ backgroundColor: action }}
                />
                <p className="text-sm font-mono text-slate-900 bg-slate-100 px-3 py-2 rounded-lg flex-1">
                  {action}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Instrucciones
          </h2>
          
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                1
              </span>
              <p>
                <strong className="text-slate-900">Haz clic en el botón flotante</strong> en la esquina inferior derecha para abrir el widget.
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                2
              </span>
              <p>
                <strong className="text-slate-900">Prueba enviando mensajes</strong> para ver cómo se comporta el widget con tus colores personalizados.
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                3
              </span>
              <p>
                <strong className="text-slate-900">Verifica el contraste</strong> de los textos para asegurarte de que sean legibles.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-blue-900">
                Tip: Para instalar en tu sitio
              </p>
              <p className="text-sm text-blue-700">
                Copia el código del snippet desde la sección de configuración y pégalo antes del cierre de <code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-xs">&lt;/body&gt;</code> en tu sitio web.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* El widget se carga dinámicamente aquí */}
    </div>
  );
}


