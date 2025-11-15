🧭 Convenciones generales

Todos los endpoints de panel requieren:
Authorization: Bearer <token>

El workspaceId se infiere del usuario (por el token), no va en la URL.

Para el widget:

x-site-key: <PROJECT_SITE_KEY> o query ?siteKey=...

Prefijo API: /v1/...

1. Auth & Usuarios
1.1. Registro / login

POST /v1/auth/register
Crea usuario + primer workspace.

Body:

{ "name": "Andrea", "email": "andrea@ejemplo.com", "password": "xxx" }


Respuesta:

{ "token": "jwt...", "user": { ... }, "workspace": { ... } }


POST /v1/auth/login

Body:

{ "email": "andrea@ejemplo.com", "password": "xxx" }


POST /v1/auth/refresh
Refresca token (si usas refresh tokens).

GET /v1/auth/me
Devuelve info del usuario + workspaces que tiene.

2. Workspaces (Organizaciones SaaS)
2.1. Gestión de workspaces

GET /v1/workspaces
Lista workspaces del usuario autenticado.

POST /v1/workspaces
Crear nuevo workspace (ej: una agencia crea una nueva organización).

Body:

{ "name": "Agencia Latam" }


GET /v1/workspaces/:workspaceId
Detalles de un workspace actual.

PATCH /v1/workspaces/:workspaceId
Actualizar nombre, configs generales.

DELETE /v1/workspaces/:workspaceId
(Owner) Eliminar workspace.

2.2. Miembros del workspace

GET /v1/workspaces/:workspaceId/members
Lista miembros.

POST /v1/workspaces/:workspaceId/members/invite
Invitar por email.

Body:

{ "email": "nuevo@ejemplo.com", "role": "agent" }


PATCH /v1/workspaces/:workspaceId/members/:memberId
Cambiar rol (admin/agent/viewer).

DELETE /v1/workspaces/:workspaceId/members/:memberId
Expulsar miembro.

3. Proyectos (Sitios / Apps que usan el widget)

GET /v1/projects
Lista proyectos del workspace actual.

POST /v1/projects
Crear proyecto.

Body:

{
  "name": "Funpark.cl",
  "domain": "https://funpark.cl"
}


GET /v1/projects/:projectId

PATCH /v1/projects/:projectId

DELETE /v1/projects/:projectId

3.1. Config del widget

GET /v1/projects/:projectId/widget
Config actual del widget.

PATCH /v1/projects/:projectId/widget
Actualizar apariencia, textos, etc.

Body ejemplo:

{
  "theme": "dark",
  "primaryColor": "#00AEEF",
  "position": "bottom-right",
  "welcomeMessage": "¡Hola! ¿En qué te ayudamos?"
}

4. Widget público (lado visitante)

Endpoints que usa el <script> embebido.

4.1. Inicialización

POST /v1/widget/init

Headers:

x-site-key: <SITE_KEY>

Body:

{
  "visitorId": "abc123",      // opcional si ya lo tienes en localStorage
  "pageUrl": "https://cliente.cl/producto/123",
  "userAgent": "..."
}


Respuesta:

{
  "visitorId": "generado-o-el-mismo",
  "project": { "id": "...", "name": "..." },
  "widgetConfig": { ... },
  "activeConversation": { ... } // opcional
}

4.2. Envío de mensaje desde el widget (fallback REST)

Aunque uses WebSocket, conviene un endpoint HTTP:

POST /v1/widget/messages

Headers: x-site-key

Body:

{
  "visitorId": "abc123",
  "conversationId": "convo123",  // opcional si es el primero
  "content": "Hola tengo una duda"
}

4.3. Formulario offline / contacto

POST /v1/widget/offline

Body:

{
  "visitorId": "abc123",
  "name": "Andrea",
  "email": "andrea@ejemplo.com",
  "message": "Quiero cotizar un cumpleaños"
}

5. Conversaciones & Mensajes (lado agente / dashboard)
5.1. Conversaciones

GET /v1/conversations

Query params de filtro:

status=open|pending|closed

channel=web|whatsapp|instagram|facebook|email

assignedTo=me|userId

projectId=...

Ejemplo:
GET /v1/conversations?status=open&channel=web&projectId=xyz

GET /v1/conversations/:conversationId

PATCH /v1/conversations/:conversationId

Body:

{
  "status": "pending",
  "assignedToUserId": "user123",
  "tags": ["vip", "venta"]
}


POST /v1/conversations/:conversationId/assign

Body:

{ "assignedToUserId": "user123" }


POST /v1/conversations/:conversationId/close

POST /v1/conversations/:conversationId/reopen

5.2. Mensajes (lado agente)

GET /v1/conversations/:conversationId/messages
Lista mensajes.

POST /v1/conversations/:conversationId/messages

Body:

{
  "content": "Hola, soy Andrea, te ayudo con esto.",
  "type": "text"   // text | image | file
}


POST /v1/conversations/:conversationId/notes

Body:

{
  "content": "Cliente VIP, manejar con cariño",
  "visibleToCustomer": false
}

