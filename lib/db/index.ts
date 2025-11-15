import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Crear conexión a MySQL
const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'bookforce',
  password: process.env.DB_PASSWORD || 'bookforce123',
  database: process.env.DB_NAME || 'bookforce_chatbot',
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
