1. Estructura general del repo
saas-chat/
├─ apps/
│  ├─ api/               # Backend (NestJS)
│  ├─ dashboard/         # Panel web (Next.js)
│  └─ widget/            # Widget embebible (script <script> + UI chat)
│
├─ packages/
│  ├─ ui/                # Design system (componentes compartidos)
│  ├─ core-types/        # Tipos TypeScript compartidos
│  └─ sdk/               # SDK JS para integraciones externas (futuro)
│
├─ db/
│  ├─ migrations/        # Migraciones SQL
│  └─ schema.prisma      # (o drizzle) definición del modelo
│
├─ infra/
│  ├─ docker-compose.yml
│  ├─ nginx.conf
│  └─ k8s/               # (opcional, manifests k8s)
│
├─ .env.example
├─ package.json
├─ turbo.json / pnpm-workspace.yaml   # si usas Turbo/PNPM
└─ README.md

2. apps/api (NestJS) – Backend
apps/api/
├─ src/
│  ├─ main.ts
│  ├─ app.module.ts
│  │
│  ├─ config/                # Configuración (env, DB, redis…)
│  │  ├─ config.module.ts
│  │  └─ config.service.ts
│  │
│  ├─ common/                # Cosas compartidas
│  │  ├─ guards/
│  │  ├─ interceptors/
│  │  ├─ decorators/
│  │  └─ dto/
│  │
│  ├─ auth/                  # Login, registro, JWT
│  │  ├─ auth.module.ts
│  │  ├─ auth.controller.ts
│  │  ├─ auth.service.ts
│  │  └─ strategies/
│  │
│  ├─ billing/               # Planes, suscripciones, Stripe
│  │  ├─ billing.module.ts
│  │  ├─ billing.controller.ts
│  │  └─ billing.service.ts
│  │
│  ├─ workspaces/            # SaaS multi-tenant
│  │  ├─ workspaces.module.ts
│  │  ├─ workspaces.controller.ts
│  │  └─ workspaces.service.ts
│  │
│  ├─ projects/              # Sitios / proyectos que usan el widget
│  │  ├─ projects.module.ts
│  │  ├─ projects.controller.ts
│  │  └─ projects.service.ts
│  │
│  ├─ channels/              # WhatsApp, IG, FB, Email, Web
│  │  ├─ channels.module.ts
│  │  ├─ channels.controller.ts
│  │  └─ channels.service.ts
│  │
│  ├─ conversations/         # Conversaciones + mensajes
│  │  ├─ conversations.module.ts
│  │  ├─ conversations.controller.ts
│  │  └─ conversations.service.ts
│  │
│  ├─ messages/
│  │  ├─ messages.module.ts
│  │  ├─ messages.gateway.ts   # WebSocket Gateway
│  │  └─ messages.service.ts
│  │
│  ├─ end-users/             # Clientes finales
│  │  ├─ end-users.module.ts
│  │  ├─ end-users.controller.ts
│  │  └─ end-users.service.ts
│  │
│  ├─ bots/                  # Flujos de chatbot
│  │  ├─ bots.module.ts
│  │  ├─ bots.controller.ts
│  │  └─ bots.service.ts
│  │
│  ├─ automations/           # Reglas (triggers + acciones)
│  │  ├─ automations.module.ts
│  │  ├─ automations.controller.ts
│  │  └─ automations.service.ts
│  │
│  ├─ analytics/             # Métricas
│  │  ├─ analytics.module.ts
│  │  ├─ analytics.controller.ts
│  │  └─ analytics.service.ts
│  │
│  ├─ ai/                    # IA / FAQ bot (fase avanzada)
│  │  ├─ ai.module.ts
│  │  ├─ ai.controller.ts
│  │  └─ ai.service.ts
│  │
│  └─ jobs/                  # BullMQ (queues)
│     ├─ jobs.module.ts
│     ├─ jobs.processor.ts
│     └─ jobs.service.ts
│
├─ test/
└─ nest-cli.json


Punto clave: todo lo que sea multi-tenant lleva workspace_id en BD y se filtra ahí.

