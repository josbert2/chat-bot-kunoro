import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    suggestReply(body: {
        conversationId: string;
        lastMessage: string;
    }): Promise<any>;
}
