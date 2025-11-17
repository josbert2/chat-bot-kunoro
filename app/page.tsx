import ChatWidget from "@/components/ChatWidget";
import { db } from "@/db";
import { sites } from "@/db/schema";
import { parseWidgetConfig, getDefaultWidgetColors } from "@/lib/widget-config";

export const dynamic = "force-dynamic";

export default async function Home() {
  const site = await db.query.sites.findFirst();
  const config = site ? parseWidgetConfig(site.widgetConfigJson) : { colors: getDefaultWidgetColors() };

  console.log('[page] Site loaded:', { 
    hasSite: !!site, 
    appId: site?.appId, 
    siteName: site?.name 
  });

  if (!site) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">No hay sitios configurados</h1>
          <p className="text-gray-600">Por favor, configura un sitio en la base de datos.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ChatWidget appId={site.appId} initialColors={config.colors} />
    </main>
  );
}
