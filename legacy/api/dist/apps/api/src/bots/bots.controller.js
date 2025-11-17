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
exports.BotsController = void 0;
const common_1 = require("@nestjs/common");
const bots_service_1 = require("./bots.service");
let BotsController = class BotsController {
    constructor(botsService) {
        this.botsService = botsService;
    }
    async findAll() {
        return this.botsService.findAll();
    }
    async create(body) {
        return this.botsService.create(body);
    }
    async findOne(botId) {
        return this.botsService.findOne(botId);
    }
    async update(botId, body) {
        return this.botsService.update(botId, body);
    }
    async remove(botId) {
        return this.botsService.remove(botId);
    }
    async getFlow(botId) {
        return this.botsService.getFlow(botId);
    }
    async updateFlow(botId, body) {
        return this.botsService.updateFlow(botId, body);
    }
};
exports.BotsController = BotsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BotsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':botId'),
    __param(0, (0, common_1.Param)('botId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BotsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':botId'),
    __param(0, (0, common_1.Param)('botId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BotsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':botId'),
    __param(0, (0, common_1.Param)('botId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BotsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':botId/flow'),
    __param(0, (0, common_1.Param)('botId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BotsController.prototype, "getFlow", null);
__decorate([
    (0, common_1.Post)(':botId/flow'),
    __param(0, (0, common_1.Param)('botId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BotsController.prototype, "updateFlow", null);
exports.BotsController = BotsController = __decorate([
    (0, common_1.Controller)('bots'),
    (0, common_1.UseGuards)(),
    __metadata("design:paramtypes", [bots_service_1.BotsService])
], BotsController);
//# sourceMappingURL=bots.controller.js.map