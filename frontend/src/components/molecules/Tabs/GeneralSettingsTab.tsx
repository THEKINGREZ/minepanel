import { FC, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save, Trash2, HelpCircle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ServerConfig } from "@/lib/types/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GeneralSettingsTabProps {
  config: ServerConfig;
  updateConfig: (field: keyof ServerConfig, value: any) => void;
  onSave: () => Promise<boolean>;
  onClearData: () => Promise<boolean>;
}

export const GeneralSettingsTab: FC<GeneralSettingsTabProps> = ({ config, updateConfig, onSave, onClearData }) => {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearData = async () => {
    setIsClearing(true);
    try {
      await onClearData();
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración General</CardTitle>
        <CardDescription>Ajustes generales de tu servidor de Minecraft</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="basic">Ajustes Básicos</TabsTrigger>
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
            <TabsTrigger value="connectivity">Conectividad</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="serverName">Nombre del Servidor</Label>
              <Input id="serverName" value={config.serverName} onChange={(e) => updateConfig("serverName", e.target.value)} placeholder="Nombre de tu servidor" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motd">Mensaje del Día (MOTD)</Label>
              <Input id="motd" value={config.motd} onChange={(e) => updateConfig("motd", e.target.value)} placeholder="Un servidor de Minecraft increíble" />
              <p className="text-xs text-muted-foreground">El mensaje que aparece en la lista de servidores</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Dificultad</Label>
              <Select value={config.difficulty} onValueChange={(value) => updateConfig("difficulty", value as "peaceful" | "easy" | "normal" | "hard")}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Selecciona la dificultad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="peaceful">Pacífico</SelectItem>
                  <SelectItem value="easy">Fácil</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="hard">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gameMode">Modo de Juego</Label>
              <Select value={config.gameMode || "survival"} onValueChange={(value) => updateConfig("gameMode", value)}>
                <SelectTrigger id="gameMode">
                  <SelectValue placeholder="Selecciona el modo de juego" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="survival">Supervivencia</SelectItem>
                  <SelectItem value="creative">Creativo</SelectItem>
                  <SelectItem value="adventure">Aventura</SelectItem>
                  <SelectItem value="spectator">Espectador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPlayers">Número Máximo de Jugadores</Label>
              <Input id="maxPlayers" type="number" value={config.maxPlayers} onChange={(e) => updateConfig("maxPlayers", e.target.value)} placeholder="20" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seed">Semilla del Mundo</Label>
              <Input id="seed" value={config.seed} onChange={(e) => updateConfig("seed", e.target.value)} placeholder="Deja en blanco para semilla aleatoria" />
              <p className="text-xs text-muted-foreground">Semilla para la generación del mundo. Si usas un número negativo, asegúrate de ponerlo entre comillas.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="levelType">Tipo de Mundo</Label>
              <Select value={config.levelType || "minecraft:default"} onValueChange={(value) => updateConfig("levelType", value)}>
                <SelectTrigger id="levelType">
                  <SelectValue placeholder="Selecciona el tipo de mundo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minecraft:default">Normal</SelectItem>
                  <SelectItem value="minecraft:flat">Plano</SelectItem>
                  <SelectItem value="minecraft:large_biomes">Biomas Amplios</SelectItem>
                  <SelectItem value="minecraft:amplified">Amplificado</SelectItem>
                  <SelectItem value="minecraft:single_biome_surface">Bioma Único</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="hardcore">Modo Hardcore</Label>
                <Switch id="hardcore" checked={config.hardcore} onCheckedChange={(checked) => updateConfig("hardcore", checked)} />
              </div>
              <p className="text-xs text-muted-foreground">Si está activado, los jugadores pasarán a modo espectador al morir</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="pvp">PvP</Label>
                <Switch id="pvp" checked={config.pvp} onCheckedChange={(checked) => updateConfig("pvp", checked)} />
              </div>
              <p className="text-xs text-muted-foreground">Permite el combate jugador contra jugador</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="spawning">
                <AccordionTrigger>Opciones de Generación</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="spawnAnimals">Generar Animales</Label>
                      <Switch id="spawnAnimals" checked={config.spawnAnimals !== false} onCheckedChange={(checked) => updateConfig("spawnAnimals", checked)} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="spawnMonsters">Generar Monstruos</Label>
                      <Switch id="spawnMonsters" checked={config.spawnMonsters !== false} onCheckedChange={(checked) => updateConfig("spawnMonsters", checked)} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="spawnNpcs">Generar Aldeanos</Label>
                      <Switch id="spawnNpcs" checked={config.spawnNpcs !== false} onCheckedChange={(checked) => updateConfig("spawnNpcs", checked)} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="generateStructures">Generar Estructuras</Label>
                      <Switch id="generateStructures" checked={config.generateStructures !== false} onCheckedChange={(checked) => updateConfig("generateStructures", checked)} />
                    </div>
                    <p className="text-xs text-muted-foreground">Define si se generarán estructuras como aldeas, templos, etc.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="allowNether">Permitir Nether</Label>
                      <Switch id="allowNether" checked={config.allowNether !== false} onCheckedChange={(checked) => updateConfig("allowNether", checked)} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="viewDistance">Distancia de Renderizado</Label>
              <Input id="viewDistance" type="number" value={config.viewDistance || "10"} onChange={(e) => updateConfig("viewDistance", e.target.value)} placeholder="10" />
              <p className="text-xs text-muted-foreground">Número de chunks que se renderizarán alrededor de cada jugador</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="simulationDistance">Distancia de Simulación</Label>
              <Input id="simulationDistance" type="number" value={config.simulationDistance || "10"} onChange={(e) => updateConfig("simulationDistance", e.target.value)} placeholder="10" />
              <p className="text-xs text-muted-foreground">Número de chunks alrededor de cada jugador que serán procesados</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entityBroadcastRange">Rango de Transmisión de Entidades (%)</Label>
              <Input id="entityBroadcastRange" type="number" value={config.entityBroadcastRange || "100"} onChange={(e) => updateConfig("entityBroadcastRange", e.target.value)} placeholder="100" />
              <p className="text-xs text-muted-foreground">Porcentaje del rango estándar en el que se transmiten las entidades a los clientes</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="autoStop">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    Auto-Stop
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Detiene automáticamente el servidor cuando no hay jugadores conectados.</p>
                          <p className="text-amber-500 mt-1 text-xs">No compatible con Auto-Pause</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableAutoStop">Activar Auto-Stop</Label>
                      <Switch
                        id="enableAutoStop"
                        checked={config.enableAutoStop || false}
                        onCheckedChange={(checked) => {
                          updateConfig("enableAutoStop", checked);
                          if (checked) {
                            updateConfig("enableAutoPause", false);
                          }
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Detiene automáticamente el servidor cuando no hay jugadores conectados</p>
                  </div>

                  {config.enableAutoStop && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="autoStopTimeoutEst">Tiempo de Inactividad (segundos)</Label>
                        <Input id="autoStopTimeoutEst" type="number" value={config.autoStopTimeoutEst || "3600"} onChange={(e) => updateConfig("autoStopTimeoutEst", e.target.value)} placeholder="3600" />
                        <p className="text-xs text-muted-foreground">Tiempo en segundos entre la desconexión del último cliente y la detención del servidor</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="autoStopTimeoutInit">Tiempo Inicial (segundos)</Label>
                        <Input id="autoStopTimeoutInit" type="number" value={config.autoStopTimeoutInit || "1800"} onChange={(e) => updateConfig("autoStopTimeoutInit", e.target.value)} placeholder="1800" />
                        <p className="text-xs text-muted-foreground">Tiempo en segundos entre el inicio del servidor y su detención si ningún cliente se conecta</p>
                      </div>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="autoPause">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    Auto-Pause
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Pausa automáticamente el servidor cuando no hay jugadores conectados para ahorrar recursos.</p>
                          <p className="text-amber-500 mt-1 text-xs">No compatible con Auto-Stop o EXEC_DIRECTLY=true</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableAutoPause">Activar Auto-Pause</Label>
                      <Switch
                        id="enableAutoPause"
                        checked={config.enableAutoPause || false}
                        onCheckedChange={(checked) => {
                          updateConfig("enableAutoPause", checked);
                          if (checked) {
                            updateConfig("enableAutoStop", false);
                            updateConfig("execDirectly", false);
                          }
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Pausa automáticamente el servidor cuando no hay jugadores conectados</p>
                  </div>

                  {config.enableAutoPause && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="autoPauseTimeoutEst">Tiempo de Inactividad (segundos)</Label>
                        <Input id="autoPauseTimeoutEst" type="number" value={config.autoPauseTimeoutEst || "3600"} onChange={(e) => updateConfig("autoPauseTimeoutEst", e.target.value)} placeholder="3600" />
                        <p className="text-xs text-muted-foreground">Tiempo en segundos entre la desconexión del último cliente y la pausa del servidor</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="autoPauseTimeoutInit">Tiempo Inicial (segundos)</Label>
                        <Input id="autoPauseTimeoutInit" type="number" value={config.autoPauseTimeoutInit || "600"} onChange={(e) => updateConfig("autoPauseTimeoutInit", e.target.value)} placeholder="600" />
                        <p className="text-xs text-muted-foreground">Tiempo en segundos entre el inicio del servidor y su pausa si ningún cliente se conecta</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="autoPauseKnockInterface">Interfaz de Red</Label>
                        <Input id="autoPauseKnockInterface" value={config.autoPauseKnockInterface || "eth0"} onChange={(e) => updateConfig("autoPauseKnockInterface", e.target.value)} placeholder="eth0" />
                        <p className="text-xs text-muted-foreground">Interfaz de red pasada al daemon knockd. Normalmente eth0 funciona bien.</p>
                      </div>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="connectivity" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="port">Puerto del Servidor</Label>
              <Input id="port" type="text" value={config.port} onChange={(e) => updateConfig("port", e.target.value)} placeholder="25565" />
              <p className="text-xs text-muted-foreground">Puerto estándar de Minecraft: 25565</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="playerIdleTimeout">Tiempo de Inactividad (minutos)</Label>
              <Input id="playerIdleTimeout" type="number" value={config.playerIdleTimeout || "0"} onChange={(e) => updateConfig("playerIdleTimeout", e.target.value)} placeholder="0" />
              <p className="text-xs text-muted-foreground">Tiempo en minutos antes de expulsar a jugadores inactivos (0 para desactivar)</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="onlineMode">Modo Online</Label>
                <Switch id="onlineMode" checked={config.onlineMode !== false} onCheckedChange={(checked) => updateConfig("onlineMode", checked)} />
              </div>
              <p className="text-xs text-muted-foreground">Verifica la autenticidad de las cuentas de jugadores con Mojang. Desactivar permite cuentas sin licencia, pero reduce la seguridad.</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="preventProxyConnections">Prevenir Conexiones Proxy</Label>
                <Switch id="preventProxyConnections" checked={config.preventProxyConnections || false} onCheckedChange={(checked) => updateConfig("preventProxyConnections", checked)} />
              </div>
              <p className="text-xs text-muted-foreground">Impide que los jugadores utilicen proxies o VPNs para conectarse al servidor</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ops">Operadores del Servidor</Label>
              <Input id="ops" value={config.ops} onChange={(e) => updateConfig("ops", e.target.value)} placeholder="Nombres de usuario separados por comas" />
              <p className="text-xs text-muted-foreground">Jugadores con permisos de administrador (separados por comas)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="opPermissionLevel">Nivel de Permisos de OPs</Label>
              <Select value={config.opPermissionLevel || "4"} onValueChange={(value) => updateConfig("opPermissionLevel", value)}>
                <SelectTrigger id="opPermissionLevel">
                  <SelectValue placeholder="Selecciona nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Nivel 1 (Mínimo)</SelectItem>
                  <SelectItem value="2">Nivel 2</SelectItem>
                  <SelectItem value="3">Nivel 3</SelectItem>
                  <SelectItem value="4">Nivel 4 (Máximo)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Nivel de permisos para operadores (4 = acceso completo)</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="rcon">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    RCON (Control Remoto)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Configura el acceso remoto a la consola del servidor</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableRcon">Activar RCON</Label>
                      <Switch id="enableRcon" checked={config.enableRcon !== false} onCheckedChange={(checked) => updateConfig("enableRcon", checked)} />
                    </div>
                    <p className="text-xs text-muted-foreground">Permite el control remoto del servidor a través del protocolo RCON</p>
                  </div>

                  {config.enableRcon !== false && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="rconPort">Puerto RCON</Label>
                        <Input id="rconPort" type="number" value={config.rconPort || "25575"} onChange={(e) => updateConfig("rconPort", e.target.value)} placeholder="25575" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rconPassword">Contraseña RCON</Label>
                        <Input id="rconPassword" type="password" value={config.rconPassword || ""} onChange={(e) => updateConfig("rconPassword", e.target.value)} placeholder="Contraseña segura requerida" />
                        <p className="text-xs text-text-destructive font-medium">¡Importante! Debes cambiar la contraseña por defecto</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="broadcastRconToOps">Difundir RCON a OPs</Label>
                          <Switch id="broadcastRconToOps" checked={config.broadcastRconToOps || false} onCheckedChange={(checked) => updateConfig("broadcastRconToOps", checked)} />
                        </div>
                        <p className="text-xs text-muted-foreground">Difunde los comandos RCON ejecutados a los operadores conectados</p>
                      </div>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="commandBlock">Bloques de Comandos</Label>
                <Switch id="commandBlock" checked={config.commandBlock} onCheckedChange={(checked) => updateConfig("commandBlock", checked)} />
              </div>
              <p className="text-xs text-muted-foreground">Habilita el uso de bloques de comandos</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="allowFlight">Permitir Vuelo</Label>
                <Switch id="allowFlight" checked={config.allowFlight} onCheckedChange={(checked) => updateConfig("allowFlight", checked)} />
              </div>
              <p className="text-xs text-muted-foreground">Permite a los jugadores volar (si tienen habilitado el modo creativo o mods de vuelo)</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Borrar Datos del Servidor
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                <AlertDialogDescription>Esta acción no se puede deshacer. Se borrarán todos los mundos, configuraciones y datos guardados del servidor.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearData} disabled={isClearing} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {isClearing ? "Borrando..." : "Sí, borrar todo"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="button" onClick={onSave} className="gap-2">
          <Save className="h-4 w-4" />
          Guardar Configuración
        </Button>
      </CardFooter>
    </Card>
  );
};
