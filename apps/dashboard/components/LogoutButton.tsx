"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
      });
      router.push("/login");
    } catch {
      router.push("/login");
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:bg-slate-800"
    >
      Cerrar sesión
    </button>
  );
}

