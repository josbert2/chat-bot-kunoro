"use client";

import { useState, FormEvent } from "react";

type Props = {
  siteId: string;
  initialWelcomeMessage?: string;
  initialOfflineMessage?: string;
  initialBrandName?: string;
};

export function WidgetMessagesConfig({
  siteId,
  initialWelcomeMessage = "¡Hola! ¿En qué podemos ayudarte?",
  initialOfflineMessage = "En este momento estamos offline, déjanos tu mensaje y te responderemos pronto.",
  initialBrandName = "Soporte",
}: Props) {
  const [welcomeMessage, setWelcomeMessage] = useState(initialWelcomeMessage);
  const [offlineMessage, setOfflineMessage] = useState(initialOfflineMessage);
  const [brandName, setBrandName] = useState(initialBrandName);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!siteId) return;

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
          messages: {
            welcomeMessage,
            offlineMessage,
            brandName,
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
      <div className="grid gap-6 md:grid-cols-2">
        {/* Brand name */}
        <div className="space-y-2">
          <label htmlFor="brandName" className="block text-sm font-semibold text-slate-900">
            Nombre de la marca
          </label>
          <p className="text-[11px] text-slate-500">
            Se muestra en el encabezado del chat.
          </p>
          <input
            id="brandName"
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Soporte, Bookforce, etc."
            maxLength={50}
          />
        </div>

        {/* Character counter */}
        <div className="space-y-2">
          <div className="block text-sm font-semibold text-slate-900">
            Longitud
          </div>
          <p className="text-[11px] text-slate-500">
            Caracteres usados en cada mensaje.
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-600 pt-2">
            <span>Bienvenida: {welcomeMessage.length}/200</span>
            <span>•</span>
            <span>Offline: {offlineMessage.length}/200</span>
          </div>
        </div>
      </div>

      {/* Welcome message */}
      <div className="space-y-2">
        <label htmlFor="welcomeMessage" className="block text-sm font-semibold text-slate-900">
          Mensaje de bienvenida
        </label>
        <p className="text-[11px] text-slate-500">
          El primer mensaje que verá el usuario al abrir el chat.
        </p>
        <textarea
          id="welcomeMessage"
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Ej: ¡Hola! ¿En qué podemos ayudarte?"
          maxLength={200}
        />
      </div>

      {/* Offline message */}
      <div className="space-y-2">
        <label htmlFor="offlineMessage" className="block text-sm font-semibold text-slate-900">
          Mensaje fuera de horario
        </label>
        <p className="text-[11px] text-slate-500">
          Se muestra cuando el equipo está offline (si activas horarios de atención).
        </p>
        <textarea
          id="offlineMessage"
          value={offlineMessage}
          onChange={(e) => setOfflineMessage(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Ej: En este momento estamos offline..."
          maxLength={200}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "saving" ? "Guardando..." : "Guardar mensajes"}
        </button>

        {status === "saved" && (
          <span className="text-[11px] font-medium text-emerald-600">
            ✔ Cambios guardados
          </span>
        )}
        {status === "error" && errorMessage && (
          <span className="text-[11px] font-medium text-red-500">{errorMessage}</span>
        )}
      </div>
    </form>
  );
}

