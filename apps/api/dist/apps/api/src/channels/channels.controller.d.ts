import { ChannelsService } from './channels.service';
export declare class ChannelsController {
    private readonly channelsService;
    constructor(channelsService: ChannelsService);
    findAll(): Promise<any>;
    create(body: any): Promise<any>;
    findOne(channelId: string): Promise<any>;
    update(channelId: string, body: any): Promise<any>;
    remove(channelId: string): Promise<any>;
}
