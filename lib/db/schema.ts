import { mysqlTable, varchar, text, timestamp, int, index } from 'drizzle-orm/mysql-core';

// Tabla de sesiones por IP
export const sessions = mysqlTable('sessions', {
  id: int('id').primaryKey().autoincrement(),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(), // IPv4 o IPv6
  sessionId: varchar('session_id', { length: 255 }).notNull().unique(),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastActivity: timestamp('last_activity').defaultNow().notNull(),
}, (table) => ({
  ipIdx: index('ip_idx').on(table.ipAddress),
  sessionIdx: index('session_idx').on(table.sessionId),
}));

// Tabla de mensajes del chat
export const messages = mysqlTable('messages', {
  id: int('id').primaryKey().autoincrement(),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull(), // 'user' o 'assistant'
  content: text('content').notNull(),
  intent: varchar('intent', { length: 50 }), // categoría detectada
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  sessionIdx: index('session_idx').on(table.sessionId),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
}));

// Tipos TypeScript
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
