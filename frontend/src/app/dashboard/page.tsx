/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2, Plus, RefreshCw } from "lucide-react";
import { isAuthenticated } from "@/services/auth/auth.service";
import { fetchServerList, createServer, getAllServersStatus } from "@/services/docker/fetchs";
import { toast } from "sonner";
import { Header } from "@/components/molecules/Header";
import { Footer } from "@/components/molecules/Footer";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Esquema de validación para el formulario de creación de servidor
const createServerSchema = z.object({
  id: z
    .string()
    .min(3, { message: "El ID debe tener al menos 3 caracteres" })
    .max(20, { message: "El ID debe tener máximo 20 caracteres" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "El ID solo puede contener letras, números, guiones y guiones bajos",
    }),
});

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
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingServer, setIsCreatingServer] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Configurar el formulario
  const form = useForm<z.infer<typeof createServerSchema>>({
    resolver: zodResolver(createServerSchema),
    defaultValues: {
      id: "",
    },
  });

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }

    // Cargar lista de servidores desde el backend
    fetchServersFromBackend();

    // Actualizar cada 30 segundos
    const interval = setInterval(loadServerInfo, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const fetchServersFromBackend = async () => {
    setIsLoading(true);
    try {
      // Obtener la lista de servidores desde el backend
      const serverList = await fetchServerList();

      // Convertir los datos al formato que espera nuestro componente
      const formattedServers: ServerInfo[] = serverList.map((server) => ({
        id: server.id,
        name: server.serverName || `Servidor ${server.id}`,
        description: server.motd || "Servidor de Minecraft",
        displayName: server.serverName || `minecraft-${server.id}`,
        status: "loading",
        port: server.port || "25565",
        containerName: `${server.id}_mc_1`,
      }));

      // Actualizar el estado con los servidores formateados
      setServers(formattedServers);

      // Luego procesar cada servidor individualmente para obtener su estado
      const updatedServers = await processServerStatuses(formattedServers);
      setServers(updatedServers);
    } catch (error) {
      console.error("Error fetching server list:", error);
      toast.error("Error al cargar la lista de servidores");
    } finally {
      setIsLoading(false);
    }
  };

  // Nueva función para procesar los estados de los servidores
  const processServerStatuses = async (serversList: ServerInfo[]): Promise<ServerInfo[]> => {
    if (serversList.length === 0) return [];

    try {
      // Obtener todos los estados de servidores en una sola llamada
      const allStatusData: { [key: string]: "running" | "stopped" | "starting" | "not_found" } = await getAllServersStatus();

      // Actualizar los estados en la lista existente
      const updatedServers = serversList.map((server) => {
        return {
          ...server,
          status: allStatusData[server.id] || "not_found",
        };
      });

      // Devolver la lista actualizada
      return updatedServers;
    } catch (error) {
      console.error("Error processing server statuses:", error);
      toast.error("Error al procesar los estados de los servidores");
      return serversList.map((server) => ({ ...server, status: "not_found" }));
    }
  };

  // Y modificar loadServerInfo para usar la nueva función
  const loadServerInfo = async () => {
    if (servers.length === 0) return;

    setIsLoading(true);
    try {
      const updatedServers = await processServerStatuses(servers);
      setServers(updatedServers);
    } catch (error) {
      console.error("Error loading server information:", error);
      toast.error("Error al cargar información de los servidores");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateServer = async (values: z.infer<typeof createServerSchema>) => {
    setIsCreatingServer(true);
    try {
      const response = await createServer({ id: values.id });

      if (response.success) {
        // ✅ Verificación correcta de success
        toast.success(`Servidor "${values.id}" creado correctamente`);
        setIsDialogOpen(false);
        form.reset();

        // Pequeño retraso para dar tiempo al backend para procesar
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Recargar la lista de servidores
        await fetchServersFromBackend();
      } else {
        toast.error(`Error al crear servidor: ${response.message}`);
      }
    } catch (error: any) {
      console.error("Error creating server:", error);
      toast.error(error.response?.data?.message || "Error al crear el servidor");
    } finally {
      setIsCreatingServer(false);
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
    <div className="flex min-h-screen flex-col bg-[url('/images/minecraft-bg-blur.png')] bg-cover bg-fixed bg-center relative">
      <div className="absolute inset-0 bg-black/50"></div>
      <Header />

      <main className="flex-1 py-12 px-4 relative z-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-between bg-gray-900/80 backdrop-blur-md p-6 rounded-lg border border-gray-700/60">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white font-minecraft">Panel de Control</h1>
              <p className="text-gray-300 mt-2">Selecciona un servidor para configurar</p>
            </div>
            <div className="flex gap-3">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 border-blue-600/50 text-blue-500 hover:bg-blue-600/20 hover:text-blue-400">
                    <Plus className="h-4 w-4" />
                    Crear Servidor
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle className="font-minecraft">Crear Nuevo Servidor</DialogTitle>
                    <DialogDescription className="text-gray-400">Ingresa el nombre para tu nuevo servidor de Minecraft.</DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreateServer)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">ID del Servidor</FormLabel>
                            <FormControl>
                              <Input placeholder="mi-servidor" {...field} className="bg-gray-800 border-gray-700 text-white" />
                            </FormControl>
                            <FormDescription className="text-gray-400">Identificador único para el servidor (solo letras, números, guiones y guiones bajos)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter className="gap-3 sm:gap-0">
                        <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)} className="bg-gray-700 hover:bg-gray-600">
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={isCreatingServer} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                          {isCreatingServer ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Creando...
                            </>
                          ) : (
                            "Crear Servidor"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

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
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            {servers.length === 0 && !isLoading ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-2 text-center py-12">
                <Image src="/images/chest.webp" alt="Empty chest" width={64} height={64} className="mx-auto mb-4" />
                <h3 className="text-xl font-minecraft text-gray-300 mb-2">No hay servidores disponibles</h3>
                <p className="text-gray-400 mb-6">Crea tu primer servidor para comenzar</p>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-minecraft">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Servidor
                </Button>
              </motion.div>
            ) : (
              servers.map((server, index) => (
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
                      {server.status === "not_found" ? (
                        <Button className="w-full gap-1 bg-emerald-600 hover:bg-emerald-700 font-minecraft text-white" disabled>
                          Configurar
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Link href={`/dashboard/${server.id}`} className="w-full">
                          <Button className="w-full gap-1 bg-emerald-600 hover:bg-emerald-700 font-minecraft text-white">
                            Configurar
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            )}
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
