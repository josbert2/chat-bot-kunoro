import { mysqlTable, varchar, timestamp, text, boolean, int, index } from "drizzle-orm/mysql-core";

// ------------------------------------------------------------
// Multi-tenant core tables
// ------------------------------------------------------------

export const accounts = mysqlTable("accounts", {
  id: varchar("id", { length: 191 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  plan: varchar("plan", { length: 50 }).notNull().default("free"),
  // Campos derivados del tour de onboarding
  businessModel: varchar("business_model", { length: 255 }),
  industry: varchar("industry", { length: 255 }),
  conversationsRange: varchar("conversations_range", { length: 255 }),
  visitorsRange: varchar("visitors_range", { length: 255 }),
  platform: varchar("platform", { length: 255 }),
  agentCount: varchar("agent_count", { length: 255 }),
  goalId: varchar("goal_id", { length: 255 }),
  useAi: boolean("use_ai"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sites = mysqlTable("sites", {
  id: varchar("id", { length: 191 }).primaryKey(),
  accountId: varchar("account_id", { length: 191 })
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  appId: varchar("app_id", { length: 191 }).notNull().unique(),
  domain: varchar("domain", { length: 255 }),
  widgetConfigJson: text("widget_config_json"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ------------------------------------------------------------
// Better Auth tables (usuarios + sesiones + proveedores)
// ------------------------------------------------------------

export const user = mysqlTable("user", {
  id: varchar("id", { length: 191 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  accountId: varchar("account_id", { length: 191 }).references(() => accounts.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 191 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  ipAddress: varchar("ip_address", { length: 255 }),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 191 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 191 }).primaryKey(),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 191 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 191 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ------------------------------------------------------------
// App-specific tables
// ------------------------------------------------------------

export const chatLogs = mysqlTable("chat_logs", {
  id: varchar("id", { length: 191 }).primaryKey(),
  intent: varchar("intent", { length: 191 }).notNull(),
  userMessage: text("user_message").notNull(),
  assistantMessage: text("assistant_message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Conversaciones del widget
export const conversations = mysqlTable("conversations", {
  id: varchar("id", { length: 191 }).primaryKey(),
  accountId: varchar("account_id", { length: 191 })
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  siteId: varchar("site_id", { length: 191 })
    .notNull()
    .references(() => sites.id, { onDelete: "cascade" }),
  visitorId: varchar("visitor_id", { length: 191 }), // Para identificar visitantes únicos
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, closed, archived
  metadata: text("metadata"), // JSON con info del visitante (url, userAgent, etc)
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  accountIdx: index("conversation_account_idx").on(table.accountId),
  siteIdx: index("conversation_site_idx").on(table.siteId),
  statusIdx: index("conversation_status_idx").on(table.status),
}));

export const messages = mysqlTable('messages', {
  id: varchar('id', { length: 191 }).primaryKey(),
  conversationId: varchar('conversation_id', { length: 191 })
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  role: varchar('role', { length: 20 }).notNull(), // 'user' o 'assistant'
  content: text('content').notNull(),
  intent: varchar('intent', { length: 50 }), // categoría detectada
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  conversationIdx: index('conversation_idx').on(table.conversationId),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
}));

// ------------------------------------------------------------
// API Tokens para autenticación Bearer
// ------------------------------------------------------------

export const apiTokens = mysqlTable("api_tokens", {
  id: varchar("id", { length: 191 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Nombre descriptivo del token
  token: varchar("token", { length: 255 }).notNull().unique(), // El token Bearer
  accountId: varchar("account_id", { length: 191 })
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 191 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  lastUsedAt: timestamp("last_used_at"),
  expiresAt: timestamp("expires_at"), // null = sin expiración
  isActive: boolean("is_active").notNull().default(true),
  scopes: text("scopes"), // JSON con permisos: ["chat:read", "chat:write", etc]
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  tokenIdx: index("token_idx").on(table.token),
  accountIdx: index("account_idx").on(table.accountId),
}));

// Tipos TypeScript
export type ApiToken = typeof apiTokens.$inferSelect;
export type NewApiToken = typeof apiTokens.$inferInsert;
export type Account = typeof accounts.$inferSelect;
export type Site = typeof sites.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
