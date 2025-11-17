import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection.js';
import { accounts, user } from '../db/schema.js';
import { AppError } from '../middleware/error.middleware.js';

class WorkspacesService {
  async findAll(userId: string) {
    console.log('🟢 [WORKSPACES SERVICE] Obteniendo workspaces para usuario:', userId);

    const database = await db.connect();

    // Buscar usuario para obtener su accountId
    const [foundUser] = await database
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!foundUser || !foundUser.accountId) {
      return { data: [], total: 0 };
    }

    // Buscar workspace del usuario
    const [workspace] = await database
      .select()
      .from(accounts)
      .where(eq(accounts.id, foundUser.accountId))
      .limit(1);

    return {
      data: workspace ? [workspace] : [],
      total: workspace ? 1 : 0,
    };
  }

  async findOne(workspaceId: string, userId: string) {
    console.log('🟢 [WORKSPACES SERVICE] Obteniendo workspace:', workspaceId);

    const database = await db.connect();

    // Verificar que el usuario tenga acceso a este workspace
    const [foundUser] = await database
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!foundUser || foundUser.accountId !== workspaceId) {
      throw new AppError(404, 'Workspace no encontrado');
    }

    const [workspace] = await database
      .select()
      .from(accounts)
      .where(eq(accounts.id, workspaceId))
      .limit(1);

    if (!workspace) {
      throw new AppError(404, 'Workspace no encontrado');
    }

    return { data: workspace };
  }

  async update(workspaceId: string, userId: string, body: { name?: string; plan?: string }) {
    console.log('🟢 [WORKSPACES SERVICE] Actualizando workspace:', workspaceId);

    const database = await db.connect();

    // Verificar que el usuario tenga acceso
    const [foundUser] = await database
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!foundUser || foundUser.accountId !== workspaceId) {
      throw new AppError(404, 'Workspace no encontrado');
    }

    // Actualizar workspace
    await database
      .update(accounts)
      .set({
        ...(body.name && { name: body.name }),
        ...(body.plan && { plan: body.plan }),
      })
      .where(eq(accounts.id, workspaceId));

    // Obtener workspace actualizado
    const [updated] = await database
      .select()
      .from(accounts)
      .where(eq(accounts.id, workspaceId))
      .limit(1);

    console.log('✅ [WORKSPACES SERVICE] Workspace actualizado');

    return { data: updated };
  }
}

export const workspacesService = new WorkspacesService();

