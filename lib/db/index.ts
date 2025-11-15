import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Crear conexión a MySQL
const connection = mysql.createPool({
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: parseInt(process.env.DATABASE_PORT || '3530'),
  user: process.env.DATABASE_USER || 'chatbot',
  password: process.env.DATABASE_PASSWORD || 'chatbot_pw',
  database: process.env.DATABASE_NAME || 'chatbot',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Crear instancia de Drizzle
export const db = drizzle(connection, { schema, mode: 'default' });

// Función para verificar la conexión
export async function testConnection() {
  try {
    const [rows] = await connection.query('SELECT 1');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}