3. apps/dashboard (Next.js) – Panel SaaS
apps/dashboard/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx               # Landing interna o dashboard
│  │
│  ├─ (auth)/
│  │  ├─ login/page.tsx
│  │  └─ register/page.tsx
│  │
│  ├─ (app)/                 # Área protegida
│  │  ├─ workspaces/
│  │  │  ├─ page.tsx         # Listado de workspaces
│  │  │  └─ [workspaceId]/
│  │  │     ├─ page.tsx      # Dashboard general del workspace
│  │  │     ├─ projects/
│  │  │     │  ├─ page.tsx   # Lista de proyectos (sitios)
│  │  │     │  └─ [projectId]/
│  │  │     │     ├─ settings/
│  │  │     │     │  ├─ appearance/page.tsx
│  │  │     │     │  ├─ widget/page.tsx
│  │  │     │     │  └─ channels/page.tsx
│  │  │     │     └─ bots/
│  │  │     │        ├─ page.tsx
│  │  │     │        └─ [botId]/edit/page.tsx
│  │  │     │
│  │  │     ├─ inbox/
│  │  │     │  └─ page.tsx  # Inbox unificado
│  │  │     ├─ team/
│  │  │     │  └─ page.tsx  # Miembros y roles
│  │  │     ├─ analytics/
│  │  │     │  └─ page.tsx
│  │  │     └─ billing/
│  │  │        └─ page.tsx  # Plan, upgrade, pagos
│  │
│  └─ api/                   # Route handlers Next (si necesitas)
│
├─ components/
│  ├─ layout/
│  ├─ navigation/
│  ├─ inbox/
│  ├─ forms/
│  └─ charts/
│
├─ lib/
│  ├─ api-client.ts          # Cliente HTTP al backend Nest
│  ├─ auth.ts                # Helpers auth
│  └─ socket.ts              # Cliente WebSocket para inbox
│
├─ styles/
│  └─ globals.css
├─ next.config.js
└─ tsconfig.json

4. apps/widget – Widget embebible
apps/widget/
├─ src/
│  ├─ main.ts                # Entry principal: inicializa widget
│  ├─ bootstrap.ts           # Lee data-key, crea contenedor, etc.
│  ├─ api/
│  │  └─ client.ts           # HTTP para /widget/init, etc.
│  ├─ socket/
│  │  └─ socket.ts           # WebSocket del visitante
│  ├─ ui/
│  │  ├─ ChatWidget.tsx (o .svelte/.tsx)
│  │  ├─ MessageList.tsx
│  │  ├─ MessageInput.tsx
│  │  └─ LauncherButton.tsx
│  ├─ styles/
│  │  └─ widget.css
│  └─ utils/
│     ├─ storage.ts          # localStorage/cookies visitor_id
│     └─ theme.ts            # manejo de colores/temas
│
├─ dist/
│  └─ widget.js              # bundle final para CDN
├─ vite.config.ts
└─ package.json


Objetivo: compilar a un solo archivo widget.js que el cliente inserta con <script>.

5. packages/ui – Design System
packages/ui/
├─ src/
│  ├─ index.ts
│  ├─ components/
│  │  ├─ Button.tsx
│  │  ├─ Card.tsx
│  │  ├─ Input.tsx
│  │  ├─ Select.tsx
│  │  ├─ Modal.tsx
│  │  ├─ Badge.tsx
│  │  └─ Sidebar.tsx
│  └─ hooks/
│     └─ useMediaQuery.ts
├─ tailwind.config.cjs
└─ package.json


Se usa tanto en dashboard como eventualmente en widget si quieres mantener estilo.

6. packages/core-types – Tipos compartidos
packages/core-types/
├─ src/
│  ├─ index.ts
│  ├─ Conversation.ts
│  ├─ Message.ts
│  ├─ Workspace.ts
│  ├─ Project.ts
│  └─ BotFlow.ts
└─ package.json


Ejemplo: tipos para mensajes que se reutilizan en backend, dashboard y widget.

7. db – Modelo de datos

Ejemplo si usas Prisma (idéntico concepto con Drizzle):

db/
├─ schema.prisma
└─ migrations/


schema.prisma (solo estructura, muy resumida):

model Workspace {
  id           String   @id @default(cuid())
  name         String
  plan         String   // free, pro, enterprise
  users        WorkspaceMember[]
  projects     Project[]
  conversations Conversation[]
  createdAt    DateTime @default(now())
}

model WorkspaceMember {
  id           String   @id @default(cuid())
  user         User     @relation(fields: [userId], references: [id])
  userId       String
  workspace    Workspace @relation(fields: [workspaceId], references: [id])
  workspaceId  String
  role         String   // owner, admin, agent, viewer
}

model Project {
  id           String   @id @default(cuid())
  workspace    Workspace @relation(fields: [workspaceId], references: [id])
  workspaceId  String
  name         String
  siteKey      String   @unique
  domain       String?
  conversations Conversation[]
}

model Conversation {
  id           String   @id @default(cuid())
  workspace    Workspace @relation(fields: [workspaceId], references: [id])
  workspaceId  String
  project      Project?  @relation(fields: [projectId], references: [id])
  projectId    String?
  endUser      EndUser?  @relation(fields: [endUserId], references: [id])
  endUserId    String?
  status       String    // open, pending, closed
  channel      String    // web, whatsapp, ig, fb, email
  messages     Message[]
}

model Message {
  id             String        @id @default(cuid())
  conversation   Conversation  @relation(fields: [conversationId], references: [id])
  conversationId String
  authorType     String        // agent, visitor, bot, system
  authorId       String?
  content        String
  createdAt      DateTime      @default(now())
}

8. infra – Infraestructura
infra/
├─ docker-compose.yml
├─ nginx.conf
└─ k8s/
   ├─ api-deployment.yaml
   ├─ dashboard-deployment.yaml
   └─ ingress.yaml