export declare class AiService {
    suggestReply(conversationId: string, lastMessage: string): Promise<{
        message: string;
    }>;
}
