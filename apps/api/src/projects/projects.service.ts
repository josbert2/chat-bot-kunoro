import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../config/database.service';
import { sites, accounts } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { parseWidgetConfig, serializeWidgetConfig, WidgetConfig } from '@saas-chat/core-types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProjectsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(accountId: string) {
    const db = this.dbService.getDb();

    const accountSites = await db
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
    const db = this.dbService.getDb();

    // Generar appId único
    const appId = `app_${uuidv4()}`;

    const siteId = `site_${uuidv4()}`;
    await db
      .insert(sites)
      .values({
        id: siteId,
        accountId,
        name: body.name,
        appId,
        domain: body.domain || null,
        widgetConfigJson: null,
      });

    const [newSite] = await db
      .select()
      .from(sites)
      .where(eq(sites.id, siteId))
      .limit(1);

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
    const db = this.dbService.getDb();

    const [site] = await db
      .select()
      .from(sites)
      .where(eq(sites.id, projectId))
      .limit(1);

    if (!site || site.accountId !== accountId) {
      throw new NotFoundException('Project not found');
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
      },
    };
  }

  async findByAppId(appId: string) {
    const db = this.dbService.getDb();

    const [site] = await db
      .select()
      .from(sites)
      .where(eq(sites.appId, appId))
      .limit(1);

    if (!site) {
      return null;
    }

    const widgetConfig = parseWidgetConfig(site.widgetConfigJson);

    return {
      appId,
      site: {
        id: site.id,
        name: site.name,
        domain: site.domain,
      },
      config: widgetConfig,
    };
  }

  async update(projectId: string, accountId: string, body: any) {
    const db = this.dbService.getDb();

    // Verificar que el proyecto existe y pertenece a la cuenta
    const [site] = await db
      .select()
      .from(sites)
      .where(eq(sites.id, projectId))
      .limit(1);

    if (!site || site.accountId !== accountId) {
      throw new NotFoundException('Project not found');
    }

    const updateData: any = {};
    if (body.name) updateData.name = body.name;
    if (body.domain !== undefined) updateData.domain = body.domain;

    await db
      .update(sites)
      .set(updateData)
      .where(eq(sites.id, projectId));

    const [updated] = await db
      .select()
      .from(sites)
      .where(eq(sites.id, projectId))
      .limit(1);

    return {
      success: true,
      data: updated,
    };
  }

  async remove(projectId: string, accountId: string) {
    const db = this.dbService.getDb();

    // Verificar que el proyecto existe y pertenece a la cuenta
    const [site] = await db
      .select()
      .from(sites)
      .where(eq(sites.id, projectId))
      .limit(1);

    if (!site || site.accountId !== accountId) {
      throw new NotFoundException('Project not found');
    }

    await db.delete(sites).where(eq(sites.id, projectId));

    return {
      success: true,
      message: 'Project deleted successfully',
    };
  }

  async getWidgetConfig(appId: string) {
    const result = await this.findByAppId(appId);
    
    if (!result) {
      return {
        appId,
        config: parseWidgetConfig(null),
      };
    }

    return result;
  }

  async updateWidgetConfig(projectId: string, accountId: string, config: WidgetConfig) {
    const db = this.dbService.getDb();

    // Verificar que el proyecto existe y pertenece a la cuenta
    const [site] = await db
      .select()
      .from(sites)
      .where(eq(sites.id, projectId))
      .limit(1);

    if (!site || site.accountId !== accountId) {
      throw new NotFoundException('Project not found');
    }

    const widgetConfigJson = serializeWidgetConfig(config);

    await db
      .update(sites)
      .set({ widgetConfigJson })
      .where(eq(sites.id, projectId));

    const [updated] = await db
      .select()
      .from(sites)
      .where(eq(sites.id, projectId))
      .limit(1);

    return {
      success: true,
      data: {
        id: updated.id,
        widgetConfig: parseWidgetConfig(updated.widgetConfigJson),
      },
    };
  }
}

