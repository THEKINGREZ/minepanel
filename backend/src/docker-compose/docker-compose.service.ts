import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { ServerConfig } from '../models/server-config.model';

@Injectable()
export class DockerComposeService {
  private readonly DOCKER_COMPOSE_PATH = path.join(
    process.cwd(),
    '..',
    'docker-compose.yml',
  );
  private readonly CONFIG_DIR = path.join(process.cwd(), 'config');
  private readonly CONFIG_FILE = 'servers.json';

  constructor() {
    fs.ensureDirSync(this.CONFIG_DIR);

    // Initialize server configs if they don't exist
    if (!fs.existsSync(this.getConfigPath())) {
      // Extract server configs from existing docker-compose.yml
      this.initializeFromDockerCompose();
    }
  }

  private getConfigPath(): string {
    return path.join(this.CONFIG_DIR, this.CONFIG_FILE);
  }

  private async initializeFromDockerCompose(): Promise<void> {
    try {
      if (!fs.existsSync(this.DOCKER_COMPOSE_PATH)) {
        // Create default configs if docker-compose.yml doesn't exist
        await this.saveServerConfigs([
          this.createDefaultConfig('daily'),
          this.createDefaultConfig('weekend'),
        ]);
        return;
      }

      const composeFileContent = await fs.readFile(
        this.DOCKER_COMPOSE_PATH,
        'utf8',
      );
      const composeConfig = yaml.load(composeFileContent) as any;

      if (!composeConfig.services || !composeConfig.services.mc) {
        // Create default configs if docker-compose.yml doesn't have mc service
        await this.saveServerConfigs([
          this.createDefaultConfig('daily'),
          this.createDefaultConfig('weekend'),
        ]);
        return;
      }

      const mcService = composeConfig.services.mc;
      const env = mcService.environment || {};
      const resources = mcService.deploy?.resources || {};

      // Extract server config from docker-compose
      const dailyConfig: ServerConfig = {
        id: 'daily',
        active: true,
        serverType: (env.TYPE || 'vanilla').toLowerCase(),

        // General configuration
        serverName: env.MOTD || 'TulaCraft',
        port: '25565',
        difficulty: env.DIFFICULTY || 'hard',
        maxPlayers: env.MAX_PLAYERS || '10',
        ops: env.OPS || 'ketbome',
        timezone: env.TZ || 'America/Santiago',
        idleTimeout: env.PLAYER_IDLE_TIMEOUT || '60',
        onlineMode: env.ONLINE_MODE === 'true',
        pvp: env.PVP === 'true',
        commandBlock: env.ENABLE_COMMAND_BLOCK === 'true',
        allowFlight: env.ALLOW_FLIGHT === 'true',

        // Resources
        initMemory: env.INIT_MEMORY || '6G',
        maxMemory: env.MAX_MEMORY || '10G',
        cpuLimit: resources.limits?.cpus || '2',
        cpuReservation: resources.reservations?.cpus || '0.3',
        memoryReservation: resources.reservations?.memory || '4G',
        viewDistance: env.VIEW_DISTANCE || '6',
        simulationDistance: env.SIMULATION_DISTANCE || '4',

        // Docker
        dockerImage: mcService.image
          ? mcService.image.split(':')[1] || 'latest'
          : 'latest',
        minecraftVersion: env.VERSION || '1.19.2',
        dockerVolumes: Array.isArray(mcService.volumes)
          ? mcService.volumes.join('\n')
          : './mc-data:/data\n./modpacks:/modpacks:ro',
        restartPolicy: mcService.restart || 'unless-stopped',
        stopDelay: env.STOP_SERVER_ANNOUNCE_DELAY || '60',
        rollingLogs: env.ENABLE_ROLLING_LOGS === 'true',
        execDirectly: env.EXEC_DIRECTLY === 'true',
        envVars: '',
      };

      // Add CurseForge specific config
      if (dailyConfig.serverType === 'curseforge') {
        dailyConfig.cfMethod = env.CF_SERVER_MOD
          ? 'file'
          : env.CF_SLUG
            ? 'slug'
            : 'url';
        dailyConfig.cfUrl = env.CF_PAGE_URL || '';
        dailyConfig.cfSlug = env.CF_SLUG || '';
        dailyConfig.cfFile = env.CF_SERVER_MOD || '';
        dailyConfig.cfApiKey = env.CF_API_KEY || '';
        dailyConfig.cfSync = env.CF_FORCE_SYNCHRONIZE === 'true';
        dailyConfig.cfForceInclude = env.CF_FORCE_INCLUDE_MODS || '';
        dailyConfig.cfExclude = env.CF_EXCLUDE_MODS || '';
        dailyConfig.cfFilenameMatcher = env.CF_FILENAME_MATCHER || '';
      }

      // Create weekend config as a copy of daily with different port
      const weekendConfig = {
        ...dailyConfig,
        id: 'weekend',
        active: false,
        port: '25566',
      };

      await this.saveServerConfigs([dailyConfig, weekendConfig]);
    } catch (error) {
      console.error('Error initializing from docker-compose:', error);

      // Fallback to default configs
      await this.saveServerConfigs([
        this.createDefaultConfig('daily'),
        this.createDefaultConfig('weekend'),
      ]);
    }
  }

