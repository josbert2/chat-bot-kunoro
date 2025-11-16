"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotsService = void 0;
const common_1 = require("@nestjs/common");
let BotsService = class BotsService {
    async findAll() {
        return { message: 'FindAll bots - to be implemented' };
    }
    async create(body) {
        return { message: 'Create bot - to be implemented' };
    }
    async findOne(botId) {
        return { message: 'FindOne bot - to be implemented' };
    }
    async update(botId, body) {
        return { message: 'Update bot - to be implemented' };
    }
    async remove(botId) {
        return { message: 'Remove bot - to be implemented' };
    }
    async getFlow(botId) {
        return { message: 'GetFlow - to be implemented' };
    }
    async updateFlow(botId, body) {
        return { message: 'UpdateFlow - to be implemented' };
    }
};
exports.BotsService = BotsService;
exports.BotsService = BotsService = __decorate([
    (0, common_1.Injectable)()
], BotsService);
//# sourceMappingURL=bots.service.js.map