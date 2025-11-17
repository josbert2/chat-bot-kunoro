"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import {
  DEFAULT_WIDGET_COLORS,
  WidgetColors,
  isValidHexColor,
  isDarkHexColor,
} from "@/lib/widget-config";

type Props = {
  siteId?: string | null;
  appId?: string | null;
  initialColors: WidgetColors;
  onSaved?: () => void;
};

type Status = "idle" | "saving" | "saved" | "error";

const LABELS: Record<keyof WidgetColors, { title: string; description: string }> = {
  background: {
    title: "Color de fondo",
    description: "Define el color principal del widget y su cabecera.",
  },
  action: {
    title: "Color de acción",
    description: "Botones principales, burbuja flotante y mensajes propios.",
  },
};

export function AppearanceGeneralForm({ siteId, appId, initialColors, onSaved }: Props) {
  const [background, setBackground] = useState(initialColors?.background || DEFAULT_WIDGET_COLORS.background);
  const [action, setAction] = useState(initialColors?.action || DEFAULT_WIDGET_COLORS.action);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialColors?.background) {
      setBackground(initialColors.background);
    }
    if (initialColors?.action) {
      setAction(initialColors.action);
    }
  }, [initialColors]);

  const isValidForm = useMemo(() => {
    const hasSiteId = Boolean(siteId);
    const validBackground = isValidHexColor(background);
    const validAction = isValidHexColor(action);
    
    console.log('🔍 [Form Validation]', {
      siteId,
      hasSiteId,
      background,
      validBackground,
      action,
      validAction,
      isValidForm: hasSiteId && validBackground && validAction
    });
    
    return hasSiteId && validBackground && validAction;
  }, [siteId, background, action]);

  const isDarkBackground = useMemo(() => isDarkHexColor(background), [background]);

  function handlePreview() {
    // Abrir vista previa en nueva ventana
    const previewUrl = `/widget-test?appId=${appId || 'demo'}&background=${encodeURIComponent(background)}&action=${encodeURIComponent(action)}`;
    console.log('🔍 [Preview] Abriendo vista previa con:', { appId, background, action, previewUrl });
    window.open(previewUrl, '_blank', 'width=1200,height=800');
  }

  function handleColorChange(value: string, setter: (val: string) => void) {
    if (!value) {
      setter("");
      return;
    }
    setter(value.toUpperCase());
  }

  function handleReset() {
    setBackground(DEFAULT_WIDGET_COLORS.background);
    setAction(DEFAULT_WIDGET_COLORS.action);
    setStatus("idle");
    setErrorMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    console.log('💾 [Form Submit] Intentando guardar...', {
      siteId,
      background,
      action,
      isValidForm
    });
    
    if (!siteId || !isValidForm) {
      console.error('❌ [Form Submit] Form no válido:', { siteId, isValidForm });
      return;
    }

    setStatus("saving");
    setErrorMessage(null);

    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.error('❌ [Form Submit] No hay token');
        throw new Error("No hay sesión activa");
      }

      console.log('📤 [Form Submit] Enviando a /api/widget/config...');

      const response = await fetch("/api/widget/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          siteId,
          colors: {
            background,
            action,
          },
        }),
      });

      console.log('📥 [Form Submit] Respuesta:', response.status, response.statusText);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.error('❌ [Form Submit] Error del servidor:', data);
        throw new Error(data.error ?? "No pudimos guardar tu configuración.");
      }

      console.log('✅ [Form Submit] Guardado exitoso!');
      setStatus("saved");
      
      // Notificar al padre para que recargue los datos
      if (onSaved) {
        console.log('🔄 [Form Submit] Notificando al padre para recargar datos...');
        setTimeout(() => {
          onSaved();
        }, 500);
      }
      
      // Resetear estado después de 2.5 segundos
      setTimeout(() => {
        setStatus("idle");
      }, 2500);
    } catch (error) {
      console.error('❌ [Form Submit] Error:', error);
      setStatus("error");
      setErrorMessage((error as Error).message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header con botones de acción */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Personaliza tu widget</h3>
          <p className="text-xs text-slate-500 mt-1">
            Elige colores que se adapten a tu marca y visualiza los cambios en tiempo real
          </p>
        </div>
        <button
          type="button"
          onClick={handlePreview}
          disabled={!isValidForm}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Vista en nueva pestaña
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,400px)]">
        {/* Columna izquierda: Controles */}
        <div className="space-y-6">
          {/* Sección General */}
          <details open className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none py-3 px-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="text-sm font-semibold text-slate-900">General</span>
              <svg className="w-5 h-5 text-slate-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            
            <div className="mt-4 grid gap-4 md:grid-cols-2">
          {(Object.keys(LABELS) as (keyof WidgetColors)[]).map((key) => {
            const isBackground = key === "background";
            const value = isBackground ? background : action;
            const setValue = isBackground ? setBackground : setAction;
            const label = LABELS[key];

            return (
              <div
                key={key}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-slate-900">{label.title}</p>
                  <p className="text-[11px] text-slate-500">{label.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={value}
                    onChange={(event) => handleColorChange(event.target.value, setValue)}
                    className="h-12 w-12 rounded-lg border border-slate-200 bg-white shadow-sm cursor-pointer"
                    aria-label={label.title}
                    disabled={!siteId}
                  />
                  <input
                    value={value}
                    onChange={(event) => handleColorChange(event.target.value, setValue)}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                    placeholder="#000000"
                    disabled={!siteId}
                  />
                </div>

                <div
                  className="rounded-lg border border-slate-200 h-16 flex items-center justify-center text-[11px] text-slate-500"
                  style={{ background: key === "background" ? background : "white" }}
                >
                  {key === "background" ? (
                    <div className={`text-xs font-medium ${isDarkBackground ? "text-white" : "text-slate-800"}`}>
                      Fondo
                    </div>
                  ) : (
                    <div
                      className="rounded-full px-4 py-1 text-white text-[11px] font-semibold"
                      style={{ background: action }}
                    >
                      CTA
                    </div>
                  )}
                </div>
              </div>
            );
          })}
            </div>
          </details>
        </div>

        {/* Columna derecha: Vista previa */}
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-4 sticky top-4 self-start">
          <header className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-sm font-semibold text-slate-900">Vista previa</span>
            <span className="text-xs text-slate-500">Cambios en vivo</span>
          </header>

          <div className="flex-1 min-h-[320px] rounded-2xl border border-slate-100 bg-slate-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#e2e8f0_1px,transparent_0)] [background-size:24px_24px]" />

            <div className="relative z-10 flex flex-col items-center justify-start h-full pt-6 gap-6">
              <div className="w-[240px] rounded-2xl border border-slate-200 shadow-lg overflow-hidden bg-white">
                <div
                  className="px-4 py-3"
                  style={{ background }}
                >
                  <p className={`text-xs font-semibold ${isDarkBackground ? "text-white" : "text-slate-900"}`}>
                    Tu marca
                  </p>
                  <p className={`text-[11px] ${isDarkBackground ? "text-white/80" : "text-slate-100/80"} opacity-80`}>
                    Siempre disponible
                  </p>
                </div>
                <div className="px-4 py-3 space-y-3 bg-white">
                  <div className="rounded-2xl bg-slate-100 px-3 py-2 text-[12px] text-slate-600">
                    ¡Hola! Este es un adelanto de tu widget.
                  </div>
                  <button
                    type="button"
                    className="w-full rounded-full px-3 py-2 text-[11px] font-semibold text-white shadow-sm"
                    style={{ background: action }}
                    disabled
                  >
                    Enviar mensaje
                  </button>
                </div>
              </div>

              <div className="mt-auto mb-6 flex items-center gap-3 self-end pr-6">
                <div className="rounded-full bg-white px-4 py-2 text-[11px] font-medium text-slate-600 shadow">
                  Chatea con nosotros 👋
                </div>
                <button
                  type="button"
                  className="h-12 w-12 rounded-full shadow-lg border border-slate-200 text-white text-xl"
                  style={{ background: action }}
                  disabled
                >
                  💬
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={!isValidForm || status === "saving"}
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
          title={!siteId ? "Necesitas tener un proyecto para guardar" : !isValidHexColor(background) || !isValidHexColor(action) ? "Verifica que los colores sean válidos" : ""}
        >
          {status === "saving" ? "Guardando..." : "Guardar cambios"}
        </button>
        
        {!siteId && (
          <span className="text-xs text-amber-600 font-medium">
            ⚠️ Creando proyecto...
          </span>
        )}

        <button
          type="button"
          onClick={handleReset}
          disabled={status === "saving"}
          className="text-[11px] font-medium text-slate-500 hover:text-slate-700 disabled:opacity-50"
        >
          Restablecer a valores base
        </button>

        {status === "saved" && (
          <span className="text-[11px] font-medium text-emerald-600">
            ✔ Cambios guardados
          </span>
        )}
        {status === "error" && errorMessage && (
          <span className="text-[11px] font-medium text-red-500">{errorMessage}</span>
        )}
        {!siteId && (
          <span className="text-[11px] font-medium text-slate-500">
            Crea un sitio para personalizar su widget.
          </span>
        )}
      </div>
    </form>
  );
}

