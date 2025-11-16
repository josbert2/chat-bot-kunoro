# Estado de Migración al Monorepo

## ✅ Completado

### 1. Estructura del Monorepo
- ✅ Estructura de directorios creada (`apps/`, `packages/`, `db/`, `infra/`)
- ✅ Configuración de TurboRepo (`turbo.json`)
- ✅ Configuración de pnpm workspaces (`pnpm-workspace.yaml`)

### 2. Base de Datos
- ✅ Schema migrado a `db/schema.ts`
- ✅ Drizzle configurado en NestJS (`apps/api/src/config/database.service.ts`)
- ✅ Conexión a MySQL funcionando

### 3. Widget
- ✅ Widget migrado de `public/widget.js` a `apps/widget/src/` (TypeScript)
- ✅ Endpoints del widget implementados en NestJS:
  - `POST /v1/widget/init` ✅
  - `POST /v1/widget/messages` ✅ (con integración OpenAI)
  - `POST /v1/widget/offline` ✅

### 4. Projects/Sites
- ✅ `GET /v1/projects` - Listar proyectos (con Bearer auth)
- ✅ `POST /v1/projects` - Crear proyecto
- ✅ `GET /v1/projects/:projectId` - Obtener proyecto
- ✅ `PATCH /v1/projects/:projectId` - Actualizar proyecto
- ✅ `DELETE /v1/projects/:projectId` - Eliminar proyecto
- ✅ `GET /v1/projects/widget/config?appId=...` - Config pública del widget
- ✅ `GET /v1/projects/:projectId/widget` - Config del widget (auth)
- ✅ `PATCH /v1/projects/:projectId/widget` - Actualizar config del widget

### 5. Autenticación Bearer
- ✅ `BearerAuthGuard` implementado con validación real de tokens
- ✅ Decorador `@BearerAuth()` para obtener contexto de autenticación
- ✅ Validación de tokens en BD, verificación de expiración, scopes

### 6. Packages Compartidos
- ✅ `packages/core-types` - Tipos TypeScript compartidos
- ✅ `packages/ui` - Design system básico
- ✅ WidgetConfig utilities migradas

## 🔄 Pendiente de Migrar

### 1. Auth & Usuarios
- ⚠️ `/api/auth/*` - Better Auth (Next.js) → Adaptar a NestJS con JWT
- ⚠️ `/api/tokens/*` - Gestión de tokens API
  - `GET /api/tokens/list`
  - `POST /api/tokens/generate`
  - `POST /api/tokens/revoke`

### 2. Workspaces/Accounts
- ⚠️ `/api/v1/account` → `GET /v1/workspaces/:workspaceId`
- ⚠️ Gestión de miembros del workspace

### 3. Conversaciones
- ⚠️ `/api/v1/chat/*` → Migrar a `conversations.controller.ts`
- ⚠️ Endpoints de conversaciones para el dashboard

### 4. Onboarding
- ⚠️ `/api/onboarding/complete` → Migrar a `workspaces` o `auth`

### 5. Health Checks
- ⚠️ `/api/health/db` → Migrar a módulo de health

## 📝 Notas Importantes

1. **OpenAI Integration**: ✅ Migrada y funcionando en `widget.service.ts`
2. **Bearer Auth**: ✅ Funcional con validación real de tokens
3. **CORS**: ✅ Configurado para permitir widget embebido
4. **Drizzle**: ✅ Configurado y funcionando en NestJS

## 🚀 Próximos Pasos

1. Migrar módulo de tokens API
2. Migrar auth de Better Auth a JWT en NestJS
3. Migrar endpoints de conversaciones
4. Migrar dashboard de Next.js a la nueva estructura
5. Configurar build del widget para producción

