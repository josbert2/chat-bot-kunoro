import { WidgetInitDto, WidgetMessageDto } from './dto/widget.dto';
import { DatabaseService } from '../config/database.service';
export declare class WidgetService {
    private readonly dbService;
    constructor(dbService: DatabaseService);
    init(siteKey: string, body: WidgetInitDto): Promise<{
        visitorId: any;
        project: {
            id: any;
            name: any;
        };
        widgetConfig: any;
        activeConversation: any;
    }>;
    sendMessage(siteKey: string, body: WidgetMessageDto & {
        pageUrl?: string;
        userAgent?: string;
    }): Promise<{
        conversationId: any;
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
