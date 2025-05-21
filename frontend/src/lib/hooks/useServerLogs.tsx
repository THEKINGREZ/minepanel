import { useState } from "react";
import { toast } from "sonner";
import { getServerLogs } from "@/services/docker/fetchs";

export function useServerLogs(serverId: string) {
  const [logs, setLogs] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [lineCount, setLineCount] = useState<number>(100);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getServerLogs(serverId, lineCount);
      setLogs(data.logs);
      return data.logs;
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Error al obtener los logs del servidor");
      return "";
    } finally {
      setLoading(false);
    }
  };

  const setLogLines = (lines: number) => {
    setLineCount(lines);
  };

  return {
    logs,
    loading,
    lineCount,
    fetchLogs,
    setLogLines,
  };
}
