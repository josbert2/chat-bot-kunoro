import { CanActivate, ExecutionContext } from '@nestjs/common';
import { DatabaseService } from '../../config/database.service';
export interface AuthContext {
    token: {
        id: string;
        name: string;
        accountId: string;
        userId: string;
        scopes: string[];
    };
    account: {
        id: string;
        name: string;
        plan: string;
    };
    user: {
        id: string;
        name: string;
        email: string;
    };
}
export declare class BearerAuthGuard implements CanActivate {
    private readonly dbService;
    constructor(dbService: DatabaseService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private validateBearerToken;
}
