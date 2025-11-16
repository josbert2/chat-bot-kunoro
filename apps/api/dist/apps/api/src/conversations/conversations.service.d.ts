export declare class ConversationsService {
    findAll(query: any): Promise<{
        message: string;
    }>;
    findOne(conversationId: string): Promise<{
        message: string;
    }>;
    update(conversationId: string, body: any): Promise<{
        message: string;
    }>;
}
