# Kunoro Chat API - Express

API REST moderna construida con Express.js y TypeScript para el sistema de chat bot de Kunoro.

## 🚀 Características

- ✅ **Autenticación JWT** - Registro y login seguros
- ✅ **Workspaces y Proyectos** - Gestión completa de sitios
- ✅ **Widget Público** - Chat widget con IA integrada
- ✅ **Conversaciones y Mensajes** - Sistema completo de mensajería
- ✅ **OpenAI Integration** - Respuestas automáticas con GPT-3.5-turbo
- ✅ **Analytics en Tiempo Real** - Métricas y estadísticas
- ✅ **AI Suggestions** - Sugerencias de respuesta para agentes
- ✅ **End Users Management** - Gestión de visitantes

## 📦 Stack Tecnológico

- **Runtime**: Node.js con TypeScript
- **Framework**: Express.js
- **Database**: MySQL con Drizzle ORM
- **Authentication**: JWT (jsonwebtoken)
- **AI**: OpenAI GPT-3.5-turbo
- **Security**: Helmet, bcryptjs
- **Logging**: Morgan
- **CORS**: Configurado para widgets públicos

## 🏃 Inicio Rápido

### 1. Instalación

```bash
cd apps/api-express
pnpm install
```

### 2. Configuración

Crea un archivo `.env`:

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
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=7d

# OpenAI (opcional)
OPENAI_API_KEY=sk-...

# Frontend
FRONTEND_URL=http://localhost:3000
```

### 3. Ejecutar

```bash
# Desarrollo (con hot reload)
pnpm dev

# Build
pnpm build

# Producción
pnpm start
```

El servidor estará disponible en: **http://localhost:3001**

## 📚 Documentación

- **[USAGE_GUIDE.md](./USAGE_GUIDE.md)** - Guía completa con ejemplos de cURL
- **[MIGRATION_STATUS.md](./MIGRATION_STATUS.md)** - Estado de la migración desde NestJS
- **API Docs**: http://localhost:3001/v1/health/docs (cuando el servidor esté corriendo)

## 🔗 Endpoints Principales

### Autenticación
- `POST /v1/auth/register` - Registro de usuario
- `POST /v1/auth/login` - Login
- `GET /v1/auth/me` - Usuario actual

### Workspaces
- `GET /v1/workspaces` - Listar workspaces
- `GET /v1/workspaces/:id` - Obtener workspace
- `PATCH /v1/workspaces/:id` - Actualizar workspace

### Projects (Sitios)
- `GET /v1/projects` - Listar proyectos
- `POST /v1/projects` - Crear proyecto
- `GET /v1/projects/:id` - Obtener proyecto
- `PATCH /v1/projects/:id` - Actualizar proyecto
- `DELETE /v1/projects/:id` - Eliminar proyecto

### Widget (Público)
- `POST /v1/widget/init` - Inicializar widget (requiere `x-site-key`)
- `POST /v1/widget/messages` - Enviar mensaje (requiere `x-site-key`)

### Conversaciones
- `GET /v1/conversations` - Listar conversaciones
- `GET /v1/conversations/:id` - Obtener conversación
- `PATCH /v1/conversations/:id` - Actualizar estado
- `GET /v1/conversations/:id/messages` - Listar mensajes
- `POST /v1/conversations/:id/messages` - Crear mensaje

### Analytics
- `GET /v1/analytics/summary` - Resumen general
- `GET /v1/analytics/conversations-per-day` - Conversaciones por día
- `GET /v1/analytics/agents-performance` - Performance de agentes

### AI
- `POST /v1/ai/suggest-reply` - Sugerir respuesta con IA

## 🔐 Autenticación

La mayoría de los endpoints requieren autenticación JWT:

```bash
Authorization: Bearer <tu_token_jwt>
```

Los endpoints del widget público usan:

```bash
x-site-key: <app_id_del_proyecto>
```

## 🏗️ Arquitectura

```
src/
├── index.ts              # Entry point
├── db/
│   ├── connection.ts     # Drizzle DB connection
│   └── schema.ts         # Database schema
├── middleware/
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── routes/
│   ├── auth.routes.ts
│   ├── workspaces.routes.ts
│   ├── projects.routes.ts
│   ├── conversations.routes.ts
│   ├── messages.routes.ts
│   ├── widget.routes.ts
│   ├── end-users.routes.ts
│   ├── analytics.routes.ts
│   └── ai.routes.ts
├── controllers/
│   └── [nombre].controller.ts
└── services/
    └── [nombre].service.ts
```

**Patrón**: Routes → Controllers → Services → Database

## 🤖 Integración con IA

El sistema incluye dos tipos de integración con OpenAI:

1. **Widget Automático**: Respuestas automáticas a visitantes
2. **Sugerencias para Agentes**: Ayuda a los agentes humanos con sugerencias

Ambos usan GPT-3.5-turbo y requieren `OPENAI_API_KEY` en el `.env`.

## 📊 Base de Datos

El proyecto usa Drizzle ORM con MySQL. El schema incluye:

- `user` - Usuarios del sistema
- `accounts` - Cuentas de clientes
- `workspaces` - Espacios de trabajo
- `sites` - Proyectos/sitios web
- `conversations` - Conversaciones
- `messages` - Mensajes
- `api_tokens` - Tokens de API

Ver `src/db/schema.ts` para el schema completo.

## 🔧 Scripts

```bash
pnpm dev      # Desarrollo con hot reload
pnpm build    # Compilar TypeScript
pnpm start    # Ejecutar versión compilada
```

## 🐛 Debug

El servidor usa console.log con emojis para facilitar el debugging:

- 🟢 Éxito / Inicio de operación
- ❌ Error
- 🔵 Información
- 🤖 Operaciones con IA
- ✅ Operación completada

## 📝 Notas

- **CORS**: Configurado para permitir cualquier origen (necesario para el widget)
- **Rate Limiting**: Pendiente de implementar
- **WebSockets**: Socket.io incluido pero pendiente de configurar
- **Tests**: Pendiente de implementar

## 🚧 Próximas Funcionalidades

- [ ] Bots personalizados
- [ ] Automatizaciones
- [ ] Sistema de billing
- [ ] Rate limiting
- [ ] WebSockets en tiempo real
- [ ] Tests unitarios y de integración

## 📄 Licencia

Privado - © Kunoro 2024

---

**Desarrollado con ❤️ usando Express.js + TypeScript**

