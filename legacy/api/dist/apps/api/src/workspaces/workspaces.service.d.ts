import { DatabaseService } from '../config/database.service';
export declare class WorkspacesService {
    private readonly dbService;
    constructor(dbService: DatabaseService);
    findAll(userId: string): Promise<{
        data: {
            id: string;
            name: string;
            plan: string;
            businessModel: string;
            industry: string;
            conversationsRange: string;
            visitorsRange: string;
            platform: string;
            agentCount: string;
            goalId: string;
            useAi: boolean;
            createdAt: Date;
        }[];
        total: number;
    }>;
    create(userId: string, body: {
        name: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            plan: string;
            businessModel: string;
            industry: string;
            conversationsRange: string;
            visitorsRange: string;
            platform: string;
            agentCount: string;
            goalId: string;
            useAi: boolean;
            createdAt: Date;
        };
    }>;
    findOne(workspaceId: string, userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            plan: string;
            businessModel: string;
            industry: string;
            conversationsRange: string;
            visitorsRange: string;
            platform: string;
            agentCount: string;
            goalId: string;
            useAi: boolean;
            createdAt: Date;
        };
    }>;
    update(workspaceId: string, userId: string, body: any): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            plan: string;
            businessModel: string;
            industry: string;
            conversationsRange: string;
            visitorsRange: string;
            platform: string;
            agentCount: string;
            goalId: string;
            useAi: boolean;
            createdAt: Date;
        };
    }>;
    remove(workspaceId: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
