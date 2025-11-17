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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsController = void 0;
const common_1 = require("@nestjs/common");
const channels_service_1 = require("./channels.service");
let ChannelsController = class ChannelsController {
    constructor(channelsService) {
        this.channelsService = channelsService;
    }
    async findAll() {
        return this.channelsService.findAll();
    }
    async create(body) {
        return this.channelsService.create(body);
    }
    async findOne(channelId) {
        return this.channelsService.findOne(channelId);
    }
    async update(channelId, body) {
        return this.channelsService.update(channelId, body);
    }
    async remove(channelId) {
        return this.channelsService.remove(channelId);
    }
};
exports.ChannelsController = ChannelsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':channelId'),
    __param(0, (0, common_1.Param)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':channelId'),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':channelId'),
    __param(0, (0, common_1.Param)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "remove", null);
exports.ChannelsController = ChannelsController = __decorate([
    (0, common_1.Controller)('channels'),
    (0, common_1.UseGuards)(),
    __metadata("design:paramtypes", [typeof (_a = typeof channels_service_1.ChannelsService !== "undefined" && channels_service_1.ChannelsService) === "function" ? _a : Object])
], ChannelsController);
//# sourceMappingURL=channels.controller.js.map