  private createDefaultConfig(id: string): ServerConfig {
    return {
      id,
      active: id === 'daily',
      serverType: 'curseforge',

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
      cfMethod: 'url',
      cfUrl: 'https://www.curseforge.com/minecraft/modpacks/all-the-mods-10',
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
    try {
      const configData = await fs.readJson(this.getConfigPath());
      return configData as ServerConfig[];
    } catch (error) {
      console.error('Error reading server configs:', error);
      return [];
    }
  }

  async getServerConfig(id: string): Promise<ServerConfig | null> {
    const configs = await this.getAllServerConfigs();
    return configs.find((config) => config.id === id) || null;
  }

  async saveServerConfigs(configs: ServerConfig[]): Promise<void> {
    // Save configs to JSON file
    await fs.writeJson(this.getConfigPath(), configs, { spaces: 2 });

    // Generate docker-compose.yml from active config
    const activeConfig = configs.find((c) => c.active);
    if (activeConfig) {
      await this.generateDockerComposeFile(activeConfig);
    }
  }

  async updateServerConfig(
    id: string,
    config: Partial<ServerConfig>,
  ): Promise<ServerConfig | null> {
    const configs = await this.getAllServerConfigs();
    const index = configs.findIndex((c) => c.id === id);

    if (index === -1) {
      return null;
    }

    // Update config
    configs[index] = { ...configs[index], ...config };

    // If this config is now active, deactivate all others
    if (configs[index].active) {
      for (let i = 0; i < configs.length; i++) {
        if (i !== index) {
          configs[i].active = false;
        }
      }
    }

    await this.saveServerConfigs(configs);
    return configs[index];
  }

  private async generateDockerComposeFile(config: ServerConfig): Promise<void> {
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
    if (config.serverType === 'forge' && config.forgeBuild) {
      environment['FORGE_VERSION'] = config.forgeBuild;
    }

    if (config.serverType === 'curseforge') {
      if (config.cfMethod === 'url' && config.cfUrl) {
        environment['CF_PAGE_URL'] = config.cfUrl;
        environment['MODPACK_PLATFORM'] = 'AUTO_CURSEFORGE';
      } else if (config.cfMethod === 'slug' && config.cfSlug) {
        environment['CF_SLUG'] = config.cfSlug;
        environment['MODPACK_PLATFORM'] = 'AUTO_CURSEFORGE';
      } else if (config.cfMethod === 'file' && config.cfFile) {
        environment['CF_SERVER_MOD'] = config.cfFile;
      }

      if (config.cfApiKey) {
        environment['CF_API_KEY'] = config.cfApiKey;
      }

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
      .map((line) => line.trim());

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
          ports: ['25580:80'],
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
    await fs.writeFile(this.DOCKER_COMPOSE_PATH, yamlContent);
  }
}
