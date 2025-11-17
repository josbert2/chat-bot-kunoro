export declare class JobsService {
    enqueueJob(jobType: string, data: any): Promise<{
        message: string;
    }>;
}
