# Estado de Migración de NestJS a Express

## ✅ Módulos Completados

### 1. **Auth** (Autenticación)
- ✅ Registro de usuarios
- ✅ Login
- ✅ JWT tokens
- ✅ Middleware de autenticación
- Endpoints:
  - `POST /v1/auth/register`
  - `POST /v1/auth/login`
  - `GET /v1/auth/me`

### 2. **Workspaces** (Espacios de trabajo)
- ✅ Listar workspaces
- ✅ Obtener workspace por ID
- ✅ Actualizar workspace
- Endpoints:
  - `GET /v1/workspaces`
  - `GET /v1/workspaces/:workspaceId`
  - `PATCH /v1/workspaces/:workspaceId`

### 3. **Projects** (Sitios/Proyectos)
- ✅ CRUD completo de proyectos
- ✅ Configuración de widget
- ✅ Obtener config por appId (público)
- Endpoints:
  - `GET /v1/projects`
  - `POST /v1/projects`
  - `GET /v1/projects/:projectId`
  - `PATCH /v1/projects/:projectId`
  - `DELETE /v1/projects/:projectId`
  - `GET /v1/projects/widget/config?appId=xxx`
  - `GET /v1/projects/:projectId/widget`
  - `PATCH /v1/projects/:projectId/widget`

### 4. **Conversations** (Conversaciones)
- ✅ Listar conversaciones
- ✅ Obtener conversación
- ✅ Actualizar status
- ✅ Listar mensajes de conversación
- ✅ Crear mensaje en conversación
- Endpoints:
  - `GET /v1/conversations`
  - `GET /v1/conversations/:conversationId`
  - `PATCH /v1/conversations/:conversationId`
  - `GET /v1/conversations/:conversationId/messages`
  - `POST /v1/conversations/:conversationId/messages`

### 5. **Messages** (Mensajes)
- ✅ Obtener mensaje por ID
- Endpoints:
  - `GET /v1/messages/:messageId`

### 6. **Widget** (Widget público)
- ✅ Inicialización del widget
- ✅ Envío de mensajes
- ✅ Integración con OpenAI (GPT-3.5-turbo)
- ✅ Formulario offline
- Endpoints:
  - `POST /v1/widget/init` (público, requiere x-site-key)
  - `POST /v1/widget/messages` (público, requiere x-site-key)
  - `POST /v1/widget/offline` (público)

### 7. **End Users** (Visitantes)
- ✅ Listar visitantes
- ✅ Ver detalles de visitante
- ✅ Actualizar visitante
- Endpoints:
  - `GET /v1/end-users`
  - `GET /v1/end-users/:visitorId`
  - `PATCH /v1/end-users/:visitorId`

### 8. **Analytics** (Analíticas)
- ✅ Resumen general (conversaciones, mensajes, visitantes)
- ✅ Conversaciones por día
- ✅ Performance de agentes
- Endpoints:
  - `GET /v1/analytics/summary?from=YYYY-MM-DD&to=YYYY-MM-DD&siteId=xxx`
  - `GET /v1/analytics/conversations-per-day?from=YYYY-MM-DD&to=YYYY-MM-DD&siteId=xxx`
  - `GET /v1/analytics/agents-performance?from=YYYY-MM-DD&to=YYYY-MM-DD&siteId=xxx`

### 9. **AI** (Inteligencia Artificial)
- ✅ Sugerencias de respuesta con OpenAI
- ✅ Integración con GPT-3.5-turbo
- Endpoints:
  - `POST /v1/ai/suggest-reply` (body: { conversationId, lastMessage })

## 🚧 Módulos Pendientes

### 10. **Bots**
- ❌ CRUD de bots
- ❌ Configuración de flujos
- Status: Solo tiene estructura placeholder (baja prioridad, la IA ya funciona)

### 11. **Automations** (Automatizaciones)
- ❌ Reglas de automatización
- ❌ Triggers
- Status: Por revisar

### 12. **Billing** (Facturación)
- ❌ Planes
- ❌ Suscripciones
- ❌ Pagos
- Status: Por revisar

### 13. **Channels** (Canales)
- ❌ Configuración de canales
- ❌ Integraciones
- Status: Por revisar

### 14. **Jobs** (Trabajos en background)
- ❌ Queue de trabajos
- ❌ Procesamiento asíncrono
- Status: Por revisar

### 15. **Tokens** (API Tokens)
- ❌ Gestión de tokens
- ❌ Autenticación por API key
- Status: Por revisar

## 📋 Arquitectura Actual

```
apps/api-express/
├── src/
│   ├── index.ts                 # Entry point
│   ├── db/
│   │   ├── connection.ts        # DB connection
│   │   └── schema.ts            # Drizzle schema
│   ├── middleware/
│   │   ├── auth.middleware.ts   # JWT auth
│   │   └── error.middleware.ts  # Error handling
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── workspaces.routes.ts
│   │   ├── projects.routes.ts
│   │   ├── conversations.routes.ts
│   │   ├── messages.routes.ts
│   │   ├── widget.routes.ts
│   │   ├── end-users.routes.ts
│   │   └── health.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── workspaces.controller.ts
│   │   ├── projects.controller.ts
│   │   ├── conversations.controller.ts
│   │   ├── messages.controller.ts
│   │   ├── widget.controller.ts
│   │   └── end-users.controller.ts
│   └── services/
│       ├── auth.service.ts
│       ├── workspaces.service.ts
│       ├── projects.service.ts
│       ├── conversations.service.ts
│       ├── messages.service.ts
│       ├── widget.service.ts
│       ├── end-users.service.ts
│       ├── analytics.service.ts
│       └── ai.service.ts
├── package.json
├── tsconfig.json
└── .env
```

## 🎯 Prioridades

1. ✅ **Core Auth & CRUD** - Completado
2. ✅ **Widget público con IA** - Completado
3. ✅ **Analytics con métricas reales** - Completado
4. ✅ **AI con sugerencias de respuesta** - Completado
5. 🚧 **Bots & Automations** - Pendiente (baja prioridad)
6. 🚧 **Billing** - Pendiente (baja prioridad)

## 📝 Notas

- **Database**: MySQL con Drizzle ORM
- **Authentication**: JWT tokens en headers `Authorization: Bearer <token>`
- **Widget**: Usa header `x-site-key` para identificar el sitio
- **OpenAI**: Integrado en el widget, usa GPT-3.5-turbo
- **CORS**: Configurado para permitir cualquier origen (necesario para el widget)
- **Logging**: Console logs con emojis para debugging

## 🚀 Cómo probar

```bash
# Iniciar el servidor
cd apps/api-express
pnpm dev

# El servidor corre en http://localhost:3001
# Docs: http://localhost:3001/v1/health/docs
```

## 📚 Documentación Postman

Ver `/docs/Kunoro_Auth_API.postman_collection.json` para requests pre-configurados.

