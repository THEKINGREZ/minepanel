/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ServerConfig } from "@/lib/types/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";

interface BasicSettingsTabProps {
  config: ServerConfig;
  updateConfig: (field: keyof ServerConfig, value: any) => void;
}

export const BasicSettingsTab: FC<BasicSettingsTabProps> = ({ config, updateConfig }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="serverName" className="text-gray-200 font-minecraft text-sm">
          Nombre del Servidor
        </Label>
        <Input id="serverName" value={config.serverName} onChange={(e) => updateConfig("serverName", e.target.value)} placeholder="Nombre de tu servidor" className="bg-gray-800/70 border-gray-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/30" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="motd" className="text-gray-200 font-minecraft text-sm">
          Mensaje del Día (MOTD)
        </Label>
        <Input id="motd" value={config.motd} onChange={(e) => updateConfig("motd", e.target.value)} placeholder="Un servidor de Minecraft increíble" className="bg-gray-800/70 border-gray-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/30" />
        <p className="text-xs text-gray-400">El mensaje que aparece en la lista de servidores</p>
      </div>

      <div className="space-y-2 text-gray-200">
        <Label htmlFor="difficulty" className="text-gray-200 font-minecraft text-sm">
          Dificultad
        </Label>
        <Select value={config.difficulty} onValueChange={(value) => updateConfig("difficulty", value as "peaceful" | "easy" | "normal" | "hard")}>
          <SelectTrigger id="difficulty" className="bg-gray-800/70 border-gray-700/50 focus:ring-emerald-500/30">
            <SelectValue placeholder="Selecciona la dificultad" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="peaceful">
              <div className="flex items-center gap-2">
                <Image src="/images/peaceful.png" alt="Pacífico" width={16} height={16} />
                <span>Pacífico</span>
              </div>
            </SelectItem>
            <SelectItem value="easy">
              <div className="flex items-center gap-2">
                <Image src="/images/easy.png" alt="Fácil" width={16} height={16} />
                <span>Fácil</span>
              </div>
            </SelectItem>
            <SelectItem value="normal">
              <div className="flex items-center gap-2">
                <Image src="/images/easy.png" alt="Normal" width={16} height={16} />
                <span>Normal</span>
              </div>
            </SelectItem>
            <SelectItem value="hard">
              <div className="flex items-center gap-2">
                <Image src="/images/hard.png" alt="Difícil" width={16} height={16} />
                <span>Difícil</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gameMode" className="text-gray-200 font-minecraft text-sm">
          Modo de Juego
        </Label>
        <Select value={config.gameMode || "survival"} onValueChange={(value) => updateConfig("gameMode", value)}>
          <SelectTrigger id="gameMode" className="bg-gray-800/70 border-gray-700/50 focus:ring-emerald-500/30">
            <SelectValue placeholder="Selecciona el modo de juego" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="survival">
              <div className="flex items-center gap-2">
                <Image src="/images/sword.png" alt="Supervivencia" width={16} height={16} />
                <span>Supervivencia</span>
              </div>
            </SelectItem>
            <SelectItem value="creative">
              <div className="flex items-center gap-2">
                <Image src="/images/easy.png" alt="Creativo" width={16} height={16} />
                <span>Creativo</span>
              </div>
            </SelectItem>
            <SelectItem value="adventure">
              <div className="flex items-center gap-2">
                <Image src="/images/easy.png" alt="Aventura" width={16} height={16} />
                <span>Aventura</span>
              </div>
            </SelectItem>
            <SelectItem value="spectator">
              <div className="flex items-center gap-2">
                <Image src="/images/hard.png" alt="Espectador" width={16} height={16} />
                <span>Espectador</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxPlayers" className="text-gray-200 font-minecraft text-sm">
          Número Máximo de Jugadores
        </Label>
        <Input id="maxPlayers" type="number" value={config.maxPlayers} onChange={(e) => updateConfig("maxPlayers", e.target.value)} placeholder="20" className="bg-gray-800/70 border-gray-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/30 text-gray-200" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="seed" className="text-gray-200 font-minecraft text-sm">
          Semilla del Mundo
        </Label>
        <Input id="seed" value={config.seed} onChange={(e) => updateConfig("seed", e.target.value)} placeholder="Deja en blanco para semilla aleatoria" className="bg-gray-800/70 border-gray-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/30 text-gray-200" />
        <p className="text-xs text-gray-400">Semilla para la generación del mundo. Si usas un número negativo, asegúrate de ponerlo entre comillas.</p>
      </div>

      <div className="space-y-2 text-gray-200">
        <Label htmlFor="levelType" className="text-gray-200 font-minecraft text-sm">
          Tipo de Mundo
        </Label>
        <Select value={config.levelType || "minecraft:default"} onValueChange={(value) => updateConfig("levelType", value)}>
          <SelectTrigger id="levelType" className="bg-gray-800/70 border-gray-700/50 focus:ring-emerald-500/30">
            <SelectValue placeholder="Selecciona el tipo de mundo" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="minecraft:default">Normal</SelectItem>
            <SelectItem value="minecraft:flat">Plano</SelectItem>
            <SelectItem value="minecraft:large_biomes">Biomas Amplios</SelectItem>
            <SelectItem value="minecraft:amplified">Amplificado</SelectItem>
            <SelectItem value="minecraft:single_biome_surface">Bioma Único</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 rounded-md bg-gray-800/50 border border-gray-700/50 space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="hardcore" className="text-gray-200 font-minecraft text-sm flex items-center gap-2">
            <Image src="/images/hard.png" alt="Hardcore" width={16} height={16} />
            Modo Hardcore
          </Label>
          <Switch id="hardcore" checked={config.hardcore} onCheckedChange={(checked) => updateConfig("hardcore", checked)} className="data-[state=checked]:bg-red-500" />
        </div>
        <p className="text-xs text-gray-400">Si está activado, los jugadores pasarán a modo espectador al morir</p>
      </div>

      <div className="p-4 rounded-md bg-gray-800/50 border border-gray-700/50 space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="pvp" className="text-gray-200 font-minecraft text-sm flex items-center gap-2">
            <Image src="/images/sword.png" alt="PvP" width={16} height={16} />
            PvP
          </Label>
          <Switch id="pvp" checked={config.pvp} onCheckedChange={(checked) => updateConfig("pvp", checked)} />
        </div>
        <p className="text-xs text-gray-400">Permite el combate jugador contra jugador</p>
      </div>

      <Accordion type="single" collapsible className="w-full bg-gray-800/50 border border-gray-700/50 rounded-md">
        <AccordionItem value="spawning" className="border-b-0">
          <AccordionTrigger className="px-4 py-3 text-gray-200 font-minecraft text-sm hover:bg-gray-700/30 rounded-t-md">
            <div className="flex items-center gap-2">
              <Image src="/images/spawner.webp" alt="Generación" width={16} height={16} />
              Opciones de Generación
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4 px-4 pb-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="spawnAnimals" className="text-gray-200 flex items-center gap-2">
                  <Image src="/images/cow.jpg" alt="Animales" width={16} height={16} />
                  Generar Animales
                </Label>
                <Switch id="spawnAnimals" checked={config.spawnAnimals !== false} onCheckedChange={(checked) => updateConfig("spawnAnimals", checked)} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="spawnMonsters" className="text-gray-200 flex items-center gap-2">
                  <Image src="/images/creeper.webp" alt="Monstruos" width={16} height={16} />
                  Generar Monstruos
                </Label>
                <Switch id="spawnMonsters" checked={config.spawnMonsters !== false} onCheckedChange={(checked) => updateConfig("spawnMonsters", checked)} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="spawnNpcs" className="text-gray-200 flex items-center gap-2">
                  <Image src="/images/villager.png" alt="Aldeanos" width={16} height={16} />
                  Generar Aldeanos
                </Label>
                <Switch id="spawnNpcs" checked={config.spawnNpcs !== false} onCheckedChange={(checked) => updateConfig("spawnNpcs", checked)} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="generateStructures" className="text-gray-200 flex items-center gap-2">
                  <Image src="/images/structure.webp" alt="Estructuras" width={16} height={16} />
                  Generar Estructuras
                </Label>
                <Switch id="generateStructures" checked={config.generateStructures !== false} onCheckedChange={(checked) => updateConfig("generateStructures", checked)} />
              </div>
              <p className="text-xs text-gray-400">Define si se generarán estructuras como aldeas, templos, etc.</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="allowNether" className="text-gray-200 flex items-center gap-2">
                  <Image src="/images/nether.webp" alt="Nether" width={16} height={16} />
                  Permitir Nether
                </Label>
                <Switch id="allowNether" checked={config.allowNether !== false} onCheckedChange={(checked) => updateConfig("allowNether", checked)} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};
