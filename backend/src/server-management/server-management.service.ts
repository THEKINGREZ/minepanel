import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs-extra';

const execAsync = promisify(exec);

@Injectable()
export class ServerManagementService {
  private readonly BASE_DIR = path.join(process.cwd(), '..', 'servers');

  private getDockerComposePath(serverId: string): string {
    return path.join(this.BASE_DIR, serverId, 'docker-compose.yml');
  }

  private getMcDataPath(serverId: string): string {
    return path.join(this.BASE_DIR, serverId, 'mc-data');
  }

  async restartServer(serverId: string): Promise<boolean> {
    try {
      const dockerComposePath = this.getDockerComposePath(serverId);
      if (!(await fs.pathExists(dockerComposePath))) {
        console.error(`Docker compose file does not exist for server ${serverId}`);
        return false;
      }

      // Execute docker-compose commands from the directory containing the docker-compose.yml
      const composeDir = path.dirname(dockerComposePath);

      // Stop the server if it's running
      await execAsync('docker-compose down', { cwd: composeDir });
      // Start the server
      await execAsync('docker-compose up -d', { cwd: composeDir });

      return true;
    } catch (error) {
      console.error(`Failed to restart server ${serverId}:`, error);
      return false;
    }
  }

  async clearServerData(serverId: string): Promise<boolean> {
    try {
      const serverDataDir = this.getMcDataPath(serverId);
      const dockerComposePath = this.getDockerComposePath(serverId);

      if (await fs.pathExists(dockerComposePath)) {
        // Stop the server first
        const composeDir = path.dirname(dockerComposePath);
        await execAsync('docker-compose down', { cwd: composeDir });
      }

      if (await fs.pathExists(serverDataDir)) {
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

  async getServerStatus(serverId: string): Promise<'running' | 'stopped' | 'starting' | 'not_found'> {
    try {
      // First check if the directory exists
      if (!(await fs.pathExists(path.join(this.BASE_DIR, serverId)))) {
        return 'not_found';
      }

      // Container name would be something like `serverId_mc_1`
      const containerNamePattern = `${serverId}_mc_1`;

      // Get container status with more details
      const { stdout } = await execAsync(`docker ps --filter "name=${containerNamePattern}" --format "{{.Names}}:{{.Status}}"`);

      if (stdout.trim()) {
        // Check if the status indicates it's still starting
        // Docker status can include "Up X seconds" or
        // "health: starting" for containers with health checks
        if (stdout.includes('starting') || (stdout.includes('Up') && stdout.includes('seconds'))) {
          return 'starting';
        }
        return 'running';
      }

      // Check if container exists but not running
      const { stdout: allContainers } = await execAsync(`docker ps -a --filter "name=${containerNamePattern}" --format "{{.Names}}:{{.Status}}"`);

      if (allContainers.trim()) {
        // Check if container is in a transitional state like restarting
        if (allContainers.includes('Restarting') || allContainers.includes('Created')) {
          return 'starting';
        }
        return 'stopped';
      }

      // If docker-compose file exists but no container, consider it stopped
      if (await fs.pathExists(this.getDockerComposePath(serverId))) {
        return 'stopped';
      }

      return 'not_found';
    } catch (error) {
      console.error(`Failed to get status for server ${serverId}:`, error);
      return 'not_found';
    }
  }

  async getAllServersStatus(): Promise<{ [serverId: string]: 'running' | 'stopped' | 'starting' | 'not_found' }> {
    try {
      // Primero, obtener la lista de directorios de servidores
      const directories = await fs.readdir(this.BASE_DIR);
      const serverDirectories = await Promise.all(
        directories.map(async (dir) => {
          const fullPath = path.join(this.BASE_DIR, dir);
          const isDirectory = (await fs.stat(fullPath)).isDirectory();
          const hasDockerCompose = await fs.pathExists(this.getDockerComposePath(dir));
          // Solo considerar como servidor si es un directorio y tiene un docker-compose.yml
          return isDirectory && hasDockerCompose ? dir : null;
        }),
      );

      // Filtrar los nulos y obtener el estado de cada servidor
      const validServerDirectories = serverDirectories.filter(Boolean);
      const statusPromises = validServerDirectories.map(async (serverId) => {
        return { serverId, status: await this.getServerStatus(serverId) };
      });

      // Esperar todas las promesas de estado
      const statusResults = await Promise.all(statusPromises);

      // Convertir a objeto con pares clave-valor
      const result = statusResults.reduce((acc, { serverId, status }) => {
        acc[serverId] = status;
        return acc;
      }, {});

      return result;
    } catch (error) {
      console.error('Error al obtener el estado de todos los servidores:', error);
      return {};
    }
  }

  async getServerInfo(serverId: string): Promise<any> {
    try {
      const status = await this.getServerStatus(serverId);
      if (status === 'not_found') {
        return {
          exists: false,
          status,
        };
      }

      const dockerComposePath = this.getDockerComposePath(serverId);
      const mcDataPath = this.getMcDataPath(serverId);

      const dockerComposeExists = await fs.pathExists(dockerComposePath);
      const mcDataExists = await fs.pathExists(mcDataPath);

      let worldSize = 0;
      let lastUpdated = null;

      if (mcDataExists) {
        // Calculate directory size
        const worldPath = path.join(mcDataPath, 'world');
        if (await fs.pathExists(worldPath)) {
          const { stdout } = await execAsync(`du -sb "${worldPath}" | cut -f1`);
          worldSize = parseInt(stdout.trim(), 10);

          // Get last modified time
          const stats = await fs.stat(worldPath);
          lastUpdated = stats.mtime;
        }
      }

      return {
        exists: true,
        status,
        dockerComposeExists,
        mcDataExists,
        worldSize,
        lastUpdated,
        worldSizeFormatted: this.formatBytes(worldSize),
      };
    } catch (error) {
      console.error(`Failed to get info for server ${serverId}:`, error);
      return {
        exists: false,
        status: 'error',
        error: error.message,
      };
    }
  }

  async deleteServer(serverId: string): Promise<boolean> {
    try {
      const serverDir = path.join(this.BASE_DIR, serverId);
      const dockerComposePath = this.getDockerComposePath(serverId);

      // Check if server exists
      if (!(await fs.pathExists(serverDir))) {
        console.error(`Server directory does not exist for server ${serverId}`);
        return false;
      }

      // If docker-compose exists, stop the server first
      if (await fs.pathExists(dockerComposePath)) {
        const composeDir = path.dirname(dockerComposePath);
        try {
          // Stop any running containers
          await execAsync('docker-compose down', { cwd: composeDir });
        } catch (error) {
          console.warn(`Warning: Could not stop server ${serverId} before deletion:`, error);
          // Continue with deletion even if stopping fails
        }
      }

      // Delete the server directory
      await fs.remove(serverDir);

      // Remove any docker volumes associated with this server
      try {
        // Look for volumes with this server name pattern
        const { stdout: volumeList } = await execAsync(`docker volume ls --filter "name=${serverId}" --format "{{.Name}}"`);

        if (volumeList.trim()) {
          const volumes = volumeList.trim().split('\n');
          for (const volume of volumes) {
            await execAsync(`docker volume rm ${volume}`);
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not clean up docker volumes for ${serverId}:`, error);
        // Continue with deletion even if volume cleanup fails
      }

      return true;
    } catch (error) {
      console.error(`Failed to delete server ${serverId}:`, error);
      return false;
    }
  }

  async getServerResources(serverId: string): Promise<{
    cpuUsage: string;
    memoryUsage: string;
    memoryLimit: string;
    diskUsage: string;
  }> {
    try {
      // Container name pattern
      const containerNamePattern = `${serverId}_mc_1`;

      // Get container ID
      const { stdout: containerId } = await execAsync(`docker ps --filter "name=${containerNamePattern}" --format "{{.ID}}"`);

      if (!containerId.trim()) {
        throw new Error('Container not found or not running');
      }

      // Get CPU usage
      const { stdout: cpuStats } = await execAsync(`docker stats ${containerId.trim()} --no-stream --format "{{.CPUPerc}}"`);

      // Get memory usage
      const { stdout: memStats } = await execAsync(`docker stats ${containerId.trim()} --no-stream --format "{{.MemUsage}}"`);

      // Split memory usage into used and limit
      const memoryParts = memStats.trim().split(' / ');
      const memoryUsage = memoryParts[0];
      const memoryLimit = memoryParts[1] || 'N/A';

      // Get disk usage for the server directory
      const mcDataPath = this.getMcDataPath(serverId);
      let diskUsage = 'N/A';

      if (await fs.pathExists(mcDataPath)) {
        const { stdout: diskStats } = await execAsync(`du -sh "${mcDataPath}" | cut -f1`);
        diskUsage = diskStats.trim();
      }

      return {
        cpuUsage: cpuStats.trim(),
        memoryUsage,
        memoryLimit,
        diskUsage,
      };
    } catch (error) {
      console.error(`Failed to get resource usage for server ${serverId}:`, error);
      return {
        cpuUsage: 'N/A',
        memoryUsage: 'N/A',
        memoryLimit: 'N/A',
        diskUsage: 'N/A',
      };
    }
  }

  // Helper to format bytes to a human-readable format
  private formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  async getServerLogs(serverId: string, lines: number = 100): Promise<{ logs: string }> {
    try {
      // Check if the server exists
      if (!(await fs.pathExists(path.join(this.BASE_DIR, serverId)))) {
        return { logs: 'Server not found' };
      }

      // Container name would be something like `serverId_mc_1` or `serverId-mc-1`
      const containerNamePattern = `${serverId}_mc_1`;

      // Get container ID
      const { stdout: containerId } = await execAsync(`docker ps -a --filter "name=${containerNamePattern}" --format "{{.ID}}"`);

      if (!containerId.trim()) {
        return { logs: 'Container not found' };
      }

      // Get logs from the container
      const { stdout: logs } = await execAsync(`docker logs --tail ${lines} ${containerId.trim()}`);

      return { logs };
    } catch (error) {
      console.error(`Failed to get logs for server ${serverId}:`, error);
      return { logs: `Error retrieving logs: ${error.message}` };
    }
  }

  async executeCommand(serverId: string, command: string): Promise<{ success: boolean; output: string }> {
    try {
      // Verificar si el servidor existe
      if (!(await fs.pathExists(path.join(this.BASE_DIR, serverId)))) {
        return {
          success: false,
          output: 'Servidor no encontrado',
        };
      }

      // Obtener el ID del contenedor
      const containerNamePattern = `${serverId}_mc_1`;
      const { stdout: containerId } = await execAsync(`docker ps --filter "name=${containerNamePattern}" --format "{{.ID}}"`);

      if (!containerId.trim()) {
        return {
          success: false,
          output: 'Contenedor no encontrado o no está en ejecución',
        };
      }

      // Ejecutar el comando en la consola RCON del servidor Minecraft
      // Se usa docker exec para ejecutar el comando rcon-cli dentro del contenedor
      const { stdout, stderr } = await execAsync(`docker exec ${containerId.trim()} rcon-cli ${command}`);

      if (stderr) {
        return {
          success: false,
          output: `Error al ejecutar comando: ${stderr}`,
        };
      }

      return {
        success: true,
        output: stdout || 'Comando ejecutado correctamente',
      };
    } catch (error) {
      console.error(`Error al ejecutar comando en servidor ${serverId}:`, error);
      return {
        success: false,
        output: `Error: ${error.message}`,
      };
    }
  }

  async startServer(serverId: string): Promise<boolean> {
    try {
      const dockerComposePath = this.getDockerComposePath(serverId);
      if (!(await fs.pathExists(dockerComposePath))) {
        console.error(`Docker compose file does not exist for server ${serverId}`);
        return false;
      }

      // Execute docker-compose commands from the directory containing the docker-compose.yml
      const composeDir = path.dirname(dockerComposePath);

      await execAsync('docker-compose down', { cwd: composeDir });

      // Start the server
      await execAsync('docker-compose up -d', { cwd: composeDir });

      return true;
    } catch (error) {
      console.error(`Failed to start server ${serverId}:`, error);
      return false;
    }
  }

  async stopServer(serverId: string): Promise<boolean> {
    try {
      const dockerComposePath = this.getDockerComposePath(serverId);
      if (!(await fs.pathExists(dockerComposePath))) {
        console.error(`Docker compose file does not exist for server ${serverId}`);
        return false;
      }

      // Execute docker-compose commands from the directory containing the docker-compose.yml
      const composeDir = path.dirname(dockerComposePath);

      // Stop the server
      await execAsync('docker-compose down', { cwd: composeDir });

      return true;
    } catch (error) {
      console.error(`Failed to stop server ${serverId}:`, error);
      return false;
    }
  }
}
