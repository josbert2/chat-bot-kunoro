export declare class AnalyticsService {
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
