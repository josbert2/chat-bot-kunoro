import { randomUUID } from "crypto";
import { db } from "@/db";
import { accounts, user } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Asegura que un usuario tenga una cuenta asociada.
 * Si no tiene cuenta, crea una automáticamente con valores por defecto.
 */
export async function ensureUserHasAccount(userId: string): Promise<string> {
  const [existingUser] = await db.select().from(user).where(eq(user.id, userId));

  if (!existingUser) {
    throw new Error("Usuario no encontrado");
  }

  // Si ya tiene cuenta, retornarla
  if (existingUser.accountId) {
    return existingUser.accountId;
  }

  // Crear nueva cuenta con valores por defecto
  const accountId = randomUUID();
  const accountName = existingUser.name ?? existingUser.email ?? "Mi cuenta";

  await db.insert(accounts).values({
    id: accountId,
    name: accountName,
    plan: "free",
    businessModel: null,
    industry: null,
    conversationsRange: null,
    visitorsRange: null,
    platform: null,
    agentCount: null,
    goalId: null,
    useAi: null,
  });

  // Actualizar usuario con el accountId
  await db
    .update(user)
    .set({ accountId })
    .where(eq(user.id, userId));

  return accountId;
}

