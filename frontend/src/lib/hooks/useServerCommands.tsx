import { useState } from "react";
import { toast } from "sonner";
import { executeServerCommand } from "@/services/docker/fetchs";

export function useServerCommands(serverId: string, rconPort: string, rconPassword: string) {
  const [command, setCommand] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [executing, setExecuting] = useState<boolean>(false);

  const executeCommand = async (commandToExecute: string = command) => {
    if (!commandToExecute.trim()) {
      toast.error("Ingresa un comando para ejecutar");
      return false;
    }
    if (!rconPort) {
      toast.error("El puerto RCON no está configurado");
      return false;
    }

    const body = {
      command: commandToExecute,
      rconPort: rconPort,
      rconPassword: rconPassword,
    };

    setExecuting(true);
    try {
      const result = await executeServerCommand(serverId, body);
      if (result.success) {
        setResponse(result.output);
        toast.success("Comando ejecutado correctamente");
        // Clear the command field after execution
        setCommand("");
        return true;
      } else {
        setResponse(result.output);
        toast.error("Error al ejecutar el comando");
        return false;
      }
    } catch (error) {
      console.error("Error executing command:", error);
      toast.error("Error al ejecutar el comando");
      return false;
    } finally {
      setExecuting(false);
    }
  };

  const clearResponse = () => {
    setResponse("");
  };

  const setCommandText = (text: string) => {
    setCommand(text);
  };

  return {
    command,
    response,
    executing,
    executeCommand,
    setCommand: setCommandText,
    clearResponse,
  };
}
