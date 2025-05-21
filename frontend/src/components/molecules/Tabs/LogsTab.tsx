import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, RefreshCcw, ChevronDown } from "lucide-react";
import { useServerLogs } from "@/lib/hooks/useServerLogs";
import Image from "next/image";

interface LogsTabProps {
  serverId: string;
}

export function LogsTab({ serverId }: Readonly<LogsTabProps>) {
  const { logs, loading, lineCount, fetchLogs, setLogLines } = useServerLogs(serverId);
  const logsContainerRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (logsContainerRef.current && logs) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Card className="bg-gray-900/60 border-gray-700/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl text-emerald-400 font-minecraft flex items-center gap-2">
            <Image src="/images/command-block.webp" alt="Logs" width={24} height={24} className="opacity-90" />
            Logs del Servidor
          </CardTitle>
          <CardDescription className="text-gray-300">Visualiza los logs más recientes del servidor</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select value={lineCount} onChange={(e) => setLogLines(Number(e.target.value))} className="h-9 appearance-none rounded-md border border-gray-700/50 bg-gray-800/70 text-gray-200 px-3 py-1 text-sm ring-offset-background focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-8">
              <option value={50}>50 líneas</option>
              <option value={100}>100 líneas</option>
              <option value={500}>500 líneas</option>
              <option value={1000}>1000 líneas</option>
            </select>
            <ChevronDown className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <Button type="button" size="sm" onClick={fetchLogs} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-minecraft text-sm">
            {loading ? <RefreshCcw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
            Actualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative border border-gray-700/50 rounded-md shadow-inner">
          <div className="absolute top-0 right-0 bg-gray-800/80 px-3 py-1 text-xs font-minecraft rounded-bl-md flex items-center text-emerald-400 border-l border-b border-gray-700/50">
            <Terminal className="h-3 w-3 mr-1" /> Consola
          </div>
          <pre ref={logsContainerRef} className="logs-container bg-gray-950/80 text-emerald-400 p-4 pt-6 rounded-md h-[500px] overflow-auto text-xs font-mono border-gray-700/50 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {logs ? (
              <div className="minecraft-log">{logs}</div>
            ) : loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCcw className="h-5 w-5 animate-spin text-gray-400" />
                  <span className="text-gray-400 font-minecraft text-sm">Cargando logs...</span>
                  <Image src="/images/loading-block.png" alt="Loading" width={32} height={32} className="animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-gray-500 gap-4">
                <Image src="/images/empty-chest.png" alt="No Logs" width={64} height={64} className="opacity-70" />
                <span className="font-minecraft text-sm">No hay logs disponibles</span>
              </div>
            )}
          </pre>
        </div>

        <div className="flex justify-between mt-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse mr-2"></div>
            <span className="text-xs text-gray-400 font-minecraft">Auto-scroll activado</span>
          </div>
          <Button type="button" onClick={fetchLogs} disabled={loading} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-minecraft">
            {loading ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Actualizar Logs
          </Button>
        </div>
      </CardContent>

      <style jsx global>{`
        .minecraft-log {
          line-height: 1.4;
        }

        .minecraft-log .error,
        .minecraft-log .severe,
        .minecraft-log [level="ERROR"],
        .minecraft-log [level="SEVERE"] {
          color: #ff5555;
        }

        .minecraft-log .warn,
        .minecraft-log .warning,
        .minecraft-log [level="WARN"],
        .minecraft-log [level="WARNING"] {
          color: #ffaa00;
        }

        .minecraft-log .info,
        .minecraft-log [level="INFO"] {
          color: #55ffff;
        }

        .minecraft-log .debug,
        .minecraft-log [level="DEBUG"] {
          color: #aaaaaa;
        }

        /* Estilizar scrollbar para navegadores webkit */
        .logs-container::-webkit-scrollbar {
          width: 8px;
        }

        .logs-container::-webkit-scrollbar-track {
          background: rgba(17, 24, 39, 0.7);
          border-radius: 4px;
        }

        .logs-container::-webkit-scrollbar-thumb {
          background-color: rgba(55, 65, 81, 0.7);
          border-radius: 4px;
          border: 2px solid rgba(17, 24, 39, 0.7);
        }

        .logs-container::-webkit-scrollbar-thumb:hover {
          background-color: rgba(75, 85, 99, 0.8);
        }
      `}</style>
    </Card>
  );
}
