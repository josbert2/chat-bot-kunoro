"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiTokens = exports.messages = exports.conversations = exports.chatLogs = exports.verification = exports.account = exports.session = exports.user = exports.sites = exports.accounts = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
exports.accounts = (0, mysql_core_1.mysqlTable)("accounts", {
    id: (0, mysql_core_1.varchar)("id", { length: 191 }).primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    plan: (0, mysql_core_1.varchar)("plan", { length: 50 }).notNull().default("free"),
    businessModel: (0, mysql_core_1.varchar)("business_model", { length: 255 }),
    industry: (0, mysql_core_1.varchar)("industry", { length: 255 }),
    conversationsRange: (0, mysql_core_1.varchar)("conversations_range", { length: 255 }),
    visitorsRange: (0, mysql_core_1.varchar)("visitors_range", { length: 255 }),
    platform: (0, mysql_core_1.varchar)("platform", { length: 255 }),
    agentCount: (0, mysql_core_1.varchar)("agent_count", { length: 255 }),
    goalId: (0, mysql_core_1.varchar)("goal_id", { length: 255 }),
    useAi: (0, mysql_core_1.boolean)("use_ai"),
    createdAt: (0, mysql_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.sites = (0, mysql_core_1.mysqlTable)("sites", {
    id: (0, mysql_core_1.varchar)("id", { length: 191 }).primaryKey(),
    accountId: (0, mysql_core_1.varchar)("account_id", { length: 191 })
        .notNull()
        .references(() => exports.accounts.id, { onDelete: "cascade" }),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    appId: (0, mysql_core_1.varchar)("app_id", { length: 191 }).notNull().unique(),
    domain: (0, mysql_core_1.varchar)("domain", { length: 255 }),
    widgetConfigJson: (0, mysql_core_1.text)("widget_config_json"),
    createdAt: (0, mysql_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.user = (0, mysql_core_1.mysqlTable)("user", {
    id: (0, mysql_core_1.varchar)("id", { length: 191 }).primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    email: (0, mysql_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    emailVerified: (0, mysql_core_1.boolean)("email_verified").notNull().default(false),
    image: (0, mysql_core_1.text)("image"),
    accountId: (0, mysql_core_1.varchar)("account_id", { length: 191 }).references(() => exports.accounts.id, {
        onDelete: "set null",
    }),
    createdAt: (0, mysql_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").notNull().defaultNow().onUpdateNow(),
});
exports.session = (0, mysql_core_1.mysqlTable)("session", {
    id: (0, mysql_core_1.varchar)("id", { length: 191 }).primaryKey(),
    expiresAt: (0, mysql_core_1.timestamp)("expires_at").notNull(),
    token: (0, mysql_core_1.varchar)("token", { length: 255 }).notNull().unique(),
    createdAt: (0, mysql_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").notNull().defaultNow().onUpdateNow(),
    ipAddress: (0, mysql_core_1.varchar)("ip_address", { length: 255 }),
    userAgent: (0, mysql_core_1.text)("user_agent"),
    userId: (0, mysql_core_1.varchar)("user_id", { length: 191 })
        .notNull()
        .references(() => exports.user.id, { onDelete: "cascade" }),
});
exports.account = (0, mysql_core_1.mysqlTable)("account", {
    id: (0, mysql_core_1.varchar)("id", { length: 191 }).primaryKey(),
    accountId: (0, mysql_core_1.varchar)("account_id", { length: 255 }).notNull(),
    providerId: (0, mysql_core_1.varchar)("provider_id", { length: 255 }).notNull(),
    userId: (0, mysql_core_1.varchar)("user_id", { length: 191 })
        .notNull()
        .references(() => exports.user.id, { onDelete: "cascade" }),
    accessToken: (0, mysql_core_1.text)("access_token"),
    refreshToken: (0, mysql_core_1.text)("refresh_token"),
    idToken: (0, mysql_core_1.text)("id_token"),
    accessTokenExpiresAt: (0, mysql_core_1.timestamp)("access_token_expires_at"),
    refreshTokenExpiresAt: (0, mysql_core_1.timestamp)("refresh_token_expires_at"),
    scope: (0, mysql_core_1.text)("scope"),
    password: (0, mysql_core_1.text)("password"),
    createdAt: (0, mysql_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").notNull().defaultNow().onUpdateNow(),
});
exports.verification = (0, mysql_core_1.mysqlTable)("verification", {
    id: (0, mysql_core_1.varchar)("id", { length: 191 }).primaryKey(),
    identifier: (0, mysql_core_1.varchar)("identifier", { length: 255 }).notNull(),
    value: (0, mysql_core_1.varchar)("value", { length: 255 }).notNull(),
    expiresAt: (0, mysql_core_1.timestamp)("expires_at").notNull(),
    createdAt: (0, mysql_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").notNull().defaultNow().onUpdateNow(),
});
exports.chatLogs = (0, mysql_core_1.mysqlTable)("chat_logs", {
    id: (0, mysql_core_1.varchar)("id", { length: 191 }).primaryKey(),
    intent: (0, mysql_core_1.varchar)("intent", { length: 191 }).notNull(),
    userMessage: (0, mysql_core_1.text)("user_message").notNull(),
    assistantMessage: (0, mysql_core_1.text)("assistant_message").notNull(),
    createdAt: (0, mysql_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.conversations = (0, mysql_core_1.mysqlTable)("conversations", {
    id: (0, mysql_core_1.varchar)("id", { length: 191 }).primaryKey(),
    accountId: (0, mysql_core_1.varchar)("account_id", { length: 191 })
        .notNull()
        .references(() => exports.accounts.id, { onDelete: "cascade" }),
    siteId: (0, mysql_core_1.varchar)("site_id", { length: 191 })
        .notNull()
        .references(() => exports.sites.id, { onDelete: "cascade" }),
    visitorId: (0, mysql_core_1.varchar)("visitor_id", { length: 191 }),
    status: (0, mysql_core_1.varchar)("status", { length: 50 }).notNull().default("active"),
    metadata: (0, mysql_core_1.text)("metadata"),
    createdAt: (0, mysql_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").notNull().defaultNow().onUpdateNow(),
}, (table) => ({
    accountIdx: (0, mysql_core_1.index)("conversation_account_idx").on(table.accountId),
    siteIdx: (0, mysql_core_1.index)("conversation_site_idx").on(table.siteId),
    statusIdx: (0, mysql_core_1.index)("conversation_status_idx").on(table.status),
}));
exports.messages = (0, mysql_core_1.mysqlTable)('messages', {
    id: (0, mysql_core_1.varchar)('id', { length: 191 }).primaryKey(),
    conversationId: (0, mysql_core_1.varchar)('conversation_id', { length: 191 })
        .notNull()
        .references(() => exports.conversations.id, { onDelete: "cascade" }),
    role: (0, mysql_core_1.varchar)('role', { length: 20 }).notNull(),
    content: (0, mysql_core_1.text)('content').notNull(),
    intent: (0, mysql_core_1.varchar)('intent', { length: 50 }),
    createdAt: (0, mysql_core_1.timestamp)('created_at').defaultNow().notNull(),
}, (table) => ({
    conversationIdx: (0, mysql_core_1.index)('conversation_idx').on(table.conversationId),
    createdAtIdx: (0, mysql_core_1.index)('created_at_idx').on(table.createdAt),
}));
exports.apiTokens = (0, mysql_core_1.mysqlTable)("api_tokens", {
    id: (0, mysql_core_1.varchar)("id", { length: 191 }).primaryKey(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    token: (0, mysql_core_1.varchar)("token", { length: 255 }).notNull().unique(),
    accountId: (0, mysql_core_1.varchar)("account_id", { length: 191 })
        .notNull()
        .references(() => exports.accounts.id, { onDelete: "cascade" }),
    userId: (0, mysql_core_1.varchar)("user_id", { length: 191 })
        .notNull()
        .references(() => exports.user.id, { onDelete: "cascade" }),
    lastUsedAt: (0, mysql_core_1.timestamp)("last_used_at"),
    expiresAt: (0, mysql_core_1.timestamp)("expires_at"),
    isActive: (0, mysql_core_1.boolean)("is_active").notNull().default(true),
    scopes: (0, mysql_core_1.text)("scopes"),
    createdAt: (0, mysql_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at").notNull().defaultNow().onUpdateNow(),
}, (table) => ({
    tokenIdx: (0, mysql_core_1.index)("token_idx").on(table.token),
    accountIdx: (0, mysql_core_1.index)("account_idx").on(table.accountId),
}));
//# sourceMappingURL=schema.js.map