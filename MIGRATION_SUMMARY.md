# Resumen de Migración de Código Existente

Este documento resume el código reciclado de la estructura anterior al nuevo monorepo.

## ✅ Código Migrado

### 1. Schema de Base de Datos
- **Origen**: `db/schema.ts` (existente)
- **Destino**: `db/schema.ts` (mantenido en raíz del monorepo)
- **Estado**: ✅ Migrado y actualizado
- **Contenido**: 
  - Tablas: accounts, sites, user, session, conversations, messages, apiTokens
  - Tipos TypeScript exportados

### 2. Widget Config (Utilidades)
- **Origen**: `lib/widget-config.ts`
- **Destino**: `packages/core-types/src/WidgetConfig.ts`
- **Estado**: ✅ Migrado
- **Contenido**: 
  - Funciones para parsear/configurar colores del widget
  - Validación de colores hex
  - Detección de colores oscuros/claros

### 3. Widget JavaScript
- **Origen**: `public/widget.js` (vanilla JS completo)
- **Destino**: `apps/widget/src/` (TypeScript modular)
- **Estado**: ✅ Migrado y refactorizado
- **Cambios**:
  - Convertido a TypeScript
  - Separado en módulos: `bootstrap.ts`, `widget-ui.ts`, `api/client.ts`
  - Mantiene compatibilidad con `data-app-id` y `data-key`
  - Soporta `data-api-url` para configuración de API

### 4. Bearer Auth Guard
- **Origen**: `lib/bearer-auth.ts`
- **Destino**: `apps/api/src/common/guards/bearer-auth.guard.ts`
- **Estado**: ✅ Migrado (estructura básica)
- **Nota**: Necesita implementación completa con conexión a BD

### 5. Storage Utils (Widget)
- **Origen**: Lógica del widget original
- **Destino**: `apps/widget/src/utils/storage.ts`
- **Estado**: ✅ Creado
- **Contenido**: Funciones para manejar visitorId en localStorage

## 🔄 Código Pendiente de Migrar

### 1. Rutas API de Next.js
- **Origen**: `app/api/` (varias rutas)
- **Destino**: Controladores NestJS en `apps/api/src/`
- **Rutas identificadas**:
  - `/api/widget/config/[appId]` → `apps/api/src/projects/projects.controller.ts`
  - `/api/public/chat` → `apps/api/src/widget/widget.controller.ts` (crear)
  - `/api/v1/account/*` → `apps/api/src/workspaces/workspaces.controller.ts`
  - `/api/v1/sites/*` → `apps/api/src/projects/projects.controller.ts`
  - `/api/v1/chat/*` → `apps/api/src/conversations/conversations.controller.ts`

### 2. Better Auth
- **Origen**: `lib/auth.ts` (better-auth)
- **Destino**: `apps/api/src/auth/` (adaptar a NestJS)
- **Estado**: ⚠️ Pendiente
- **Nota**: Better-auth es específico de Next.js, necesitará adaptación o reemplazo con JWT en NestJS

### 3. Componentes React del Dashboard
- **Origen**: `components/` (ChatWidget.tsx, etc.)
- **Destino**: `apps/dashboard/components/` o `packages/ui/src/components/`
- **Estado**: ⚠️ Pendiente
- **Nota**: Algunos componentes pueden servir como referencia para el dashboard

### 4. Rutas del Dashboard
- **Origen**: `app/dashboard/`, `app/admin/`, etc.
- **Destino**: `apps/dashboard/app/`
- **Estado**: ⚠️ Pendiente
- **Nota**: Migrar páginas existentes a la nueva estructura

## 📝 Notas Importantes

1. **Compatibilidad**: El widget mantiene compatibilidad con el código anterior:
   - Soporta `data-app-id` (nombre anterior) y `data-key` (nuevo)
   - Mantiene la misma estructura de respuesta de API

2. **Base de Datos**: El schema está en `db/schema.ts` en la raíz. Necesita:
   - Configuración de conexión en `apps/api/src/config/`
   - Migraciones en `db/migrations/`

3. **Widget Build**: El widget necesita configuración de build en `vite.config.ts` para generar un bundle único (`widget.js`)

4. **Tipos Compartidos**: Los tipos están en `packages/core-types` y pueden ser importados desde cualquier app del monorepo

## 🚀 Próximos Pasos

1. Implementar controladores de widget en NestJS (`/v1/widget/init`, `/v1/widget/messages`)
2. Migrar rutas API restantes
3. Configurar conexión a BD en NestJS
4. Implementar autenticación JWT en lugar de better-auth
5. Migrar componentes React del dashboard
6. Configurar build del widget para producción

