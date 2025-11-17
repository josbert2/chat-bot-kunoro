"use client";

import { useState } from "react";
import type { WidgetConfig } from "@/lib/widget-config";
import { WidgetConfigTabs, TabPanel } from "@/components/WidgetConfigTabs";
import { AppearanceGeneralForm } from "@/components/AppearanceGeneralForm";
import { WidgetMessagesConfig } from "@/components/WidgetMessagesConfig";
import { WidgetBehaviorConfig } from "@/components/WidgetBehaviorConfig";
import { WidgetInstallation } from "@/components/WidgetInstallation";

type WidgetConfigPageProps = {
  siteId: string;
  siteName: string;
  appId: string;
  config: WidgetConfig;
};

export function WidgetConfigPage({ siteId, siteName, appId, config }: WidgetConfigPageProps) {
  const [activeTab, setActiveTab] = useState("appearance");

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-slate-900">Configuración del Widget</h3>
        <p className="text-xs text-slate-500 max-w-2xl">
          Personaliza la apariencia, mensajes y comportamiento del chat en vivo para tu sitio{" "}
          <span className="font-medium text-slate-700">{siteName}</span>.
        </p>
      </header>

      {/* Config content */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <WidgetConfigTabs activeTab={activeTab} onTabChange={setActiveTab}>
          <TabPanel tabId="appearance" activeTab={activeTab}>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Colores y apariencia</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Personaliza los colores del widget para que coincidan con tu marca.
                </p>
              </div>
              <AppearanceGeneralForm siteId={siteId} initialColors={config.colors} />
            </div>
          </TabPanel>

          <TabPanel tabId="messages" activeTab={activeTab}>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Textos y mensajes</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Configura los mensajes que verán tus visitantes al interactuar con el widget.
                </p>
              </div>
              <WidgetMessagesConfig
                siteId={siteId}
                initialWelcomeMessage={config.welcomeMessage}
                initialOfflineMessage={config.offlineMessage}
                initialBrandName={config.brandName}
              />
            </div>
          </TabPanel>

          <TabPanel tabId="behavior" activeTab={activeTab}>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Comportamiento</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Define cómo y cuándo se muestra el widget a tus visitantes.
                </p>
              </div>
              <WidgetBehaviorConfig
                siteId={siteId}
                initialPosition={config.position}
                initialBusinessHours={config.businessHours}
                initialShowPoweredBy={config.showPoweredBy}
              />
            </div>
          </TabPanel>

          <TabPanel tabId="installation" activeTab={activeTab}>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Instalación</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Copia el código e instálalo en tu sitio web para activar el widget.
                </p>
              </div>
              <WidgetInstallation appId={appId} siteName={siteName} />
            </div>
          </TabPanel>
        </WidgetConfigTabs>
      </section>
    </div>
  );
}

