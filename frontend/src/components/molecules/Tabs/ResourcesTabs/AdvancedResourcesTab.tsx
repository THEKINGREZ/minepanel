import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { ServerConfig } from "@/lib/types/types";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

interface AdvancedResourcesTabProps {
  config: ServerConfig;
  updateConfig: (field: keyof ServerConfig, value: any) => void;
}

export const AdvancedResourcesTab: FC<AdvancedResourcesTabProps> = ({ config, updateConfig }) => {
  return (
    <>
      <div className="p-4 rounded-md bg-gray-800/50 border border-gray-700/50 space-y-2">
        <Label htmlFor="tz" className="text-gray-200 font-minecraft text-sm flex items-center gap-2">
          <Image src="/images/clock.webp" alt="Zona Horaria" width={16} height={16} />
          Zona Horaria
        </Label>
        <Select value={config.tz || "UTC"} onValueChange={(value) => updateConfig("tz", value)}>
          <SelectTrigger id="tz" className="bg-gray-800/70 border-gray-700/50 focus:ring-emerald-500/30">
            <SelectValue placeholder="Selecciona la zona horaria" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
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
        <p className="text-xs text-gray-400">Zona horaria del servidor (por defecto: UTC)</p>
      </div>

      <div className="p-4 rounded-md bg-gray-800/50 border border-gray-700/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="enableRollingLogs" className="text-gray-200 font-minecraft text-sm flex items-center gap-2">
              <Image src="/images/paper.webp" alt="Logs Rotativos" width={16} height={16} />
              Habilitar Logs Rotativos
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0 bg-transparent hover:bg-gray-700/50">
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200">
                  <p>Por defecto, el archivo de registro vanilla crecerá sin límite. El registrador se puede reconfigurar para usar una estrategia de archivos de registro rotativa.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch id="enableRollingLogs" checked={config.enableRollingLogs || false} onCheckedChange={(checked) => updateConfig("enableRollingLogs", checked)} />
        </div>
        <p className="text-xs text-gray-400">Limita el tamaño de los archivos de log mediante rotación</p>
      </div>

      <div className="p-4 rounded-md bg-gray-800/50 border border-gray-700/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="logTimestamp" className="text-gray-200 font-minecraft text-sm flex items-center gap-2">
              <Image src="/images/daylight-detector.webp" alt="Tiempo en Logs" width={16} height={16} />
              Mostrar Hora en Logs
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0 bg-transparent hover:bg-gray-700/50">
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200">
                  <p>Incluye la marca de tiempo con cada log</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch id="logTimestamp" checked={config.logTimestamp || false} onCheckedChange={(checked) => updateConfig("logTimestamp", checked)} />
        </div>
        <p className="text-xs text-gray-400">Agrega marcas de tiempo en las entradas de los logs</p>
      </div>
    </>
  );
};
