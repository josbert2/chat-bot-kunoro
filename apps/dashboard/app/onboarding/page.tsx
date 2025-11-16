"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const DEPARTMENTS = [
  "Soy propietario de una empresa",
  "Atención al cliente",
  "Operaciones",
  "Ventas",
  "Informático/técnico",
  "Marketing",
  "Desarrollo de sitio web",
  "Otros",
];

function readKunoroUserCookie(): { name?: string; email?: string } {
  if (typeof document === "undefined") return {};
  const match = document.cookie.split(";").find((c) => c.trim().startsWith("kunoro_user="));
  if (!match) return {};
  try {
    const raw = decodeURIComponent(match.split("=")[1] ?? "");
    return JSON.parse(raw ?? "{}");
  } catch {
    return {};
  }
}

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = readKunoroUserCookie();
    if (data.name) setName(data.name);
    setLoading(false);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Guardar nombre y departamento en la cookie existente
    if (typeof document !== "undefined") {
      const existing = readKunoroUserCookie();
      const payload = encodeURIComponent(
        JSON.stringify({
          ...existing,
          name,
          department,
        }),
      );
      document.cookie = `kunoro_user=${payload}; path=/; max-age=31536000`;
    }
    router.push("/onboarding/business");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-xs text-slate-400">Cargando tour...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-[1.3fr_minmax(0,1fr)] gap-8">
        {/* Panel de preguntas */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl px-8 py-8 flex flex-col gap-8 shadow-lg">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Configura tu experiencia</h1>
              <p className="text-xs text-slate-400 mt-1">
                Estas respuestas nos ayudarán a personalizar el panel y el chat para tu negocio.
              </p>
            </div>
          </header>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <h2 className="text-sm font-medium">¿Cómo te llamas?</h2>
              <p className="text-[11px] text-slate-400">
                Tus respuestas nos ayudarán a personalizar tu experiencia.
              </p>
              <input
                className="mt-2 w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ej: Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-medium">¿En qué departamento trabajas?</h2>
              <p className="text-[11px] text-slate-400">
                Esto nos ayuda a adaptar el lenguaje y las sugerencias.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {DEPARTMENTS.map((dep) => (
                  <button
                    type="button"
                    key={dep}
                    onClick={() => setDepartment(dep)}
                    className={`border rounded-lg px-3 py-2 text-left transition-colors ${
                      department === dep
                        ? "border-blue-500 bg-blue-500/10 text-slate-50"
                        : "border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    {dep}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden mr-4">
                <div className="h-full w-2/3 bg-blue-500" />
              </div>
              <button
                type="submit"
                disabled={!name || !department}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-medium text-slate-50 shadow-sm hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </form>
        </section>

        {/* Preview del chat */}
        <section className="hidden md:flex items-center justify-center">
          <div className="w-72 h-[420px] rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col overflow-hidden">
            <header className="h-10 px-3 flex items-center justify-between border-b border-slate-800 text-[11px]">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-blue-500" />
                <span className="font-medium truncate max-w-[120px]">{name || "Tu nombre"}</span>
              </div>
              <span className="text-slate-500">•••</span>
            </header>
            <div className="flex-1 px-3 py-3 space-y-2 text-[11px] text-slate-300">
              <div className="self-start max-w-[85%] rounded-2xl rounded-bl-sm bg-slate-800 px-3 py-2">
                <p>¡Hola {name || ""}! Bienvenido a Kunoro 👋</p>
              </div>
              <div className="self-start max-w-[85%] rounded-2xl rounded-bl-sm bg-slate-800 px-3 py-2">
                <p>
                  Usaremos esta información para ayudarte a configurar tu chat
                  y tu inbox.
                </p>
              </div>
            </div>
            <footer className="h-11 border-t border-slate-800 flex items-center px-3 text-[11px] text-slate-500 bg-slate-950/80">
              <span className="flex-1">Escribe un mensaje...</span>
              <div className="h-6 w-6 rounded-full bg-blue-600" />
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
