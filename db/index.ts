import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const poolConnection = mysql.createPool({
  host: process.env.DATABASE_HOST || "127.0.0.1",
  port: parseInt(process.env.DATABASE_PORT || "3530"),
  user: process.env.DATABASE_USER || "chatbot",
  password: process.env.DATABASE_PASSWORD || "chatbot_pw",
  database: process.env.DATABASE_NAME || "chatbot",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(poolConnection, { schema, mode: "default" });

process.on("SIGINT", async () => {
  await poolConnection.end();
  process.exit(0);
});
