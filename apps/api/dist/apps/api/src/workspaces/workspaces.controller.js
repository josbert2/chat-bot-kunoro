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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspacesController = void 0;
const common_1 = require("@nestjs/common");
const workspaces_service_1 = require("./workspaces.service");
const bearer_auth_guard_1 = require("../common/guards/bearer-auth.guard");
const bearer_auth_decorator_1 = require("../common/decorators/bearer-auth.decorator");
let WorkspacesController = class WorkspacesController {
    constructor(workspacesService) {
        this.workspacesService = workspacesService;
    }
    async findAll(auth) {
        return this.workspacesService.findAll(auth.user.id);
    }
    async create(auth, body) {
        return this.workspacesService.create(auth.user.id, body);
    }
    async findOne(auth, workspaceId) {
        return this.workspacesService.findOne(workspaceId, auth.user.id);
    }
    async update(auth, workspaceId, body) {
        return this.workspacesService.update(workspaceId, auth.user.id, body);
    }
    async remove(auth, workspaceId) {
        return this.workspacesService.remove(workspaceId, auth.user.id);
    }
};
exports.WorkspacesController = WorkspacesController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(bearer_auth_guard_1.BearerAuthGuard),
    __param(0, (0, bearer_auth_decorator_1.BearerAuth)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof bearer_auth_decorator_1.AuthContext !== "undefined" && bearer_auth_decorator_1.AuthContext) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(bearer_auth_guard_1.BearerAuthGuard),
    __param(0, (0, bearer_auth_decorator_1.BearerAuth)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof bearer_auth_decorator_1.AuthContext !== "undefined" && bearer_auth_decorator_1.AuthContext) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':workspaceId'),
    (0, common_1.UseGuards)(bearer_auth_guard_1.BearerAuthGuard),
    __param(0, (0, bearer_auth_decorator_1.BearerAuth)()),
    __param(1, (0, common_1.Param)('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof bearer_auth_decorator_1.AuthContext !== "undefined" && bearer_auth_decorator_1.AuthContext) === "function" ? _d : Object, String]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':workspaceId'),
    (0, common_1.UseGuards)(bearer_auth_guard_1.BearerAuthGuard),
    __param(0, (0, bearer_auth_decorator_1.BearerAuth)()),
    __param(1, (0, common_1.Param)('workspaceId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof bearer_auth_decorator_1.AuthContext !== "undefined" && bearer_auth_decorator_1.AuthContext) === "function" ? _e : Object, String, Object]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':workspaceId'),
    (0, common_1.UseGuards)(bearer_auth_guard_1.BearerAuthGuard),
    __param(0, (0, bearer_auth_decorator_1.BearerAuth)()),
    __param(1, (0, common_1.Param)('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof bearer_auth_decorator_1.AuthContext !== "undefined" && bearer_auth_decorator_1.AuthContext) === "function" ? _f : Object, String]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "remove", null);
exports.WorkspacesController = WorkspacesController = __decorate([
    (0, common_1.Controller)('workspaces'),
    __metadata("design:paramtypes", [typeof (_a = typeof workspaces_service_1.WorkspacesService !== "undefined" && workspaces_service_1.WorkspacesService) === "function" ? _a : Object])
], WorkspacesController);
//# sourceMappingURL=workspaces.controller.js.map