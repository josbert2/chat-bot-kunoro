import { WidgetService } from './widget.service';
import { WidgetInitDto, WidgetMessageDto } from './dto/widget.dto';
export declare class WidgetController {
    private readonly widgetService;
    constructor(widgetService: WidgetService);
    init(siteKey: string, body: WidgetInitDto): Promise<{
        visitorId: string;
        project: {
            id: string;
            name: string;
        };
        widgetConfig: any;
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
    offlineForm(body: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
