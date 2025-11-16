import { AutomationsService } from './automations.service';
export declare class AutomationsController {
    private readonly automationsService;
    constructor(automationsService: AutomationsService);
    findAll(): Promise<{
        message: string;
    }>;
    create(body: any): Promise<{
        message: string;
    }>;
    findOne(automationId: string): Promise<{
        message: string;
    }>;
    update(automationId: string, body: any): Promise<{
        message: string;
    }>;
    remove(automationId: string): Promise<{
        message: string;
    }>;
}
