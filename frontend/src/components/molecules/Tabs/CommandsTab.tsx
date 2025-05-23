import { FC, useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Trash, Terminal, AlertTriangle } from "lucide-react";
import { useServerCommands } from "@/lib/hooks/useServerCommands";
import Image from "next/image";

interface CommandsTabProps {
  serverId: string;
  serverStatus: string;
  rconPort: string;
  rconPassword: string;
}

export const CommandsTab: FC<CommandsTabProps> = ({ serverId, serverStatus, rconPort, rconPassword }) => {
  const { command, response, executing, executeCommand, setCommand, clearResponse } = useServerCommands(serverId, rconPort, rconPassword);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState<Array<{ label: string; command: string }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const isServerRunning = serverStatus === "running";

  // Lista expandida de comandos comunes de Minecraft con categorías
  const allCommands = [
    // Jugadores
    { label: "Listar jugadores", command: "list", category: "jugadores" },
    { label: "Teletransportar a jugador", command: "tp @p ~ ~ ~", category: "jugadores" },
    { label: "Dar experiencia", command: "xp add @p 100 levels", category: "jugadores" },
    { label: "Dar efecto", command: "effect give @p minecraft:speed 60 2", category: "jugadores" },
    { label: "Modo creativo", command: "gamemode creative @p", category: "jugadores" },
    { label: "Modo supervivencia", command: "gamemode survival @p", category: "jugadores" },
    { label: "Modo aventura", command: "gamemode adventure @p", category: "jugadores" },
    { label: "Modo espectador", command: "gamemode spectator @p", category: "jugadores" },

    // Mundo
    { label: "Modo día", command: "time set day", category: "mundo" },
    { label: "Modo noche", command: "time set night", category: "mundo" },
    { label: "Clima despejado", command: "weather clear", category: "mundo" },
    { label: "Clima lluvioso", command: "weather rain", category: "mundo" },
    { label: "Clima tormentoso", command: "weather thunder", category: "mundo" },
    { label: "Dificultad pacífica", command: "difficulty peaceful", category: "mundo" },
    { label: "Dificultad fácil", command: "difficulty easy", category: "mundo" },
    { label: "Dificultad normal", command: "difficulty normal", category: "mundo" },
    { label: "Dificultad difícil", command: "difficulty hard", category: "mundo" },

    // Items
    { label: "Dar diamantes", command: "give @p minecraft:diamond 64", category: "items" },
    { label: "Dar espada de diamante", command: "give @p minecraft:diamond_sword", category: "items" },
    { label: "Dar manzanas doradas", command: "give @p minecraft:golden_apple 16", category: "items" },
    { label: "Dar bloque de comandos", command: "give @p minecraft:command_block", category: "items" },

    // Administración
    { label: "Ver seed del mundo", command: "seed", category: "admin" },
    { label: "Guardar mundo", command: "save-all", category: "admin" },
    { label: "Expulsar a jugador", command: "kick <jugador>", category: "admin" },
    { label: "Banear a jugador", command: "ban <jugador>", category: "admin" },
    { label: "Ver TPS", command: "forge tps", category: "admin" },
    { label: "Modo spigot timings", command: "timings on", category: "admin" },
  ];

  // Comandos comunes para mostrar como botones rápidos
  const commonCommands = allCommands.slice(0, 7);

  useEffect(() => {
    if (command) {
      const filtered = allCommands.filter((cmd) => cmd.command.toLowerCase().includes(command.toLowerCase()) || cmd.label.toLowerCase().includes(command.toLowerCase()));
      setFilteredCommands(filtered.slice(0, 5)); // Limitamos a 5 sugerencias
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [command]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      executeCommand();
      setShowSuggestions(false);
    } else if (e.key === "Tab" && showSuggestions && filteredCommands.length > 0) {
      e.preventDefault();
      setCommand(filteredCommands[0].command);
      setShowSuggestions(false);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    } else if (e.key === "ArrowDown" && showSuggestions) {
      e.preventDefault();
      // Navegar por las sugerencias
    }
  };

  const handleSuggestionClick = (suggestedCommand: string) => {
    setCommand(suggestedCommand);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <Card className="bg-gray-900/60 border-gray-700/50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-emerald-400 font-minecraft flex items-center gap-2">
          <Image src="/images/command-block.webp" alt="Comandos" width={24} height={24} className="opacity-90" />
          Consola de Comandos
        </CardTitle>
        <CardDescription className="text-gray-300">Ejecuta comandos directamente en el servidor de Minecraft</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isServerRunning && (
          <div className="p-4 border rounded-md bg-amber-900/30 border-amber-700/30 text-amber-300 mb-4 flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium font-minecraft text-sm">El servidor no está en funcionamiento</p>
              <p className="text-xs text-amber-200/80 mt-1">Inicia el servidor para poder ejecutar comandos.</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-gray-300 font-minecraft text-sm mb-1 flex items-center gap-2">
            <Image src="/images/experience-bottle.webp" alt="Comandos" width={16} height={16} className="opacity-90" />
            Comandos Rápidos
          </div>
          <div className="flex flex-wrap gap-2">
            {commonCommands.map((cmd, idx) => (
              <Button key={idx} type="button" variant="outline" size="sm" onClick={() => setCommand(cmd.command)} disabled={!isServerRunning} className="text-xs bg-gray-800/60 border-gray-700/50 text-gray-200 hover:bg-gray-700/40 hover:text-emerald-400 font-minecraft">
                {cmd.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-gray-300 font-minecraft text-sm mb-1 flex items-center gap-2">
            <Image src="/images/book.webp" alt="Comandos" width={16} height={16} className="opacity-90" />
            Enviar Comando
          </div>
          <div className="relative">
            <div className="flex space-x-2">
              <Input ref={inputRef} value={command} onChange={(e) => setCommand(e.target.value)} onKeyDown={handleKeyDown} onFocus={() => command && setShowSuggestions(filteredCommands.length > 0)} onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} placeholder="Escribe un comando de Minecraft... (sin /)" disabled={!isServerRunning || executing} className="flex-1 bg-gray-800/70 text-gray-200 border-gray-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/30 font-mono" />
              <Button type="button" onClick={() => executeCommand()} disabled={!isServerRunning || !command.trim() || executing} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-minecraft">
                {executing ? (
                  <>
                    <Send className="h-4 w-4 animate-pulse" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Enviar
                  </>
                )}
              </Button>
            </div>

            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 z-10 bg-gray-800 border border-gray-700 rounded-md mt-1 shadow-lg max-h-48 overflow-auto">
                {filteredCommands.map((suggestion, idx) => (
                  <div key={idx} onClick={() => handleSuggestionClick(suggestion.command)} className="p-2 hover:bg-gray-700 cursor-pointer flex justify-between border-b border-gray-700/50">
                    <span className="font-mono text-emerald-400">{suggestion.command}</span>
                    <span className="text-xs text-gray-400">{suggestion.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 pl-1">
            <span className="opacity-70">Presiona</span> <kbd className="px-1.5 py-0.5 text-xs bg-gray-800 border border-gray-700 rounded-md">Tab</kbd> <span className="opacity-70">para autocompletar, o</span> <kbd className="px-1.5 py-0.5 text-xs bg-gray-800 border border-gray-700 rounded-md">Enter</kbd> <span className="opacity-70">para enviar</span>
          </p>
        </div>

        {response && (
          <div className="space-y-2">
            <div className="text-gray-300 font-minecraft text-sm mb-1 flex items-center gap-2">
              <Image src="/images/redstone-comparator.png" alt="Respuesta" width={16} height={16} className="opacity-90" />
              Respuesta del Servidor
            </div>
            <div className="relative mt-1">
              <div className="absolute top-2 right-2">
                <Button type="button" variant="ghost" size="icon" onClick={clearResponse} className="h-6 w-6 text-gray-400 hover:text-white hover:bg-gray-700/50">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 bg-gray-950/80 text-emerald-400 border border-gray-700/50 rounded-md min-h-[200px] max-h-[400px] overflow-auto font-mono text-sm whitespace-pre-wrap">{response}</div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-gray-700/40 pt-4">
        <div className="flex items-center text-xs text-gray-400">
          <Terminal className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
          <p>Los comandos se envían sin el símbolo &quot;/&quot; inicial. Usa Tab para autocompletar comandos sugeridos.</p>
        </div>
      </CardFooter>
    </Card>
  );
};
