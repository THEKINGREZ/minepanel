export interface ServerConfig {
  id: string;
  active: boolean;
  serverType: 'vanilla' | 'forge' | 'curseforge';

  // General configuration
  serverName: string;
  port: string;
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
  maxPlayers: string;
  ops: string;
  timezone: string;
  idleTimeout: string;
  onlineMode: boolean;
  pvp: boolean;
  commandBlock: boolean;
  allowFlight: boolean;

  // Resources
  initMemory: string;
  maxMemory: string;
  cpuLimit: string;
  cpuReservation: string;
  memoryReservation: string;
  viewDistance: string;
  simulationDistance: string;

  // Docker
  dockerImage: string;
  minecraftVersion: string;
  dockerVolumes: string;
  restartPolicy: 'no' | 'always' | 'on-failure' | 'unless-stopped';
  stopDelay: string;
  rollingLogs: boolean;
  execDirectly: boolean;
  envVars: string;

  // Forge specific
  forgeBuild?: string;

  // CurseForge specific
  cfMethod?: 'url' | 'slug' | 'file';
  cfUrl?: string;
  cfSlug?: string;
  cfFile?: string;
  cfApiKey?: string;
  cfSync?: boolean;
  cfForceInclude?: string;
  cfExclude?: string;
  cfFilenameMatcher?: string;
}
