"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Server, RefreshCw, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Importar los servicios de fetch
import {
  fetchServerConfig,
  updateServerConfig,
  restartServer,
  clearServerData,
  getServerStatus,
} from "@/services/docker/fetchs";

export default function ServerConfig() {
  const params = useParams();
  const serverId = params.server as string;

  const [isActive, setIsActive] = useState(false);
  const [isRestartingServer, setIsRestartingServer] = useState(false);
  const [isClearingData, setIsClearingData] = useState(false);
  const [serverStatus, setServerStatus] = useState<string>("unknown");
  const [serverType, setServerType] = useState<
    "VANILLA" | "FORGE" | "AUTO_CURSEFORGE"
  >("AUTO_CURSEFORGE");

  // Configuración general
  const [serverName, setServerName] = useState("TulaCraft");
  const [port, setPort] = useState(serverId === "daily" ? "25565" : "25566");
  const [difficulty, setDifficulty] = useState<
    "peaceful" | "easy" | "normal" | "hard"
  >("hard");
  const [maxPlayers, setMaxPlayers] = useState("10");
  const [ops, setOps] = useState("ketbome");
  const [timezone, setTimezone] = useState("America/Santiago");
  const [idleTimeout, setIdleTimeout] = useState("60");
  const [onlineMode, setOnlineMode] = useState(false);
  const [pvp, setPvp] = useState(true);
  const [commandBlock, setCommandBlock] = useState(true);
  const [allowFlight, setAllowFlight] = useState(true);

  // Recursos
  const [initMemory, setInitMemory] = useState("6G");
  const [maxMemory, setMaxMemory] = useState("10G");
  const [cpuLimit, setCpuLimit] = useState("2");
  const [cpuReservation, setCpuReservation] = useState("0.3");
  const [memoryReservation, setMemoryReservation] = useState("4G");
  const [viewDistance, setViewDistance] = useState("6");
  const [simulationDistance, setSimulationDistance] = useState("4");

  // Docker
  const [dockerImage, setDockerImage] = useState("latest");
  const [minecraftVersion, setMinecraftVersion] = useState("1.19.2");
  const [dockerVolumes, setDockerVolumes] = useState(
    "./mc-data:/data\n./modpacks:/modpacks:ro"
  );
  const [restartPolicy, setRestartPolicy] = useState<
    "no" | "always" | "on-failure" | "unless-stopped"
  >("unless-stopped");
  const [stopDelay, setStopDelay] = useState("60");
  const [rollingLogs, setRollingLogs] = useState(true);
  const [execDirectly, setExecDirectly] = useState(true);
  const [envVars, setEnvVars] = useState("");

  // Forge
  const [forgeBuild, setForgeBuild] = useState("");

  // CurseForge
  const [cfMethod, setCfMethod] = useState("url");
  const [cfUrl, setCfUrl] = useState(
    "https://www.curseforge.com/minecraft/modpacks/all-the-mods-10"
  );
  const [cfSlug, setCfSlug] = useState("");
  const [cfFile, setCfFile] = useState("");
  const [cfApiKey, setCfApiKey] = useState("");
  const [cfSync, setCfSync] = useState(true);
  const [cfForceInclude, setCfForceInclude] = useState("");
  const [cfExclude, setCfExclude] = useState("");
  const [cfFilenameMatcher, setCfFilenameMatcher] = useState("");

  const serverName2 =
    serverId === "daily" ? "Servidor Diario" : "Servidor Fin de Semana";
  const containerName = serverId === "daily" ? "daily_mc_1" : "weekend_mc_1";

  // Cargar la configuración del servidor al iniciar
  useEffect(() => {
    async function loadServerConfig() {
      try {
        // Utilizar el servicio fetchServerConfig
        const config = await fetchServerConfig(serverId);

        // Actualizar los estados con la configuración cargada
        setIsActive(config.active || false);
        setServerType(config.serverType || "AUTO_CURSEFORGE");
        setServerName(config.serverName || "TulaCraft");
        setPort(config.port || (serverId === "daily" ? "25565" : "25566"));
        setDifficulty(config.difficulty || "hard");
        setMaxPlayers(config.maxPlayers || "10");
        setOps(config.ops || "ketbome");
        setTimezone(config.timezone || "America/Santiago");
        setIdleTimeout(config.idleTimeout || "60");
        setOnlineMode(config.onlineMode || false);
        setPvp(config.pvp || true);
        setCommandBlock(config.commandBlock || true);
        setAllowFlight(config.allowFlight || true);

        // Recursos
        setInitMemory(config.initMemory || "6G");
        setMaxMemory(config.maxMemory || "10G");
        setCpuLimit(config.cpuLimit || "2");
        setCpuReservation(config.cpuReservation || "0.3");
        setMemoryReservation(config.memoryReservation || "4G");
        setViewDistance(config.viewDistance || "6");
        setSimulationDistance(config.simulationDistance || "4");

        // Docker
        setDockerImage(config.dockerImage || "latest");
        setMinecraftVersion(config.minecraftVersion || "1.19.2");
        setDockerVolumes(
          config.dockerVolumes || "./mc-data:/data\n./modpacks:/modpacks:ro"
        );
        setRestartPolicy(config.restartPolicy || "unless-stopped");
        setStopDelay(config.stopDelay || "60");
        setRollingLogs(config.rollingLogs || true);
        setExecDirectly(config.execDirectly || true);
        setEnvVars(config.envVars || "");

        // Forge
        if (config.forgeBuild) {
          setForgeBuild(config.forgeBuild);
        }

        // CurseForge
        if (config.serverType === "AUTO_CURSEFORGE") {
          setCfMethod(config.cfMethod || "url");
          setCfUrl(config.cfUrl || "");
          setCfSlug(config.cfSlug || "");
          setCfFile(config.cfFile || "");
          setCfApiKey(config.cfApiKey || "");
          setCfSync(config.cfSync || true);
          setCfForceInclude(config.cfForceInclude || "");
          setCfExclude(config.cfExclude || "");
          setCfFilenameMatcher(config.cfFilenameMatcher || "");
        }

        // Cargar el estado del servidor
        updateServerStatus();
      } catch (error) {
        console.error("Error loading server config:", error);
        toast.error("Error al cargar la configuración del servidor");
      }
    }

    loadServerConfig();
  }, [serverId]);

  const updateServerStatus = async () => {
    try {
      // Utilizar el servicio getServerStatus
      const data = await getServerStatus(serverId);
      setServerStatus(data.status);
      setIsActive(data.status === "running");
    } catch (error) {
      console.error("Error fetching server status:", error);
    }
  };

  const handleSaveConfig = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Guardando configuración...");

    try {
      // Recopilar todos los valores de configuración
      const config: {
        serverType: typeof serverType;
        serverName: string;
        port: string;
        difficulty: typeof difficulty;
        maxPlayers: string;
        ops: string;
        timezone: string;
        idleTimeout: string;
        onlineMode: boolean;
        pvp: boolean;
        commandBlock: boolean;
        allowFlight: boolean;
        initMemory: string;
        maxMemory: string;
        cpuLimit: string;
        cpuReservation: string;
        memoryReservation: string;
        viewDistance: string;
        simulationDistance: string;
        dockerImage: string;
        dockerVolumes: string;
        restartPolicy: typeof restartPolicy;
        stopDelay: string;
        rollingLogs: boolean;
        execDirectly: boolean;
        minecraftVersion?: string;
        envVars: string;
      } = {
        serverType,
        serverName,
        port,
        difficulty,
        maxPlayers,
        ops,
        timezone,
        idleTimeout,
        onlineMode,
        pvp,
        commandBlock,
        allowFlight,
        initMemory,
        maxMemory,
        cpuLimit,
        cpuReservation,
        memoryReservation,
        viewDistance,
        simulationDistance,
        dockerImage,
        dockerVolumes,
        restartPolicy,
        stopDelay,
        rollingLogs,
        execDirectly,
        minecraftVersion,
        envVars,
      };

      // Agregar propiedades específicas de cada tipo de servidor
      if (serverType === "FORGE") {
        Object.assign(config, { forgeBuild });
      } else if (serverType === "AUTO_CURSEFORGE") {
        Object.assign(config, {
          cfMethod,
          cfUrl,
          cfSlug,
          cfFile,
          cfApiKey,
          cfSync,
          cfForceInclude,
          cfExclude,
          cfFilenameMatcher,
        });
      }

      console.log("Configuración a guardar:", config);
      await updateServerConfig(serverId, config);
      toast.success("Configuración guardada correctamente");

      // Actualizar el estado del servidor después de guardar
      updateServerStatus();
    } catch (error) {
      console.error("Error saving config:", error);
      toast.error("Error al guardar la configuración");
    }
  };

  const handleRestartServer = async () => {
    setIsRestartingServer(true);
    try {
      // Utilizar el servicio restartServer
      const result = await restartServer(serverId);

      if (result.success) {
        toast.success("Servidor reiniciado correctamente");
        // Esperar un momento y actualizar el estado
        setTimeout(updateServerStatus, 3000);
      } else {
        throw new Error(result.message || "Error al reiniciar el servidor");
      }
    } catch (error) {
      console.error("Error restarting server:", error);
      toast.error("Error al reiniciar el servidor");
    } finally {
      setIsRestartingServer(false);
    }
  };

  const handleClearData = async () => {
    setIsClearingData(true);
    try {
      // Utilizar el servicio clearServerData
      const result = await clearServerData(serverId);

      if (result.success) {
        toast.success("Datos del servidor borrados correctamente");
        // Actualizar el estado después de borrar
        updateServerStatus();
      } else {
        throw new Error(
          result.message || "Error al borrar los datos del servidor"
        );
      }
    } catch (error) {
      console.error("Error clearing server data:", error);
      toast.error("Error al borrar los datos del servidor");
    } finally {
      setIsClearingData(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background border-b">
        <div className="flex h-16 items-center justify-between px-4 sm:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <span className="text-xl">MinecraftManager</span>
          </Link>
          <Link href="/">
            <Button variant="outline">Cerrar Sesión</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 py-12 px-4">
        <form onSubmit={handleSaveConfig}>
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="outline" size="icon" type="button">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">
                {serverName2}
              </h1>
              <Badge
                variant={isActive ? "outline" : "secondary"}
                className={
                  isActive
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }
              >
                {serverStatus === "running"
                  ? "Activo"
                  : serverStatus === "stopped"
                  ? "Detenido"
                  : serverStatus === "not_found"
                  ? "No encontrado"
                  : "Desconocido"}
              </Badge>
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/40">
              <Server className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{containerName}</p>
                <p className="text-xs text-muted-foreground">
                  Docker Container
                </p>
              </div>
              <div className="ml-auto flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isRestartingServer}
                  onClick={handleRestartServer}
                  className="gap-2"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      isRestartingServer ? "animate-spin" : ""
                    }`}
                  />
                  {isRestartingServer ? "Reiniciando..." : "Reiniciar Servidor"}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      className="gap-2"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Borrar Datos
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción eliminará todos los datos del servidor
                        incluyendo mundos guardados, configuraciones y no puede
                        ser revertida.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleClearData}
                        disabled={isClearingData}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isClearingData ? "Borrando..." : "Sí, borrar datos"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <Tabs defaultValue="type">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="type">Tipo de Servidor</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="resources">Recursos</TabsTrigger>
                <TabsTrigger value="mods">Mods</TabsTrigger>
                <TabsTrigger value="advanced">Avanzado</TabsTrigger>
              </TabsList>

              <TabsContent value="type" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Tipo de Servidor</CardTitle>
                    <CardDescription>
                      Selecciona el tipo de servidor de Minecraft
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <Button
                          variant="outline"
                          type="button"
                          className={`p-4 w-full text-center flex flex-col items-center justify-center h-auto ${
                            serverType === "VANILLA"
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary hover:bg-primary/5"
                          }`}
                          onClick={() => setServerType("VANILLA")}
                        >
                          <Server className="h-10 w-10 mx-auto mb-2" />
                          <p className="font-medium">Vanilla</p>
                        </Button>
                        <Button
                          variant="outline"
                          type="button"
                          className={`p-4 w-full text-center flex flex-col items-center justify-center h-auto ${
                            serverType === "FORGE"
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary hover:bg-primary/5"
                          }`}
                          onClick={() => setServerType("FORGE")}
                        >
                          <Server className="h-10 w-10 mx-auto mb-2" />
                          <p className="font-medium">Forge</p>
                        </Button>
                        <Button
                          variant="outline"
                          type="button"
                          className={`p-4 w-full text-center flex flex-col items-center justify-center h-auto ${
                            serverType === "AUTO_CURSEFORGE"
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary hover:bg-primary/5"
                          }`}
                          onClick={() => setServerType("AUTO_CURSEFORGE")}
                        >
                          <Server className="h-10 w-10 mx-auto mb-2" />
                          <p className="font-medium">CurseForge</p>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="docker-image">Versión de Docker</Label>
                      <select
                        id="docker-image"
                        value={dockerImage}
                        onChange={(e) => setDockerImage(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="latest">
                          itzg/minecraft-server:latest
                        </option>
                        <option value="java17">
                          itzg/minecraft-server:java17
                        </option>
                        <option value="java17-alpine">
                          itzg/minecraft-server:java17-alpine
                        </option>
                        <option value="java8">
                          itzg/minecraft-server:java8
                        </option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {serverType === "AUTO_CURSEFORGE" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración de CurseForge</CardTitle>
                      <CardDescription>
                        Configura los ajustes específicos para CurseForge
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cf-method">Método de Instalación</Label>
                        <select
                          id="cf-method"
                          value={cfMethod}
                          onChange={(e) => setCfMethod(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="url">URL de CurseForge</option>
                          <option value="slug">Slug de CurseForge</option>
                          <option value="file">Archivo ZIP Local</option>
                        </select>
                      </div>

                      {cfMethod === "url" && (
                        <div className="space-y-2">
                          <Label htmlFor="cf-url">URL del Modpack</Label>
                          <Input
                            id="cf-url"
                            value={cfUrl}
                            onChange={(e) => setCfUrl(e.target.value)}
                          />
                        </div>
                      )}

                      {cfMethod === "slug" && (
                        <div className="space-y-2">
                          <Label htmlFor="cf-slug">Slug del Modpack</Label>
                          <Input
                            id="cf-slug"
                            value={cfSlug}
                            onChange={(e) => setCfSlug(e.target.value)}
                            placeholder="Ej: 1082906"
                          />
                        </div>
                      )}

                      {cfMethod === "file" && (
                        <div className="space-y-2">
                          <Label htmlFor="cf-file">Archivo ZIP Local</Label>
                          <Input
                            id="cf-file"
                            value={cfFile}
                            onChange={(e) => setCfFile(e.target.value)}
                            placeholder="Ej: /modpacks/serverpack9112.zip"
                          />
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="cf-sync"
                          checked={cfSync}
                          onCheckedChange={setCfSync}
                        />
                        <Label htmlFor="cf-sync">
                          Forzar sincronización (CF_FORCE_SYNCHRONIZE)
                        </Label>
                      </div>

                      <Button type="submit" className="gap-2">
                        <Save className="h-4 w-4" />
                        Guardar Cambios
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {serverType === "VANILLA" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración de Vanilla</CardTitle>
                      <CardDescription>
                        Configura los ajustes específicos para Vanilla
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="vanilla-version">
                          Versión de Minecraft
                        </Label>
                        <Input
                          id="vanilla-version"
                          value={minecraftVersion}
                          onChange={(e) => setMinecraftVersion(e.target.value)}
                        />
                      </div>

                      <Button type="submit" className="gap-2">
                        <Save className="h-4 w-4" />
                        Guardar Cambios
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {serverType === "FORGE" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración de Forge</CardTitle>
                      <CardDescription>
                        Configura los ajustes específicos para Forge
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="forge-version">
                          Versión de Minecraft
                        </Label>
                        <Input
                          id="forge-version"
                          value={minecraftVersion}
                          onChange={(e) => setMinecraftVersion(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="forge-build">Versión de Forge</Label>
                        <Input
                          id="forge-build"
                          value={forgeBuild}
                          onChange={(e) => setForgeBuild(e.target.value)}
                          placeholder="Ej: 43.2.0"
                        />
                      </div>

                      <Button type="submit" className="gap-2">
                        <Save className="h-4 w-4" />
                        Guardar Cambios
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="general" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Estado del Servidor</CardTitle>
                    <CardDescription>
                      Controla si el servidor está activo o inactivo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="server-status"
                        checked={isActive}
                        onCheckedChange={setIsActive}
                      />
                      <Label htmlFor="server-status">
                        {isActive ? "Servidor Activo" : "Servidor Inactivo"}
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configuración Básica</CardTitle>
                    <CardDescription>
                      Ajusta la configuración básica del servidor
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="server-name">
                        Nombre del Servidor (MOTD)
                      </Label>
                      <Input
                        id="server-name"
                        value={serverName}
                        onChange={(e) => setServerName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="server-port">Puerto</Label>
                      <Input
                        id="server-port"
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="server-difficulty">Dificultad</Label>
                      <select
                        id="server-difficulty"
                        value={difficulty}
                        onChange={(e) =>
                          setDifficulty(
                            e.target.value as
                              | "peaceful"
                              | "easy"
                              | "normal"
                              | "hard"
                          )
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="peaceful">Pacífico</option>
                        <option value="easy">Fácil</option>
                        <option value="normal">Normal</option>
                        <option value="hard">Difícil</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-players">Máximo de Jugadores</Label>
                      <Input
                        id="max-players"
                        value={maxPlayers}
                        onChange={(e) => setMaxPlayers(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ops">Operadores (OPS)</Label>
                      <Input
                        id="ops"
                        value={ops}
                        onChange={(e) => setOps(e.target.value)}
                        placeholder="Nombres separados por comas"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Zona Horaria</Label>
                      <Input
                        id="timezone"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idle-timeout">
                        Tiempo de Inactividad (minutos)
                      </Label>
                      <Input
                        id="idle-timeout"
                        value={idleTimeout}
                        onChange={(e) => setIdleTimeout(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="online-mode"
                        checked={onlineMode}
                        onCheckedChange={setOnlineMode}
                      />
                      <Label htmlFor="online-mode">
                        Modo Online (Verificación de Cuentas)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="pvp" checked={pvp} onCheckedChange={setPvp} />
                      <Label htmlFor="pvp">PVP Habilitado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="command-block"
                        checked={commandBlock}
                        onCheckedChange={setCommandBlock}
                      />
                      <Label htmlFor="command-block">
                        Habilitar Command Blocks
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="allow-flight"
                        checked={allowFlight}
                        onCheckedChange={setAllowFlight}
                      />
                      <Label htmlFor="allow-flight">Permitir Vuelo</Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="gap-2">
                      <Save className="h-4 w-4" />
                      Guardar Cambios
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recursos del Servidor</CardTitle>
                    <CardDescription>
                      Configura los recursos asignados al servidor
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="init-memory">
                        Memoria Inicial (INIT_MEMORY)
                      </Label>
                      <Input
                        id="init-memory"
                        value={initMemory}
                        onChange={(e) => setInitMemory(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-memory">
                        Memoria Máxima (MAX_MEMORY)
                      </Label>
                      <Input
                        id="max-memory"
                        value={maxMemory}
                        onChange={(e) => setMaxMemory(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpu-limit">Límite de CPU</Label>
                      <Input
                        id="cpu-limit"
                        value={cpuLimit}
                        onChange={(e) => setCpuLimit(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpu-reservation">Reserva de CPU</Label>
                      <Input
                        id="cpu-reservation"
                        value={cpuReservation}
                        onChange={(e) => setCpuReservation(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="memory-reservation">
                        Reserva de Memoria
                      </Label>
                      <Input
                        id="memory-reservation"
                        value={memoryReservation}
                        onChange={(e) => setMemoryReservation(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="view-distance">Distancia de Visión</Label>
                      <Input
                        id="view-distance"
                        value={viewDistance}
                        onChange={(e) => setViewDistance(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="simulation-distance">
                        Distancia de Simulación
                      </Label>
                      <Input
                        id="simulation-distance"
                        value={simulationDistance}
                        onChange={(e) => setSimulationDistance(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="gap-2">
                      <Save className="h-4 w-4" />
                      Guardar Cambios
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="mods" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Mods</CardTitle>
                    <CardDescription>
                      Gestiona los mods incluidos y excluidos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="force-include">
                        Mods a Incluir Forzosamente (IDs separados por comas)
                      </Label>
                      <Input
                        id="force-include"
                        value={cfForceInclude}
                        onChange={(e) => setCfForceInclude(e.target.value)}
                        placeholder="Ej: 250419, 890745"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Usa esto para forzar la inclusión de mods específicos
                        por su ID
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exclude-mods">
                        Mods a Excluir (IDs separados por comas)
                      </Label>
                      <Input
                        id="exclude-mods"
                        value={cfExclude}
                        onChange={(e) => setCfExclude(e.target.value)}
                        placeholder="Ej: 965556"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Usa esto para excluir mods específicos por su ID
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="filename-matcher">
                        Filtro de Nombre de Archivo
                      </Label>
                      <Input
                        id="filename-matcher"
                        value={cfFilenameMatcher}
                        onChange={(e) => setCfFilenameMatcher(e.target.value)}
                        placeholder="Ej: 0.2.34"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Filtra modpacks por parte del nombre de archivo
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="gap-2">
                      <Save className="h-4 w-4" />
                      Guardar Cambios
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración Avanzada</CardTitle>
                    <CardDescription>
                      Ajustes avanzados del servidor
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="docker-volumes">
                        Volúmenes de Docker
                      </Label>
                      <Textarea
                        id="docker-volumes"
                        value={dockerVolumes}
                        onChange={(e) => setDockerVolumes(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restart-policy">
                        Política de Reinicio
                      </Label>
                      <select
                        id="restart-policy"
                        value={restartPolicy}
                        onChange={(e) =>
                          setRestartPolicy(
                            e.target.value as
                              | "no"
                              | "always"
                              | "on-failure"
                              | "unless-stopped"
                          )
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="no">No reiniciar</option>
                        <option value="always">Siempre</option>
                        <option value="on-failure">En caso de fallo</option>
                        <option value="unless-stopped">
                          A menos que se detenga manualmente
                        </option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stop-delay">
                        Retraso de Anuncio de Parada (segundos)
                      </Label>
                      <Input
                        id="stop-delay"
                        value={stopDelay}
                        onChange={(e) => setStopDelay(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="rolling-logs"
                        checked={rollingLogs}
                        onCheckedChange={setRollingLogs}
                      />
                      <Label htmlFor="rolling-logs">
                        Habilitar Logs Rotativos
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="exec-directly"
                        checked={execDirectly}
                        onCheckedChange={setExecDirectly}
                      />
                      <Label htmlFor="exec-directly">
                        Ejecutar Directamente
                      </Label>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="env-vars">
                        Variables de Entorno Adicionales
                      </Label>
                      <Textarea
                        id="env-vars"
                        value={envVars}
                        onChange={(e) => setEnvVars(e.target.value)}
                        placeholder="Ingresa variables adicionales en formato CLAVE=VALOR, una por línea"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="gap-2">
                      <Save className="h-4 w-4" />
                      Guardar Cambios
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </form>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MinecraftManager. Todos los
            derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
