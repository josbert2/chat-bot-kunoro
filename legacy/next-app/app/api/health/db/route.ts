import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();

  try {
    const config = {
      host: process.env.DATABASE_HOST ?? "127.0.0.1",
      port: parseInt(process.env.DATABASE_PORT ?? "3530"),
      user: process.env.DATABASE_USER || "chatbot",
      database: process.env.DATABASE_NAME || "chatbot",
    };

    let directConnection: any = null;
    let directConnectionError: any = null;

    try {
      const connection = await mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: process.env.DATABASE_PASSWORD || "chatbot_pw",
        database: config.database,
        connectTimeout: 5000,
      });

      const [rows] = await connection.execute("SELECT 1 as test");
      await connection.end();

      directConnection = {
        status: "success",
        message: "Conexión directa exitosa",
        testQuery: rows,
      };
    } catch (error: any) {
      directConnectionError = {
        status: "error",
        code: error.code,
        errno: error.errno,
        message: error.message,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage,
      };
    }

    let drizzleConnection: any = null;
    let drizzleConnectionError: any = null;

    try {
      const result = await db.execute(sql`SELECT 1 as test, NOW() as current_time`);
      drizzleConnection = {
        status: "success",
        message: "Conexión Drizzle exitosa",
        testQuery: result,
      };
    } catch (error: any) {
      drizzleConnectionError = {
        status: "error",
        code: error.code,
        errno: error.errno,
        message: error.message,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage,
      };
    }

    const duration = Date.now() - startTime;

    const isHealthy = directConnection?.status === "success" || drizzleConnection?.status === "success";

    return NextResponse.json(
      {
        status: isHealthy ? "healthy" : "unhealthy",
        timestamp: new Date().toISOString(),
        duration: `${duration}ms`,
        config,
        checks: {
          directConnection: directConnection || directConnectionError,
          drizzleConnection: drizzleConnection || drizzleConnectionError,
        },
        environment: {
          nodeEnv: process.env.NODE_ENV,
          hasDatabaseHost: !!process.env.DATABASE_HOST,
          hasDatabasePassword: !!process.env.DATABASE_PASSWORD,
          hasDatabaseUser: !!process.env.DATABASE_USER,
          hasDatabaseName: !!process.env.DATABASE_NAME,
        },
      },
      {
        status: isHealthy ? 200 : 503,
      },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: {
          message: error.message,
          code: error.code,
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
      },
      { status: 500 },
    );
  }
}
