"use client";

import { useState, useRef, useEffect } from "react";
import { LogoutButton } from "@/components/LogoutButton";

export function SidebarUserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200/90 overflow-hidden border border-slate-300 hover:bg-slate-300/70 transition-colors"
      >
        <span className="sr-only">Perfil</span>
        <span className="text-sm font-medium text-slate-700">U</span>
      </button>
      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 border border-white" />

      {open && (
        <div className="absolute right-12 bottom-0 min-w-[190px] rounded-xl border border-slate-200 bg-white shadow-lg py-2 text-[11px]">
          <p className="px-3 pb-2 text-[11px] font-medium text-slate-700 border-b border-slate-100 mb-1">
            Perfil
          </p>
          <button
            type="button"
            className="w-full px-3 py-1.5 text-left text-slate-600 hover:bg-slate-50 flex items-center justify-between"
          >
            <span>Mostrar en línea</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </button>
          <div className="mt-1 border-t border-slate-100 pt-1">
            <div className="px-3 py-1.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer">
              <span className="flex-1">Cerrar sesión</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
