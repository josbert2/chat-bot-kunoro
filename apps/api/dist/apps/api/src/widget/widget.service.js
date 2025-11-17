"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const database_service_1 = require("../config/database.service");
const schema_1 = require("../../../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const core_types_1 = require("@saas-chat/core-types");
let WidgetService = class WidgetService {
    constructor(dbService) {
        this.dbService = dbService;
    }
    async init(siteKey, body) {
        if (!siteKey) {
            throw new common_1.BadRequestException('x-site-key header is required');
        }
        const db = this.dbService.getDb();
        const [site] = await db
            .select()
            .from(schema_1.sites)
            .where((0, drizzle_orm_1.eq)(schema_1.sites.appId, siteKey))
            .limit(1);
        if (!site) {
            throw new common_1.NotFoundException('Site not found');
        }
        const [account] = await db
            .select()
            .from(schema_1.accounts)
            .where((0, drizzle_orm_1.eq)(schema_1.accounts.id, site.accountId))
            .limit(1);
        if (!account) {
            throw new common_1.NotFoundException('Account not found');
        }
        const visitorId = body.visitorId || this.generateVisitorId();
        const widgetConfig = (0, core_types_1.parseWidgetConfig)(site.widgetConfigJson);
        const [activeConversation] = await db
            .select()
            .from(schema_1.conversations)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.conversations.siteId, site.id), (0, drizzle_orm_1.eq)(schema_1.conversations.visitorId, visitorId), (0, drizzle_orm_1.eq)(schema_1.conversations.status, 'active')))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.conversations.updatedAt))
            .limit(1);
        return {
            visitorId,
            project: {
                id: site.id,
                name: site.name,
            },
            widgetConfig,
            activeConversation: activeConversation || null,
        };
    }
    async sendMessage(siteKey, body) {
        if (!siteKey) {
            throw new common_1.BadRequestException('x-site-key header is required');
        }
        if (!body.content || !body.content.trim()) {
            throw new common_1.BadRequestException('Message content is required');
        }
        const db = this.dbService.getDb();
        const [site] = await db
            .select()
            .from(schema_1.sites)
            .where((0, drizzle_orm_1.eq)(schema_1.sites.appId, siteKey))
            .limit(1);
        if (!site) {
            throw new common_1.NotFoundException('Site not found');
        }
        const [account] = await db
            .select()
            .from(schema_1.accounts)
            .where((0, drizzle_orm_1.eq)(schema_1.accounts.id, site.accountId))
            .limit(1);
        if (!account) {
            throw new common_1.NotFoundException('Account not found');
        }
        let conversationId = body.conversationId;
        if (!conversationId) {
            conversationId = this.generateConversationId();
            await db.insert(schema_1.conversations).values({
                id: conversationId,
                accountId: site.accountId,
                siteId: site.id,
                visitorId: body.visitorId,
                status: 'active',
                metadata: JSON.stringify({
                    pageUrl: body.pageUrl || '',
                    userAgent: body.userAgent || '',
                }),
            });
        }
        else {
            const [conversation] = await db
                .select()
                .from(schema_1.conversations)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.conversations.id, conversationId), (0, drizzle_orm_1.eq)(schema_1.conversations.siteId, site.id)))
                .limit(1);
            if (!conversation) {
                throw new common_1.NotFoundException('Conversation not found');
            }
        }
        const userMessageId = this.generateMessageId();
        await db.insert(schema_1.messages).values({
            id: userMessageId,
            conversationId,
            role: 'user',
            content: body.content.trim(),
        });
        await db
            .update(schema_1.conversations)
            .set({ updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.conversations.id, conversationId));
        let botResponse = 'Gracias por tu mensaje. Un agente te responderá pronto.';
        let usage = null;
        if (process.env.OPENAI_API_KEY) {
            try {
                const OpenAI = (await Promise.resolve().then(() => require('openai'))).default;
                const openai = new OpenAI({
                    apiKey: process.env.OPENAI_API_KEY,
                });
                const messageHistory = await db
                    .select({
                    role: schema_1.messages.role,
                    content: schema_1.messages.content,
                })
                    .from(schema_1.messages)
                    .where((0, drizzle_orm_1.eq)(schema_1.messages.conversationId, conversationId))
                    .orderBy(schema_1.messages.createdAt)
                    .limit(10);
                const systemPrompt = `Eres un asistente inteligente de ${account.name}.
Tu objetivo es ayudar a los visitantes del sitio web "${site.name}".
Responde de manera útil, profesional y amigable.
Siempre responde en español.`;
                const chatMessages = [
                    { role: 'system', content: systemPrompt },
                    ...messageHistory.map((msg) => ({
                        role: msg.role,
                        content: msg.content,
                    })),
                ];
                const completion = await openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: chatMessages,
                    temperature: 0.7,
                    max_tokens: 500,
                });
                botResponse =
                    completion.choices[0]?.message?.content ||
                        'Lo siento, no pude generar una respuesta.';
                usage = {
                    promptTokens: completion.usage?.prompt_tokens,
                    completionTokens: completion.usage?.completion_tokens,
                    totalTokens: completion.usage?.total_tokens,
                };
            }
            catch (error) {
                console.error('Error llamando a OpenAI:', error);
                if (error?.code === 'insufficient_quota') {
                    botResponse = 'Lo siento, el servicio de IA no está disponible en este momento.';
                }
            }
        }
        const botMessageId = this.generateMessageId();
        await db.insert(schema_1.messages).values({
            id: botMessageId,
            conversationId,
            role: 'assistant',
            content: botResponse,
        });
        return {
            conversationId,
            message: botResponse,
            usage,
        };
    }
    async handleOfflineForm(body) {
        return {
            success: true,
            message: 'Tu mensaje ha sido enviado. Te contactaremos pronto.',
        };
    }
    generateVisitorId() {
        return `visitor_${(0, uuid_1.v4)()}`;
    }
    generateConversationId() {
        return `conv_${(0, uuid_1.v4)()}`;
    }
    generateMessageId() {
        return `msg_${(0, uuid_1.v4)()}`;
    }
};
exports.WidgetService = WidgetService;
exports.WidgetService = WidgetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object])
], WidgetService);
//# sourceMappingURL=widget.service.js.map