import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Terminal, RefreshCcw } from "lucide-react";
import { useServerLogs } from "@/lib/hooks/useServerLogs";

interface LogsTabProps {
  serverId: string;
}

export function LogsTab({ serverId }: Readonly<LogsTabProps>) {
  const { logs, loading, lineCount, fetchLogs, setLogLines } =
    useServerLogs(serverId);
  const logsContainerRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (logsContainerRef.current && logs) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Logs del Servidor</CardTitle>
          <CardDescription>
            Visualiza los logs más recientes del servidor
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={lineCount}
            onChange={(e) => setLogLines(Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value={50}>50 líneas</option>
            <option value={100}>100 líneas</option>
            <option value={500}>500 líneas</option>
            <option value={1000}>1000 líneas</option>
          </select>
          <Button
            type="button"
            size="sm"
            onClick={fetchLogs}
            disabled={loading}
          >
            {loading ? (
              <RefreshCcw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2" />
            )}
            Actualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute top-0 right-0 bg-muted px-2 py-1 text-xs rounded-bl-md flex items-center">
            <Terminal className="h-3 w-3 mr-1" /> Consola
          </div>
          <pre
            ref={logsContainerRef}
            className="logs-container bg-black text-green-400 p-4 rounded-md h-[400px] overflow-auto text-xs font-mono"
          >
            {logs ? (
              logs
            ) : loading ? (
              <div className="flex h-full items-center justify-center">
                <RefreshCcw className="h-4 w-4 animate-spin mr-2" />
                Cargando logs...
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No hay logs disponibles
              </div>
            )}
          </pre>
        </div>
        <div className="flex justify-end mt-4">
          <Button type="button" onClick={fetchLogs} disabled={loading}>
            {loading ? (
              <RefreshCcw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2" />
            )}
            Actualizar Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
