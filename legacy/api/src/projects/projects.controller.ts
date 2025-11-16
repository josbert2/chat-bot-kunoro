import { Controller, Get, Post, Patch, Delete, Param, Body, Headers, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { BearerAuth } from '../common/decorators/bearer-auth.decorator';
import { BearerAuthGuard, AuthContext } from '../common/guards/bearer-auth.guard';
import { UseGuards } from '@nestjs/common';
import { WidgetConfig } from '@saas-chat/core-types';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @UseGuards(BearerAuthGuard)
  async findAll(@BearerAuth() auth: AuthContext) {
    return this.projectsService.findAll(auth.account.id);
  }

  @Post()
  @UseGuards(BearerAuthGuard)
  async create(@BearerAuth() auth: AuthContext, @Body() body: { name: string; domain?: string }) {
    return this.projectsService.create(auth.account.id, body);
  }

  @Get('widget/config')
  async getWidgetConfigByAppId(@Query('appId') appId: string) {
    // Endpoint público para obtener configuración del widget por appId
    return this.projectsService.getWidgetConfig(appId);
  }

  @Get(':projectId')
  @UseGuards(BearerAuthGuard)
  async findOne(@BearerAuth() auth: AuthContext, @Param('projectId') projectId: string) {
    return this.projectsService.findOne(projectId, auth.account.id);
  }

  @Patch(':projectId')
  @UseGuards(BearerAuthGuard)
  async update(@BearerAuth() auth: AuthContext, @Param('projectId') projectId: string, @Body() body: any) {
    return this.projectsService.update(projectId, auth.account.id, body);
  }

  @Delete(':projectId')
  @UseGuards(BearerAuthGuard)
  async remove(@BearerAuth() auth: AuthContext, @Param('projectId') projectId: string) {
    return this.projectsService.remove(projectId, auth.account.id);
  }

  @Get(':projectId/widget')
  @UseGuards(BearerAuthGuard)
  async getWidgetConfig(@BearerAuth() auth: AuthContext, @Param('projectId') projectId: string) {
    const site = await this.projectsService.findOne(projectId, auth.account.id);
    return {
      appId: site.data.appId,
      config: site.data.widgetConfig,
    };
  }

  @Patch(':projectId/widget')
  @UseGuards(BearerAuthGuard)
  async updateWidgetConfig(@BearerAuth() auth: AuthContext, @Param('projectId') projectId: string, @Body() body: WidgetConfig) {
    return this.projectsService.updateWidgetConfig(projectId, auth.account.id, body);
  }
}

