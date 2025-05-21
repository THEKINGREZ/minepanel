"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Server, Loader2 } from "lucide-react";
import { isAuthenticated } from "@/services/auth/auth.service";
import { getServerStatus, fetchServerConfig } from "@/services/docker/fetchs";
import { toast } from "sonner";
import { Header } from "@/components/molecules/Header";
import { Footer } from "@/components/molecules/Footer";

// Tipo para almacenar información de los servidores
type ServerInfo = {
  id: string;
  name: string;
  description: string;
  displayName: string;
  status: "running" | "stopped" | "not_found" | "loading";
  port: string;
  containerName: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [servers, setServers] = useState<ServerInfo[]>([
    {
      id: "daily",
      name: "Servidor Diario",
      description: "Servidor disponible todos los días",
      displayName: "minecraft-daily",
      status: "loading",
      port: "25565",
      containerName: "daily_mc_1",
    },
    {
      id: "weekend",
      name: "Servidor Fin de Semana",
      description: "Servidor temporal para fines de semana",
      displayName: "minecraft-weekend",
      status: "loading",
      port: "25566",
      containerName: "weekend_mc_1",
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }

    // Cargar información de los servidores
    loadServerInfo();
  }, [router]);

  const loadServerInfo = async () => {
    setIsLoading(true);
    try {
      // Clonar el array de servidores para actualizarlo
      const updatedServers = [...servers];

      // Obtener información de cada servidor de forma asíncrona
      const promises = servers.map(async (server, index) => {
        try {
          // Obtener el estado del servidor
          const statusData = await getServerStatus(server.id);

          // Obtener configuración del servidor si existe
          if (statusData.status !== "not_found") {
            try {
              const config = await fetchServerConfig(server.id);
              updatedServers[index] = {
                ...updatedServers[index],
                displayName:
                  config.serverName || updatedServers[index].displayName,
                port: config.port || updatedServers[index].port,
                status: statusData.status,
              };
            } catch (configError) {
              console.error(
                `Error fetching config for ${server.id}:`,
                configError
              );
              updatedServers[index] = {
                ...updatedServers[index],
                status: statusData.status,
              };
            }
          } else {
            updatedServers[index] = {
              ...updatedServers[index],
              status: statusData.status,
            };
          }
        } catch (statusError) {
          console.error(`Error fetching status for ${server.id}:`, statusError);
          updatedServers[index] = {
            ...updatedServers[index],
            status: "not_found",
          };
        }
      });

      // Esperar a que todas las consultas terminen
      await Promise.all(promises);

      // Actualizar el estado con la nueva información
      setServers(updatedServers);
    } catch (error) {
      console.error("Error loading server information:", error);
      toast.error("Error al cargar información de los servidores");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener la clase CSS del indicador de estado
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-50 text-green-700 border-green-200";
      case "stopped":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "not_found":
        return "bg-red-50 text-red-700 border-red-200";
      case "loading":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case "running":
        return "Activo";
      case "stopped":
        return "Detenido";
      case "not_found":
        return "No encontrado";
      case "loading":
        return "Cargando...";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Panel de Control
              </h1>
              <p className="text-muted-foreground mt-2">
                Selecciona un servidor para configurar
              </p>
            </div>
            <Button
              onClick={loadServerInfo}
              variant="outline"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <Server className="h-4 w-4" />
                  Actualizar
                </>
              )}
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {servers.map((server) => (
              <Card key={server.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>{server.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={getStatusBadgeClass(server.status)}
                    >
                      {server.status === "loading" ? (
                        <span className="flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          {getStatusText(server.status)}
                        </span>
                      ) : (
                        getStatusText(server.status)
                      )}
                    </Badge>
                  </div>
                  <CardDescription>{server.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center gap-3">
                    <Server className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {server.displayName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Puerto: {server.port}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/dashboard/${server.id}`} className="w-full">
                    <Button className="w-full gap-1">
                      Configurar
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
