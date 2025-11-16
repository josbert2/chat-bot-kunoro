import { DatabaseService } from '../config/database.service';
import { WidgetConfig } from '@saas-chat/core-types';
export declare class ProjectsService {
    private readonly dbService;
    constructor(dbService: DatabaseService);
    findAll(accountId: string): Promise<{
        success: boolean;
        data: any;
        total: any;
    }>;
    create(accountId: string, body: {
        name: string;
        domain?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            appId: any;
            domain: any;
            widgetSnippet: string;
        };
    }>;
    findOne(projectId: string, accountId: string): Promise<{
        success: boolean;
        data: {
            id: any;
            name: any;
            appId: any;
            domain: any;
            widgetConfig: any;
            createdAt: any;
        };
    }>;
    findByAppId(appId: string): Promise<{
        appId: string;
        site: {
            id: any;
            name: any;
            domain: any;
        };
        config: any;
    }>;
    update(projectId: string, accountId: string, body: any): Promise<{
        success: boolean;
        data: any;
    }>;
    remove(projectId: string, accountId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getWidgetConfig(appId: string): Promise<{
        appId: string;
        site: {
            id: any;
            name: any;
            domain: any;
        };
        config: any;
    } | {
        appId: string;
        config: any;
    }>;
    updateWidgetConfig(projectId: string, accountId: string, config: WidgetConfig): Promise<{
        success: boolean;
        data: {
            id: any;
            widgetConfig: any;
        };
    }>;
}
