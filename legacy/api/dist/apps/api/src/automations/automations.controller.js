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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationsController = void 0;
const common_1 = require("@nestjs/common");
const automations_service_1 = require("./automations.service");
let AutomationsController = class AutomationsController {
    constructor(automationsService) {
        this.automationsService = automationsService;
    }
    async findAll() {
        return this.automationsService.findAll();
    }
    async create(body) {
        return this.automationsService.create(body);
    }
    async findOne(automationId) {
        return this.automationsService.findOne(automationId);
    }
    async update(automationId, body) {
        return this.automationsService.update(automationId, body);
    }
    async remove(automationId) {
        return this.automationsService.remove(automationId);
    }
};
exports.AutomationsController = AutomationsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutomationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AutomationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':automationId'),
    __param(0, (0, common_1.Param)('automationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AutomationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':automationId'),
    __param(0, (0, common_1.Param)('automationId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AutomationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':automationId'),
    __param(0, (0, common_1.Param)('automationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AutomationsController.prototype, "remove", null);
exports.AutomationsController = AutomationsController = __decorate([
    (0, common_1.Controller)('automations'),
    (0, common_1.UseGuards)(),
    __metadata("design:paramtypes", [automations_service_1.AutomationsService])
], AutomationsController);
//# sourceMappingURL=automations.controller.js.map