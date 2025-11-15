import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { accounts, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardSettingsPage() {
  const session = await auth.api.getSession({ headers: headers() });

  if (!session) {
    return null;
  }

  const userId = session.user.id as string;
  const [currentUser] = await db.select().from(user).where(eq(user.id, userId));

  let accountData: any = null;
  if (currentUser?.accountId) {
    const [acc] = await db.select().from(accounts).where(eq(accounts.id, currentUser.accountId));
    if (acc) accountData = acc;
  }

  const accountName = accountData?.name ?? "Mi cuenta";
  const accountPlan = accountData?.plan ?? "free";
  const businessModel = accountData?.businessModel ?? "No definido";
  const platform = accountData?.platform ?? "No definido";
  const useAi = accountData?.useAi === true;
  const goalId = (accountData?.goalId as string | null) ?? null;

  const goalLabel =
    goalId === "leads"
      ? "Conseguir más leads"
      : goalId === "support"
        ? "Soporte al cliente"
        : goalId === "sales"
          ? "Cerrar más ventas"
          : "Sin definir";

  const ownerEmail = session.user.email ?? "";

  return (
    <div className="h-full flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-slate-900">Configuración</h3>
        <p className="text-xs text-slate-500 max-w-xl">
          Ajusta los datos de tu cuenta, tus canales y cómo se comporta la IA de Kunoro.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Cuenta / perfil */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-3">
          <header className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Cuenta</h4>
              <p className="text-[11px] text-slate-500">Nombre, email y plan actual.</p>
            </div>
            <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
              Plan {accountPlan}
            </span>
          </header>
          <div className="space-y-2 text-[11px] text-slate-600">
            <div>
              <p className="text-[11px] font-medium text-slate-800">Nombre de la cuenta</p>
              <p className="text-[11px] text-slate-900 font-medium">{accountName}</p>
              <p className="text-[11px] text-slate-500">Se sincroniza con los datos de onboarding.</p>
                </div>
                <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
                Plan {accountPlan}
                </span>
            </div>
            <div className="space-y-2 text-[11px] text-slate-600">
                <div>
                <p className="text-[11px] font-medium text-slate-800">Nombre de la cuenta</p>
                <p className="text-[11px] text-slate-900 font-medium">{accountName}</p>
                <p className="text-[11px] text-slate-500">Se sincroniza con los datos de onboarding.</p>
                </div>
                <div>
                <p className="text-[11px] font-medium text-slate-800">Correo del propietario</p>
                <p className="text-[11px] text-slate-900 font-medium">{ownerEmail}</p>
                <p className="text-[11px] text-slate-500">Usado para notificaciones importantes.</p>
                </div>
            </div>
            <button className="mt-2 self-start rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100">
                Editar cuenta
            </button>
            </section>

            {/* Sitio / canal principal */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-3">
            <header>
                <h4 className="text-sm font-semibold text-slate-900">Sitio y canal</h4>
                <p className="text-[11px] text-slate-500">Dominio, plataforma y canales conectados.</p>
            </header>
            <div className="space-y-2 text-[11px] text-slate-600">
                <div>
                <p className="text-[11px] font-medium text-slate-800">Dominio principal</p>
                <p className="text-[11px] text-slate-500">Ej: midominio.com</p>
                </div>
                <div>
                <p className="text-[11px] font-medium text-slate-800">Plataforma</p>
                <p className="text-[11px] text-slate-900 font-medium">{platform}</p>
                <p className="text-[11px] text-slate-500">WordPress, Shopify, custom, etc.</p>
                </div>
            </div>
            <button className="mt-2 self-start rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100">
                Configurar sitio
            </button>
            </section>

            {/* IA y automatización */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-3">
            <header>
                <h4 className="text-sm font-semibold text-slate-900">IA y automatización</h4>
                <p className="text-[11px] text-slate-500">Preferencias de IA y uso de respuestas automáticas.</p>
            </header>
            <div className="space-y-2 text-[11px] text-slate-600">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-medium text-slate-800">Usar IA para preguntas repetitivas</p>
                    <p className="text-[11px] text-slate-500">Se basa en lo que definiste en el tour.</p>
                </div>
                <span
                    className={`inline-flex h-5 w-9 items-center rounded-full px-0.5 text-[10px] text-white transition-colors ${
                    useAi ? "bg-emerald-500 justify-end" : "bg-slate-300 justify-start"
                    }`}
                >
                    <span className="h-4 w-4 rounded-full bg-white" />
                </span>
                </div>
                <div>
                <p className="text-[11px] font-medium text-slate-800">Objetivo principal</p>
                <p className="text-[11px] text-slate-900 font-medium">{goalLabel}</p>
                <p className="text-[11px] text-slate-500">Leads, soporte, ventas, etc.</p>
                </div>
            </div>
            <button className="mt-2 self-start rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100">
                Ajustar IA
            </button>
            </section>
      </div>
    </div>
  );
}
