import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getServerStatus as apiGetServerStatus,
  startServer as apiStartServer,
  stopServer as apiStopServer,
} from "@/services/docker/fetchs";
import { useLanguage } from "@/lib/hooks/useLanguage";

export function useServerStatus(serverId: string) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<string>("unknown");
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Helper function to translate error messages
  const translateMessage = (message: string): string => {
    // Try to translate if it's a translation key, otherwise return the original message
    const translated = t(message as any);
    return translated !== message ? translated : message;
  };

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
        toast.success(t('serverStarted'));
        // Wait a moment and update status
        setTimeout(fetchStatus, 3000);
        return true;
      } else {
        throw new Error(translateMessage(result.message || "SERVER_START_ERROR"));
      }
    } catch (error) {
      console.error("Error starting server:", error);
      const errorMessage = error instanceof Error ? translateMessage(error.message) : t('SERVER_START_ERROR');
      toast.error(errorMessage);
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
        toast.success(t('serverStopped'));
        // Update status
        fetchStatus();
        return true;
      } else {
        throw new Error(translateMessage(result.message || "SERVER_STOP_ERROR"));
      }
    } catch (error) {
      console.error("Error stopping server:", error);
      const errorMessage = error instanceof Error ? translateMessage(error.message) : t('SERVER_STOP_ERROR');
      toast.error(errorMessage);
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
