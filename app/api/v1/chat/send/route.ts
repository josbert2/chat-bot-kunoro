import { NextRequest, NextResponse } from "next/server";
import { requireBearerAuth, hasScope } from "@/lib/bearer-auth";
import { handleCorsOptions, withCors } from "@/lib/cors";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * OPTIONS /api/v1/chat/send
 * Maneja preflight CORS
 */
export async function OPTIONS() {
  return handleCorsOptions();
}

/**
 * POST /api/v1/chat/send
 * Envía un mensaje al chatbot y recibe una respuesta
 * Requiere autenticación Bearer y scope "chat:write" o "*"
 * 
 * Body:
 * {
 *   "message": "Hola, ¿cómo puedo ayudarte?",
 *   "sessionId": "opcional-uuid-de-sesion" // para mantener contexto
 * }
 * 
 * Ejemplo de uso:
 * curl -X POST -H "Authorization: Bearer kunoro_xxxxx" \
 *      -H "Content-Type: application/json" \
 *      -d '{"message": "Hola"}' \
 *      http://localhost:3000/api/v1/chat/send
 */
export async function POST(request: NextRequest) {
  // Validar autenticación Bearer
  const authResult = await requireBearerAuth(request);

  if (!authResult.authenticated) {
    return withCors(authResult.response);
  }

  const { context } = authResult;

  // Verificar que el token tenga el scope necesario
  if (!hasScope(context, "chat:write")) {
    return withCors(NextResponse.json(
      {
        error: "Permiso denegado",
        message: 'Este token no tiene permiso para enviar mensajes. Requiere scope "chat:write".',
      },
      { status: 403 }
    ));
  }

  try {
    // Obtener el mensaje del body
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return withCors(NextResponse.json(
        { error: "Mensaje requerido", message: "Debes proporcionar un mensaje" },
        { status: 400 }
      ));
    }

    // Verificar que OpenAI esté configurado
    if (!process.env.OPENAI_API_KEY) {
      return withCors(NextResponse.json(
        {
          error: "Configuración faltante",
          message: "El servidor no tiene configurada la API key de OpenAI",
        },
        { status: 500 }
      ));
    }

    // Crear prompt del sistema personalizado para la cuenta
    const systemPrompt = `Eres un asistente inteligente de ${context.account.name}.
Responde de manera útil, profesional y amigable.
Siempre responde en español.`;

    // Llamar a OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage = completion.choices[0]?.message?.content || "Lo siento, no pude generar una respuesta.";

    // TODO: Aquí podrías guardar el mensaje en la base de datos con el sessionId

    return withCors(NextResponse.json({
      success: true,
      data: {
        message: assistantMessage,
        sessionId: sessionId || null,
        usage: {
          promptTokens: completion.usage?.prompt_tokens,
          completionTokens: completion.usage?.completion_tokens,
          totalTokens: completion.usage?.total_tokens,
        },
      },
    }));
  } catch (error: any) {
    console.error("Error en chat:", error);
    
    if (error?.code === 'insufficient_quota') {
      return withCors(NextResponse.json(
        {
          error: "Cuota excedida",
          message: "La API key de OpenAI no tiene crédito disponible",
        },
        { status: 503 }
      ));
    }

    return withCors(NextResponse.json(
      { error: "Error interno", message: "No se pudo procesar el mensaje" },
      { status: 500 }
    ));
  }
}

