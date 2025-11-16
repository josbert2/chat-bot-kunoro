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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid_1 = require("uuid");
const database_service_1 = require("../config/database.service");
const schema_1 = require("../../../../db/schema");
let AuthService = class AuthService {
    constructor(dbService) {
        this.dbService = dbService;
    }
    async register(body) {
        console.log('🟢 [AUTH SERVICE] Iniciando registro:', {
            name: body.name,
            email: body.email,
            hasPassword: !!body.password,
            passwordLength: body.password?.length || 0,
        });
        const db = this.dbService.getDb();
        if (!body.password || body.password.length < 8) {
            console.error('❌ [AUTH SERVICE] Contraseña inválida:', {
                hasPassword: !!body.password,
                length: body.password?.length || 0,
            });
            throw new common_1.BadRequestException("La contraseña debe tener al menos 8 caracteres");
        }
        console.log('🟢 [AUTH SERVICE] Verificando si el email ya existe...');
        const [existingUser] = await db
            .select()
            .from(schema_1.user)
            .where((0, drizzle_orm_1.eq)(schema_1.user.email, body.email))
            .limit(1);
        if (existingUser) {
            console.error('❌ [AUTH SERVICE] Email ya registrado:', body.email);
            throw new common_1.BadRequestException("El email ya está registrado");
        }
        console.log('🟢 [AUTH SERVICE] Email disponible, creando usuario...');
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const userId = (0, uuid_1.v4)();
        const workspaceId = (0, uuid_1.v4)();
        console.log('🟢 [AUTH SERVICE] IDs generados:', { userId, workspaceId });
        try {
            console.log('🟢 [AUTH SERVICE] Insertando usuario...');
            await db.insert(schema_1.user).values({
                id: userId,
                name: body.name,
                email: body.email,
                emailVerified: false,
            });
            console.log('✅ [AUTH SERVICE] Usuario insertado correctamente');
            console.log('🟢 [AUTH SERVICE] Insertando workspace...');
            await db.insert(schema_1.accounts).values({
                id: workspaceId,
                name: body.name || "Mi workspace",
                plan: "free",
            });
            console.log('✅ [AUTH SERVICE] Workspace insertado correctamente');
            console.log('🟢 [AUTH SERVICE] Actualizando accountId del usuario...');
            await db
                .update(schema_1.user)
                .set({ accountId: workspaceId })
                .where((0, drizzle_orm_1.eq)(schema_1.user.id, userId));
            console.log('✅ [AUTH SERVICE] AccountId actualizado correctamente');
            console.log('🟢 [AUTH SERVICE] Insertando account (credenciales)...');
            await db.insert(schema_1.account).values({
                id: (0, uuid_1.v4)(),
                accountId: "email",
                providerId: body.email,
                userId,
                password: hashedPassword,
            });
            console.log('✅ [AUTH SERVICE] Account insertado correctamente');
            console.log('🟢 [AUTH SERVICE] Generando token JWT...');
            const token = this.generateToken({
                userId,
                accountId: workspaceId,
                email: body.email,
            });
            console.log('✅ [AUTH SERVICE] Token generado correctamente');
            console.log('✅ [AUTH SERVICE] Registro completado exitosamente para:', body.email);
            return {
                token,
                user: {
                    id: userId,
                    name: body.name,
                    email: body.email,
                },
                workspace: {
                    id: workspaceId,
                    name: body.name || "Mi workspace",
                    plan: "free",
                },
            };
        }
        catch (error) {
            console.error('❌ [AUTH SERVICE] Error durante el registro:', error);
            console.error('❌ [AUTH SERVICE] Detalles del error:', {
                name: error?.name,
                message: error?.message,
                stack: error?.stack,
            });
            throw new common_1.InternalServerErrorException('Error al crear la cuenta. Por favor intenta de nuevo.');
        }
    }
    async login(body) {
        console.log('🟢 [AUTH SERVICE] Iniciando login:', {
            email: body.email,
            hasPassword: !!body.password,
        });
        const db = this.dbService.getDb();
        console.log('🟢 [AUTH SERVICE] Buscando usuario por email...');
        const [foundUser] = await db
            .select()
            .from(schema_1.user)
            .where((0, drizzle_orm_1.eq)(schema_1.user.email, body.email))
            .limit(1);
        if (!foundUser) {
            console.error('❌ [AUTH SERVICE] Usuario no encontrado:', body.email);
            throw new common_1.UnauthorizedException("Credenciales inválidas");
        }
        console.log('🟢 [AUTH SERVICE] Usuario encontrado, buscando credenciales...');
        const [accountRecord] = await db
            .select()
            .from(schema_1.account)
            .where((0, drizzle_orm_1.eq)(schema_1.account.userId, foundUser.id))
            .limit(1);
        if (!accountRecord || !accountRecord.password || typeof accountRecord.password !== "string") {
            console.error('❌ [AUTH SERVICE] Credenciales no encontradas o inválidas para usuario:', foundUser.id);
            throw new common_1.UnauthorizedException("Credenciales inválidas");
        }
        console.log('🟢 [AUTH SERVICE] Verificando contraseña...');
        const isPasswordValid = await bcrypt.compare(body.password, accountRecord.password);
        if (!isPasswordValid) {
            console.error('❌ [AUTH SERVICE] Contraseña incorrecta para:', body.email);
            throw new common_1.UnauthorizedException("Credenciales inválidas");
        }
        console.log('✅ [AUTH SERVICE] Contraseña válida, verificando workspace...');
        if (!foundUser.accountId) {
            console.error('❌ [AUTH SERVICE] Usuario sin accountId:', foundUser.id);
            throw new common_1.UnauthorizedException("Workspace no encontrado para este usuario");
        }
        const [workspace] = await db
            .select()
            .from(schema_1.accounts)
            .where((0, drizzle_orm_1.eq)(schema_1.accounts.id, foundUser.accountId))
            .limit(1);
        if (!workspace) {
            console.error('❌ [AUTH SERVICE] Workspace no encontrado:', foundUser.accountId);
            throw new common_1.UnauthorizedException("Workspace no encontrado para este usuario");
        }
        console.log('🟢 [AUTH SERVICE] Generando token...');
        const token = this.generateToken({
            userId: foundUser.id,
            accountId: workspace.id,
            email: foundUser.email,
        });
        console.log('✅ [AUTH SERVICE] Login exitoso para:', body.email);
        return {
            token,
            user: {
                id: foundUser.id,
                name: foundUser.name,
                email: foundUser.email,
            },
            workspace,
        };
    }
    async refresh(refreshToken) {
        throw new common_1.BadRequestException("Refresh tokens no implementados aún");
    }
    async getMe(userId) {
        const db = this.dbService.getDb();
        const [foundUser] = await db
            .select()
            .from(schema_1.user)
            .where((0, drizzle_orm_1.eq)(schema_1.user.id, userId))
            .limit(1);
        if (!foundUser) {
            throw new common_1.UnauthorizedException("Usuario no encontrado");
        }
        const [workspace] = await db
            .select()
            .from(schema_1.accounts)
            .where((0, drizzle_orm_1.eq)(schema_1.accounts.id, foundUser.accountId || ""))
            .limit(1);
        return {
            user: {
                id: foundUser.id,
                name: foundUser.name,
                email: foundUser.email,
            },
            workspace: workspace || null,
        };
    }
    generateToken(payload) {
        const secret = process.env.JWT_SECRET || "your-secret-key-change-me";
        if (!secret || secret === "your-secret-key") {
            throw new common_1.InternalServerErrorException("JWT_SECRET no configurado");
        }
        const expiresInValue = process.env.JWT_EXPIRES_IN || "7d";
        return jwt.sign(payload, secret, {
            expiresIn: expiresInValue,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map