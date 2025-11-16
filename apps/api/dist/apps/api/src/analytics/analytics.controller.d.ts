import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getSummary(query: any): Promise<{
        message: string;
    }>;
    getConversationsPerDay(query: any): Promise<{
        message: string;
    }>;
    getAgentsPerformance(query: any): Promise<{
        message: string;
    }>;
}
