"use client";

import { usePathname } from "next/navigation";

export function SettingsSubSidebar() {
  const pathname = usePathname();

  const isSettings = pathname?.startsWith("/dashboard/settings");

  if (!isSettings) return null;

  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white/80 backdrop-blur-sm px-2 py-3 text-[11px] text-slate-600 flex flex-col gap-2">
      <div className="px-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        Canales
      </div>
      <button className="w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-100">
        <span className="flex items-center gap-2">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-[6px] border border-blue-200 bg-blue-50 text-[9px]">
            💬
          </span>
          <span>Chat en vivo</span>
        </span>
        <span className="text-[10px] text-blue-500">Apariencia</span>
      </button>
    </aside>
  );
}
