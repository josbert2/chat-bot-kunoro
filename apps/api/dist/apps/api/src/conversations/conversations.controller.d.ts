import { ConversationsService } from './conversations.service';
export declare class ConversationsController {
    private readonly conversationsService;
    constructor(conversationsService: ConversationsService);
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
