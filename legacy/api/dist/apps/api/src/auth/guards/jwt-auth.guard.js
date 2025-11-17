"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
let JwtAuthGuard = class JwtAuthGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new common_1.UnauthorizedException('Se requiere token de autenticación');
        }
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new common_1.UnauthorizedException('Formato de token inválido');
        }
        const token = parts[1];
        const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        try {
            const decoded = jwt.verify(token, secret);
            request.user = decoded.userId;
            request.accountId = decoded.accountId;
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Token inválido o expirado');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map