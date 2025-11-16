import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards() // TODO: Agregar guard de autenticación
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  async getSummary(@Query() query: any) {
    return this.analyticsService.getSummary(query);
  }

  @Get('conversations-per-day')
  async getConversationsPerDay(@Query() query: any) {
    return this.analyticsService.getConversationsPerDay(query);
  }

  @Get('agents-performance')
  async getAgentsPerformance(@Query() query: any) {
    return this.analyticsService.getAgentsPerformance(query);
  }
}

