import { ServerConfig } from "@/lib/types/types";
import api from "../axios.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://minecraft.ketbome.lat:8091";

export const fetchServerConfig = async (
  serverId: string
): Promise<ServerConfig> => {
  const response = await api.get(`${API_URL}/servers/${serverId}`);
  return response.data;
};

export const updateServerConfig = async (
  serverId: string,
  config: Partial<ServerConfig>
): Promise<ServerConfig> => {
  const response = await api.put(`${API_URL}/servers/${serverId}`, config);
  return response.data;
};

export const restartServer = async (
  serverId: string
): Promise<{ success: boolean; message: string }> => {
  // Corrige esto, estabas pasando withCredentials como cuerpo de la solicitud
  const response = await api.post(`${API_URL}/servers/${serverId}/restart`, {});
  return response.data;
};

export const clearServerData = async (
  serverId: string
): Promise<{ success: boolean; message: string }> => {
  // Corrige esto, estabas pasando withCredentials como cuerpo de la solicitud
  const response = await api.post(`${API_URL}/servers/${serverId}/clear-data`, {});
  return response.data;
};

export const getServerStatus = async (
  serverId: string
): Promise<{ status: "running" | "stopped" | "not_found" }> => {
  const response = await api.get(`${API_URL}/servers/${serverId}/status`);
  return response.data;
};

export const getServerLogs = async (
  serverId: string
): Promise<{ logs: string }> => {
  const response = await api.get(`${API_URL}/servers/${serverId}/logs`);
  return response.data;
}