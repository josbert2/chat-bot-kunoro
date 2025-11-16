import { NextResponse } from "next/server";

/**
 * Agrega headers CORS a la respuesta
 */
export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

/**
 * Maneja la petición OPTIONS (preflight)
 */
export function handleCorsOptions() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

/**
 * Wrapper para agregar CORS a cualquier respuesta
 */
export function withCors(response: NextResponse) {
  Object.entries(corsHeaders()).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

