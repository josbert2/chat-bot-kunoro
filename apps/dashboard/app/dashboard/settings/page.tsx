"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppearanceGeneralForm } from "@/components/AppearanceGeneralForm";
import { parseWidgetConfig, WidgetColors } from "@/lib/widget-config";

type Account = {
  id: string;
  name: string;
  plan: string;
  businessModel?: string | null;
  platform?: string | null;
  useAi?: boolean | null;
  goalId?: string | null;
};

type Site = {
  id: string;
  name: string;
  appId: string;
  widgetConfigJson?: string | null;
};

export default function DashboardSettingsPage() {
  const searchParams = useSearchParams();
  const activeSection = searchParams?.get('section') || 'apariencia';
  
  const [account, setAccount] = useState<Account | null>(null);
  const [site, setSite] = useState<Site | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [widgetColors, setWidgetColors] = useState<WidgetColors>({
    background: "#0F172A",
    action: "#2563EB",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user_data");
      
      if (!token) {
        console.error("❌ No hay token");
        return;
      }

      if (userData) {
        const user = JSON.parse(userData);
        setUserEmail(user.email || "");
      }

      // Obtener cuenta
      const accountRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (accountRes.ok) {
        const accountData = await accountRes.json();
        console.log("✅ Account data:", accountData);
        setAccount(accountData.account);

        // Obtener proyectos (sites)
        if (accountData.account?.id) {
          const projectsRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/projects`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );

          if (projectsRes.ok) {
            const projectsData = await projectsRes.json();
            console.log("✅ Projects data:", projectsData);
            
            if (projectsData.data && projectsData.data.length > 0) {
              const firstProject = projectsData.data[0];
              console.log("✅ First project:", firstProject);
              console.log("✅ Widget config raw:", firstProject.widgetConfig);
              
              setSite({
                id: firstProject.id,
                name: firstProject.name,
                appId: firstProject.appId,
                widgetConfigJson: firstProject.widgetConfig ? JSON.stringify({ colors: firstProject.widgetConfig }) : null,
              });

              // Parsear colores del widget - ASEGURARSE de que se cargan correctamente
              if (firstProject.widgetConfig && firstProject.widgetConfig.colors) {
                console.log("✅ Widget colors from project:", firstProject.widgetConfig.colors);
                setWidgetColors({
                  background: firstProject.widgetConfig.colors.background || "#0F172A",
                  action: firstProject.widgetConfig.colors.action || "#2563EB",
                });
              } else {
                console.warn("⚠️ No hay widgetConfig en el proyecto, usando defaults");
                setWidgetColors({
                  background: "#0F172A",
                  action: "#2563EB",
                });
              }
            } else {
              console.warn("⚠️ No hay proyectos. Creando uno automáticamente...");
              // Crear proyecto automáticamente
              await createDefaultProject(token, accountData.account.id);
            }
          } else {
            console.error("❌ Error obteniendo proyectos:", await projectsRes.text());
          }
        }
      } else {
        console.error("❌ Error obteniendo cuenta:", await accountRes.text());
      }
    } catch (error) {
      console.error("❌ Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createDefaultProject(token: string, accountId: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/v1/projects`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Mi Proyecto',
            accountId: accountId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Proyecto creado:", data);
        // Recargar datos
        await loadData();
      } else {
        console.error("❌ Error creando proyecto:", await response.text());
      }
    } catch (error) {
      console.error("❌ Error creando proyecto:", error);
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-slate-500">Cargando configuración...</p>
      </div>
    );
  }

  const accountName = account?.name ?? "Mi cuenta";
  const accountPlan = account?.plan ?? "free";
  const businessModel = account?.businessModel ?? "No definido";
  const platform = account?.platform ?? "No definido";
  const useAi = account?.useAi === true;
  const goalId = account?.goalId ?? null;

  const goalLabel =
    goalId === "leads"
      ? "Conseguir más leads"
      : goalId === "support"
        ? "Soporte al cliente"
        : goalId === "sales"
          ? "Cerrar más ventas"
          : "Sin definir";

  const sectionTitles: Record<string, { title: string; description: string }> = {
    apariencia: {
      title: "Apariencia",
      description: "Personaliza los colores y apariencia del widget."
    },
    equipo: {
      title: "Equipo",
      description: "Gestiona los miembros de tu equipo y sus permisos."
    },
    facturacion: {
      title: "Facturación",
      description: "Administra tu plan y métodos de pago."
    },
    whatsapp: {
      title: "WhatsApp",
      description: "Conecta WhatsApp para recibir conversaciones."
    },
    zapier: {
      title: "Zapier",
      description: "Automatiza flujos de trabajo con Zapier."
    }
  };

  const currentSection = sectionTitles[activeSection] || sectionTitles['apariencia'];

  return (
    <div className="h-full flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-slate-900">
          {currentSection.title}
        </h3>
        <p className="text-xs text-slate-500 max-w-xl">
          {currentSection.description}
        </p>
      </header>

      <div className="flex-1">


        {activeSection === "apariencia" && (
          <>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <AppearanceGeneralForm 
                siteId={site?.id ?? null}
                appId={site?.appId ?? null}
                initialColors={widgetColors}
                onSaved={() => {
                  console.log('🔄 [Settings] Recargando datos después de guardar...');
                  loadData();
                }}
              />
            </div>

            {!loading && site && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <header className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-[12px] font-semibold text-white">
                      &lt;/&gt;
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">Código de instalación</h4>
                      <p className="text-[11px] text-slate-500">
                        Copia este código y pégalo antes del cierre del tag &lt;/body&gt; en tu sitio web.
                      </p>
                    </div>
                  </div>
                </header>

                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-xs font-mono">
{`<script 
  src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget.js"
  data-app-id="${site.appId}"
  data-color-background="${widgetColors.background}"
  data-color-action="${widgetColors.action}"
></script>`}
                  </pre>
                  <button
                    onClick={() => {
                      const code = `<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget.js" data-app-id="${site.appId}" data-color-background="${widgetColors.background}" data-color-action="${widgetColors.action}"></script>`;
                      navigator.clipboard.writeText(code);
                      alert('✅ Código copiado al portapapeles');
                    }}
                    className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-lg bg-slate-700 hover:bg-slate-600 px-3 py-1.5 text-[11px] font-medium text-white transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copiar
                  </button>
                </div>

                <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="text-[11px] text-amber-900">
                    <p className="font-semibold mb-1">Importante</p>
                    <p className="text-amber-800">
                      Después de guardar cambios en los colores, actualiza este código en tu sitio web para reflejar los nuevos estilos.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {activeSection === "equipo" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-center py-12">
              <span className="text-4xl">👥</span>
              <h4 className="mt-4 text-sm font-semibold text-slate-900">Gestión de Equipo</h4>
              <p className="mt-2 text-xs text-slate-500">
                Invita miembros a tu equipo y gestiona permisos.
              </p>
              <button className="mt-4 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500">
                Invitar miembro
              </button>
            </div>
          </section>
        )}

        {activeSection === "facturacion" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-center py-12">
              <span className="text-4xl">💳</span>
              <h4 className="mt-4 text-sm font-semibold text-slate-900">Facturación y Pagos</h4>
              <p className="mt-2 text-xs text-slate-500">
                Administra tu plan, métodos de pago y facturas.
              </p>
              <div className="mt-4 flex gap-2 justify-center">
                <button className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500">
                  Ver plan actual
                </button>
                <button className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                  Ver facturas
                </button>
              </div>
            </div>
          </section>
        )}

        {activeSection === "whatsapp" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-center py-12">
              <span className="text-4xl">💬</span>
              <h4 className="mt-4 text-sm font-semibold text-slate-900">Integración con WhatsApp</h4>
              <p className="mt-2 text-xs text-slate-500">
                Conecta WhatsApp Business API para recibir conversaciones.
              </p>
              <button className="mt-4 rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-500">
                Conectar WhatsApp
              </button>
            </div>
          </section>
        )}

        {activeSection === "zapier" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-center py-12">
              <span className="text-4xl">⚡</span>
              <h4 className="mt-4 text-sm font-semibold text-slate-900">Integración con Zapier</h4>
              <p className="mt-2 text-xs text-slate-500">
                Automatiza flujos de trabajo conectando con más de 5000 apps.
              </p>
              <button className="mt-4 rounded-full bg-orange-600 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-500">
                Conectar Zapier
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
