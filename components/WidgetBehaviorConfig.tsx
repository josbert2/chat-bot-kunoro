"use client";

import { useState, FormEvent } from "react";
import type { WidgetPosition, BusinessHours } from "@/lib/widget-config";

type Props = {
  siteId: string;
  initialPosition?: WidgetPosition;
  initialBusinessHours?: BusinessHours;
  initialShowPoweredBy?: boolean;
};

const POSITIONS: { value: WidgetPosition; label: string }[] = [
  { value: "bottom-right", label: "Abajo Derecha" },
  { value: "bottom-left", label: "Abajo Izquierda" },
  { value: "top-right", label: "Arriba Derecha" },
  { value: "top-left", label: "Arriba Izquierda" },
];

const DAYS = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

export function WidgetBehaviorConfig({
  siteId,
  initialPosition = "bottom-right",
  initialBusinessHours,
  initialShowPoweredBy = true,
}: Props) {
  const [position, setPosition] = useState<WidgetPosition>(initialPosition);
  const [showPoweredBy, setShowPoweredBy] = useState(initialShowPoweredBy);
  const [businessHoursEnabled, setBusinessHoursEnabled] = useState(initialBusinessHours?.enabled || false);
  const [schedule, setSchedule] = useState(
    initialBusinessHours?.schedule || {
      monday: { enabled: true, from: "09:00", to: "18:00" },
      tuesday: { enabled: true, from: "09:00", to: "18:00" },
      wednesday: { enabled: true, from: "09:00", to: "18:00" },
      thursday: { enabled: true, from: "09:00", to: "18:00" },
      friday: { enabled: true, from: "09:00", to: "18:00" },
      saturday: { enabled: false, from: "09:00", to: "18:00" },
      sunday: { enabled: false, from: "09:00", to: "18:00" },
    }
  );

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
          behavior: {
            position,
            showPoweredBy,
            businessHours: {
              enabled: businessHoursEnabled,
              timezone: "America/Santiago",
              schedule,
            },
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

  const handleDayToggle = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  };

  const handleTimeChange = (day: string, field: "from" | "to", value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Position */}
      <section className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Posición del widget</h4>
          <p className="text-[11px] text-slate-500">
            Dónde aparecerá el botón flotante en la pantalla.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {POSITIONS.map((pos) => (
            <button
              key={pos.value}
              type="button"
              onClick={() => setPosition(pos.value)}
              className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                position === pos.value
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {pos.label}
            </button>
          ))}
        </div>
      </section>

      {/* Business Hours */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Horarios de atención</h4>
            <p className="text-[11px] text-slate-500">
              Muestra mensaje de offline fuera de horario.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBusinessHoursEnabled(!businessHoursEnabled)}
            className={`inline-flex h-6 w-11 items-center rounded-full px-0.5 transition-colors ${
              businessHoursEnabled ? "bg-blue-600 justify-end" : "bg-slate-300 justify-start"
            }`}
          >
            <span className="h-5 w-5 rounded-full bg-white" />
          </button>
        </div>

        {businessHoursEnabled && (
          <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
            {DAYS.map((day) => (
              <div key={day.key} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleDayToggle(day.key)}
                  className={`flex h-5 w-5 items-center justify-center rounded border text-[10px] ${
                    schedule[day.key]?.enabled
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {schedule[day.key]?.enabled && "✓"}
                </button>
                <span className="w-24 text-xs font-medium text-slate-700">{day.label}</span>
                <input
                  type="time"
                  value={schedule[day.key]?.from || "09:00"}
                  onChange={(e) => handleTimeChange(day.key, "from", e.target.value)}
                  disabled={!schedule[day.key]?.enabled}
                  className="rounded border border-slate-200 px-2 py-1 text-xs disabled:opacity-50"
                />
                <span className="text-xs text-slate-500">a</span>
                <input
                  type="time"
                  value={schedule[day.key]?.to || "18:00"}
                  onChange={(e) => handleTimeChange(day.key, "to", e.target.value)}
                  disabled={!schedule[day.key]?.enabled}
                  className="rounded border border-slate-200 px-2 py-1 text-xs disabled:opacity-50"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Show "Powered by" */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Mostrar "Powered by Bookforce"</h4>
            <p className="text-[11px] text-slate-500">
              Muestra el link de atribución en el widget.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPoweredBy(!showPoweredBy)}
            className={`inline-flex h-6 w-11 items-center rounded-full px-0.5 transition-colors ${
              showPoweredBy ? "bg-blue-600 justify-end" : "bg-slate-300 justify-start"
            }`}
          >
            <span className="h-5 w-5 rounded-full bg-white" />
          </button>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "saving" ? "Guardando..." : "Guardar comportamiento"}
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

