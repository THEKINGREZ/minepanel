import { Module } from '@nestjs/common';
import { ServerManagementController } from './server-management.controller';
import { ServerManagementService } from './server-management.service';
import { DockerComposeService } from 'src/docker-compose/docker-compose.service';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';

@Module({
  imports: [],
  controllers: [AppController, ServerManagementController],
  providers: [AppService, DockerComposeService, ServerManagementService],
})
export class ServerManagementModule {}
