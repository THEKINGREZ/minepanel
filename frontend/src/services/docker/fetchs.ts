import axios from "axios";

import { ServerConfig } from "@/lib/types/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";

export const fetchServerConfig = async (
  serverId: string
): Promise<ServerConfig> => {
  const response = await axios.get(`${API_URL}/servers/${serverId}`);
  return response.data;
};

export const updateServerConfig = async (
  serverId: string,
  config: Partial<ServerConfig>
): Promise<ServerConfig> => {
  const response = await axios.put(`${API_URL}/servers/${serverId}`, config);
  return response.data;
};

export const restartServer = async (
  serverId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post(`${API_URL}/servers/${serverId}/restart`);
  return response.data;
};

export const clearServerData = async (
  serverId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post(
    `${API_URL}/servers/${serverId}/clear-data`
  );
  return response.data;
};

export const getServerStatus = async (
  serverId: string
): Promise<{ status: "running" | "stopped" | "not_found" }> => {
  const response = await axios.get(`${API_URL}/servers/${serverId}/status`);
  return response.data;
};
