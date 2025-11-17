"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndUsersModule = void 0;
const common_1 = require("@nestjs/common");
const end_users_controller_1 = require("./end-users.controller");
const end_users_service_1 = require("./end-users.service");
let EndUsersModule = class EndUsersModule {
};
exports.EndUsersModule = EndUsersModule;
exports.EndUsersModule = EndUsersModule = __decorate([
    (0, common_1.Module)({
        controllers: [end_users_controller_1.EndUsersController],
        providers: [end_users_service_1.EndUsersService],
        exports: [end_users_service_1.EndUsersService],
    })
], EndUsersModule);
//# sourceMappingURL=end-users.module.js.map