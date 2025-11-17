import { Server } from 'socket.io';
import { MessagesService } from './messages.service';
export declare class MessagesGateway {
    private readonly messagesService;
    server: Server;
    constructor(messagesService: MessagesService);
    handleMessage(data: any): {
        event: string;
        data: any;
    };
}
