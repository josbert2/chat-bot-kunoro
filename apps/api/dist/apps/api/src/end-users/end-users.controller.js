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
exports.EndUsersController = void 0;
const common_1 = require("@nestjs/common");
const end_users_service_1 = require("./end-users.service");
let EndUsersController = class EndUsersController {
    constructor(endUsersService) {
        this.endUsersService = endUsersService;
    }
    async findAll(query) {
        return this.endUsersService.findAll(query);
    }
    async findOne(endUserId) {
        return this.endUsersService.findOne(endUserId);
    }
    async update(endUserId, body) {
        return this.endUsersService.update(endUserId, body);
    }
};
exports.EndUsersController = EndUsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EndUsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':endUserId'),
    __param(0, (0, common_1.Param)('endUserId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EndUsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':endUserId'),
    __param(0, (0, common_1.Param)('endUserId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EndUsersController.prototype, "update", null);
exports.EndUsersController = EndUsersController = __decorate([
    (0, common_1.Controller)('end-users'),
    (0, common_1.UseGuards)(),
    __metadata("design:paramtypes", [typeof (_a = typeof end_users_service_1.EndUsersService !== "undefined" && end_users_service_1.EndUsersService) === "function" ? _a : Object])
], EndUsersController);
//# sourceMappingURL=end-users.controller.js.map