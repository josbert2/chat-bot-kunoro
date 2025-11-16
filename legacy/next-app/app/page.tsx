import ChatWidget from "@/components/ChatWidget";
import { db } from "@/db";
import { sites } from "@/db/schema";
import { parseWidgetConfig, getDefaultWidgetColors } from "@/lib/widget-config";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [site] = await db.select().from(sites).limit(1);
  const config = site ? parseWidgetConfig(site.widgetConfigJson) : { colors: getDefaultWidgetColors() };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ChatWidget appId={site?.appId} initialColors={config.colors} />
    </main>
  );
}
