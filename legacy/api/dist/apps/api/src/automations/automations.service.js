"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationsService = void 0;
const common_1 = require("@nestjs/common");
let AutomationsService = class AutomationsService {
    async findAll() {
        return { message: 'FindAll automations - to be implemented' };
    }
    async create(body) {
        return { message: 'Create automation - to be implemented' };
    }
    async findOne(automationId) {
        return { message: 'FindOne automation - to be implemented' };
    }
    async update(automationId, body) {
        return { message: 'Update automation - to be implemented' };
    }
    async remove(automationId) {
        return { message: 'Remove automation - to be implemented' };
    }
};
exports.AutomationsService = AutomationsService;
exports.AutomationsService = AutomationsService = __decorate([
    (0, common_1.Injectable)()
], AutomationsService);
//# sourceMappingURL=automations.service.js.map