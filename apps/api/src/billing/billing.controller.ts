import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('billing')
@UseGuards() // TODO: Agregar guard de autenticación
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('plans')
  async getPlans() {
    return this.billingService.getPlans();
  }

  @Get('workspaces/:workspaceId/billing')
  async getWorkspaceBilling(@Param('workspaceId') workspaceId: string) {
    return this.billingService.getWorkspaceBilling(workspaceId);
  }

  @Post('workspaces/:workspaceId/billing/checkout')
  async createCheckout(@Param('workspaceId') workspaceId: string, @Body() body: any) {
    return this.billingService.createCheckout(workspaceId, body);
  }
}

