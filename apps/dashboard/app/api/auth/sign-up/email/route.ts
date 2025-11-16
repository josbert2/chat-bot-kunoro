import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  console.log('🔵 [API ROUTE] POST /api/auth/sign-up/email recibido');
  
  try {
    const body = await request.json();
    console.log('🔵 [API ROUTE] Body recibido:', { ...body, password: '***' });
    
    // Proxy al backend NestJS (con prefijo v1)
    const backendUrl = `${API_URL}/v1/auth/register`;
    console.log('🔵 [API ROUTE] Enviando a:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('🔵 [API ROUTE] Backend response status:', response.status);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ [API ROUTE] Error del backend:', data);
      return NextResponse.json(data, { status: response.status });
    }
    
    console.log('✅ [API ROUTE] Respuesta exitosa del backend');
    
    // Guardar token en cookie
    const res = NextResponse.json(data, { status: response.status });
    if (data.token) {
      res.cookies.set('kunoro_auth_token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 días
        path: '/',
      });
      console.log('✅ [API ROUTE] Token guardado en cookie');
    }
    
    return res;
    
  } catch (error) {
    console.error('❌ [API ROUTE] Error en proxy:', error);
    return NextResponse.json(
      { message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

