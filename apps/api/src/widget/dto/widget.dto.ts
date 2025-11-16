export class WidgetInitDto {
  visitorId?: string;
  pageUrl: string;
  userAgent: string;
}

export class WidgetMessageDto {
  visitorId: string;
  conversationId?: string;
  content: string;
}

export class WidgetOfflineDto {
  visitorId: string;
  name: string;
  email: string;
  message: string;
}

