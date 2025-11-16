import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const users = await db.select().from(user).limit(50);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Usuarios</h1>
            <p className="text-xs text-slate-400 mt-1">
              Vista básica de administración para ver usuarios registrados.
            </p>
          </div>
        </header>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-900 border-b border-slate-800">
              <tr className="text-left text-[11px] text-slate-400">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Cuenta</th>
                <th className="px-3 py-2">Creado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-900/80 text-slate-200">
                  <td className="px-3 py-2 align-top max-w-[140px] truncate text-[10px] text-slate-400">
                    {u.id}
                  </td>
                  <td className="px-3 py-2 align-top">
                    {u.name}
                  </td>
                  <td className="px-3 py-2 align-top text-slate-300">
                    {u.email}
                  </td>
                  <td className="px-3 py-2 align-top text-slate-400 text-[11px]">
                    {u.accountId || "—"}
                  </td>
                  <td className="px-3 py-2 align-top text-slate-400 text-[11px]">
                    {u.createdAt?.toISOString?.() ?? ""}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-center text-slate-500 text-[11px]" colSpan={5}>
                    No hay usuarios aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
