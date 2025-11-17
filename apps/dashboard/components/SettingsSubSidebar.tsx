'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SettingsSubSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Solo mostrar en rutas de configuración
  if (!pathname?.startsWith('/dashboard/settings')) {
    return null;
  }

  const sections = [
    {
      id: "general",
      title: "General",
      subsections: [
        { id: "apariencia", title: "Apariencia", icon: "🎨" },
        { id: "equipo", title: "Equipo", icon: "👥" },
        { id: "facturacion", title: "Facturación", icon: "💳" },
      ]
    },
    {
      id: "integraciones",
      title: "Integraciones",
      subsections: [
        { id: "whatsapp", title: "WhatsApp", icon: "💬" },
        { id: "zapier", title: "Zapier", icon: "⚡" },
      ]
    }
  ];

  // Obtener sección activa de URL
  const activeSection = searchParams?.get('section') || 'apariencia';

  return (
    <aside className="w-56 border-r border-slate-200 bg-white p-4">
      <div className="space-y-1">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2 mb-2">
          CONFIGURACIÓN
        </h3>
        
        {sections.map((section) => (
          <div key={section.id} className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
              {section.title}
            </div>
            {section.subsections.map((subsection) => (
              <button
                key={subsection.id}
                onClick={() => router.push(`/dashboard/settings?section=${subsection.id}`)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === subsection.id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{subsection.icon}</span>
                <span>{subsection.title}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}
