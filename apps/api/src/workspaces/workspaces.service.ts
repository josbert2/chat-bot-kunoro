import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../config/database.service';
import { accounts, user } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WorkspacesService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(userId: string) {
    const db = this.dbService.getDb();

    // Buscar usuario para obtener su accountId
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!foundUser || !foundUser.accountId) {
      return { data: [], total: 0 };
    }

    // Buscar todos los workspaces del usuario (por ahora solo el suyo)
    const [workspace] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, foundUser.accountId))
      .limit(1);

    return {
      data: workspace ? [workspace] : [],
      total: workspace ? 1 : 0,
    };
  }

  async create(userId: string, body: { name: string }) {
    const db = this.dbService.getDb();

    const accountId = uuidv4();
    await db.insert(accounts).values({
      id: accountId,
      name: body.name,
      plan: 'free',
    });

    const [newWorkspace] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, accountId))
      .limit(1);

    // Actualizar usuario con nuevo accountId
    await db.update(user).set({ accountId }).where(eq(user.id, userId));

    return {
      success: true,
      data: newWorkspace,
    };
  }

  async findOne(workspaceId: string, userId: string) {
    const db = this.dbService.getDb();

    // Verificar que el usuario tiene acceso a este workspace
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!foundUser || foundUser.accountId !== workspaceId) {
      throw new NotFoundException('Workspace not found');
    }

    const [workspace] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, workspaceId))
      .limit(1);

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return {
      success: true,
      data: workspace,
    };
  }

  async update(workspaceId: string, userId: string, body: any) {
    const db = this.dbService.getDb();

    // Verificar acceso
    await this.findOne(workspaceId, userId);

    const updateData: any = {};
    if (body.name) updateData.name = body.name;
    if (body.plan) updateData.plan = body.plan;

    await db
      .update(accounts)
      .set(updateData)
      .where(eq(accounts.id, workspaceId));

    const [updated] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, workspaceId))
      .limit(1);

    return {
      success: true,
      data: updated,
    };
  }

  async remove(workspaceId: string, userId: string) {
    const db = this.dbService.getDb();

    // Verificar acceso
    await this.findOne(workspaceId, userId);

    await db.delete(accounts).where(eq(accounts.id, workspaceId));

    return {
      success: true,
      message: 'Workspace deleted successfully',
    };
  }
}

