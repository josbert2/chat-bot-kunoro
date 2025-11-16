import { BillingService } from './billing.service';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    getPlans(): Promise<any>;
    getWorkspaceBilling(workspaceId: string): Promise<any>;
    createCheckout(workspaceId: string, body: any): Promise<any>;
}
