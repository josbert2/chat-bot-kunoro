import { OnModuleInit } from '@nestjs/common';
import mysql from 'mysql2/promise';
import { ConfigService } from './config.service';
export declare class DatabaseService implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    private db;
    private connection;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    getDb(): import("drizzle-orm/mysql2").MySql2Database<Record<string, unknown>> & {
        $client: import("mysql2").Pool;
    };
    getConnection(): mysql.Pool;
    private testConnection;
}
