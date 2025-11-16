"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || "No se pudo crear la cuenta. Verifica los datos.");
        setIsSubmitting(false);
        return;
      }

      // Si todo sale bien, Better Auth crea el usuario + sesión.
      // Guardamos datos básicos en una cookie para el tour/onboarding.
      if (typeof document !== "undefined") {
        const payload = encodeURIComponent(
          JSON.stringify({ name, email })
        );
        document.cookie = `kunoro_user=${payload}; path=/; max-age=31536000`;
      }

      // Enviamos al tour de onboarding.
      router.push("/onboarding");
    } catch (e) {
      setError("Hubo un error al conectar con el servidor. Intenta de nuevo.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Crear cuenta</h1>
          <p className="text-xs text-slate-400">
            Crea una cuenta para acceder al dashboard de Kunoro.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-5"
        >
          <div className="space-y-1 text-xs">
            <label htmlFor="name" className="block text-slate-200">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md bg-slate-950/70 border border-slate-800 px-3 py-2 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="Tu nombre o el de tu empresa"
            />
          </div>

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
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-slate-950/70 border border-slate-800 px-3 py-2 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="Mínimo 8 caracteres"
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
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-[11px] text-slate-500 text-center">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="underline underline-offset-2 hover:text-slate-300">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
