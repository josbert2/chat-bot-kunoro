import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chatLogs } from '@/db/schema';
import { getClientIP } from '@/lib/get-client-ip';
import { getOrCreateSession, getSessionMessages, saveMessage } from '@/lib/session';
import { classifyIntent, getSystemPrompt } from '@/lib/chat-intent';
import { openaiClient } from '@/lib/openai-client';

const openai = openaiClient;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, loadHistory } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Obtener IP del cliente y crear/obtener sesión
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || undefined;

    let session;
    let sessionMessages = [];
    
    try {
      session = await getOrCreateSession(clientIP, userAgent);
      console.log(`[Session] User IP: ${clientIP}, Session ID: ${session.sessionId}`);
      
      // Si se solicita cargar historial, obtener mensajes previos
      if (loadHistory) {
        sessionMessages = await getSessionMessages(session.sessionId);
        console.log(`[Session] Loaded ${sessionMessages.length} previous messages`);
      }
    } catch (dbError) {
      console.error('[Session] Database error:', dbError);
      // Continuar sin sesión si hay error de BD
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

    // Guardar mensaje del usuario en la BD
    if (session) {
      try {
        await saveMessage(session.sessionId, 'user', lastUserMessage.content, intent);
      } catch (dbError) {
        console.error('[Session] Error saving user message:', dbError);
      }
    }

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
      sessionId: session?.sessionId,
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
