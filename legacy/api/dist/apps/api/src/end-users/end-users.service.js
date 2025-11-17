"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndUsersService = void 0;
const common_1 = require("@nestjs/common");
let EndUsersService = class EndUsersService {
    async findAll(query) {
        return { message: 'FindAll end-users - to be implemented' };
    }
    async findOne(endUserId) {
        return { message: 'FindOne end-user - to be implemented' };
    }
    async update(endUserId, body) {
        return { message: 'Update end-user - to be implemented' };
    }
};
exports.EndUsersService = EndUsersService;
exports.EndUsersService = EndUsersService = __decorate([
    (0, common_1.Injectable)()
], EndUsersService);
//# sourceMappingURL=end-users.service.js.map