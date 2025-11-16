import { NextRequest } from 'next/server';

/**
 * Obtiene la IP del cliente desde los headers de la request
 * Soporta proxies y servicios como Vercel
 */
export function getClientIP(request: NextRequest): string {
  // Intentar obtener IP de diferentes headers (en orden de prioridad)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwardedFor) {
    // x-forwarded-for puede contener múltiples IPs, tomar la primera
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP.trim();
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }
  
  // Fallback a IP genérica si no se puede obtener
  return 'unknown';
}
