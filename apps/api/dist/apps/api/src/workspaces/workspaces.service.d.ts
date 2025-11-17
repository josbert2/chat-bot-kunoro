import { DatabaseService } from '../config/database.service';
export declare class WorkspacesService {
    private readonly dbService;
    constructor(dbService: DatabaseService);
    findAll(userId: string): Promise<{
        data: any[];
        total: number;
    }>;
    create(userId: string, body: {
        name: string;
    }): Promise<{
        success: boolean;
        data: any;
    }>;
    findOne(workspaceId: string, userId: string): Promise<{
        success: boolean;
        data: any;
    }>;
    update(workspaceId: string, userId: string, body: any): Promise<{
        success: boolean;
        data: any;
    }>;
    remove(workspaceId: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
