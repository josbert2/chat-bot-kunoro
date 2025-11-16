import { BillingService } from './billing.service';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
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
