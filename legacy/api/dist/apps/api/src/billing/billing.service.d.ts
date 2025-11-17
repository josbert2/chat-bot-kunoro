export declare class BillingService {
    getPlans(): Promise<{
        message: string;
    }>;
    getWorkspaceBilling(workspaceId: string): Promise<{
        message: string;
    }>;
    createCheckout(workspaceId: string, body: any): Promise<{
        message: string;
    }>;
}
