# Guía de Uso - API Express

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
cd apps/api-express
pnpm install

# 2. Configurar .env
cp .env.example .env
# Edita .env con tu configuración

# 3. Iniciar servidor
pnpm dev

# Servidor corriendo en http://localhost:3001
```

## 🔑 Autenticación

### Registro
```bash
curl -X POST http://localhost:3001/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "Password123!"
  }'
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "acc_...",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

### Login
```bash
curl -X POST http://localhost:3001/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123!"
  }'
```

### Usuario Actual
```bash
curl -X GET http://localhost:3001/v1/auth/me \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 🏢 Workspaces

### Listar Workspaces
```bash
curl -X GET http://localhost:3001/v1/workspaces \
  -H "Authorization: Bearer TU_TOKEN"
```

### Obtener Workspace
```bash
curl -X GET http://localhost:3001/v1/workspaces/ws_123 \
  -H "Authorization: Bearer TU_TOKEN"
```

### Actualizar Workspace
```bash
curl -X PATCH http://localhost:3001/v1/workspaces/ws_123 \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Nombre",
    "metadata": { "plan": "premium" }
  }'
```

---

## 🌐 Projects (Sitios)

### Listar Proyectos
```bash
curl -X GET "http://localhost:3001/v1/projects?workspaceId=ws_123" \
  -H "Authorization: Bearer TU_TOKEN"
```

### Crear Proyecto
```bash
curl -X POST http://localhost:3001/v1/projects \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workspaceId": "ws_123",
    "name": "Mi Sitio Web",
    "domain": "https://misitio.com"
  }'
