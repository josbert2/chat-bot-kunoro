import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.js';

class Database {
  private connection: mysql.Pool | null = null;
  private db: ReturnType<typeof drizzle> | null = null;

  async connect() {
    if (this.connection) return this.db!;

    try {
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

      this.db = drizzle(this.connection, { schema, mode: 'default' }) as any;

      return this.db;
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
      throw error;
    }
  }

  async testConnection() {
    if (!this.connection) {
      await this.connect();
    }
    const [rows] = await this.connection!.query('SELECT 1');
    return true;
  }

  getDb() {
    if (!this.db) {
      throw new Error('Base de datos no está conectada. Llama a connect() primero.');
    }
    return this.db;
  }

  getConnection() {
    return this.connection;
  }
}

export const db = new Database();

