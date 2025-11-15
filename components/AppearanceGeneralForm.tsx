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
  initialColors: WidgetColors;
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

export function AppearanceGeneralForm({ siteId, initialColors }: Props) {
  const [background, setBackground] = useState(initialColors.background);
  const [action, setAction] = useState(initialColors.action);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setBackground(initialColors.background);
    setAction(initialColors.action);
  }, [initialColors.background, initialColors.action]);

  const isValidForm = useMemo(() => {
    return Boolean(siteId) && isValidHexColor(background) && isValidHexColor(action);
  }, [siteId, background, action]);

  const isDarkBackground = useMemo(() => isDarkHexColor(background), [background]);

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
    if (!siteId || !isValidForm) return;

    setStatus("saving");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/widget/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteId,
          colors: {
            background,
            action,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "No pudimos guardar tu configuración.");
      }

      setStatus("saved");
      setTimeout(() => {
        setStatus("idle");
      }, 2500);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage((error as Error).message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <div className="grid gap-4 md:grid-cols-2">
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

        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-4">
          <header className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Vista previa</span>
            <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
              Inicio
              <svg
                aria-hidden
                className="h-3 w-3 text-slate-400"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
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
        >
          {status === "saving" ? "Guardando..." : "Guardar cambios"}
        </button>

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

