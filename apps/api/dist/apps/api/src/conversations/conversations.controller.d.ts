import { ConversationsService } from './conversations.service';
export declare class ConversationsController {
    private readonly conversationsService;
    constructor(conversationsService: ConversationsService);
    findAll(query: any): Promise<any>;
    findOne(conversationId: string): Promise<any>;
    update(conversationId: string, body: any): Promise<any>;
}
