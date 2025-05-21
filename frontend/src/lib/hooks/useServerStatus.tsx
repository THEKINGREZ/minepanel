import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getServerStatus as apiGetServerStatus,
  startServer as apiStartServer,
  stopServer as apiStopServer,
} from "@/services/docker/fetchs";

export function useServerStatus(serverId: string) {
  const [status, setStatus] = useState<string>("unknown");
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await apiGetServerStatus(serverId);
      setStatus(data.status);
      return data.status;
    } catch (error) {
      console.error("Error fetching server status:", error);
      return "error";
    }
  }, [serverId]);

  // Initial status load
  useEffect(() => {
    fetchStatus();

    // Optional: Polling for status updates
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const startServer = async () => {
    setIsProcessingAction(true);
    try {
      const result = await apiStartServer(serverId);
      if (result.success) {
        toast.success("Servidor iniciado correctamente");
        // Wait a moment and update status
        setTimeout(fetchStatus, 3000);
        return true;
      } else {
        throw new Error(result.message || "Error al iniciar el servidor");
      }
    } catch (error) {
      console.error("Error starting server:", error);
      toast.error("Error al iniciar el servidor");
      return false;
    } finally {
      setIsProcessingAction(false);
    }
  };

  const stopServer = async () => {
    setIsProcessingAction(true);
    try {
      const result = await apiStopServer(serverId);
      if (result.success) {
        toast.success("Servidor detenido correctamente");
        // Update status
        fetchStatus();
        return true;
      } else {
        throw new Error(result.message || "Error al detener el servidor");
      }
    } catch (error) {
      console.error("Error stopping server:", error);
      toast.error("Error al detener el servidor");
      return false;
    } finally {
      setIsProcessingAction(false);
    }
  };

  return {
    status,
    isProcessingAction,
    fetchStatus,
    startServer,
    stopServer,
  };
}
