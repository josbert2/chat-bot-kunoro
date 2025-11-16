import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getSummary(query: any): Promise<any>;
    getConversationsPerDay(query: any): Promise<any>;
    getAgentsPerformance(query: any): Promise<any>;
}
