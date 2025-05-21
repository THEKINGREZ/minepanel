import { FC } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { ServerConfig } from "@/lib/types/types";

interface AdvancedTabProps {
  config: ServerConfig;
  updateConfig: (field: keyof ServerConfig, value: any) => void;
  onSave: () => Promise<boolean>;
}

export const AdvancedTab: FC<AdvancedTabProps> = ({ config, updateConfig, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración Avanzada</CardTitle>
        <CardDescription>Opciones avanzadas para la configuración de tu servidor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="dockerImage">Imagen Docker</Label>
          <Input id="dockerImage" value={config.dockerImage} onChange={(e) => updateConfig("dockerImage", e.target.value)} placeholder="itzg/minecraft-server:latest" />
          <p className="text-xs text-muted-foreground">Imagen Docker a utilizar (por defecto: itzg/minecraft-server:latest)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minecraftVersion">Versión de Minecraft</Label>
          <Input id="minecraftVersion" value={config.minecraftVersion} onChange={(e) => updateConfig("minecraftVersion", e.target.value)} placeholder="1.19.2" />
          <p className="text-xs text-muted-foreground">Versión específica de Minecraft a utilizar</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="idleTimeout">Tiempo Inactivo (min)</Label>
          <Input id="idleTimeout" type="number" value={config.idleTimeout} onChange={(e) => updateConfig("idleTimeout", e.target.value)} placeholder="60" />
          <p className="text-xs text-muted-foreground">Tiempo en minutos antes de expulsar a jugadores inactivos (0 para desactivar)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dockerVolumes">Volúmenes Docker</Label>
          <Textarea
            id="dockerVolumes"
            value={config.dockerVolumes}
            onChange={(e) => updateConfig("dockerVolumes", e.target.value)}
            placeholder="./mc-data:/data
./modpacks:/modpacks:ro"
            className="min-h-20"
          />
          <p className="text-xs text-muted-foreground">Mapeos de volúmenes Docker (uno por línea, formato: ruta-local:ruta-contenedor)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="restartPolicy">Política de Reinicio</Label>
          <Select value={config.restartPolicy} onValueChange={(value) => updateConfig("restartPolicy", value as "no" | "always" | "on-failure" | "unless-stopped")}>
            <SelectTrigger id="restartPolicy">
              <SelectValue placeholder="Selecciona la política de reinicio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No reiniciar</SelectItem>
              <SelectItem value="always">Siempre reiniciar</SelectItem>
              <SelectItem value="on-failure">Reiniciar en caso de error</SelectItem>
              <SelectItem value="unless-stopped">Reiniciar a menos que se detenga manualmente</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Política de reinicio del contenedor Docker</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stopDelay">Retardo de Detención (seg)</Label>
          <Input id="stopDelay" type="number" value={config.stopDelay} onChange={(e) => updateConfig("stopDelay", e.target.value)} placeholder="60" />
          <p className="text-xs text-muted-foreground">Tiempo en segundos a esperar antes de detener forzosamente el servidor</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="rollingLogs">Logs Rotativos</Label>
            <Switch id="rollingLogs" checked={config.rollingLogs} onCheckedChange={(checked) => updateConfig("rollingLogs", checked)} />
          </div>
          <p className="text-xs text-muted-foreground">Activar rotación de logs para evitar que crezcan demasiado</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="execDirectly">Ejecución Directa</Label>
            <Switch id="execDirectly" checked={config.execDirectly} onCheckedChange={(checked) => updateConfig("execDirectly", checked)} />
          </div>
          <p className="text-xs text-muted-foreground">Ejecutar Java directamente en lugar de usar scripts de inicio (mejor rendimiento)</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="envVars">Variables de Entorno</Label>
          <Textarea
            id="envVars"
            value={config.envVars}
            onChange={(e) => updateConfig("envVars", e.target.value)}
            placeholder="ENABLE_AUTOPAUSE=TRUE
MAX_TICK_TIME=60000"
            className="min-h-20"
          />
          <p className="text-xs text-muted-foreground">Variables de entorno adicionales para el contenedor (una por línea, formato: CLAVE=VALOR)</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="button" onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Guardar
        </Button>
      </CardFooter>
    </Card>
  );
};