```

**Respuesta:**
```json
{
  "id": "site_abc123",
  "workspaceId": "ws_123",
  "accountId": "acc_xyz",
  "name": "Mi Sitio Web",
  "domain": "https://misitio.com",
  "appId": "app_unique_key_here", // ⚠️ IMPORTANTE: Guarda esto para el widget
  "widgetConfigJson": "{...}",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Obtener Configuración del Widget (Público)
```bash
curl -X GET "http://localhost:3001/v1/projects/widget/config?appId=app_unique_key_here"
```

### Actualizar Configuración del Widget
```bash
curl -X PATCH http://localhost:3001/v1/projects/site_abc123/widget \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "primaryColor": "#00D9FF",
    "position": "bottom-right",
    "welcomeMessage": "¡Hola! ¿En qué puedo ayudarte?"
  }'
```

---

## 💬 Widget (Endpoints Públicos)

### Inicializar Widget
```bash
curl -X POST http://localhost:3001/v1/widget/init \
  -H "x-site-key: app_unique_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "visitorId": "visitor_optional_123"
  }'
```

**Respuesta:**
```json
{
  "visitorId": "visitor_generated_or_provided",
  "project": {
    "id": "site_abc123",
    "name": "Mi Sitio Web"
  },
  "widgetConfig": {
    "theme": "light",
    "primaryColor": "#007BFF",
    "position": "bottom-right",
    "welcomeMessage": "¡Hola! ¿En qué puedo ayudarte?"
  },
  "activeConversation": null
}
```

### Enviar Mensaje desde el Widget
```bash
curl -X POST http://localhost:3001/v1/widget/messages \
  -H "x-site-key: app_unique_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "visitorId": "visitor_123",
    "conversationId": "conv_optional",
    "content": "Hola, quisiera información sobre precios",
    "pageUrl": "https://misitio.com/precios",
    "userAgent": "Mozilla/5.0..."
  }'
```

**Respuesta (con IA):**
```json
{
  "conversationId": "conv_generated_or_provided",
  "message": "¡Hola! Con gusto te ayudo con información sobre nuestros precios...",
  "usage": {
    "promptTokens": 120,
    "completionTokens": 85,
    "totalTokens": 205
  }
}
```

---

## 💬 Conversaciones

### Listar Conversaciones
```bash
curl -X GET "http://localhost:3001/v1/conversations?siteId=site_abc123&status=active&limit=20" \
  -H "Authorization: Bearer TU_TOKEN"
```

### Obtener Conversación
```bash
curl -X GET http://localhost:3001/v1/conversations/conv_123 \
  -H "Authorization: Bearer TU_TOKEN"
```

### Actualizar Estado
```bash
curl -X PATCH http://localhost:3001/v1/conversations/conv_123 \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "closed"
  }'
```

### Listar Mensajes de una Conversación
```bash
curl -X GET http://localhost:3001/v1/conversations/conv_123/messages \
  -H "Authorization: Bearer TU_TOKEN"
```

### Enviar Mensaje (Agente)
```bash
curl -X POST http://localhost:3001/v1/conversations/conv_123/messages \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Gracias por tu consulta. Te envío la información...",
    "role": "assistant"
  }'
```

---

## 👥 End Users (Visitantes)

### Listar Visitantes
```bash
curl -X GET "http://localhost:3001/v1/end-users?siteId=site_abc123&limit=50" \
  -H "Authorization: Bearer TU_TOKEN"
```

### Ver Detalles de Visitante
```bash
curl -X GET http://localhost:3001/v1/end-users/visitor_123 \
  -H "Authorization: Bearer TU_TOKEN"
```

---

## 📊 Analytics

### Resumen General
```bash
curl -X GET "http://localhost:3001/v1/analytics/summary?from=2024-01-01&to=2024-01-31&siteId=site_abc123" \
  -H "Authorization: Bearer TU_TOKEN"
```

**Respuesta:**
```json
{
  "period": {
    "from": "2024-01-01T00:00:00.000Z",
    "to": "2024-01-31T23:59:59.000Z"
  },
  "summary": {
    "totalConversations": 150,
    "activeConversations": 23,
    "totalMessages": 1250,
    "uniqueVisitors": 87,
    "avgMessagesPerConversation": "8.33"
  }
}
```

### Conversaciones por Día
```bash
curl -X GET "http://localhost:3001/v1/analytics/conversations-per-day?from=2024-01-01&to=2024-01-31" \
  -H "Authorization: Bearer TU_TOKEN"
```

**Respuesta:**
```json
{
  "period": { "from": "...", "to": "..." },
  "data": [
    { "date": "2024-01-01", "count": 12 },
    { "date": "2024-01-02", "count": 8 },
    { "date": "2024-01-03", "count": 15 }
  ]
}
```

### Performance de Agentes
```bash
curl -X GET "http://localhost:3001/v1/analytics/agents-performance?from=2024-01-01&to=2024-01-31" \
  -H "Authorization: Bearer TU_TOKEN"
```

---

## 🤖 AI (Inteligencia Artificial)

### Sugerir Respuesta
```bash
curl -X POST http://localhost:3001/v1/ai/suggest-reply \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "conv_123",
    "lastMessage": "¿Cuánto cuesta el plan premium?"
  }'
```

**Respuesta:**
```json
{
  "suggestedReply": "El plan premium tiene un costo de $49/mes e incluye todas las funcionalidades avanzadas...",
  "usage": {
    "promptTokens": 95,
    "completionTokens": 78,
    "totalTokens": 173
  }
}
```

---

## 🔧 Variables de Entorno

Crea un archivo `.env` en `apps/api-express/`:

```env
# Server
API_PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=kunoro_chat

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
JWT_EXPIRES_IN=7d

# OpenAI (opcional, para IA)
OPENAI_API_KEY=sk-...

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:3000
```

---

## 📝 Notas Importantes

1. **Widget appId**: El `appId` generado al crear un proyecto es la clave para usar el widget en sitios web.
2. **Headers de Widget**: Los endpoints de widget usan `x-site-key` en lugar de `Authorization`.
3. **OpenAI**: Si no configuras `OPENAI_API_KEY`, el widget usará respuestas predeterminadas.
4. **CORS**: El servidor está configurado para permitir cualquier origen (necesario para el widget).
5. **Token JWT**: Guarda el token del login/registro y úsalo en el header `Authorization: Bearer <token>`.

---

## 🐛 Debug

Ver logs en tiempo real:
```bash
# El servidor muestra logs con emojis:
# 🟢 Éxito
# ❌ Error
# 🔵 Info
# 🤖 IA/OpenAI
```

Ver documentación completa:
```bash
curl http://localhost:3001/v1/health/docs
```

