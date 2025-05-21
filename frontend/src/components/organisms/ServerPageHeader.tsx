import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, PowerIcon, RefreshCw, Server } from "lucide-react";

interface ServerPageHeaderProps {
  readonly serverId: string;
  readonly serverName: string;
  readonly serverStatus: string;
  readonly isProcessing: boolean;
  readonly onStartServer: () => Promise<boolean>;
  readonly onStopServer: () => Promise<boolean>;
  readonly onRestartServer: () => Promise<boolean>;
}

export function ServerPageHeader({
  serverId,
  serverName,
  serverStatus,
  isProcessing,
  onStartServer,
  onStopServer,
  onRestartServer,
}: ServerPageHeaderProps) {
  const containerName = serverId === "daily" ? "daily_mc_1" : "weekend_mc_1";
  const serverDisplayName =
    serverId === "daily" ? "Servidor Diario" : "Servidor Fin de Semana";

  return (
    <>
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="outline" size="icon" type="button">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          {serverDisplayName}
        </h1>
        <Badge
          variant={serverStatus === "running" ? "outline" : "secondary"}
          className={
            serverStatus === "running"
              ? "bg-green-50 text-green-700 border-green-200"
              : serverStatus === "starting"
              ? "bg-orange-50 text-orange-700 border-orange-200"
              : "bg-red-50 text-red-700 border-red-200"
          }
        >
          {serverStatus === "running"
            ? "Activo"
            : serverStatus === "stopped"
            ? "Detenido"
            : serverStatus === "starting"
            ? "Iniciando..."
            : serverStatus === "not_found"
            ? "No encontrado"
            : "Desconocido"}
        </Badge>
      </div>

      <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/40">
        <Server className="h-10 w-10 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">{containerName}</p>
          <p className="text-xs text-muted-foreground">Docker Container</p>
        </div>
        <div className="ml-auto flex gap-2">
          {serverStatus === "running" ? (
            <Button
              type="button"
              variant="destructive"
              onClick={onStopServer}
              disabled={isProcessing}
              className="gap-2"
            >
              <PowerIcon className="h-4 w-4" />
              {isProcessing ? "Procesando..." : "Detener Servidor"}
            </Button>
          ) : serverStatus === "stopped" ? (
            <Button
              type="button"
              variant="default"
              onClick={onStartServer}
              disabled={isProcessing}
              className="gap-2"
            >
              <PowerIcon className="h-4 w-4" />
              {isProcessing ? "Procesando..." : "Iniciar Servidor"}
            </Button>
          ) : null}

          <Button
            type="button"
            variant="outline"
            onClick={onRestartServer}
            disabled={isProcessing || serverStatus !== "running"}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isProcessing ? "animate-spin" : ""}`}
            />
            {isProcessing ? "Reiniciando..." : "Reiniciar Servidor"}
          </Button>
        </div>
      </div>
    </>
  );
}
