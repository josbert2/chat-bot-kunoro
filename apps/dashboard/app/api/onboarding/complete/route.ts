import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: Request) {
  console.log('🔵 [API ROUTE] POST /api/onboarding/complete recibido');

  try {
    // El token viene en el header Authorization desde el frontend
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ [API ROUTE] No se encontró token de autenticación en header');
      return NextResponse.json(
        { message: 'No autenticado. Token no encontrado.' },
        { status: 401 }
      );
    }

    // Leer datos del onboarding del body de la request
    const body = await request.json();
    console.log('🔵 [API ROUTE] Datos de onboarding recibidos del frontend');

    // Enviar al backend
    const backendUrl = `${API_URL}/v1/onboarding/complete`;
    console.log('🔵 [API ROUTE] Enviando a:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader, // Pasar el token tal cual
      },
      body: JSON.stringify(body),
    });

    console.log('🔵 [API ROUTE] Backend response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Error al completar el onboarding' 
      }));
      console.error('❌ [API ROUTE] Error del backend:', errorData);
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ [API ROUTE] Onboarding completado exitosamente');
    
    return NextResponse.json(data, { status: response.status });

  } catch (error: any) {
    console.error('❌ [API ROUTE] Error en proxy:', error);
    return NextResponse.json(
      { message: error.message || 'Error interno del servidor proxy' },
      { status: 500 }
    );
  }
}

