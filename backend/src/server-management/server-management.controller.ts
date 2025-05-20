import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ServerConfig } from '../models/server-config.model';
import { DockerComposeService } from 'src/docker-compose/docker-compose.service';
import { ServerManagementService } from './server-management.service';

@Controller('servers')
export class ServerManagementController {
  constructor(
    private readonly dockerComposeService: DockerComposeService,
    private readonly managementService: ServerManagementService,
  ) {}

  @Get()
  async getAllServers() {
    return this.dockerComposeService.getAllServerConfigs();
  }

  @Get(':id')
  async getServer(@Param('id') id: string) {
    const config = await this.dockerComposeService.getServerConfig(id);
    if (!config) {
      throw new NotFoundException(`Server with ID "${id}" not found`);
    }
    return config;
  }

  @Post(':id')
  async updateServer(
    @Param('id') id: string,
    @Body() config: Partial<ServerConfig>,
  ) {
    const updatedConfig = await this.dockerComposeService.updateServerConfig(
      id,
      config,
    );
    if (!updatedConfig) {
      throw new NotFoundException(`Server with ID "${id}" not found`);
    }
    return updatedConfig;
  }

  @Post(':id/restart')
  async restartServer() {
    const result = await this.managementService.restartServer();
    return {
      success: result,
      message: result
        ? 'Server restarted successfully'
        : 'Failed to restart server',
    };
  }

  @Post(':id/clear-data')
  async clearServerData(@Param('id') id: string) {
    const config = await this.dockerComposeService.getServerConfig(id);
    if (!config) {
      throw new NotFoundException(`Server with ID "${id}" not found`);
    }

    const result = await this.managementService.clearServerData(id);
    return {
      success: result,
      message: result
        ? 'Server data cleared successfully'
        : 'Failed to clear server data',
    };
  }

  @Get(':id/status')
  async getServerStatus() {
    const status = await this.managementService.getServerStatus();
    return { status };
  }
}
