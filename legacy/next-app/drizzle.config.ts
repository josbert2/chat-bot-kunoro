import type { Config } from "drizzle-kit";

// Usamos aquí valores fijos alineados con docker-compose.yml para evitar
// que variables de entorno globales (de otros proyectos) cambien la conexión.

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: parseInt(process.env.DATABASE_PORT || '3530'),
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'rootpassword',
    database: process.env.DATABASE_NAME || 'chatbot',
  },
} satisfies Config;
