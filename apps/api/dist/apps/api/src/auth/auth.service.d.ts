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
            id: any;
            name: any;
            email: any;
        };
        workspace: any;
    }>;
    private generateToken;
}
export {};
