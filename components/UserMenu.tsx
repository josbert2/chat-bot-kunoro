"use client";

import { useState, useRef, useEffect } from "react";
import { LogoutButton } from "@/components/LogoutButton";

interface UserMenuProps {
  email?: string | null;
}

export function UserMenu({ email }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      window.addEventListener("mousedown", handleClickOutside);
    } else {
      window.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative flex items-center gap-2 text-xs text-slate-500">
      {email && <span className="hidden sm:inline text-slate-700 max-w-[180px] truncate">{email}</span>}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 overflow-hidden border border-slate-300 hover:bg-slate-300/70 transition-colors"
      >
        <span className="sr-only">Perfil</span>
        <span className="text-sm font-medium text-slate-700">U</span>
      </button>

      {open && (
        <div className="absolute right-0 top-11 min-w-[180px] rounded-xl border border-slate-200 bg-white shadow-lg py-2 text-[11px]">
          <div className="px-3 pb-2 border-b border-slate-100 mb-1">
            <p className="text-[11px] font-medium text-slate-700">Cuenta</p>
            {email && <p className="text-[10px] text-slate-500 truncate">{email}</p>}
          </div>

          <button
            type="button"
            className="w-full px-3 py-1.5 text-left text-slate-600 hover:bg-slate-50"
          >
            Perfil
          </button>
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
