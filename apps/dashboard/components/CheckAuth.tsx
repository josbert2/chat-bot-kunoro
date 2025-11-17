"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function CheckAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay token en localStorage
    const token = localStorage.getItem("auth_token");
    
    if (!token) {
      console.log("❌ No hay token, redirigiendo a login");
      router.push("/login");
    }
  }, [router]);

  return <>{children}</>;
}

