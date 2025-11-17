export declare class EndUsersService {
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
