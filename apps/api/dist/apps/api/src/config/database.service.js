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
var DatabaseService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const mysql2_1 = require("drizzle-orm/mysql2");
const promise_1 = require("mysql2/promise");
const schema = require("../../../../db/schema");
const config_service_1 = require("./config.service");
let DatabaseService = DatabaseService_1 = class DatabaseService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(DatabaseService_1.name);
    }
    async onModuleInit() {
        try {
            this.connection = promise_1.default.createPool({
                host: process.env.DATABASE_HOST || '127.0.0.1',
                port: parseInt(process.env.DATABASE_PORT || '3530'),
                user: process.env.DATABASE_USER || 'chatbot',
                password: process.env.DATABASE_PASSWORD || 'chatbot_pw',
                database: process.env.DATABASE_NAME || 'chatbot',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
            });
            this.db = (0, mysql2_1.drizzle)(this.connection, { schema, mode: 'default' });
            await this.testConnection();
            this.logger.log('✅ Database connection successful');
        }
        catch (error) {
            this.logger.error('❌ Database connection failed:', error);
            this.logger.warn('⚠️  El servidor continuará pero algunas funciones pueden no estar disponibles');
        }
    }
    async onModuleDestroy() {
        if (this.connection) {
            await this.connection.end();
            this.logger.log('Database connection closed');
        }
    }
    getDb() {
        if (!this.db) {
            throw new Error('Database no está conectada. Verifica la configuración de la base de datos.');
        }
        return this.db;
    }
    getConnection() {
        return this.connection;
    }
    async testConnection() {
        try {
            const [rows] = await this.connection.query('SELECT 1');
            return true;
        }
        catch (error) {
            this.logger.error('Database test query failed:', error);
            throw error;
        }
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = DatabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_service_1.ConfigService !== "undefined" && config_service_1.ConfigService) === "function" ? _a : Object])
], DatabaseService);
//# sourceMappingURL=database.service.js.map