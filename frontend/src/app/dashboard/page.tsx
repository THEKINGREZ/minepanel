"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { isAuthenticated } from "@/services/auth/auth.service";
import { getServerStatus, fetchServerConfig } from "@/services/docker/fetchs";
import { toast } from "sonner";
import { Header } from "@/components/molecules/Header";
import { Footer } from "@/components/molecules/Footer";
import { motion } from "framer-motion";

// Actualizar el tipo para incluir el nuevo estado "starting"
type ServerInfo = {
  id: string;
  name: string;
  description: string;
  displayName: string;
  status: "running" | "stopped" | "starting" | "not_found" | "loading";
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

    // Actualizar cada 30 segundos
    const interval = setInterval(loadServerInfo, 30000);
    return () => clearInterval(interval);
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
                displayName: config.serverName || updatedServers[index].displayName,
                port: config.port || updatedServers[index].port,
                status: statusData.status,
              };
            } catch (configError) {
              console.error(`Error fetching config for ${server.id}:`, configError);
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
        return "bg-green-600/20 text-green-500 border-green-600/30";
      case "starting":
        return "bg-orange-600/20 text-orange-500 border-orange-600/30";
      case "stopped":
        return "bg-yellow-600/20 text-yellow-500 border-yellow-600/30";
      case "not_found":
        return "bg-red-600/20 text-red-500 border-red-600/30";
      case "loading":
        return "bg-blue-600/20 text-blue-500 border-blue-600/30";
      default:
        return "bg-gray-600/20 text-gray-500 border-gray-600/30";
    }
  };

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case "running":
        return "Activo";
      case "starting":
        return "Iniciando...";
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

  // Función para obtener el ícono basado en el estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return "/images/emerald.webp";
      case "starting":
        return "/images/gold.webp";
      case "stopped":
        return "/images/redstone.webp";
      case "not_found":
        return "/images/barrier.webp";
      case "loading":
        return "/images/lapis.webp";
      default:
        return "/images/barrier.webp";
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[url('/images/minecraft-bg-blur.png')] bg-cover bg-fixed bg-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <Header />

      <main className="flex-1 py-12 px-4 relative z-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-between bg-gray-900/80 backdrop-blur-md p-6 rounded-lg border border-gray-700/60">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white font-minecraft">Panel de Control</h1>
              <p className="text-gray-300 mt-2">Selecciona un servidor para configurar</p>
            </div>
            <Button onClick={loadServerInfo} variant="outline" disabled={isLoading} className="flex items-center gap-2 border-emerald-600/50 text-emerald-500 hover:bg-emerald-600/20 hover:text-emerald-400">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Actualizar
                </>
              )}
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            {servers.map((server, index) => (
              <motion.div key={server.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}>
                <Card className="border-2 border-gray-700/60 bg-gray-900/80 backdrop-blur-md shadow-xl overflow-hidden">
                  <div className={`h-1 ${server.status === "running" ? "bg-emerald-500" : server.status === "stopped" ? "bg-amber-500" : server.status === "starting" ? "bg-orange-500" : "bg-gray-500"}`}></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-100 font-minecraft">{server.name}</CardTitle>
                      <Badge variant="outline" className={`px-3 py-1 ${getStatusBadgeClass(server.status)}`}>
                        {server.status === "loading" || server.status === "starting" ? (
                          <span className="flex items-center gap-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            {getStatusText(server.status)}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-current"></div>
                            {getStatusText(server.status)}
                          </span>
                        )}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-300">{server.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 relative">
                        <Image src={getStatusIcon(server.status)} alt="Server Status" width={48} height={48} className="object-contain" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-100">{server.displayName}</p>
                        <p className="text-xs text-gray-400 mt-1">Puerto: {server.port}</p>
                        <p className="text-xs text-gray-400">ID: {server.containerName}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/dashboard/${server.id}`} className="w-full">
                      <Button className="w-full gap-1 bg-emerald-600 hover:bg-emerald-700 font-minecraft text-white">
                        Configurar
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Decoración adicional */}
          <div className="flex justify-center gap-6 mt-12">
            <motion.div initial={{ y: 0 }} animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
              <Image src="/images/anvil.webp" alt="Anvil" width={40} height={40} className="opacity-70 hover:opacity-100 transition-opacity" />
            </motion.div>
            <motion.div initial={{ y: 0 }} animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 3, delay: 0.5, ease: "easeInOut" }}>
              <Image src="/images/crafting-table.webp" alt="Crafting Table" width={40} height={40} className="opacity-70 hover:opacity-100 transition-opacity" />
            </motion.div>
            <motion.div initial={{ y: 0 }} animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 3, delay: 1, ease: "easeInOut" }}>
              <Image src="/images/command-block.webp" alt="Command Block" width={40} height={40} className="opacity-70 hover:opacity-100 transition-opacity" />
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
