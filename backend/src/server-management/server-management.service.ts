import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs-extra';

const execAsync = promisify(exec);

@Injectable()
export class ServerManagementService {
  private readonly DOCKER_COMPOSE_PATH = path.join(
    process.cwd(),
    '..',
    'docker-compose.yml',
  );
  private readonly DATA_DIR = path.join(process.cwd(), '..', 'mc-data');

  async restartServer(): Promise<boolean> {
    try {
      if (!(await fs.pathExists(this.DOCKER_COMPOSE_PATH))) {
        console.error(`Docker compose file does not exist`);
        return false;
      }

      // Execute docker-compose commands from the directory containing the docker-compose.yml
      const composeDir = path.dirname(this.DOCKER_COMPOSE_PATH);

      // Stop the server if it's running
      await execAsync('docker-compose down', { cwd: composeDir });
      // Start the server
      await execAsync('docker-compose up -d', { cwd: composeDir });

      return true;
    } catch (error) {
      console.error(`Failed to restart server:`, error);
      return false;
    }
  }

  async clearServerData(serverId: string): Promise<boolean> {
    try {
      const serverDataDir = path.join(this.DATA_DIR, serverId);

      if (await fs.pathExists(serverDataDir)) {
        // Stop the server first
        if (await fs.pathExists(this.DOCKER_COMPOSE_PATH)) {
          const composeDir = path.dirname(this.DOCKER_COMPOSE_PATH);
          await execAsync('docker-compose down', { cwd: composeDir });
        }

        // Remove server data
        await fs.remove(serverDataDir);

        // Create empty directory
        await fs.ensureDir(serverDataDir);

        return true;
      }

      return false;
    } catch (error) {
      console.error(`Failed to clear data for server "${serverId}":`, error);
      return false;
    }
  }

  async getServerStatus(): Promise<'running' | 'stopped' | 'not_found'> {
    try {
      const { stdout } = await execAsync(
        `docker ps --filter "name=mineminenomi_mc" --format "{{.Names}}"`,
      );

      if (stdout.trim()) {
        return 'running';
      }

      // Check if container exists but not running
      const { stdout: allContainers } = await execAsync(
        `docker ps -a --filter "name=mineminenomi_mc" --format "{{.Names}}"`,
      );

      if (allContainers.trim()) {
        return 'stopped';
      }

      return 'not_found';
    } catch (error) {
      console.error(`Failed to get server status:`, error);
      return 'not_found';
    }
  }
}
