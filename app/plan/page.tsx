import fs from "fs/promises";
import path from "path";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ReactMarkdown from "react-markdown";

export default async function PlanPage() {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) {
    redirect("/login");
  }

  const planPath = path.join(process.cwd(), "plan.md");
  const content = await fs.readFile(planPath, "utf8");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Plan del proyecto</h1>
            <p className="text-xs text-slate-400 mt-1">
              Vista solo-lectura de plan.md dentro de la app.
            </p>
          </div>
        </header>

        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm leading-relaxed markdown-body">
          <ReactMarkdown>{content}</ReactMarkdown>
        </section>
      </div>
    </main>
  );
}
