import { BotsService } from './bots.service';
export declare class BotsController {
    private readonly botsService;
    constructor(botsService: BotsService);
    findAll(): Promise<any>;
    create(body: any): Promise<any>;
    findOne(botId: string): Promise<any>;
    update(botId: string, body: any): Promise<any>;
    remove(botId: string): Promise<any>;
    getFlow(botId: string): Promise<any>;
    updateFlow(botId: string, body: any): Promise<any>;
}
