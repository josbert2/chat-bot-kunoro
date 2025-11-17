import { randomUUID } from "crypto";
import { db } from "@/db";
import { accounts, sites } from "@/db/schema";
import { eq } from "drizzle-orm";

async function createSitesForExistingAccounts() {
  try {
    console.log("🔍 Looking for accounts without sites...");

    const allAccounts = await db.query.accounts.findMany();
    console.log(`Found ${allAccounts.length} total accounts`);

    for (const account of allAccounts) {
      const existingSite = await db.query.sites.findFirst({
        where: eq(sites.accountId, account.id),
      });

      if (!existingSite) {
        console.log(`\n📝 Creating site for account: ${account.name} (${account.id})`);
        
        const siteId = randomUUID();
        const appId = `app_${randomUUID().replace(/-/g, "")}`;

        await db.insert(sites).values({
          id: siteId,
          accountId: account.id,
          name: `${account.name} - Sitio Principal`,
          appId,
          domain: "localhost:3000",
          widgetConfigJson: JSON.stringify({
            colors: {
              background: "#6366f1",
              action: "#4f46e5",
            },
            position: "bottom-right",
            welcomeMessage: "¡Hola! ¿En qué podemos ayudarte?",
          }),
        });

        console.log(`  ✓ Site created with App ID: ${appId}`);
      } else {
        console.log(`✓ Account "${account.name}" already has a site (${existingSite.appId})`);
      }
    }

    console.log("\n🎉 All accounts now have sites!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

createSitesForExistingAccounts();

