import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { ServerConfig } from '../models/server-config.model';

@Injectable()
export class DockerComposeService {
  private readonly BASE_DIR = path.join(process.cwd(), '..');

  private getDockerComposePath(serverId: string): string {
    return path.join(this.BASE_DIR, serverId, 'docker-compose.yml');
  }

  private getMcDataPath(serverId: string): string {
    return path.join(this.BASE_DIR, serverId, 'mc-data');
  }

  private async loadServerConfigFromDockerCompose(
    serverId: string,
  ): Promise<ServerConfig> {
    const dockerComposePath = this.getDockerComposePath(serverId);

    if (!fs.existsSync(dockerComposePath)) {
      console.error(
        `Docker compose file does not exist for server ${serverId}`,
      );
      return this.createDefaultConfig(serverId);
    }

    try {
      const composeFileContent = await fs.readFile(dockerComposePath, 'utf8');
      const composeConfig = yaml.load(composeFileContent) as any;

      if (!composeConfig.services?.mc) {
        // Create default config if docker-compose.yml doesn't have mc service
        return this.createDefaultConfig(serverId);
      }

      const mcService = composeConfig.services.mc;
      const env = mcService.environment ?? {};
      const resources = mcService.deploy?.resources ?? {};

      // Extract server config from docker-compose
      const serverConfig: ServerConfig = {
        id: serverId,
        active: fs.existsSync(this.getMcDataPath(serverId)),
        serverType: env.TYPE ?? 'VANILLA',

        // General configuration
        serverName: env.MOTD ?? 'TulaCraft',
        port: serverId === 'daily' ? '25565' : '25566',
        difficulty: env.DIFFICULTY ?? 'hard',
        maxPlayers: env.MAX_PLAYERS ?? '10',
        ops: env.OPS ?? 'ketbome',
        timezone: env.TZ ?? 'America/Santiago',
        idleTimeout: env.PLAYER_IDLE_TIMEOUT ?? '60',
        onlineMode: env.ONLINE_MODE === 'true',
        pvp: env.PVP === 'true',
        commandBlock: env.ENABLE_COMMAND_BLOCK === 'true',
        allowFlight: env.ALLOW_FLIGHT === 'true',

        // Resources
        initMemory: env.INIT_MEMORY ?? '6G',
        maxMemory: env.MAX_MEMORY ?? '10G',
        cpuLimit: resources.limits?.cpus ?? '2',
        cpuReservation: resources.reservations?.cpus ?? '0.3',
        memoryReservation: resources.reservations?.memory ?? '4G',
        viewDistance: env.VIEW_DISTANCE ?? '6',
        simulationDistance: env.SIMULATION_DISTANCE ?? '4',

        // Docker
        dockerImage: mcService.image
          ? (mcService.image.split(':')[1] ?? 'latest')
          : 'latest',
        minecraftVersion: env.VERSION,
        dockerVolumes: Array.isArray(mcService.volumes)
          ? mcService.volumes.join('\n')
          : './mc-data:/data\n./modpacks:/modpacks:ro',
        restartPolicy: mcService.restart ?? 'unless-stopped',
        stopDelay: env.STOP_SERVER_ANNOUNCE_DELAY ?? '60',
        rollingLogs: env.ENABLE_ROLLING_LOGS === 'true',
        execDirectly: env.EXEC_DIRECTLY === 'true',
        envVars: '',
      };

      // Add CurseForge specific config
      if (serverConfig.serverType === 'AUTO_CURSEFORGE') {
        serverConfig.cfMethod = env.CF_SERVER_MOD
          ? 'file'
          : env.CF_SLUG
            ? 'slug'
            : 'url';
        serverConfig.cfUrl = env.CF_PAGE_URL ?? '';
        serverConfig.cfSlug = env.CF_SLUG ?? '';
        serverConfig.cfFile = env.CF_SERVER_MOD ?? '';
        serverConfig.cfSync = env.CF_FORCE_SYNCHRONIZE === 'true';
        serverConfig.cfForceInclude = env.CF_FORCE_INCLUDE_MODS ?? '';
        serverConfig.cfExclude = env.CF_EXCLUDE_MODS ?? '';
        serverConfig.cfFilenameMatcher = env.CF_FILENAME_MATCHER ?? '';
      }

      return serverConfig;
    } catch (error) {
      console.error(`Error loading config for server ${serverId}:`, error);
      return this.createDefaultConfig(serverId);
    }
  }

