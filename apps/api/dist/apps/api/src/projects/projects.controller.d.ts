import { ProjectsService } from './projects.service';
import { AuthContext } from '../common/guards/bearer-auth.guard';
import { WidgetConfig } from '@saas-chat/core-types';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(auth: AuthContext): Promise<any>;
    create(auth: AuthContext, body: {
        name: string;
        domain?: string;
    }): Promise<any>;
    getWidgetConfigByAppId(appId: string): Promise<any>;
    findOne(auth: AuthContext, projectId: string): Promise<any>;
    update(auth: AuthContext, projectId: string, body: any): Promise<any>;
    remove(auth: AuthContext, projectId: string): Promise<any>;
    getWidgetConfig(auth: AuthContext, projectId: string): Promise<{
        appId: any;
        config: any;
    }>;
    updateWidgetConfig(auth: AuthContext, projectId: string, body: WidgetConfig): Promise<any>;
}
