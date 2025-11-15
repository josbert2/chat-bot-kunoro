"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function SettingsSubSidebar() {
  const pathname = usePathname();

  const isSettings = pathname?.startsWith("/dashboard/settings");

  if (!isSettings) return null;

  const isApiTokens = pathname === "/dashboard/settings/api-tokens";
  const isAppearance = pathname === "/dashboard/settings";

  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white/80 backdrop-blur-sm px-2 py-3 text-[11px] text-slate-600 flex flex-col gap-2">
      <div className="px-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        Canales
      </div>
      <Link
        href="/dashboard/settings"
        className={`w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${
          isAppearance
            ? "bg-blue-50 text-blue-700 border border-blue-100"
            : "hover:bg-slate-50"
        }`}
      >
        <span className="flex items-center gap-2">
          <span
            className={`inline-flex h-4 w-4 items-center justify-center rounded-[6px] border text-[9px] ${
              isAppearance
                ? "border-blue-200 bg-blue-50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            💬
          </span>
          <span>Chat en vivo</span>
        </span>
        {isAppearance && <span className="text-[10px] text-blue-500">Apariencia</span>}
      </Link>

      <div className="px-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400 mt-3">
        Desarrollo
      </div>
      <Link
        href="/dashboard/settings/api-tokens"
        className={`w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${
          isApiTokens
            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
            : "hover:bg-slate-50"
        }`}
      >
        <span className="flex items-center gap-2">
          <span
            className={`inline-flex h-4 w-4 items-center justify-center rounded-[6px] border text-[9px] ${
              isApiTokens
                ? "border-emerald-200 bg-emerald-50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            🔐
          </span>
          <span>Tokens API</span>
        </span>
      </Link>
    </aside>
  );
}
