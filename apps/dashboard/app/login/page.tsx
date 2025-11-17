"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    console.log('🔵 [LOGIN] Iniciando login:', { email });

    try {
      // Llamar directo al API Express
      const res = await fetch(`${API_URL}/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('🔵 [LOGIN] Response status:', res.status);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('❌ [LOGIN] Error:', data);
        setError(data?.message || "No se pudo iniciar sesión. Verifica tus datos.");
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();
      console.log('✅ [LOGIN] Login exitoso');

      // Guardar token y datos en localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user_data", JSON.stringify(data.user));
      }

      console.log('🔵 [LOGIN] Redirigiendo a /dashboard');
      router.push("/dashboard");
    } catch (e: any) {
      console.error('❌ [LOGIN] Error en catch:', e);
      setError("Hubo un error al conectar con el servidor. Intenta de nuevo.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Iniciar sesión</h1>
          <p className="text-xs text-slate-400">
            Accede al dashboard de Kunoro para ver tu inbox y configurar tus sitios.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-5"
        >
          <div className="space-y-1 text-xs">
            <label htmlFor="email" className="block text-slate-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-slate-950/70 border border-slate-800 px-3 py-2 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="tu@empresa.com"
            />
          </div>

          <div className="space-y-1 text-xs">
            <label htmlFor="password" className="block text-slate-200">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-slate-950/70 border border-slate-800 px-3 py-2 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p className="text-[11px] text-red-400 bg-red-950/40 border border-red-900 rounded-md px-2 py-1 mt-1">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-slate-50 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <p className="text-[11px] text-slate-500 text-center">
          ¿No tienes cuenta todavía? <span className="text-slate-300">(pantalla de registro vendrá después)</span>
        </p>

        <div className="text-center text-[11px] text-slate-500">
          <Link href="/dashboard" className="underline underline-offset-2 hover:text-slate-300">
            Ir directo al dashboard (modo demo)
          </Link>
        </div>
      </div>
    </main>
  );
}
