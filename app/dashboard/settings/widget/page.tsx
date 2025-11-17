import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { sites, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { parseWidgetConfig, serializeWidgetConfig, getDefaultWidgetConfig } from "@/lib/widget-config";
import { WidgetConfigPage } from "@/components/WidgetConfigPage";

export default async function WidgetSettingsPage() {
  const session = await auth.api.getSession({ headers: headers() });

  if (!session) {
    redirect("/auth/login");
  }

  const userId = session.user.id as string;
  const [currentUser] = await db.select().from(user).where(eq(user.id, userId));

  if (!currentUser?.accountId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-slate-500">No tienes una cuenta asociada</p>
      </div>
    );
  }

  let primarySite = await db.query.sites.findFirst({
    where: eq(sites.accountId, currentUser.accountId),
  });

  // Create site if it doesn't exist
  if (!primarySite) {
    const siteId = randomUUID();
    const appId = `app_${randomUUID().replace(/-/g, "")}`;
    const widgetConfig = serializeWidgetConfig(getDefaultWidgetConfig());

    await db.insert(sites).values({
      id: siteId,
      accountId: currentUser.accountId,
      name: `${currentUser.name ?? "Mi"} Sitio Principal`,
      appId,
      domain: "localhost:3000",
      widgetConfigJson: widgetConfig,
    });

    primarySite = await db.query.sites.findFirst({
      where: eq(sites.id, siteId),
    });
  }

  if (!primarySite) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-slate-500">Error al cargar el sitio</p>
      </div>
    );
  }

  const widgetConfig = parseWidgetConfig(primarySite.widgetConfigJson);

  return (
    <WidgetConfigPage
      siteId={primarySite.id}
      siteName={primarySite.name}
      appId={primarySite.appId}
      config={widgetConfig}
    />
  );
}

