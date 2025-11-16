import { WorkspacesService } from './workspaces.service';
import { AuthContext } from '../common/decorators/bearer-auth.decorator';
export declare class WorkspacesController {
    private readonly workspacesService;
    constructor(workspacesService: WorkspacesService);
    findAll(auth: AuthContext): Promise<{
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
    create(auth: AuthContext, body: {
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
    findOne(auth: AuthContext, workspaceId: string): Promise<{
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
    update(auth: AuthContext, workspaceId: string, body: any): Promise<{
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
    remove(auth: AuthContext, workspaceId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
