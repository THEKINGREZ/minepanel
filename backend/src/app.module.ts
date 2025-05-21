import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DockerComposeService } from './docker-compose/docker-compose.service';
import { ServerManagementService } from './server-management/server-management.service';
import { ServerManagementController } from './server-management/server-management.controller';
import { ServerManagementModule } from './server-management/server-management.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ServerManagementModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController, ServerManagementController],
  providers: [AppService, DockerComposeService, ServerManagementService],
})
export class AppModule {}
