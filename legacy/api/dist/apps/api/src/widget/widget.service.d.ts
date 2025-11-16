import { WidgetInitDto, WidgetMessageDto } from './dto/widget.dto';
import { DatabaseService } from '../config/database.service';
export declare class WidgetService {
    private readonly dbService;
    constructor(dbService: DatabaseService);
    init(siteKey: string, body: WidgetInitDto): Promise<{
        visitorId: string;
        project: {
            id: string;
            name: string;
        };
        widgetConfig: import("@core-types/WidgetConfig").WidgetConfig;
        activeConversation: {
            id: string;
            accountId: string;
            siteId: string;
            visitorId: string;
            status: string;
            metadata: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    sendMessage(siteKey: string, body: WidgetMessageDto & {
        pageUrl?: string;
        userAgent?: string;
    }): Promise<{
        conversationId: string;
        message: string;
        usage: any;
    }>;
    handleOfflineForm(body: any): Promise<{
        success: boolean;
        message: string;
    }>;
    private generateVisitorId;
    private generateConversationId;
    private generateMessageId;
}
