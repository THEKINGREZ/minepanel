"use client";

import { useState, type FormEvent } from "react";
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
import { ArrowLeft, Save, Server, Loader, BrushCleaning } from "lucide-react";

export default function ServerConfig() {
  const params = useParams();
  const serverId = params.server as string;

  const [isActive, setIsActive] = useState(serverId === "daily");
  const [isLoading, setIsLoading] = useState(false);
  const [serverType, setServerType] = useState("curseforge");

  // Configuración general
  const [serverName, setServerName] = useState("TulaCraft");
  const [port, setPort] = useState(serverId === "daily" ? "25565" : "25566");
  const [difficulty, setDifficulty] = useState("hard");
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
  const [restartPolicy, setRestartPolicy] = useState("unless-stopped");
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
  const containerName =
    serverId === "daily" ? "minecraft-daily" : "minecraft-weekend";

  const handleSaveConfig = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
                {isActive ? "Activo" : "Inactivo"}
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
              <div className="ml-auto gap-1 flex">
                <Button type="submit" disabled={isLoading} className="gap-2">
                  <Loader className="h-4 w-4" />
                  {isLoading ? "Reiniciando..." : "Reiniciar Servidor"}
                </Button>

                <Button type="submit" disabled={isLoading} className="gap-2">
                  <BrushCleaning className="h-4 w-4" />
                  {isLoading ? "Borrando..." : "Borrar datos"}
                </Button>
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
                        <button
                          type="button"
                          className={`border rounded-md p-4 w-full text-center cursor-pointer ${
                            serverType === "vanilla"
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary hover:bg-primary/5"
                          }`}
                          onClick={() => setServerType("vanilla")}
                        >
                          <Server className="h-10 w-10 mx-auto mb-2" />
                          <p className="font-medium">Vanilla</p>
                        </button>
                        <button
                          type="button"
                          className={`border rounded-md p-4 w-full text-center cursor-pointer ${
                            serverType === "forge"
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary hover:bg-primary/5"
                          }`}
                          onClick={() => setServerType("forge")}
                        >
                          <Server className="h-10 w-10 mx-auto mb-2" />
                          <p className="font-medium">Forge</p>
                        </button>
                        <button
                          type="button"
                          className={`border rounded-md p-4 w-full text-center cursor-pointer ${
                            serverType === "curseforge"
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary hover:bg-primary/5"
                          }`}
                          onClick={() => setServerType("curseforge")}
                        >
                          <Server className="h-10 w-10 mx-auto mb-2" />
                          <p className="font-medium">CurseForge</p>
                        </button>
                        <div className="col-span-3">
                          <p className="font-medium">CurseForge</p>
                        </div>
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

                {serverType === "curseforge" && (
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

                      <div className="space-y-2">
                        <Label htmlFor="cf-api-key">CurseForge API Key</Label>
                        <Input
                          id="cf-api-key"
                          type="password"
                          value={cfApiKey}
                          onChange={(e) => setCfApiKey(e.target.value)}
                          placeholder="Ingresa tu API key de CurseForge"
                        />
                      </div>

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
                    </CardContent>
                  </Card>
                )}

                {serverType === "vanilla" && (
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
                    </CardContent>
                  </Card>
                )}

                {serverType === "forge" && (
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
                        onChange={(e) => setDifficulty(e.target.value)}
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
                        onChange={(e) => setRestartPolicy(e.target.value)}
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
