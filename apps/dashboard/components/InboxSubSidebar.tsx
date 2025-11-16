'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function InboxSubSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Solo mostrar en rutas de inbox
  if (!pathname?.startsWith('/dashboard/inbox')) {
    return null;
  }

  // Obtener filtro activo de URL
  const activeFilter = searchParams?.get('filter') || 'unassigned';

  // Contar conversaciones por estado (esto se podría obtener de un contexto o API)
  // Por ahora mostramos los botones sin contadores dinámicos

  return (
    <aside className="w-56 border-r border-slate-200 bg-white p-4">
      <div className="space-y-1">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2 mb-2">
          BANDEJA DE ENTRADA
        </h3>
        
        <div className="space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
            Conversación en vivo
          </div>
          
          <button
            onClick={() => router.push('/dashboard/inbox?filter=unassigned')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              activeFilter === 'unassigned'
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span>📥</span>
            <span>Sin asignar</span>
          </button>

          <button
            onClick={() => router.push('/dashboard/inbox?filter=open')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              activeFilter === 'open'
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span>💬</span>
            <span>Abiertos</span>
          </button>

          <button
            onClick={() => router.push('/dashboard/inbox?filter=resolved')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              activeFilter === 'resolved'
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span>✅</span>
            <span>Resueltos</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

