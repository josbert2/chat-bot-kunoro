import { AuthService } from './auth.service';
import { AuthContext } from '../common/decorators/bearer-auth.decorator';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
        workspace: {
            id: string;
            name: string;
            plan: string;
        } | null;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
        workspace: {
            id: string;
            name: string;
            plan: string;
        } | null;
    }>;
    refresh(body: {
        refreshToken: string;
    }): Promise<void>;
    getMe(auth: AuthContext): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        workspace: {
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
}
