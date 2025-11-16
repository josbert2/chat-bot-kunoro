import { EndUsersService } from './end-users.service';
export declare class EndUsersController {
    private readonly endUsersService;
    constructor(endUsersService: EndUsersService);
    findAll(query: any): Promise<{
        message: string;
    }>;
    findOne(endUserId: string): Promise<{
        message: string;
    }>;
    update(endUserId: string, body: any): Promise<{
        message: string;
    }>;
}
