import { DatabaseService } from "../config/database.service";
type RegisterBody = {
    name: string;
    email: string;
    password: string;
};
type LoginBody = {
    email: string;
    password: string;
};
type AuthResponse = {
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
};
export declare class AuthService {
    private readonly dbService;
    constructor(dbService: DatabaseService);
    register(body: RegisterBody): Promise<AuthResponse>;
    login(body: LoginBody): Promise<AuthResponse>;
    refresh(refreshToken: string): Promise<void>;
    getMe(userId: string): Promise<{
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
    private generateToken;
}
export {};
