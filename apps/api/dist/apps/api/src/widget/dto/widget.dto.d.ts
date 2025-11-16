export declare class WidgetInitDto {
    visitorId?: string;
    pageUrl: string;
    userAgent: string;
}
export declare class WidgetMessageDto {
    visitorId: string;
    conversationId?: string;
    content: string;
}
export declare class WidgetOfflineDto {
    visitorId: string;
    name: string;
    email: string;
    message: string;
}
