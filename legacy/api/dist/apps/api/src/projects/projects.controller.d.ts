import { ProjectsService } from './projects.service';
import { AuthContext } from '../common/guards/bearer-auth.guard';
import { WidgetConfig } from '@saas-chat/core-types';
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
            widgetConfig: WidgetConfig;
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
        config: WidgetConfig;
    } | {
        appId: string;
        config: WidgetConfig;
    }>;
    findOne(auth: AuthContext, projectId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            appId: string;
            domain: string;
            widgetConfig: WidgetConfig;
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
        config: WidgetConfig;
    }>;
    updateWidgetConfig(auth: AuthContext, projectId: string, body: WidgetConfig): Promise<{
        success: boolean;
        data: {
            id: string;
            widgetConfig: WidgetConfig;
        };
    }>;
}
