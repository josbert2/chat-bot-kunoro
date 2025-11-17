export declare class MessagesService {
    create(conversationId: string, content: string, authorType: string): Promise<{
        message: string;
    }>;
    findByConversation(conversationId: string): Promise<{
        message: string;
    }>;
}
