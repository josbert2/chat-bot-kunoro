"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SettingsSubSidebar() {
  const pathname = usePathname();

  const isSettings = pathname?.startsWith("/dashboard/settings");

  if (!isSettings) return null;

  const isWidget = pathname === "/dashboard/settings/widget";
  const isGeneral = pathname === "/dashboard/settings";

  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white/80 backdrop-blur-sm px-2 py-3 text-[11px] text-slate-600 flex flex-col gap-2">
      <div className="px-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        General
      </div>
      <Link
        href="/dashboard/settings"
        className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
          isGeneral
            ? "bg-blue-50 text-blue-700 border border-blue-100"
            : "hover:bg-slate-100 text-slate-600"
        }`}
      >
        <span className={`inline-flex h-4 w-4 items-center justify-center rounded-[6px] ${
          isGeneral ? "border border-blue-200 bg-blue-50" : "border border-slate-200"
        } text-[9px]`}>
          ⚙️
        </span>
        <span>Cuenta y sitios</span>
      </Link>

      <div className="px-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400 mt-3">
        Canales
      </div>
      <Link
        href="/dashboard/settings/widget"
        className={`w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
          isWidget
            ? "bg-blue-50 text-blue-700 border border-blue-100"
            : "hover:bg-slate-100 text-slate-600"
        }`}
      >
        <span className="flex items-center gap-2">
          <span className={`inline-flex h-4 w-4 items-center justify-center rounded-[6px] ${
            isWidget ? "border border-blue-200 bg-blue-50" : "border border-slate-200"
          } text-[9px]`}>
            💬
          </span>
          <span>Widget de chat</span>
        </span>
      </Link>
    </aside>
  );
}
