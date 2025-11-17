import { mysqlTable, varchar, timestamp, boolean, index } from 'drizzle-orm/mysql-core';

// Schema de Better Auth - Tabla de usuarios
export const user = mysqlTable("user", {
  id: varchar("id", { length: 191 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: varchar("image", { length: 500 }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
  accountId: varchar("account_id", { length: 191 }),
}, (table) => ({
  emailIdx: index("user_email_idx").on(table.email),
}));

// Schema de Better Auth - Tabla de sesiones
export const session = mysqlTable("session", {
  id: varchar("id", { length: 191 }).primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: varchar("userAgent", { length: 500 }),
  userId: varchar("userId", { length: 191 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  userIdx: index("session_user_idx").on(table.userId),
}));

// Schema de Better Auth - Tabla de cuentas (accounts)
export const account = mysqlTable("account", {
  id: varchar("id", { length: 191 }).primaryKey(),
  accountId: varchar("accountId", { length: 191 }).notNull(),
  providerId: varchar("providerId", { length: 191 }).notNull(),
  userId: varchar("userId", { length: 191 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: varchar("accessToken", { length: 500 }),
  refreshToken: varchar("refreshToken", { length: 500 }),
  idToken: varchar("idToken", { length: 500 }),
  expiresAt: timestamp("expiresAt"),
  password: varchar("password", { length: 255 }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  userIdx: index("account_user_idx").on(table.userId),
}));

// Schema de Better Auth - Tabla de verificación
export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 191 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
});

// Tabla de accounts para el negocio (reutilizada del schema existente)
export const accounts = mysqlTable("accounts", {
  id: varchar("id", { length: 191 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  plan: varchar("plan", { length: 50 }).notNull().default("free"),
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

