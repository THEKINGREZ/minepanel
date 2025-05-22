import { ServerConfig } from "@/lib/types/types";
import api from "../axios.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://minecraft.ketbome.lat:8091";

export const fetchServerConfig = async (serverId: string): Promise<ServerConfig> => {
  const response = await api.get(`${API_URL}/servers/${serverId}`);
  return response.data;
};

export const fetchServerList = async (): Promise<ServerConfig[]> => {
  const response = await api.get(`${API_URL}/servers`);
  return response.data;
};

export const createServer = async (data: { id: string }): Promise<{ success: boolean; message: string; server: ServerConfig }> => {
  const response = await api.post(`${API_URL}/servers`, data);
  return response.data;
};

export const updateServerConfig = async (serverId: string, config: Partial<ServerConfig>): Promise<ServerConfig> => {
  const response = await api.put(`${API_URL}/servers/${serverId}`, config);
  return response.data;
};

export const apiRestartServer = async (serverId: string): Promise<{ success: boolean; message: string }> => {
  // Corrige esto, estabas pasando withCredentials como cuerpo de la solicitud
  const response = await api.post(`${API_URL}/servers/${serverId}/restart`, {});
  return response.data;
};

export const apiClearServerData = async (serverId: string): Promise<{ success: boolean; message: string }> => {
  // Corrige esto, estabas pasando withCredentials como cuerpo de la solicitud
  const response = await api.post(`${API_URL}/servers/${serverId}/clear-data`, {});
  return response.data;
};

export const getServerStatus = async (serverId: string): Promise<{ status: "running" | "stopped" | "not_found" }> => {
  const response = await api.get(`${API_URL}/servers/${serverId}/status`);
  return response.data;
};

export const getAllServersStatus = async (): Promise<{ [serverId: string]: 'running' | 'stopped' | 'starting' | 'not_found' }> => {
  const response = await api.get(`${API_URL}/servers/all-status`);
  return response.data;
};

export const getServerLogs = async (serverId: string, limit: number = 100): Promise<{ logs: string }> => {
  const response = await api.get(`${API_URL}/servers/${serverId}/logs`, {
    params: { lines: limit },
  });
  return response.data;
};

export const executeServerCommand = async (serverId: string, command: string): Promise<{ success: boolean; output: string }> => {
  const response = await api.post(`/servers/${serverId}/command`, { command });
  return response.data;
};

export const startServer = async (
  serverId: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await api.post(`/servers/${serverId}/start`);
    return response.data;
  } catch (error) {
    console.error(`Error starting server ${serverId}:`, error);
    return {
      success: false,
      message: "Error al iniciar el servidor",
    };
  }
};

export const stopServer = async (
  serverId: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await api.post(`/servers/${serverId}/stop`);
    return response.data;
  } catch (error) {
    console.error(`Error stopping server ${serverId}:`, error);
    return {
      success: false,
      message: "Error al detener el servidor",
    };
  }
};
