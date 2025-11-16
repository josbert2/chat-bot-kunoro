import { BotsService } from './bots.service';
export declare class BotsController {
    private readonly botsService;
    constructor(botsService: BotsService);
    findAll(): Promise<{
        message: string;
    }>;
    create(body: any): Promise<{
        message: string;
    }>;
    findOne(botId: string): Promise<{
        message: string;
    }>;
    update(botId: string, body: any): Promise<{
        message: string;
    }>;
    remove(botId: string): Promise<{
        message: string;
    }>;
    getFlow(botId: string): Promise<{
        message: string;
    }>;
    updateFlow(botId: string, body: any): Promise<{
        message: string;
    }>;
}
