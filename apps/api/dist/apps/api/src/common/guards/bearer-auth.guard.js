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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BearerAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../config/database.service");
const schema_1 = require("../../../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
let BearerAuthGuard = class BearerAuthGuard {
    constructor(dbService) {
        this.dbService = dbService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new common_1.UnauthorizedException('Se requiere token Bearer en el header Authorization');
        }
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new common_1.UnauthorizedException('Formato de token inválido');
        }
        const token = parts[1];
        const validation = await this.validateBearerToken(token);
        if (!validation.success) {
            throw new common_1.UnauthorizedException(validation.success === false ? validation.error : 'Invalid token');
        }
        request.user = validation.context;
        return true;
    }
    async validateBearerToken(token) {
        try {
            const db = this.dbService.getDb();
            const result = await db
                .select({
                token: schema_1.apiTokens,
                account: schema_1.accounts,
                user: schema_1.user,
            })
                .from(schema_1.apiTokens)
                .innerJoin(schema_1.accounts, (0, drizzle_orm_1.eq)(schema_1.apiTokens.accountId, schema_1.accounts.id))
                .innerJoin(schema_1.user, (0, drizzle_orm_1.eq)(schema_1.apiTokens.userId, schema_1.user.id))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.apiTokens.token, token), (0, drizzle_orm_1.eq)(schema_1.apiTokens.isActive, true)))
                .limit(1);
            if (result.length === 0) {
                return { success: false, error: 'Token inválido o inactivo' };
            }
            const { token: tokenData, account, user: userData } = result[0];
            if (tokenData.expiresAt && tokenData.expiresAt < new Date()) {
                return { success: false, error: 'Token expirado' };
            }
            db.update(schema_1.apiTokens)
                .set({ lastUsedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema_1.apiTokens.id, tokenData.id))
                .then()
                .catch((err) => console.error('Error actualizando lastUsedAt:', err));
            let scopes = [];
            if (tokenData.scopes) {
                try {
                    scopes = JSON.parse(tokenData.scopes);
                }
                catch (e) {
                    console.error('Error parsing scopes:', e);
                }
            }
            return {
                success: true,
                context: {
                    token: {
                        id: tokenData.id,
                        name: tokenData.name,
                        accountId: tokenData.accountId,
                        userId: tokenData.userId,
                        scopes,
                    },
                    account: {
                        id: account.id,
                        name: account.name,
                        plan: account.plan,
                    },
                    user: {
                        id: userData.id,
                        name: userData.name,
                        email: userData.email,
                    },
                },
            };
        }
        catch (error) {
            console.error('Error validando token Bearer:', error);
            return { success: false, error: 'Error interno al validar token' };
        }
    }
};
exports.BearerAuthGuard = BearerAuthGuard;
exports.BearerAuthGuard = BearerAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object])
], BearerAuthGuard);
//# sourceMappingURL=bearer-auth.guard.js.map