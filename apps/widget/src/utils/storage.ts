const VISITOR_ID_KEY = 'saas_chat_visitor_id';

export const storage = {
  getVisitorId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(VISITOR_ID_KEY);
  },

  setVisitorId(visitorId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  },

  removeVisitorId(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(VISITOR_ID_KEY);
  },
};

