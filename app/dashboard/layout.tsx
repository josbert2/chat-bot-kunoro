import type { ReactNode } from "react";
import Link from "next/link";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { UserMenu } from "@/components/UserMenu";
import { SidebarUserMenu } from "@/components/SidebarUserMenu";
import { SettingsSubSidebar } from "@/components/SettingsSubSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const userEmail = session.user.email ?? "usuario@kunoro";

   // Si el usuario aún no completó el onboarding (no tiene department en la cookie),
   // lo redirigimos al tour antes de mostrar el dashboard.
   const cookieStore = cookies();
   const rawKunoro = cookieStore.get("kunoro_user")?.value;
   if (rawKunoro) {
     try {
       const parsed = JSON.parse(decodeURIComponent(rawKunoro));
       if (!parsed?.department) {
         redirect("/onboarding");
       }
     } catch {
       // Si la cookie está corrupta, enviamos igual al onboarding.
       redirect("/onboarding");
     }
   } else {
     redirect("/onboarding");
   }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex">
      <aside className="w-16 border-r border-slate-200 bg-slate-50 flex flex-col items-center py-4 gap-4">
        {/* Logo / home */}
        <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 border border-blue-100">
          <span className="sr-only">Dashboard</span>
          <span className="text-lg font-semibold">K</span>
        </button>

        {/* Navegación principal */}
        <nav className="flex flex-col items-center gap-3 mt-2 text-slate-600">
          <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 border border-blue-100">
            <span className="sr-only">Panel</span>
            <span className="text-base">🏠</span>
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-2xl hover:bg-slate-100">
            <span className="sr-only">Inbox</span>
            <span className="text-base">💬</span>
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-2xl hover:bg-slate-100">
            <span className="sr-only">IA</span>
            <span className="text-base">🤖</span>
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-2xl hover:bg-slate-100">
            <span className="sr-only">Clientes</span>
            <span className="text-base">👥</span>
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-2xl hover:bg-slate-100">
            <span className="sr-only">Analítica</span>
            <span className="text-base">📊</span>
          </button>
        </nav>

        {/* Separador flexible */}
        <div className="flex-1" />

        {/* Progreso de onboarding / objetivo */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 shadow-[0_0_0_1px_rgba(148,163,184,0.2)]">
          <span className="sr-only">Progreso</span>
          <div className="relative h-7 w-7 rounded-full border-2 border-emerald-400 flex items-center justify-center">
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Grid / apps */}
        <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600">
          <span className="sr-only">Apps</span>
          <div className="grid grid-cols-3 gap-[2px] text-[8px]">
            <span>●</span>
            <span>●</span>
            <span>●</span>
            <span>●</span>
            <span>●</span>
            <span>●</span>
            <span>●</span>
            <span>●</span>
            <span>●</span>
          </div>
        </button>

        {/* Ajustes con indicador y avatar con dropdown lateral */}
        <Link
          href="/dashboard/settings"
          className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600"
        >
          <span className="sr-only">Configuración</span>
          <span className="text-base">⚙️</span>
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-slate-50" />
        </Link>

        <SidebarUserMenu />
      </aside>
      <main className="flex-1 flex flex-col">
        {/* Header superior, siempre visible */}
        <header className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-white">
          <div>
            <h2 className="text-sm font-semibold">Inbox</h2>
            <p className="text-xs text-slate-500">Vista inicial del panel de conversación</p>
          </div>
          <UserMenu email={userEmail} />
        </header>

        {/* Zona inferior: sub-sidebar (cuando aplique) + contenido */}
        <div className="flex flex-1 min-h-0">
          <SettingsSubSidebar />
          <section className="flex-1 p-6 bg-slate-100 overflow-auto">
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
