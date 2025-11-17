import { WidgetService } from './widget.service';
import { WidgetInitDto, WidgetMessageDto } from './dto/widget.dto';
export declare class WidgetController {
    private readonly widgetService;
    constructor(widgetService: WidgetService);
    init(siteKey: string, body: WidgetInitDto): Promise<any>;
    sendMessage(siteKey: string, body: WidgetMessageDto & {
        pageUrl?: string;
        userAgent?: string;
    }): Promise<any>;
    offlineForm(body: any): Promise<any>;
}
