import { WorkspacesService } from './workspaces.service';
import { AuthContext } from '../common/decorators/bearer-auth.decorator';
export declare class WorkspacesController {
    private readonly workspacesService;
    constructor(workspacesService: WorkspacesService);
    findAll(auth: AuthContext): Promise<any>;
    create(auth: AuthContext, body: {
        name: string;
    }): Promise<any>;
    findOne(auth: AuthContext, workspaceId: string): Promise<any>;
    update(auth: AuthContext, workspaceId: string, body: any): Promise<any>;
    remove(auth: AuthContext, workspaceId: string): Promise<any>;
}
