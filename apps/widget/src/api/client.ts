// Compatible con data-api-url del script tag
const getApiUrl = (): string => {
  if (typeof window === 'undefined') return 'http://localhost:3001';
  
  const script = document.currentScript as HTMLScriptElement;
  const apiUrl = script?.getAttribute('data-api-url');
  return apiUrl || 'http://localhost:3001';
};

export class WidgetApiClient {
  private baseUrl: string;
  private siteKey: string;

  constructor(siteKey: string, baseUrl?: string) {
    this.siteKey = siteKey;
    this.baseUrl = baseUrl || getApiUrl();
  }

  async init(visitorId?: string) {
    const response = await fetch(`${this.baseUrl}/v1/widget/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-site-key': this.siteKey,
      },
      body: JSON.stringify({
        visitorId,
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
      }),
    });

    if (!response.ok) {
      throw new Error(`Widget init failed: ${response.statusText}`);
    }

    return response.json();
  }

  async sendMessage(conversationId: string | null, content: string) {
    const response = await fetch(`${this.baseUrl}/v1/widget/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-site-key': this.siteKey,
      },
      body: JSON.stringify({
        conversationId: conversationId || undefined,
        content,
      }),
    });

    if (!response.ok) {
      throw new Error(`Send message failed: ${response.statusText}`);
    }

    return response.json();
  }
}

