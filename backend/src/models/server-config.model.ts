export interface ServerConfig {
  id: string;
  active: boolean;
  serverType: 'VANILLA' | 'FORGE' | 'AUTO_CURSEFORGE';

  // General configuration
  serverName: string;
  motd: string;
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
  gameMode: 'survival' | 'creative' | 'adventure' | 'spectator';
  seed?: string;
  levelType: 'DEFAULT' | 'FLAT' | 'LARGEBIOMES' | 'AMPLIFIED' | 'CUSTOMIZED';
  hardcore: boolean;
  spawnAnimals: boolean;
  spawnMonsters: boolean;
  spawnNpcs: boolean;
  generateStructures: boolean;
  allowNether: boolean;
  entityBroadcastRange: string;

  enableAutoStop: boolean;
  autoStopTimeoutEst: string;
  autoStopTimeoutInit: string;

  enableAutoPause: boolean;
  autoPauseTimeoutEst: string;
  autoPauseTimeoutInit: string;
  autoPauseKnockInterface: string;

  playerIdleTimeout: string;
  preventProxyConnections: boolean;
  opPermissionLevel: string;

  // RCON
  enableRcon: boolean;
  rconPort: string;
  rconPassword: string;
  broadcastRconToOps: boolean;

  // Resources
  initMemory: string;
  maxMemory: string;
  cpuLimit: string;
  cpuReservation: string;
  memoryReservation: string;
  viewDistance: string;
  simulationDistance: string;
  memory: string;
  uid: string;
  gid: string;

  useAikarFlags: boolean;
  enableJmx: boolean;
  jmxHost: string;
  jvmOpts: string;
  jvmXxOpts: string;
  jvmDdOpts: string;
  extraArgs: string;
  tz: string;
  enableRollingLogs: boolean;
  logTimestamp: boolean | undefined;

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
  cfParallelDownloads?: string;
  cfOverridesSkipExisting?: boolean;
  cfSetLevelFrom?: string;
}
