import { ChannelsService } from './channels.service';
export declare class ChannelsController {
    private readonly channelsService;
    constructor(channelsService: ChannelsService);
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
