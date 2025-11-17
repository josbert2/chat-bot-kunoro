import { AuthService } from './auth.service';
import { AuthContext } from '../common/decorators/bearer-auth.decorator';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        name: string;
        email: string;
        password: string;
    }): Promise<any>;
    login(body: {
        email: string;
        password: string;
    }): Promise<any>;
    refresh(body: {
        refreshToken: string;
    }): Promise<any>;
    getMe(auth: AuthContext): Promise<any>;
}
