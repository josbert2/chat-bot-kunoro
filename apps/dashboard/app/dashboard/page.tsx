export default function DashboardHome() {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Inbox</h3>
          <p className="text-xs text-slate-400 mt-1">
            Maqueta inicial del Inbox (lista de conversaciones, mensajes y detalles).
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[280px_minmax(0,1.5fr)_minmax(0,1fr)] gap-4">
        {/* Lista de conversaciones */}
        <section className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <header className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">Conversaciones</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">Demo</span>
          </header>
          <div className="px-3 py-2 border-b border-slate-800">
            <input
              className="w-full rounded-md bg-slate-950/60 border border-slate-800 px-2 py-1 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="Buscar por usuario, email o mensaje"
            />
          </div>
          <div className="flex-1 overflow-auto text-xs">
            <div className="px-3 py-2 text-[10px] uppercase tracking-wide text-slate-500">Hoy</div>
            {Array.from({ length: 6 }).map((_, i) => (
              <button
                key={i}
                className={`w-full text-left px-3 py-2 border-t border-slate-900/60 hover:bg-slate-800/70 ${
                  i === 0 ? "bg-slate-800" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-slate-100">Usuario demo #{i + 1}</span>
                  <span className="text-[10px] text-slate-400">hace 2 min</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  "Hola, tengo una duda sobre las entradas para el sábado..."
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Panel de mensajes */}
        <section className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <header className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-100">Usuario demo #1</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Desde sitio: demo-site.com</p>
            </div>
          </header>

          <div className="flex-1 overflow-auto px-4 py-3 space-y-3 text-xs">
            <div className="flex gap-2">
              <div className="h-6 w-6 rounded-full bg-slate-700" />
              <div>
                <p className="text-[11px] text-slate-400 mb-0.5">Usuario • 10:24</p>
                <div className="inline-block rounded-lg bg-slate-800 px-3 py-2 text-slate-50 text-xs">
                  Hola, me gustaría saber el precio de las entradas para el viernes a la noche.
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <div>
                <p className="text-[11px] text-slate-400 mb-0.5 text-right">Agente • 10:25</p>
                <div className="inline-block rounded-lg bg-blue-600 px-3 py-2 text-slate-50 text-xs">
                  ¡Hola! Claro, para el viernes las entradas generales están a $15.000 y las VIP a $25.000.
                </div>
              </div>
              <div className="h-6 w-6 rounded-full bg-blue-500" />
            </div>
          </div>

          <footer className="border-t border-slate-800 px-3 py-2 flex items-end gap-2 bg-slate-950/70">
            <textarea
              rows={2}
              className="flex-1 resize-none rounded-md bg-slate-900 border border-slate-800 px-2 py-1.5 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="Escribe una respuesta..."
            />
            <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-[11px] font-medium text-slate-50 hover:bg-blue-500">
              Enviar
            </button>
          </footer>
        </section>

        {/* Panel de detalles */}
        <section className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden text-xs">
          <header className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-100">Detalles</span>
            <span className="text-[10px] text-slate-500">v0</span>
          </header>
          <div className="p-3 space-y-3">
            <div>
              <p className="text-[11px] text-slate-400 mb-0.5">Usuario</p>
              <p className="text-xs font-medium text-slate-100">usuario.demo@ejemplo.com</p>
              <p className="text-[11px] text-slate-400">ID externo: 12345-demo</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 mb-0.5">Conversación</p>
              <ul className="space-y-0.5 text-[11px] text-slate-300">
                <li>Estado: Abierta</li>
                <li>Asignada a: Sin asignar</li>
                <li>Creada: hace 3 min</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