6. End Users (clientes finales)

GET /v1/end-users
Filtros:

search=...

tag=...

GET /v1/end-users/:endUserId

PATCH /v1/end-users/:endUserId

Body:

{
  "name": "Andrea",
  "email": "andrea@ejemplo.com",
  "phone": "+56...",
  "tags": ["cliente_frecuente"]
}

7. Chatbots & Flujos
7.1. Bots

GET /v1/bots
Lista bots del workspace.

POST /v1/bots

Body:

{
  "name": "Bot Bienvenida",
  "projectId": "proj123",
  "active": true,
  "trigger": {
    "type": "on_page_view",
    "conditions": {
      "urlContains": "/contacto"
    }
  }
}


GET /v1/bots/:botId

PATCH /v1/bots/:botId

DELETE /v1/bots/:botId

7.2. Flujos (Flow builder)

GET /v1/bots/:botId/flow

Devuelve el JSON del flujo:

{
  "nodes": [
    { "id": "start", "type": "message", "content": "¡Hola! ¿Qué necesitas?" },
    { "id": "options", "type": "options", "options": [
      { "label": "Soporte", "next": "support" },
      { "label": "Ventas", "next": "sales" }
    ]}
  ],
  "edges": [
    { "from": "start", "to": "options" },
    { "from": "options", "to": "support", "condition": "option=Soporte" }
  ]
}


PUT /v1/bots/:botId/flow

Body: JSON completo del flujo.

8. Automatizaciones (reglas simples)

GET /v1/automations

POST /v1/automations

Body:

{
  "name": "Mensaje bienvenida 10s",
  "projectId": "proj123",
  "trigger": {
    "type": "after_seconds",
    "seconds": 10
  },
  "actions": [
    {
      "type": "send_message",
      "channel": "web",
      "content": "¿Te ayudo con algo?"
    }
  ],
  "active": true
}


GET /v1/automations/:automationId

PATCH /v1/automations/:automationId

DELETE /v1/automations/:automationId

9. Canales (WhatsApp, IG, FB, Email…)

GET /v1/channels
Lista canales conectados al workspace.

POST /v1/channels

Body:

{
  "type": "whatsapp",
  "projectId": "proj123",
  "name": "WhatsApp Soporte",
  "config": {
    "provider": "whatsapp_cloud",
    "phoneNumberId": "123456",
    "accessToken": "..."
  }
}


GET /v1/channels/:channelId

PATCH /v1/channels/:channelId

DELETE /v1/channels/:channelId

9.1. Webhooks externos (entrada de mensajes)
WhatsApp / Meta:

POST /v1/webhooks/whatsapp (sin auth, pero con verificación propia)
Recibe mensajes entrantes → crea/actualiza Conversation + Message.

Instagram / Facebook:

POST /v1/webhooks/meta

Email (si usas proveedor):

POST /v1/webhooks/email

10. Analytics / Reportes

GET /v1/analytics/summary

Query:

from=2025-01-01

to=2025-01-31

projectId=... opcional.

Respuesta (ejemplo):

{
  "totalConversations": 123,
  "resolvedByBot": 40,
  "resolvedByAgents": 83,
  "avgFirstResponseTimeSeconds": 45,
  "avgConversationDurationSeconds": 300
}


GET /v1/analytics/conversations-per-day

GET /v1/analytics/agents-performance

11. Billing & Planes

GET /v1/billing/plans
Lista de planes disponibles (public info).

GET /v1/workspaces/:workspaceId/billing
Estado del plan actual.

POST /v1/workspaces/:workspaceId/billing/checkout

Body:

{
  "planId": "pro-monthly",
  "successUrl": "https://dashboard.tu-saas.com/billing/success",
  "cancelUrl": "https://dashboard.tu-saas.com/billing"
}


Responde con checkoutUrl de Stripe.

POST /v1/webhooks/stripe
Webhook para actualizar suscripciones, pagos, etc.

12. IA & Knowledge Base (fase avanzada)
12.1. Knowledge Base

GET /v1/kb/articles

POST /v1/kb/articles

Body:

{
  "title": "Política de cambios y devoluciones",
  "content": "Podrás cambiar tus entradas hasta 24h antes...",
  "tags": ["devoluciones", "cambios"]
}


PATCH /v1/kb/articles/:articleId

DELETE /v1/kb/articles/:articleId

12.2. IA helper

POST /v1/ai/suggest-reply

Body:

{
  "conversationId": "convo123",
  "lastMessage": "¿Cuál es el horario del parque el domingo?"
}


Responde con:

{
  "suggestedReply": "¡Hola! El domingo abrimos de 11:00 a 20:30 hrs..."
}


(El agente decide si la envía o no.)

13. Eventos / Webhooks hacia tus clientes (opcional PRO)

Para ofrecer webhooks a tus clientes:

POST /v1/integrations/webhooks
Configura callback url del cliente.

Ejemplo events:

conversation.created

conversation.closed

message.created

lead.captured

Tu backend después hace POST hacia la URL del cliente cuando ocurran.