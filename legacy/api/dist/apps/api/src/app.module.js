"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_module_1 = require("./config/config.module");
const auth_module_1 = require("./auth/auth.module");
const workspaces_module_1 = require("./workspaces/workspaces.module");
const projects_module_1 = require("./projects/projects.module");
const conversations_module_1 = require("./conversations/conversations.module");
const messages_module_1 = require("./messages/messages.module");
const channels_module_1 = require("./channels/channels.module");
const end_users_module_1 = require("./end-users/end-users.module");
const bots_module_1 = require("./bots/bots.module");
const automations_module_1 = require("./automations/automations.module");
const analytics_module_1 = require("./analytics/analytics.module");
const ai_module_1 = require("./ai/ai.module");
const billing_module_1 = require("./billing/billing.module");
const jobs_module_1 = require("./jobs/jobs.module");
const widget_module_1 = require("./widget/widget.module");
const app_controller_1 = require("./app.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.ConfigModule,
            auth_module_1.AuthModule,
            workspaces_module_1.WorkspacesModule,
            projects_module_1.ProjectsModule,
            conversations_module_1.ConversationsModule,
            messages_module_1.MessagesModule,
            channels_module_1.ChannelsModule,
            end_users_module_1.EndUsersModule,
            bots_module_1.BotsModule,
            automations_module_1.AutomationsModule,
            analytics_module_1.AnalyticsModule,
            ai_module_1.AiModule,
            billing_module_1.BillingModule,
            jobs_module_1.JobsModule,
            widget_module_1.WidgetModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map