  private createDefaultConfig(id: string): ServerConfig {
    return {
      id,
      active: false,
      serverType: 'VANILLA',

      // General configuration
      serverName: 'TulaCraft',
      port: id === 'daily' ? '25565' : '25566',
      difficulty: 'hard',
      maxPlayers: '10',
      ops: 'ketbome',
      timezone: 'America/Santiago',
      idleTimeout: '60',
      onlineMode: false,
      pvp: true,
      commandBlock: true,
      allowFlight: true,

      // Resources
      initMemory: '6G',
      maxMemory: '10G',
      cpuLimit: '2',
      cpuReservation: '0.3',
      memoryReservation: '4G',
      viewDistance: '6',
      simulationDistance: '4',

      // Docker
      dockerImage: 'latest',
      minecraftVersion: '1.19.2',
      dockerVolumes: './mc-data:/data\n./modpacks:/modpacks:ro',
      restartPolicy: 'unless-stopped',
      stopDelay: '60',
      rollingLogs: true,
      execDirectly: true,
      envVars: '',

      // CurseForge specific
      cfUrl: '',
      cfSlug: '',
      cfFile: '',
      cfApiKey: '',
      cfSync: true,
      cfForceInclude: '',
      cfExclude: '',
      cfFilenameMatcher: '',
    };
  }

  async getAllServerConfigs(): Promise<ServerConfig[]> {
    const serverIds = ['daily', 'weekend'];
    const configs: ServerConfig[] = [];

    for (const id of serverIds) {
      const config = await this.loadServerConfigFromDockerCompose(id);
      configs.push(config);
    }

    return configs;
  }

  async getServerConfig(id: string): Promise<ServerConfig | null> {
    if (!['daily', 'weekend'].includes(id)) {
      return null;
    }

    return this.loadServerConfigFromDockerCompose(id);
  }

  async saveServerConfigs(configs: ServerConfig[]): Promise<void> {
    // Generate docker-compose.yml for each server
    for (const config of configs) {
      await this.generateDockerComposeFile(config);
    }
  }

  async updateServerConfig(
    id: string,
    config: Partial<ServerConfig>,
  ): Promise<ServerConfig | null> {
    if (!['daily', 'weekend'].includes(id)) {
      return null;
    }

    const currentConfig = await this.loadServerConfigFromDockerCompose(id);
    const updatedConfig = { ...currentConfig, ...config };

    await this.generateDockerComposeFile(updatedConfig);
    return updatedConfig;
  }

