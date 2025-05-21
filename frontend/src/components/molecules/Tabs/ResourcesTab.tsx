import { FC } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, HelpCircle } from "lucide-react";
import { ServerConfig } from "@/lib/types/types";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ResourcesTabProps {
  config: ServerConfig;
  updateConfig: (field: keyof ServerConfig, value: any) => void;
  onSave: () => Promise<boolean>;
}

export const ResourcesTab: FC<ResourcesTabProps> = ({ config, updateConfig, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recursos del Servidor</CardTitle>
        <CardDescription>Configura memoria, CPU y otras limitaciones de recursos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="memory" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="memory">Memoria y CPU</TabsTrigger>
            <TabsTrigger value="jvm">Opciones de JVM</TabsTrigger>
            <TabsTrigger value="advanced">Opciones Avanzadas</TabsTrigger>
          </TabsList>

          <TabsContent value="memory" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="initMemory">Memoria Inicial (JVM)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Memoria inicial asignada a la JVM (-Xms)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input id="initMemory" value={config.initMemory || "1G"} onChange={(e) => updateConfig("initMemory", e.target.value)} placeholder="1G" />
                <p className="text-xs text-muted-foreground">Memoria inicial asignada a Java (Xms) - ej: 2G, 1024M</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="maxMemory">Memoria Máxima (JVM)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Memoria máxima asignada a la JVM (-Xmx)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input id="maxMemory" value={config.maxMemory || "1G"} onChange={(e) => updateConfig("maxMemory", e.target.value)} placeholder="1G" />
                <p className="text-xs text-muted-foreground">Memoria máxima asignada a Java (Xmx) - ej: 4G, 4096M</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="memory">Memoria (General)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Establece tanto la memoria inicial como máxima al mismo valor</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="memory"
                value={config.memory || "1G"}
                onChange={(e) => {
                  updateConfig("memory", e.target.value);
                  // Si se establece memory, actualizar también initMemory y maxMemory
                  if (e.target.value) {
                    updateConfig("initMemory", e.target.value);
                    updateConfig("maxMemory", e.target.value);
                  }
                }}
                placeholder="1G"
              />
              <p className="text-xs text-muted-foreground">Configura tanto la memoria inicial como máxima con un solo valor (anula valores individuales)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cpuLimit">Límite de CPU</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Límite máximo de CPU para el contenedor Docker</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input id="cpuLimit" value={config.cpuLimit} onChange={(e) => updateConfig("cpuLimit", e.target.value)} placeholder="2" />
                <p className="text-xs text-muted-foreground">Número máximo de núcleos de CPU que puede usar el servidor</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cpuReservation">Reserva de CPU</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cantidad mínima de CPU garantizada para el contenedor</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input id="cpuReservation" value={config.cpuReservation} onChange={(e) => updateConfig("cpuReservation", e.target.value)} placeholder="0.5" />
                <p className="text-xs text-muted-foreground">Cantidad mínima de CPU garantizada para el contenedor</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="memoryReservation">Reserva de Memoria (Docker)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cantidad de memoria reservada para el contenedor Docker</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input id="memoryReservation" value={config.memoryReservation} onChange={(e) => updateConfig("memoryReservation", e.target.value)} placeholder="2G" />
              <p className="text-xs text-muted-foreground">Cantidad de memoria reservada para el contenedor Docker</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="uid">Usuario Linux (UID)</Label>
                <Input id="uid" type="number" value={config.uid || "1000"} onChange={(e) => updateConfig("uid", e.target.value)} placeholder="1000" />
                <p className="text-xs text-muted-foreground">ID de usuario Linux bajo el cual se ejecutará el servidor</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gid">Grupo Linux (GID)</Label>
                <Input id="gid" type="number" value={config.gid || "1000"} onChange={(e) => updateConfig("gid", e.target.value)} placeholder="1000" />
                <p className="text-xs text-muted-foreground">ID de grupo Linux bajo el cual se ejecutará el servidor</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="jvm" className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="useAikarFlags">Usar Flags de Aikar</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-md">
                        <p>Aikar ha realizado investigaciones para encontrar las banderas JVM óptimas para el ajuste de GC, lo que es más importante cuantos más usuarios se conectan simultáneamente.</p>
                        <p className="mt-1 text-xs text-green-500">Recomendado para servidores con muchos jugadores</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch id="useAikarFlags" checked={config.useAikarFlags || false} onCheckedChange={(checked) => updateConfig("useAikarFlags", checked)} />
              </div>
              <p className="text-xs text-muted-foreground">Utiliza configuraciones optimizadas de JVM para servidores con muchos jugadores</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="enableJmx">Habilitar JMX</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Permite el monitoreo remoto JMX, como para perfilar con VisualVM o JMC</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch id="enableJmx" checked={config.enableJmx || false} onCheckedChange={(checked) => updateConfig("enableJmx", checked)} />
              </div>
              <p className="text-xs text-muted-foreground">Habilita el monitoreo remoto de JMX para herramientas de diagnóstico</p>
            </div>

            {config.enableJmx && (
              <div className="space-y-2">
                <Label htmlFor="jmxHost">Host JMX</Label>
                <Input id="jmxHost" value={config.jmxHost || ""} onChange={(e) => updateConfig("jmxHost", e.target.value)} placeholder="0.0.0.0" />
                <p className="text-xs text-muted-foreground">IP/Host que ejecuta el contenedor Docker (necesario para JMX remoto)</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="jvmOpts">Opciones de JVM</Label>
              <Textarea id="jvmOpts" value={config.jvmOpts || ""} onChange={(e) => updateConfig("jvmOpts", e.target.value)} placeholder="-XX:+UseG1GC -XX:+ParallelRefProcEnabled" className="min-h-20" />
              <p className="text-xs text-muted-foreground">Opciones generales de JVM separadas por espacios (argumentos comenzando con -X)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jvmXxOpts">Opciones XX de JVM</Label>
              <Textarea id="jvmXxOpts" value={config.jvmXxOpts || ""} onChange={(e) => updateConfig("jvmXxOpts", e.target.value)} placeholder="-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200" className="min-h-20" />
              <p className="text-xs text-muted-foreground">Opciones específicas XX de JVM (deben preceder a las opciones -X)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jvmDdOpts">Propiedades del Sistema (DD)</Label>
              <Textarea id="jvmDdOpts" value={config.jvmDdOpts || ""} onChange={(e) => updateConfig("jvmDdOpts", e.target.value)} placeholder="net.minecraft.server.level.ChunkMap.radius=3,com.mojang.eula.agree=true" className="min-h-20" />
              <p className="text-xs text-muted-foreground">Lista de propiedades del sistema separadas por comas (name=value o name:value)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="extraArgs">Argumentos Adicionales</Label>
              <Textarea id="extraArgs" value={config.extraArgs || ""} onChange={(e) => updateConfig("extraArgs", e.target.value)} placeholder="--noconsole" className="min-h-20" />
              <p className="text-xs text-muted-foreground">Argumentos adicionales que se pasarán al archivo JAR del servidor</p>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="tz">Zona Horaria</Label>
              <Select value={config.tz || "UTC"} onValueChange={(value) => updateConfig("tz", value)}>
                <SelectTrigger id="tz">
                  <SelectValue placeholder="Selecciona la zona horaria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                  <SelectItem value="America/New_York">America/New_York</SelectItem>
                  <SelectItem value="Europe/London">Europe/London</SelectItem>
                  <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                  <SelectItem value="Europe/Madrid">Europe/Madrid</SelectItem>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                  <SelectItem value="Australia/Sydney">Australia/Sydney</SelectItem>
                  <SelectItem value="America/Santiago">America/Santiago</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Zona horaria del servidor (por defecto: UTC)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="viewDistance">Distancia de Renderizado</Label>
                <Input id="viewDistance" type="number" value={config.viewDistance || "10"} onChange={(e) => updateConfig("viewDistance", e.target.value)} placeholder="10" />
                <p className="text-xs text-muted-foreground">Número de chunks que se renderizarán alrededor de cada jugador</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="simulationDistance">Distancia de Simulación</Label>
                <Input id="simulationDistance" type="number" value={config.simulationDistance || "6"} onChange={(e) => updateConfig("simulationDistance", e.target.value)} placeholder="6" />
                <p className="text-xs text-muted-foreground">Número de chunks alrededor de cada jugador que serán procesados</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="enableRollingLogs">Habilitar Logs Rotativos</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Por defecto, el archivo de registro vanilla crecerá sin límite. El registrador se puede reconfigurar para usar una estrategia de archivos de registro rotativa.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch id="enableRollingLogs" checked={config.enableRollingLogs || false} onCheckedChange={(checked) => updateConfig("enableRollingLogs", checked)} />
              </div>
              <p className="text-xs text-muted-foreground">Limita el tamaño de los archivos de log mediante rotación</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="logTimestamp">Mostrar Hora en Logs</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Incluye la marca de tiempo con cada log</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch id="logTimestamp" checked={config.logTimestamp || false} onCheckedChange={(checked) => updateConfig("logTimestamp", checked)} />
              </div>
              <p className="text-xs text-muted-foreground">Agrega marcas de tiempo en las entradas de los logs</p>
            </div>
          </TabsContent>
        </Tabs>
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
