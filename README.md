# SaaS Chat - Monorepo

SaaS B2B de atención al cliente multicanal con widget embebible, inbox unificado, chatbots e IA.

## Estructura del Monorepo

```
chat-bot-kunoro/
├─ apps/
│  ├─ api/               # Backend NestJS
│  ├─ dashboard/         # Panel web Next.js
│  └─ widget/            # Widget embebible (Vite)
│
├─ packages/
│  ├─ ui/                # Design system compartido
│  ├─ core-types/        # Tipos TypeScript compartidos
│  └─ sdk/               # SDK JS (futuro)
│
├─ db/                   # Base de datos (Drizzle)
├─ infra/                # Docker, nginx, k8s
└─ plan/                 # Documentación del plan
```

## Instalación

### Requisitos

- Node.js 18+
- pnpm (recomendado) o npm
- Docker y Docker Compose (para PostgreSQL y Redis)

### Setup inicial

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   pnpm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   # Editar .env con tus valores
   ```

4. Iniciar servicios (PostgreSQL y Redis):
   ```bash
   cd infra
   docker-compose up -d
   ```

5. Ejecutar migraciones de base de datos:
   ```bash
   pnpm --filter @saas-chat/api db:migrate
   ```

## Desarrollo

### Ejecutar todas las apps en desarrollo

```bash
pnpm dev
```

### Ejecutar apps individuales

```bash
# API (puerto 3001)
pnpm --filter @saas-chat/api dev

# Dashboard (puerto 3000)
pnpm --filter @saas-chat/dashboard dev

# Widget (puerto 3002)
pnpm --filter @saas-chat/widget dev
```

## Build

```bash
# Build de todas las apps
pnpm build

# Build individual
pnpm --filter @saas-chat/api build
pnpm --filter @saas-chat/dashboard build
pnpm --filter @saas-chat/widget build
```

## Scripts disponibles

- `pnpm dev` - Ejecuta todas las apps en modo desarrollo
- `pnpm build` - Build de producción de todas las apps
- `pnpm lint` - Linter en todos los paquetes
- `pnpm test` - Tests en todos los paquetes

## Documentación

- [Plan del producto](./plan/plan.md)
- [Estructura técnica](./plan/estructura.md)
- [Endpoints API](./plan/endpoints.md)

## Tecnologías

- **Backend**: NestJS, TypeScript
- **Frontend Dashboard**: Next.js 14, React, TailwindCSS
- **Widget**: Vite, TypeScript
- **Base de datos**: PostgreSQL con Drizzle ORM
- **Real-time**: WebSockets (Socket.IO)
- **Colas**: BullMQ (Redis)
- **Monorepo**: pnpm workspaces + TurboRepo

## Licencia

Privado
