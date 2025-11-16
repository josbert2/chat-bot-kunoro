import { EndUsersService } from './end-users.service';
export declare class EndUsersController {
    private readonly endUsersService;
    constructor(endUsersService: EndUsersService);
    findAll(query: any): Promise<any>;
    findOne(endUserId: string): Promise<any>;
    update(endUserId: string, body: any): Promise<any>;
}
