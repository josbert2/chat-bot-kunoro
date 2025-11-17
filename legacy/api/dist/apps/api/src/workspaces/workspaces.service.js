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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspacesService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../config/database.service");
const schema_1 = require("../../../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const uuid_1 = require("uuid");
let WorkspacesService = class WorkspacesService {
    constructor(dbService) {
        this.dbService = dbService;
    }
    async findAll(userId) {
        const db = this.dbService.getDb();
        const [foundUser] = await db
            .select()
            .from(schema_1.user)
            .where((0, drizzle_orm_1.eq)(schema_1.user.id, userId))
            .limit(1);
        if (!foundUser || !foundUser.accountId) {
            return { data: [], total: 0 };
        }
        const [workspace] = await db
            .select()
            .from(schema_1.accounts)
            .where((0, drizzle_orm_1.eq)(schema_1.accounts.id, foundUser.accountId))
            .limit(1);
        return {
            data: workspace ? [workspace] : [],
            total: workspace ? 1 : 0,
        };
    }
    async create(userId, body) {
        const db = this.dbService.getDb();
        const accountId = (0, uuid_1.v4)();
        await db.insert(schema_1.accounts).values({
            id: accountId,
            name: body.name,
            plan: 'free',
        });
        const [newWorkspace] = await db
            .select()
            .from(schema_1.accounts)
            .where((0, drizzle_orm_1.eq)(schema_1.accounts.id, accountId))
            .limit(1);
        await db.update(schema_1.user).set({ accountId }).where((0, drizzle_orm_1.eq)(schema_1.user.id, userId));
        return {
            success: true,
            data: newWorkspace,
        };
    }
    async findOne(workspaceId, userId) {
        const db = this.dbService.getDb();
        const [foundUser] = await db
            .select()
            .from(schema_1.user)
            .where((0, drizzle_orm_1.eq)(schema_1.user.id, userId))
            .limit(1);
        if (!foundUser || foundUser.accountId !== workspaceId) {
            throw new common_1.NotFoundException('Workspace not found');
        }
        const [workspace] = await db
            .select()
            .from(schema_1.accounts)
            .where((0, drizzle_orm_1.eq)(schema_1.accounts.id, workspaceId))
            .limit(1);
        if (!workspace) {
            throw new common_1.NotFoundException('Workspace not found');
        }
        return {
            success: true,
            data: workspace,
        };
    }
    async update(workspaceId, userId, body) {
        const db = this.dbService.getDb();
        await this.findOne(workspaceId, userId);
        const updateData = {};
        if (body.name)
            updateData.name = body.name;
        if (body.plan)
            updateData.plan = body.plan;
        await db
            .update(schema_1.accounts)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema_1.accounts.id, workspaceId));
        const [updated] = await db
            .select()
            .from(schema_1.accounts)
            .where((0, drizzle_orm_1.eq)(schema_1.accounts.id, workspaceId))
            .limit(1);
        return {
            success: true,
            data: updated,
        };
    }
    async remove(workspaceId, userId) {
        const db = this.dbService.getDb();
        await this.findOne(workspaceId, userId);
        await db.delete(schema_1.accounts).where((0, drizzle_orm_1.eq)(schema_1.accounts.id, workspaceId));
        return {
            success: true,
            message: 'Workspace deleted successfully',
        };
    }
};
exports.WorkspacesService = WorkspacesService;
exports.WorkspacesService = WorkspacesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], WorkspacesService);
//# sourceMappingURL=workspaces.service.js.map