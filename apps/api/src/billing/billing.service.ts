import { Injectable } from '@nestjs/common';

@Injectable()
export class BillingService {
  async getPlans() {
    return { message: 'GetPlans - to be implemented' };
  }

  async getWorkspaceBilling(workspaceId: string) {
    return { message: 'GetWorkspaceBilling - to be implemented' };
  }

  async createCheckout(workspaceId: string, body: any) {
    return { message: 'CreateCheckout - to be implemented' };
  }
}

