import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ProjectsModule } from './projects/projects.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { ChannelsModule } from './channels/channels.module';
import { EndUsersModule } from './end-users/end-users.module';
import { BotsModule } from './bots/bots.module';
import { AutomationsModule } from './automations/automations.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiModule } from './ai/ai.module';
import { BillingModule } from './billing/billing.module';
import { JobsModule } from './jobs/jobs.module';
import { WidgetModule } from './widget/widget.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    WorkspacesModule,
    ProjectsModule,
    ConversationsModule,
    MessagesModule,
    ChannelsModule,
    EndUsersModule,
    BotsModule,
    AutomationsModule,
    AnalyticsModule,
    AiModule,
    BillingModule,
    JobsModule,
    WidgetModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

