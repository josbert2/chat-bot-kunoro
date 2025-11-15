import type { Config } from "drizzle-kit";

// Usamos aquí valores fijos alineados con docker-compose.yml para evitar
// que variables de entorno globales (de otros proyectos) cambien la conexión.

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  dbCredentials: {
    host: "127.0.0.1",
    port: 3530,
    user: "chatbot",
    password: "chatbot_pw",
    database: "chatbot",
  },
} satisfies Config;
