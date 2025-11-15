import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/db';
import { chatLogs } from '@/db/schema';

// Initialize OpenAI client (will be null if no API key is provided)
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// Intent classifier function
function classifyIntent(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Conversación (saludos, agradecimientos)
  if (/\b(hola|buenos días|buenas tardes|buenas noches|hey|saludos|qué tal|cómo estás|gracias|muchas gracias|te agradezco|necesito ayuda|me pueden ayudar|ayuda|asistencia)\b/i.test(lowerMessage)) {
    return 'conversación';
  }
  
  // Valores (precios, tarifas, pagos)
  if (/\b(precio|precios|costo|costos|tarifa|tarifas|valor|valores|cuánto cuesta|cuánto vale|pago|pagos|descuento|descuentos|promoción|promociones|oferta|ofertas|entrada|entradas)\b/i.test(lowerMessage)) {
    return 'valores';
  }
  
  // Horarios
  if (/\b(horario|horarios|hora|horas|abierto|cierre|apertura|cuándo abren|cuándo cierran|días de atención|turno|turnos|feriado|feriados|disponibilidad)\b/i.test(lowerMessage)) {
    return 'horarios';
  }
  
  // Funciones (shows, eventos)
  if (/\b(función|funciones|show|shows|evento|eventos|actividad|actividades|duración|cuánto dura|programa|programación|espectáculo|espectáculos)\b/i.test(lowerMessage)) {
    return 'funciones';
  }
  
  // Transaccionales
  if (/\b(generar|crear|comprar|reservar|anular|cancelar|cambiar fecha|modificar|devolución|devolver|reembolso|estado de|problema con|error en|no puedo|no funciona)\b/i.test(lowerMessage)) {
    return 'transaccionales';
  }
  
  // Preguntas frecuentes
  if (/\b(política|políticas|dirección|ubicación|dónde está|cómo llegar|edad mínima|requisito|requisitos|estacionamiento|parking|reserva|reservas|información|info)\b/i.test(lowerMessage)) {
    return 'preguntas frecuentes';
  }
  
  // Default: conversación
  return 'conversación';
}

