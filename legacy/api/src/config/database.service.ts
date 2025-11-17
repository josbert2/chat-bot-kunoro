import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../../../../db/schema';
import { ConfigService } from './config.service';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private db: ReturnType<typeof drizzle>;
  private connection: mysql.Pool;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    try {
      // Crear conexión a MySQL usando las mismas variables de entorno que el proyecto original
      this.connection = mysql.createPool({
        host: process.env.DATABASE_HOST || '127.0.0.1',
        port: parseInt(process.env.DATABASE_PORT || '3530'),
        user: process.env.DATABASE_USER || 'chatbot',
        password: process.env.DATABASE_PASSWORD || 'chatbot_pw',
        database: process.env.DATABASE_NAME || 'chatbot',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      // Crear instancia de Drizzle con el schema
      this.db = drizzle(this.connection, { schema, mode: 'default' }) as any;

      // Verificar conexión
      await this.testConnection();
      this.logger.log('✅ Database connection successful');
    } catch (error) {
      this.logger.error('❌ Database connection failed:', error);
      this.logger.warn('⚠️  El servidor continuará pero algunas funciones pueden no estar disponibles');
      // No lanzamos el error para que el servidor pueda iniciar aunque falle la DB
      // throw error;
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

  private async testConnection() {
    try {
      const [rows] = await this.connection.query('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error('Database test query failed:', error);
      throw error;
    }
  }
}