  private async generateDockerComposeFile(config: ServerConfig): Promise<void> {
    // Create server directory if it doesn't exist
    const serverDir = path.join(this.BASE_DIR, config.id);
    await fs.ensureDir(serverDir);

    // Create environment variables dictionary
    const environment: Record<string, string> = {
      EULA: 'TRUE',
      MOTD: config.serverName,
      DIFFICULTY: config.difficulty,
      MAX_PLAYERS: config.maxPlayers,
      OPS: config.ops,
      TZ: config.timezone,
      INIT_MEMORY: config.initMemory,
      MAX_MEMORY: config.maxMemory,
      TYPE: config.serverType.toUpperCase(),
      VERSION: config.minecraftVersion,
      ONLINE_MODE: String(config.onlineMode),
      PVP: String(config.pvp),
      ENABLE_COMMAND_BLOCK: String(config.commandBlock),
      ALLOW_FLIGHT: String(config.allowFlight),
      VIEW_DISTANCE: config.viewDistance,
      SIMULATION_DISTANCE: config.simulationDistance,
      STOP_SERVER_ANNOUNCE_DELAY: config.stopDelay,
      ENABLE_ROLLING_LOGS: String(config.rollingLogs),
      EXEC_DIRECTLY: String(config.execDirectly),
      PLAYER_IDLE_TIMEOUT: config.idleTimeout,
    };

    // Add type-specific environment variables
    if (config.serverType === 'FORGE' && config.forgeBuild) {
      environment['FORGE_VERSION'] = config.forgeBuild;
    }

    if (config.serverType === 'AUTO_CURSEFORGE') {
      if (config.cfMethod === 'url' && config.cfUrl) {
        environment['CF_PAGE_URL'] = config.cfUrl;
        environment['MODPACK_PLATFORM'] = 'AUTO_CURSEFORGE';
      } else if (config.cfMethod === 'slug' && config.cfSlug) {
        environment['CF_SLUG'] = config.cfSlug;
        environment['MODPACK_PLATFORM'] = 'AUTO_CURSEFORGE';
      } else if (config.cfMethod === 'file' && config.cfFile) {
        environment['CF_SERVER_MOD'] = config.cfFile;
      }

      environment['CF_API_KEY'] =
        '$2a$10$T6sGluhpKpqowKQg6ZSFQ.ZabIa4UGcAxtaQSBd1TiF3ExzWqzcMa';

      if (config.cfSync) {
        environment['CF_FORCE_SYNCHRONIZE'] = 'true';
      }

      if (config.cfForceInclude) {
        environment['CF_FORCE_INCLUDE_MODS'] = config.cfForceInclude;
      }

      if (config.cfExclude) {
        environment['CF_EXCLUDE_MODS'] = config.cfExclude;
      }

      if (config.cfFilenameMatcher) {
        environment['CF_FILENAME_MATCHER'] = config.cfFilenameMatcher;
      }
    }

    // Add custom environment variables
    if (config.envVars) {
      const customEnvVars = config.envVars
        .split('\n')
        .filter((line) => line.trim() !== '')
        .reduce(
          (acc, line) => {
            const [key, value] = line.split('=').map((part) => part.trim());
            if (key && value) {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, string>,
        );

      Object.assign(environment, customEnvVars);
    }

    // Parse volumes
    const volumes = config.dockerVolumes
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => line.trim().replace('./mc-data', './mc-data')); // Keep relative path

    // Create Docker Compose configuration
    const dockerComposeConfig = {
      version: '3',
      services: {
        mc: {
          image: `itzg/minecraft-server:${config.dockerImage}`,
          tty: true,
          stdin_open: true,
          ports: [`${config.port}:25565`],
          environment,
          volumes,
          restart: config.restartPolicy,
          deploy: {
            resources: {
              limits: {
                cpus: config.cpuLimit,
                memory: config.maxMemory,
              },
              reservations: {
                cpus: config.cpuReservation,
                memory: config.memoryReservation,
              },
            },
          },
        },
        'init-filebrowser': {
          image: 'filebrowser/filebrowser',
          entrypoint: 'sh -c',
          command: ['chown -R 1000: /database'],
          restart: 'no',
          volumes: ['./filebrowser-db:/database'],
        },
        filebrowser: {
          image: 'filebrowser/filebrowser',
          depends_on: {
            'init-filebrowser': {
              condition: 'service_completed_successfully',
            },
          },
          user: '1000:1000',
          environment: {
            FB_DATABASE: '/database/filebrowser.db',
          },
          volumes: ['./:/srv', './filebrowser-db:/database'],
          ports: [config.id === 'daily' ? '25580:80' : '25581:80'],
          restart: 'unless-stopped',
        },
      },
      volumes: {
        'mc-data': {},
        'filebrowser-db': {},
      },
    };

    // Save Docker Compose file
    const yamlContent = yaml.dump(dockerComposeConfig);
    await fs.writeFile(this.getDockerComposePath(config.id), yamlContent);
  }
}
