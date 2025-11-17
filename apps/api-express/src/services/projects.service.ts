import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection.js';
import { sites } from '../db/schema.js';
import { AppError } from '../middleware/error.middleware.js';
import { parseWidgetConfig, serializeWidgetConfig, WidgetConfig } from '../utils/widget-config.js';

class ProjectsService {
  async findAll(accountId: string) {
    console.log('🟢 [PROJECTS SERVICE] Listando proyectos para cuenta:', accountId);

    const database = await db.connect();

    const accountSites = await database
      .select({
        id: sites.id,
        name: sites.name,
        appId: sites.appId,
        domain: sites.domain,
        widgetConfigJson: sites.widgetConfigJson,
        createdAt: sites.createdAt,
      })
      .from(sites)
      .where(eq(sites.accountId, accountId));

    // Procesar configuración del widget
    const processedSites = accountSites.map((site) => {
      const widgetConfig = parseWidgetConfig(site.widgetConfigJson);

      return {
        id: site.id,
        name: site.name,
        appId: site.appId,
        domain: site.domain,
        widgetConfig,
        createdAt: site.createdAt.toISOString(),
        widgetSnippet: `<script src="${process.env.WIDGET_CDN_URL || 'https://cdn.kunoro.com/widget.js'}" data-key="${site.appId}"></script>`,
      };
    });

    return {
      success: true,
      data: processedSites,
      total: processedSites.length,
    };
  }

  async create(accountId: string, body: { name: string; domain?: string }) {
    console.log('🟢 [PROJECTS SERVICE] Creando proyecto:', body.name);

    const database = await db.connect();

    // Generar appId único
    const appId = `app_${uuidv4()}`;
    const siteId = `site_${uuidv4()}`;

    await database.insert(sites).values({
      id: siteId,
      accountId,
      name: body.name,
      appId,
      domain: body.domain || null,
      widgetConfigJson: null,
    });

    const [newSite] = await database
      .select()
      .from(sites)
      .where(eq(sites.id, siteId))
      .limit(1);

    console.log('✅ [PROJECTS SERVICE] Proyecto creado:', appId);

    return {
      success: true,
      data: {
        id: newSite.id,
        name: newSite.name,
        appId: newSite.appId,
        domain: newSite.domain,
        widgetSnippet: `<script src="${process.env.WIDGET_CDN_URL || 'https://cdn.kunoro.com/widget.js'}" data-key="${newSite.appId}"></script>`,
      },
    };
  }

  async findOne(projectId: string, accountId: string) {
    console.log('🟢 [PROJECTS SERVICE] Obteniendo proyecto:', projectId);

    const database = await db.connect();

    const [site] = await database
      .select()
      .from(sites)
      .where(eq(sites.id, projectId))
      .limit(1);

    if (!site || site.accountId !== accountId) {
      throw new AppError(404, 'Proyecto no encontrado');
    }

    const widgetConfig = parseWidgetConfig(site.widgetConfigJson);

    return {
      success: true,
      data: {
        id: site.id,
        name: site.name,
        appId: site.appId,
        domain: site.domain,
        widgetConfig,
        createdAt: site.createdAt.toISOString(),
        widgetSnippet: `<script src="${process.env.WIDGET_CDN_URL || 'https://cdn.kunoro.com/widget.js'}" data-key="${site.appId}"></script>`,
      },
    };
  }

  async update(projectId: string, accountId: string, body: { name?: string; domain?: string }) {
    console.log('🟢 [PROJECTS SERVICE] Actualizando proyecto:', projectId);

    const database = await db.connect();

    const [site] = await database
      .select()
      .from(sites)
      .where(eq(sites.id, projectId))
      .limit(1);

    if (!site || site.accountId !== accountId) {
      throw new AppError(404, 'Proyecto no encontrado');
    }

    await database
      .update(sites)
      .set({
        ...(body.name && { name: body.name }),
        ...(body.domain !== undefined && { domain: body.domain }),
      })
      .where(eq(sites.id, projectId));

    const [updated] = await database
      .select()
      .from(sites)
      .where(eq(sites.id, projectId))
      .limit(1);

    console.log('✅ [PROJECTS SERVICE] Proyecto actualizado');

    return {
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        appId: updated.appId,
        domain: updated.domain,
        widgetConfig: parseWidgetConfig(updated.widgetConfigJson),
      },
    };
  }

  async remove(projectId: string, accountId: string) {
    console.log('🟢 [PROJECTS SERVICE] Eliminando proyecto:', projectId);

    const database = await db.connect();

    const [site] = await database
      .select()
      .from(sites)
      .where(eq(sites.id, projectId))
      .limit(1);

    if (!site || site.accountId !== accountId) {
      throw new AppError(404, 'Proyecto no encontrado');
    }

    await database.delete(sites).where(eq(sites.id, projectId));

    console.log('✅ [PROJECTS SERVICE] Proyecto eliminado');

    return { success: true, message: 'Proyecto eliminado' };
  }

  // Endpoint público para obtener widget config por appId
  async getWidgetConfig(appId: string) {
    console.log('🟢 [PROJECTS SERVICE] Obteniendo widget config para appId:', appId);

    const database = await db.connect();

    const [site] = await database
      .select()
      .from(sites)
      .where(eq(sites.appId, appId))
      .limit(1);

    if (!site) {
      return {
        appId,
        config: parseWidgetConfig(null),
      };
    }

    return {
      appId,
      config: parseWidgetConfig(site.widgetConfigJson),
    };
  }

  async updateWidgetConfig(projectId: string, accountId: string, config: WidgetConfig) {
    console.log('🟢 [PROJECTS SERVICE] Actualizando widget config para proyecto:', projectId);
    console.log('🟢 [PROJECTS SERVICE] Config recibido:', JSON.stringify(config));

    const database = await db.connect();

    console.log('🟢 [PROJECTS SERVICE] Buscando proyecto en DB...');
    const [site] = await database
      .select()
      .from(sites)
      .where(eq(sites.id, projectId))
      .limit(1);

    if (!site) {
      console.error('❌ [PROJECTS SERVICE] Proyecto no encontrado');
      throw new AppError(404, 'Proyecto no encontrado');
    }

    if (site.accountId !== accountId) {
      console.error('❌ [PROJECTS SERVICE] Cuenta no autorizada');
      throw new AppError(403, 'No autorizado para este proyecto');
    }

    console.log('🟢 [PROJECTS SERVICE] Proyecto encontrado, serializando config...');
    const widgetConfigJson = serializeWidgetConfig(config);
    console.log('🟢 [PROJECTS SERVICE] Config serializado:', widgetConfigJson);

    console.log('🟢 [PROJECTS SERVICE] Actualizando en DB...');
    const result = await database
      .update(sites)
      .set({ widgetConfigJson })
      .where(eq(sites.id, projectId));

    console.log('🟢 [PROJECTS SERVICE] Resultado del UPDATE:', result);

    const [updated] = await database
      .select()
      .from(sites)
      .where(eq(sites.id, projectId))
      .limit(1);

    console.log('✅ [PROJECTS SERVICE] Widget config actualizado exitosamente');
    console.log('✅ [PROJECTS SERVICE] Nuevo widgetConfigJson:', updated.widgetConfigJson);

    return {
      success: true,
      data: {
        appId: updated.appId,
        widgetConfig: parseWidgetConfig(updated.widgetConfigJson),
      },
    };
  }
}

export const projectsService = new ProjectsService();

