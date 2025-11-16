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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const projects_service_1 = require("./projects.service");
const bearer_auth_decorator_1 = require("../common/decorators/bearer-auth.decorator");
const bearer_auth_guard_1 = require("../common/guards/bearer-auth.guard");
const common_2 = require("@nestjs/common");
const core_types_1 = require("@saas-chat/core-types");
let ProjectsController = class ProjectsController {
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    async findAll(auth) {
        return this.projectsService.findAll(auth.account.id);
    }
    async create(auth, body) {
        return this.projectsService.create(auth.account.id, body);
    }
    async getWidgetConfigByAppId(appId) {
        return this.projectsService.getWidgetConfig(appId);
    }
    async findOne(auth, projectId) {
        return this.projectsService.findOne(projectId, auth.account.id);
    }
    async update(auth, projectId, body) {
        return this.projectsService.update(projectId, auth.account.id, body);
    }
    async remove(auth, projectId) {
        return this.projectsService.remove(projectId, auth.account.id);
    }
    async getWidgetConfig(auth, projectId) {
        const site = await this.projectsService.findOne(projectId, auth.account.id);
        return {
            appId: site.data.appId,
            config: site.data.widgetConfig,
        };
    }
    async updateWidgetConfig(auth, projectId, body) {
        return this.projectsService.updateWidgetConfig(projectId, auth.account.id, body);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_2.UseGuards)(bearer_auth_guard_1.BearerAuthGuard),
    __param(0, (0, bearer_auth_decorator_1.BearerAuth)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof bearer_auth_guard_1.AuthContext !== "undefined" && bearer_auth_guard_1.AuthContext) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_2.UseGuards)(bearer_auth_guard_1.BearerAuthGuard),
    __param(0, (0, bearer_auth_decorator_1.BearerAuth)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof bearer_auth_guard_1.AuthContext !== "undefined" && bearer_auth_guard_1.AuthContext) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('widget/config'),
    __param(0, (0, common_1.Query)('appId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getWidgetConfigByAppId", null);
__decorate([
    (0, common_1.Get)(':projectId'),
    (0, common_2.UseGuards)(bearer_auth_guard_1.BearerAuthGuard),
    __param(0, (0, bearer_auth_decorator_1.BearerAuth)()),
    __param(1, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof bearer_auth_guard_1.AuthContext !== "undefined" && bearer_auth_guard_1.AuthContext) === "function" ? _d : Object, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':projectId'),
    (0, common_2.UseGuards)(bearer_auth_guard_1.BearerAuthGuard),
    __param(0, (0, bearer_auth_decorator_1.BearerAuth)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof bearer_auth_guard_1.AuthContext !== "undefined" && bearer_auth_guard_1.AuthContext) === "function" ? _e : Object, String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':projectId'),
    (0, common_2.UseGuards)(bearer_auth_guard_1.BearerAuthGuard),
    __param(0, (0, bearer_auth_decorator_1.BearerAuth)()),
    __param(1, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof bearer_auth_guard_1.AuthContext !== "undefined" && bearer_auth_guard_1.AuthContext) === "function" ? _f : Object, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':projectId/widget'),
    (0, common_2.UseGuards)(bearer_auth_guard_1.BearerAuthGuard),
    __param(0, (0, bearer_auth_decorator_1.BearerAuth)()),
    __param(1, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof bearer_auth_guard_1.AuthContext !== "undefined" && bearer_auth_guard_1.AuthContext) === "function" ? _g : Object, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getWidgetConfig", null);
__decorate([
    (0, common_1.Patch)(':projectId/widget'),
    (0, common_2.UseGuards)(bearer_auth_guard_1.BearerAuthGuard),
    __param(0, (0, bearer_auth_decorator_1.BearerAuth)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof bearer_auth_guard_1.AuthContext !== "undefined" && bearer_auth_guard_1.AuthContext) === "function" ? _h : Object, String, typeof (_j = typeof core_types_1.WidgetConfig !== "undefined" && core_types_1.WidgetConfig) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "updateWidgetConfig", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, common_1.Controller)('projects'),
    __metadata("design:paramtypes", [typeof (_a = typeof projects_service_1.ProjectsService !== "undefined" && projects_service_1.ProjectsService) === "function" ? _a : Object])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map