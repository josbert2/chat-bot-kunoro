export declare class AppController {
    health(): {
        status: string;
        message: string;
        timestamp: string;
    };
    test(): {
        message: string;
        data: {
            backend: string;
            version: string;
            port: string | number;
        };
    };
}
