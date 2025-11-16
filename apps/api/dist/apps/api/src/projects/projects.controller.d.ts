import { ProjectsService } from './projects.service';
import { AuthContext } from '../common/guards/bearer-auth.guard';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(auth: AuthContext): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            appId: string;
            domain: string;
            widgetConfig: any;
            createdAt: string;
            widgetSnippet: string;
        }[];
        total: number;
    }>;
    create(auth: AuthContext, body: {
        name: string;
        domain?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            appId: string;
            domain: string;
            widgetSnippet: string;
        };
    }>;
    getWidgetConfigByAppId(appId: string): Promise<{
        appId: string;
        site: {
            id: string;
            name: string;
            domain: string;
        };
        config: any;
    } | {
        appId: string;
        config: any;
    }>;
    findOne(auth: AuthContext, projectId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            appId: string;
            domain: string;
            widgetConfig: any;
            createdAt: string;
        };
    }>;
    update(auth: AuthContext, projectId: string, body: any): Promise<{
        success: boolean;
        data: {
            id: string;
            accountId: string;
            name: string;
            appId: string;
            domain: string;
            widgetConfigJson: string;
            createdAt: Date;
        };
    }>;
    remove(auth: AuthContext, projectId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getWidgetConfig(auth: AuthContext, projectId: string): Promise<{
        appId: string;
        config: any;
    }>;
    updateWidgetConfig(auth: AuthContext, projectId: string, body: any): Promise<{
        success: boolean;
        data: {
            id: string;
            widgetConfig: any;
        };
    }>;
}
