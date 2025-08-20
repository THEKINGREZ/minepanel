import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal, RefreshCcw, Cpu, Server, AlertTriangle, XCircle, CheckCircle, Clock, Search, Filter, Play, Pause, Maximize2, Minimize2 } from "lucide-react";
import { useServerLogs } from "@/lib/hooks/useServerLogs";
import { getResources } from "@/services/docker/fetchs";
import Image from "next/image";

interface ResourcesData {
  cpuUsage: string;
  memoryUsage: string;
  memoryLimit: string;
  status?: string;
}

interface LogsTabProps {
  serverId: string;
}

export function LogsTab({ serverId }: Readonly<LogsTabProps>) {
  const { 
    logs, 
    logEntries, 
    filteredLogEntries, 
    loading, 
    lineCount, 
    error, 
    hasErrors, 
    lastUpdate, 
    isRealTime,
    searchTerm,
    levelFilter,
    fetchLogs, 
    setLogLines, 
    clearError,
    toggleRealTime,
    setSearchTerm,
    setLevelFilter
  } = useServerLogs(serverId);
  
  const logsContainerRef = useRef<HTMLPreElement>(null);
  const [resources, setResources] = useState<ResourcesData | null>(null);
  const [loadingResources, setLoadingResources] = useState(false);
  const [resourcesError, setResourcesError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    // Initial fetch only
    fetchLogs();
    fetchServerResources();
  }, []);

  // Auto-scroll to bottom when logs update (only if autoScroll is enabled)
  useEffect(() => {
    if (logsContainerRef.current && logs && autoScroll) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const fetchServerResources = async () => {
    setLoadingResources(true);
    setResourcesError(null);
    try {
      const resourceData = await getResources(serverId);
      setResources(resourceData);
    } catch (error) {
      console.error("Error fetching server resources:", error);
      setResourcesError("Error al obtener recursos del servidor");
      setResources({
        cpuUsage: "N/A",
        memoryUsage: "N/A",
        memoryLimit: "N/A",
        status: "error"
      });
    } finally {
      setLoadingResources(false);
    }
  };

  // Handle error clearing when logs are refreshed
  const handleRefreshLogs = async () => {
    clearError();
    await fetchLogs();
  };

  // Removed duplicate and incomplete Card and CardHeader
  return (
    <Card className={`bg-gray-900/60 border-gray-700/50 shadow-lg transition-all duration-300 ${
      isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : ''
    }`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl text-emerald-400 font-minecraft flex items-center gap-2">
            <Image src="/images/command-block.webp" alt="Logs" width={24} height={24} className="opacity-90" />
            Logs del Servidor
            {isRealTime && (
              <div className="flex items-center ml-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                <span className="text-xs text-green-400">EN VIVO</span>
              </div>
            )}
          </CardTitle>
          <CardDescription className="text-gray-300">
            Visualiza los logs en tiempo real del servidor
            {filteredLogEntries.length > 0 && (
              <span className="ml-2 text-emerald-400">
                ({filteredLogEntries.length} entradas)
              </span>
            )}
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            variant="outline"
            className="bg-gray-800/50 border-gray-600/50 hover:bg-gray-700/50 text-gray-300"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {/* Enhanced Controls Bar */}
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Search and Filters */}
          <div className="lg:col-span-2 space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar en logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/70 border-gray-700/50 text-gray-200 placeholder-gray-400 focus:border-emerald-500/50"
                />
              </div>
              <div className="relative">
                <select 
                  value={levelFilter} 
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="h-10 appearance-none rounded-md border border-gray-700/50 bg-gray-800/70 text-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50 pr-8"
                >
                  <option value="all">Todos los niveles</option>
                  <option value="error">Solo errores</option>
                  <option value="warn">Solo advertencias</option>
                  <option value="info">Solo información</option>
                  <option value="debug">Solo debug</option>
                </select>
                <Filter className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={autoScroll} 
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-800"
                />
                Auto-scroll
              </label>
              <div className="flex items-center gap-2">
                <span>Líneas:</span>
                <select 
                  value={lineCount} 
                  onChange={(e) => setLogLines(Number(e.target.value))} 
                  className="h-8 appearance-none rounded border border-gray-700/50 bg-gray-800/70 text-gray-200 px-2 text-xs"
                >
                  <option value={100}>100</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                  <option value={2000}>2000</option>
                </select>
              </div>
            </div>
          </div>

          {/* Real-time Controls */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={toggleRealTime}
              variant={isRealTime ? "default" : "outline"}
              className={`gap-2 font-minecraft ${
                isRealTime 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-700/50 border-gray-600/50 hover:bg-gray-600/50 text-gray-300'
              }`}
            >
              {isRealTime ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isRealTime ? 'Pausar' : 'Reanudar'}
            </Button>
            <Button 
              type="button" 
              size="sm" 
              onClick={handleRefreshLogs} 
              disabled={loading} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-minecraft"
            >
              {loading ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Error Alert Section */}
      {(error || resourcesError) && (
        <CardContent className="pb-2">
          <div className="bg-red-900/40 border border-red-700/50 rounded-md p-3 mb-4">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-red-200">
                  {error ? "Error en los logs" : "Error en los recursos"}
                </p>
                <p className="text-xs text-red-300 mt-1">
                  {error ? error.message : resourcesError}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      )}

      {/* Status Indicator */}
      {hasErrors && !error && (
        <CardContent className="pb-2">
          <div className="bg-yellow-900/40 border border-yellow-700/50 rounded-md p-3 mb-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-yellow-200">Errores detectados en los logs</p>
                <p className="text-xs text-yellow-300 mt-1">
                  Se encontraron errores o excepciones en los logs del servidor
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      )}

      {/* Last Update Info */}
      {lastUpdate && !error && (
        <CardContent className="pb-2">
          <div className="bg-green-900/20 border border-green-700/30 rounded-md p-2 mb-4">
            <div className="flex items-center text-xs text-green-300">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Última actualización: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        </CardContent>
      )}

      {/* Server Resources Section */}
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={`bg-gray-800/70 rounded-md p-3 border flex items-center ${
            resourcesError ? 'border-red-700/50' : 'border-gray-700/50'
          }`}>
            <div className={`p-2 rounded-md mr-3 ${
              resourcesError ? 'bg-red-500/20' : 'bg-blue-500/20'
            }`}>
              <Cpu className={`h-5 w-5 ${
                resourcesError ? 'text-red-400' : 'text-blue-400'
              }`} />
            </div>
            <div>
              <p className="text-xs text-gray-400">CPU</p>
              <p className="text-sm font-medium text-white">
                {loadingResources ? (
                  <RefreshCcw className="h-3 w-3 animate-spin inline mr-1" />
                ) : resourcesError ? (
                  <span className="text-red-400">Error</span>
                ) : resources?.status !== "running" && resources?.cpuUsage === "N/A" ? (
                  "Servidor inactivo"
                ) : (
                  resources?.cpuUsage || "N/A"
                )}
              </p>
            </div>
          </div>

          <div className={`bg-gray-800/70 rounded-md p-3 border flex items-center ${
            resourcesError ? 'border-red-700/50' : 'border-gray-700/50'
          }`}>
            <div className={`p-2 rounded-md mr-3 ${
              resourcesError ? 'bg-red-500/20' : 'bg-purple-500/20'
            }`}>
              <Server className={`h-5 w-5 ${
                resourcesError ? 'text-red-400' : 'text-purple-400'
              }`} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Memoria</p>
              <p className="text-sm font-medium text-white">
                {loadingResources ? (
                  <RefreshCcw className="h-3 w-3 animate-spin inline mr-1" />
                ) : resourcesError ? (
                  <span className="text-red-400">Error</span>
                ) : resources?.status !== "running" && resources?.memoryUsage === "N/A" ? (
                  "Servidor inactivo"
                ) : (
                  `${resources?.memoryUsage || "N/A"} / ${resources?.memoryLimit || "N/A"}`
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Enhanced Logs Display */}
      <CardContent className="pt-0">
        <div className="relative border border-gray-700/50 rounded-md shadow-inner">
          <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-minecraft rounded-bl-md flex items-center border-l border-b border-gray-700/50 ${
            error ? 'bg-red-800/80 text-red-400' : 
            hasErrors ? 'bg-yellow-800/80 text-yellow-400' : 
            'bg-gray-800/80 text-emerald-400'
          }`}>
            <Terminal className="h-3 w-3 mr-1" /> 
            {error ? 'Error' : hasErrors ? 'Con errores' : 'Consola'}
          </div>
          <pre ref={logsContainerRef} className={`logs-container p-4 pt-6 rounded-md overflow-auto text-xs font-mono border-gray-700/50 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 ${
            isFullscreen ? 'h-[calc(100vh-20rem)]' : 'h-[600px]'
          } ${
            error ? 'bg-red-950/40 text-red-300' : 
            hasErrors ? 'bg-yellow-950/20 text-emerald-400' : 
            'bg-gray-950/80 text-emerald-400'
          }`}>
            {filteredLogEntries.length > 0 ? (
              <div className="minecraft-log">
                {filteredLogEntries.map((entry) => (
                  <div 
                    key={entry.id} 
                    className={`log-entry mb-1 p-1 rounded ${
                      entry.level === 'error' ? 'bg-red-900/20 border-l-2 border-red-500' :
                      entry.level === 'warn' ? 'bg-yellow-900/20 border-l-2 border-yellow-500' :
                      entry.level === 'debug' ? 'bg-gray-800/20' :
                      ''
                    }`}
                  >
                    <span className={`level-indicator mr-2 px-1 rounded text-xs ${
                      entry.level === 'error' ? 'bg-red-600 text-white' :
                      entry.level === 'warn' ? 'bg-yellow-600 text-white' :
                      entry.level === 'info' ? 'bg-blue-600 text-white' :
                      entry.level === 'debug' ? 'bg-gray-600 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {entry.level.toUpperCase()}
                    </span>
                    {entry.content}
                  </div>
                ))}
              </div>
            ) : logs ? (
              <div className="minecraft-log">{logs}</div>
            ) : loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCcw className="h-5 w-5 animate-spin text-gray-400" />
                  <span className="text-gray-400 font-minecraft text-sm">Cargando logs...</span>
                  <Image src="/images/loading-cube.webp" alt="Loading" width={32} height={32} className="animate-pulse" />
                </div>
              </div>
            ) : error ? (
              <div className="flex h-full flex-col items-center justify-center text-red-400 gap-4">
                <XCircle className="h-16 w-16 opacity-70" />
                <div className="text-center">
                  <span className="font-minecraft text-sm block mb-2">Error al cargar logs</span>
                  <span className="text-xs text-red-300">{error.message}</span>
                </div>
                <Button 
                  onClick={handleRefreshLogs} 
                  variant="outline" 
                  className="gap-2 bg-red-600/20 border-red-600/30 hover:bg-red-600/30 text-red-400 font-minecraft"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Reintentar
                </Button>
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
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${
                error ? 'bg-red-500' : 
                hasErrors ? 'bg-yellow-500 animate-pulse' : 
                isRealTime ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
              }`}></div>
              <span className="text-xs text-gray-400 font-minecraft">
                {error ? 'Desconectado' : 
                 hasErrors ? 'Con errores' : 
                 isRealTime ? 'Tiempo real activo' : 'Tiempo real pausado'}
              </span>
            </div>
            {lastUpdate && !error && (
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>{lastUpdate.toLocaleTimeString()}</span>
              </div>
            )}
            <div className="text-xs text-gray-500">
              Mostrando {filteredLogEntries.length} de {logEntries.length} entradas
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              type="button" 
              onClick={fetchServerResources} 
              disabled={loadingResources} 
              variant="outline" 
              className={`gap-2 font-minecraft ${
                resourcesError 
                  ? 'bg-red-600/20 border-red-600/30 hover:bg-red-600/30 text-red-400'
                  : 'bg-blue-600/20 border-blue-600/30 hover:bg-blue-600/30 text-blue-400'
              }`}
            >
              {loadingResources ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              Recursos
            </Button>
          </div>
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
          background: rgba(255, 85, 85, 0.1);
          padding: 2px 4px;
          border-radius: 2px;
          font-weight: 600;
        }

        .minecraft-log .warn,
        .minecraft-log .warning,
        .minecraft-log [level="WARN"],
        .minecraft-log [level="WARNING"] {
          color: #ffaa00;
          background: rgba(255, 170, 0, 0.1);
          padding: 2px 4px;
          border-radius: 2px;
          font-weight: 500;
        }

        .minecraft-log .info,
        .minecraft-log [level="INFO"] {
          color: #55ffff;
        }

        .minecraft-log .debug,
        .minecraft-log [level="DEBUG"] {
          color: #aaaaaa;
        }

        /* Highlight error patterns */
        .minecraft-log:contains("Exception"),
        .minecraft-log:contains("java.lang."),
        .minecraft-log:contains("Caused by:"),
        .minecraft-log:contains("[STDERR]"),
        .minecraft-log:contains("Failed to"),
        .minecraft-log:contains("Cannot"),
        .minecraft-log:contains("Unable to") {
          background: rgba(255, 85, 85, 0.05);
          border-left: 3px solid #ff5555;
          padding-left: 8px;
          margin: 2px 0;
        }

        /* Fatal errors */
        .minecraft-log:contains("FATAL") {
          color: #ff1744;
          background: rgba(255, 23, 68, 0.15);
          padding: 4px 6px;
          border-radius: 4px;
          border: 1px solid rgba(255, 23, 68, 0.3);
          font-weight: 700;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* Success patterns */
        .minecraft-log:contains("Server started"),
        .minecraft-log:contains("Done ("),
        .minecraft-log:contains("successfully") {
          color: #4caf50;
          background: rgba(76, 175, 80, 0.1);
          padding: 2px 4px;
          border-radius: 2px;
          font-weight: 500;
        }

        /* Log entry styling */
        .log-entry {
          transition: background-color 0.2s ease;
        }

        .log-entry:hover {
          background-color: rgba(255, 255, 255, 0.02);
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
