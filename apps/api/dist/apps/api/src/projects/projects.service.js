"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../config/database.service");
const schema_1 = require("../../../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const core_types_1 = require("@saas-chat/core-types");
const uuid_1 = require("uuid");
let ProjectsService = class ProjectsService {
    constructor(dbService) {
        this.dbService = dbService;
    }
    async findAll(accountId) {
        const db = this.dbService.getDb();
        const accountSites = await db
            .select({
            id: schema_1.sites.id,
            name: schema_1.sites.name,
            appId: schema_1.sites.appId,
            domain: schema_1.sites.domain,
            widgetConfigJson: schema_1.sites.widgetConfigJson,
            createdAt: schema_1.sites.createdAt,
        })
            .from(schema_1.sites)
            .where((0, drizzle_orm_1.eq)(schema_1.sites.accountId, accountId));
        const processedSites = accountSites.map((site) => {
            const widgetConfig = (0, core_types_1.parseWidgetConfig)(site.widgetConfigJson);
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
    async create(accountId, body) {
        const db = this.dbService.getDb();
        const appId = `app_${(0, uuid_1.v4)()}`;
        const siteId = `site_${(0, uuid_1.v4)()}`;
        await db
            .insert(schema_1.sites)
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
            .from(schema_1.sites)
            .where((0, drizzle_orm_1.eq)(schema_1.sites.id, siteId))
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
    async findOne(projectId, accountId) {
        const db = this.dbService.getDb();
        const [site] = await db
            .select()
            .from(schema_1.sites)
            .where((0, drizzle_orm_1.eq)(schema_1.sites.id, projectId))
            .limit(1);
        if (!site || site.accountId !== accountId) {
            throw new common_1.NotFoundException('Project not found');
        }
        const widgetConfig = (0, core_types_1.parseWidgetConfig)(site.widgetConfigJson);
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
    async findByAppId(appId) {
        const db = this.dbService.getDb();
        const [site] = await db
            .select()
            .from(schema_1.sites)
            .where((0, drizzle_orm_1.eq)(schema_1.sites.appId, appId))
            .limit(1);
        if (!site) {
            return null;
        }
        const widgetConfig = (0, core_types_1.parseWidgetConfig)(site.widgetConfigJson);
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
    async update(projectId, accountId, body) {
        const db = this.dbService.getDb();
        const [site] = await db
            .select()
            .from(schema_1.sites)
            .where((0, drizzle_orm_1.eq)(schema_1.sites.id, projectId))
            .limit(1);
        if (!site || site.accountId !== accountId) {
            throw new common_1.NotFoundException('Project not found');
        }
        const updateData = {};
        if (body.name)
            updateData.name = body.name;
        if (body.domain !== undefined)
            updateData.domain = body.domain;
        await db
            .update(schema_1.sites)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.sites.id, projectId));
        const [updated] = await db
            .select()
            .from(schema_1.sites)
            .where((0, drizzle_orm_1.eq)(schema_1.sites.id, projectId))
            .limit(1);
        return {
            success: true,
            data: updated,
        };
    }
    async remove(projectId, accountId) {
        const db = this.dbService.getDb();
        const [site] = await db
            .select()
            .from(schema_1.sites)
            .where((0, drizzle_orm_1.eq)(schema_1.sites.id, projectId))
            .limit(1);
        if (!site || site.accountId !== accountId) {
            throw new common_1.NotFoundException('Project not found');
        }
        await db.delete(schema_1.sites).where((0, drizzle_orm_1.eq)(schema_1.sites.id, projectId));
        return {
            success: true,
            message: 'Project deleted successfully',
        };
    }
    async getWidgetConfig(appId) {
        const result = await this.findByAppId(appId);
        if (!result) {
            return {
                appId,
                config: (0, core_types_1.parseWidgetConfig)(null),
            };
        }
        return result;
    }
    async updateWidgetConfig(projectId, accountId, config) {
        const db = this.dbService.getDb();
        const [site] = await db
            .select()
            .from(schema_1.sites)
            .where((0, drizzle_orm_1.eq)(schema_1.sites.id, projectId))
            .limit(1);
        if (!site || site.accountId !== accountId) {
            throw new common_1.NotFoundException('Project not found');
        }
        const widgetConfigJson = (0, core_types_1.serializeWidgetConfig)(config);
        await db
            .update(schema_1.sites)
            .set({ widgetConfigJson })
            .where((0, drizzle_orm_1.eq)(schema_1.sites.id, projectId));
        const [updated] = await db
            .select()
            .from(schema_1.sites)
            .where((0, drizzle_orm_1.eq)(schema_1.sites.id, projectId))
            .limit(1);
        return {
            success: true,
            data: {
                id: updated.id,
                widgetConfig: (0, core_types_1.parseWidgetConfig)(updated.widgetConfigJson),
            },
        };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map