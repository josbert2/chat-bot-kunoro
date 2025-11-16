import { AutomationsService } from './automations.service';
export declare class AutomationsController {
    private readonly automationsService;
    constructor(automationsService: AutomationsService);
    findAll(): Promise<any>;
    create(body: any): Promise<any>;
    findOne(automationId: string): Promise<any>;
    update(automationId: string, body: any): Promise<any>;
    remove(automationId: string): Promise<any>;
}
