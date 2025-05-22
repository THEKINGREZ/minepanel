/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { ServerConfig } from "@/lib/types/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";

interface MemoryCpuTabProps {
  config: ServerConfig;
  updateConfig: (field: keyof ServerConfig, value: any) => void;
}

export const MemoryCpuTab: FC<MemoryCpuTabProps> = ({ config, updateConfig }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-md bg-gray-800/50 border border-gray-700/50">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="initMemory" className="text-gray-200 font-minecraft text-sm flex items-center gap-2">
              <Image src="/images/clock.webp" alt="Memoria Inicial" width={16} height={16} />
              Memoria Inicial (JVM)
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0 bg-transparent hover:bg-gray-700/50">
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200">
                  <p>Memoria inicial asignada a la JVM (-Xms)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input id="initMemory" value={config.initMemory || "1G"} onChange={(e) => updateConfig("initMemory", e.target.value)} placeholder="1G" className="bg-gray-800/70 border-gray-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/30" />
          <p className="text-xs text-gray-400">Memoria inicial asignada a Java (Xms) - ej: 2G, 1024M</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="maxMemory" className="text-gray-200 font-minecraft text-sm flex items-center gap-2">
              <Image src="/images/clock.webp" alt="Memoria Máxima" width={16} height={16} />
              Memoria Máxima (JVM)
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0 bg-transparent hover:bg-gray-700/50">
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200">
                  <p>Memoria máxima asignada a la JVM (-Xmx)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input id="maxMemory" value={config.maxMemory || "1G"} onChange={(e) => updateConfig("maxMemory", e.target.value)} placeholder="1G" className="bg-gray-800/70 border-gray-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/30" />
          <p className="text-xs text-gray-400">Memoria máxima asignada a Java (Xmx) - ej: 4G, 4096M</p>
        </div>
      </div>

      <div className="p-4 rounded-md bg-gray-800/50 border border-gray-700/50 space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="memory" className="text-gray-200 font-minecraft text-sm flex items-center gap-2">
            <Image src="/images/golden-apple.webp" alt="Memoria General" width={16} height={16} />
            Memoria (General)
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0 bg-transparent hover:bg-gray-700/50">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200">
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
          className="bg-gray-800/70 border-gray-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/30"
        />
        <p className="text-xs text-gray-400">Configura tanto la memoria inicial como máxima con un solo valor (anula valores individuales)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-md bg-gray-800/50 border border-gray-700/50">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="cpuLimit" className="text-gray-200 font-minecraft text-sm flex items-center gap-2">
              <Image src="/images/redstone.webp" alt="CPU Límite" width={16} height={16} />
              Límite de CPU
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0 bg-transparent hover:bg-gray-700/50">
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200">
                  <p>Límite máximo de CPU para el contenedor Docker</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input id="cpuLimit" value={config.cpuLimit} onChange={(e) => updateConfig("cpuLimit", e.target.value)} placeholder="2" className="bg-gray-800/70 border-gray-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/30" />
          <p className="text-xs text-gray-400">Número máximo de núcleos de CPU que puede usar el servidor</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="cpuReservation" className="text-gray-200 font-minecraft text-sm flex items-center gap-2">
              <Image src="/images/repeater.webp" alt="CPU Reserva" width={16} height={16} />
              Reserva de CPU
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0 bg-transparent hover:bg-gray-700/50">
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200">
                  <p>Cantidad mínima de CPU garantizada para el contenedor</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input id="cpuReservation" value={config.cpuReservation} onChange={(e) => updateConfig("cpuReservation", e.target.value)} placeholder="0.5" className="bg-gray-800/70 border-gray-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/30" />
          <p className="text-xs text-gray-400">Cantidad mínima de CPU garantizada para el contenedor</p>
        </div>
      </div>

      <div className="p-4 rounded-md bg-gray-800/50 border border-gray-700/50 space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="memoryReservation" className="text-gray-200 font-minecraft text-sm flex items-center gap-2">
            <Image src="/images/iron-bars.webp" alt="Reserva de Memoria" width={16} height={16} />
            Reserva de Memoria (Docker)
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0 bg-transparent hover:bg-gray-700/50">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200">
                <p>Cantidad de memoria reservada para el contenedor Docker</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input id="memoryReservation" value={config.memoryReservation} onChange={(e) => updateConfig("memoryReservation", e.target.value)} placeholder="2G" className="bg-gray-800/70 border-gray-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/30" />
        <p className="text-xs text-gray-400">Cantidad de memoria reservada para el contenedor Docker</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-md bg-gray-800/50 border border-gray-700/50">
        <div className="space-y-2">
          <Label htmlFor="uid" className="text-gray-200 font-minecraft text-sm flex items-center gap-2">
            <Image src="/images/player-head.png" alt="Usuario" width={16} height={16} />
            Usuario Linux (UID)
          </Label>
          <Input id="uid" type="number" value={config.uid || "1000"} onChange={(e) => updateConfig("uid", e.target.value)} placeholder="1000" className="bg-gray-800/70 border-gray-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/30" />
          <p className="text-xs text-gray-400">ID de usuario Linux bajo el cual se ejecutará el servidor</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gid" className="text-gray-200 font-minecraft text-sm flex items-center gap-2">
            <Image src="/images/player-head.png" alt="Grupo" width={16} height={16} />
            Grupo Linux (GID)
          </Label>
          <Input id="gid" type="number" value={config.gid || "1000"} onChange={(e) => updateConfig("gid", e.target.value)} placeholder="1000" className="bg-gray-800/70 border-gray-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/30" />
          <p className="text-xs text-gray-400">ID de grupo Linux bajo el cual se ejecutará el servidor</p>
        </div>
      </div>
    </>
  );
};
