export declare class ChannelsService {
    findAll(): Promise<{
        message: string;
    }>;
    create(body: any): Promise<{
        message: string;
    }>;
    findOne(channelId: string): Promise<{
        message: string;
    }>;
    update(channelId: string, body: any): Promise<{
        message: string;
    }>;
    remove(channelId: string): Promise<{
        message: string;
    }>;
}