// System prompt generator based on intent
function getSystemPrompt(intent: string): string {
  const basePrompt = `Eres un asistente virtual amigable y profesional para Bookforce, una plataforma de gestión de eventos y venta de entradas.

IMPORTANTE: Siempre responde en ESPAÑOL, sin importar el idioma en que te escriban. Todas tus respuestas deben ser en español.`;
  
  const intentPrompts: Record<string, string> = {
    'valores': `${basePrompt}

El usuario está preguntando sobre PRECIOS, TARIFAS o PAGOS.

Enfócate en:
- Proporcionar información clara sobre precios de entradas
- Explicar los diferentes tipos de entradas disponibles
- Mencionar descuentos o promociones vigentes
- Detallar métodos de pago aceptados
- Aclarar políticas de precios

Características de Bookforce:
- Sistema de venta de entradas online
- Múltiples métodos de pago (tarjetas, transferencias, etc.)
- Descuentos por compras anticipadas
- Precios diferenciados por tipo de entrada

Responde SIEMPRE en español, de manera clara, directa y profesional.`,

    'horarios': `${basePrompt}

El usuario está preguntando sobre HORARIOS o DISPONIBILIDAD.

Enfócate en:
- Horarios de atención y apertura
- Días disponibles para eventos
- Turnos y franjas horarias
- Disponibilidad de fechas
- Horarios especiales en feriados

Características de Bookforce:
- Calendario de disponibilidad en tiempo real
- Sistema de reservas por horarios
- Gestión de turnos y franjas horarias
- Notificaciones de cambios de horario

Responde SIEMPRE en español, de manera clara y específica sobre horarios.`,

    'funciones': `${basePrompt}

El usuario está preguntando sobre FUNCIONES, SHOWS o EVENTOS.

Enfócate en:
- Información sobre eventos disponibles
- Duración de las actividades
- Programación de shows
- Tipos de funciones
- Detalles de los espectáculos

Características de Bookforce:
- Gestión completa de eventos y actividades
- Calendario de funciones
- Información detallada de cada evento
- Sistema de categorización de actividades

Responde SIEMPRE en español, con entusiasmo sobre los eventos disponibles.`,

    'transaccionales': `${basePrompt}

El usuario quiere realizar una ACCIÓN ESPECÍFICA o resolver un PROBLEMA.

Enfócate en:
- Guiar paso a paso en el proceso
- Resolver problemas técnicos
- Explicar cómo generar o anular entradas
- Ayudar con cambios de fecha
- Gestionar devoluciones

Características de Bookforce:
- Generación automática de entradas con código QR
- Sistema de anulación y devoluciones
- Modificación de reservas
- Soporte técnico integrado
- Panel de gestión de compras

Responde SIEMPRE en español. Sé muy específico y práctico en tus instrucciones.`,

    'preguntas frecuentes': `${basePrompt}

El usuario está haciendo una PREGUNTA GENERAL sobre el servicio.

Enfócate en:
- Políticas del establecimiento
- Información de ubicación y acceso
- Requisitos y restricciones
- Servicios adicionales
- Información práctica

Características de Bookforce:
- Plataforma completa de gestión de eventos
- Sistema de reservas online
- Políticas claras y transparentes
- Soporte al cliente
- Información detallada de cada venue

Responde SIEMPRE en español. Proporciona información completa y útil.`,

    'conversación': `${basePrompt}

El usuario está iniciando una conversación o saludando.

Enfócate en:
- Dar la bienvenida de manera amigable
- Ofrecer ayuda proactivamente
- Explicar brevemente cómo puedes ayudar
- Crear un ambiente acogedor

Características de Bookforce:
- Sistema de venta de entradas online
- Gestión de eventos y actividades
- Reservas y pagos seguros
- Soporte 24/7

Responde SIEMPRE en español. Sé cálido, amigable y ofrece ayuda de manera proactiva.`
  };
  
  return intentPrompts[intent] || intentPrompts['conversación'];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!openai || !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          message: '⚠️ El chatbot aún no está configurado con una API key de OpenAI.\n\nPara activarlo:\n1. Obtén una API key en https://platform.openai.com\n2. Crea un archivo .env en la raíz del proyecto\n3. Agrega: OPENAI_API_KEY=tu_api_key\n4. Reinicia el servidor\n\n💡 Por ahora, puedes probar la interfaz del chat.' 
        },
        { status: 503 }
      );
    }

    // Classify the user's intent from the last message
    const lastUserMessage = messages[messages.length - 1];
    const intent = classifyIntent(lastUserMessage.content);
    const systemPrompt = getSystemPrompt(intent);
    
    console.log(`[Intent Classifier] Detected intent: "${intent}" for message: "${lastUserMessage.content.substring(0, 50)}..."`);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage = completion.choices[0]?.message?.content || 
      'Lo siento, no pude generar una respuesta. Por favor, intenta de nuevo.';

    const chatId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    try {
      await db.insert(chatLogs).values({
        id: chatId,
        intent,
        userMessage: lastUserMessage.content,
        assistantMessage,
      });
    } catch (logError) {
      console.error('Error saving chat log:', logError);
    }

    return NextResponse.json({
      message: assistantMessage,
      intent: intent,
      usage: completion.usage,
    });

  } catch (error: any) {
    console.error('Error in chat API:', error);

    // Handle specific OpenAI errors
    if (error?.status === 401) {
      return NextResponse.json(
        { 
          error: 'Invalid API key',
          message: 'Lo siento, hay un problema con la configuración del chatbot. Por favor, contacta al administrador.' 
        },
        { status: 500 }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: 'Lo siento, el servicio está temporalmente saturado. Por favor, intenta de nuevo en unos momentos.' 
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.' 
      },
      { status: 500 }
    );
  }
}
