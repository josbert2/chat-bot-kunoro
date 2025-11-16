import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { BearerAuthGuard } from '../common/guards/bearer-auth.guard';
import { BearerAuth, AuthContext } from '../common/decorators/bearer-auth.decorator';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  @UseGuards(BearerAuthGuard)
  async findAll(@BearerAuth() auth: AuthContext) {
    return this.workspacesService.findAll(auth.user.id);
  }

  @Post()
  @UseGuards(BearerAuthGuard)
  async create(@BearerAuth() auth: AuthContext, @Body() body: { name: string }) {
    return this.workspacesService.create(auth.user.id, body);
  }

  @Get(':workspaceId')
  @UseGuards(BearerAuthGuard)
  async findOne(@BearerAuth() auth: AuthContext, @Param('workspaceId') workspaceId: string) {
    return this.workspacesService.findOne(workspaceId, auth.user.id);
  }

  @Patch(':workspaceId')
  @UseGuards(BearerAuthGuard)
  async update(@BearerAuth() auth: AuthContext, @Param('workspaceId') workspaceId: string, @Body() body: any) {
    return this.workspacesService.update(workspaceId, auth.user.id, body);
  }

  @Delete(':workspaceId')
  @UseGuards(BearerAuthGuard)
  async remove(@BearerAuth() auth: AuthContext, @Param('workspaceId') workspaceId: string) {
    return this.workspacesService.remove(workspaceId, auth.user.id);
  }
}

