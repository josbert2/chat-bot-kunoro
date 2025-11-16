import { DatabaseService } from '../config/database.service';
import { WidgetConfig } from '@saas-chat/core-types';
export declare class ProjectsService {
    private readonly dbService;
    constructor(dbService: DatabaseService);
    findAll(accountId: string): Promise<{
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
    create(accountId: string, body: {
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
    findOne(projectId: string, accountId: string): Promise<{
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
    findByAppId(appId: string): Promise<{
        appId: string;
        site: {
            id: string;
            name: string;
            domain: string;
        };
        config: any;
    }>;
    update(projectId: string, accountId: string, body: any): Promise<{
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
    remove(projectId: string, accountId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getWidgetConfig(appId: string): Promise<{
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
    updateWidgetConfig(projectId: string, accountId: string, config: WidgetConfig): Promise<{
        success: boolean;
        data: {
            id: string;
            widgetConfig: any;
        };
    }>;
}
