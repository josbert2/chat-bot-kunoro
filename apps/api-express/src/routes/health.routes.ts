import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: '¡API Express funcionando!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

healthRouter.get('/docs', (req, res) => {
  res.json({
    name: 'Kunoro Chat Bot API',
    version: '1.0.0',
    baseUrl: `http://localhost:${process.env.PORT || 3001}/v1`,
    endpoints: {
      health: {
        'GET /v1/health': 'Health check',
        'GET /v1/health/docs': 'API documentation',
      },
      auth: {
        'POST /v1/auth/register': 'Registro de usuario',
        'POST /v1/auth/login': 'Login de usuario',
        'GET /v1/auth/me': 'Usuario actual (requiere token)',
      },
      workspaces: {
        'GET /v1/workspaces': 'Listar workspaces (requiere token)',
        'GET /v1/workspaces/:workspaceId': 'Obtener workspace (requiere token)',
        'PATCH /v1/workspaces/:workspaceId': 'Actualizar workspace (requiere token)',
      },
      projects: {
        'GET /v1/projects': 'Listar proyectos (requiere token)',
        'POST /v1/projects': 'Crear proyecto (requiere token)',
        'GET /v1/projects/:projectId': 'Obtener proyecto (requiere token)',
        'PATCH /v1/projects/:projectId': 'Actualizar proyecto (requiere token)',
        'DELETE /v1/projects/:projectId': 'Eliminar proyecto (requiere token)',
        'GET /v1/projects/widget/config?appId=xxx': 'Obtener widget config (público)',
        'GET /v1/projects/:projectId/widget': 'Obtener widget config (requiere token)',
        'PATCH /v1/projects/:projectId/widget': 'Actualizar widget config (requiere token)',
      },
      conversations: {
        'GET /v1/conversations': 'Listar conversaciones (requiere token)',
        'POST /v1/conversations': 'Crear conversación (requiere token)',
        'GET /v1/conversations/:conversationId': 'Obtener conversación (requiere token)',
        'PATCH /v1/conversations/:conversationId': 'Actualizar conversación (requiere token)',
        'GET /v1/conversations/:conversationId/messages': 'Listar mensajes (requiere token)',
        'POST /v1/conversations/:conversationId/messages': 'Crear mensaje (requiere token)',
      },
      messages: {
        'GET /v1/messages/:messageId': 'Obtener mensaje (requiere token)',
      },
      widget: {
        'POST /v1/widget/init': 'Inicializar widget (público, requiere x-site-key header)',
        'POST /v1/widget/messages': 'Enviar mensaje del widget (público, requiere x-site-key header)',
        'POST /v1/widget/offline': 'Formulario offline (público)',
      },
      endUsers: {
        'GET /v1/end-users': 'Listar visitantes (requiere token)',
        'GET /v1/end-users/:visitorId': 'Obtener visitante (requiere token)',
        'PATCH /v1/end-users/:visitorId': 'Actualizar visitante (requiere token)',
      },
      analytics: {
        'GET /v1/analytics/summary': 'Resumen general (requiere token)',
        'GET /v1/analytics/conversations-per-day': 'Conversaciones por día (requiere token)',
        'GET /v1/analytics/agents-performance': 'Performance de agentes (requiere token)',
      },
      ai: {
        'POST /v1/ai/suggest-reply': 'Sugerir respuesta con IA (requiere token)',
      },
      onboarding: {
        'POST /v1/onboarding/complete': 'Completar onboarding (requiere token)',
      },
    },
    authentication: {
      type: 'Bearer',
      header: 'Authorization: Bearer <token>',
      howToGetToken: 'POST /v1/auth/register o /v1/auth/login',
    },
  });
});

