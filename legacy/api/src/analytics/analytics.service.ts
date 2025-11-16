import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  async getSummary(query: any) {
    return { message: 'GetSummary - to be implemented' };
  }

  async getConversationsPerDay(query: any) {
    return { message: 'GetConversationsPerDay - to be implemented' };
  }

  async getAgentsPerformance(query: any) {
    return { message: 'GetAgentsPerformance - to be implemented' };
  }
}

