import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Trash } from "lucide-react";
import { useServerCommands } from "@/lib/hooks/useServerCommands";

interface CommandsTabProps {
  serverId: string;
  serverStatus: string;
}

export const CommandsTab: FC<CommandsTabProps> = ({
  serverId,
  serverStatus,
}) => {
  const {
    command,
    response,
    executing,
    executeCommand,
    setCommand,
    clearResponse,
  } = useServerCommands(serverId);

  const isServerRunning = serverStatus === "running";

  // Common Minecraft commands
  const commonCommands = [
    { label: "Lista de jugadores", command: "list" },
    { label: "Modo día", command: "time set day" },
    { label: "Modo noche", command: "time set night" },
    { label: "Clima despejado", command: "weather clear" },
    { label: "Dar diamantes", command: "give @p minecraft:diamond 64" },
    { label: "Modo creativo", command: "gamemode creative @p" },
    { label: "Modo supervivencia", command: "gamemode survival @p" },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      executeCommand();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consola de Comandos</CardTitle>
        <CardDescription>
          Ejecuta comandos directamente en el servidor de Minecraft
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isServerRunning && (
          <div className="p-4 border rounded-md bg-amber-50 border-amber-200 text-amber-700 mb-4">
            <p className="font-medium">El servidor no está en funcionamiento</p>
            <p className="text-sm">
              Inicia el servidor para poder ejecutar comandos.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {commonCommands.map((cmd, idx) => (
            <Button
              key={idx}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCommand(cmd.command)}
              disabled={!isServerRunning}
              className="text-xs"
            >
              {cmd.label}
            </Button>
          ))}
        </div>

        <div className="flex space-x-2">
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un comando de Minecraft... (sin /)"
            disabled={!isServerRunning || executing}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={() => executeCommand()}
            disabled={!isServerRunning || !command.trim() || executing}
          >
            {executing ? (
              <span className="flex items-center">
                <Send className="h-4 w-4 animate-pulse mr-2" />
                Enviando...
              </span>
            ) : (
              <span className="flex items-center">
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </span>
            )}
          </Button>
        </div>

        {response && (
          <div className="relative mt-4">
            <div className="absolute top-2 right-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearResponse}
                className="h-6 w-6"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 bg-black text-green-400 rounded-md min-h-[200px] max-h-[400px] overflow-auto font-mono text-sm whitespace-pre-wrap">
              {response}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Tip: Los comandos se envían sin el símbolo "/" inicial
        </p>
      </CardFooter>
    </Card>
  );
};
