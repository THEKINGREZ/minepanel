"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { isAuthenticated } from "@/services/auth/auth.service";
import { Header } from "@/components/molecules/Header";
import { Footer } from "@/components/molecules/Footer";
import { useServerStatus } from "@/lib/hooks/useServerStatus";
import { useServerConfig } from "@/lib/hooks/useServerConfig";
import { ServerPageHeader } from "@/components/organisms/ServerPageHeader";
import { ServerConfigTabs } from "@/components/organisms/ServerConfigTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function ServerConfig() {
  const router = useRouter();
  const params = useParams();
  const serverId = params.server as string;

  const { config, loading: configLoading, updateConfig, saveConfig, restartServer, clearServerData } = useServerConfig(serverId);

  const { status, isProcessingAction, startServer, stopServer } = useServerStatus(serverId);

  // Auth check
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
    }
  }, [router]);

  if (configLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-12 px-4">
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header skeleton */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>

            {/* Tabs skeleton */}
            <div className="space-y-4">
              <div className="flex gap-1 border-b">
                {[...Array(7)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-24 rounded-t-md" />
                ))}
              </div>
              <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-md space-y-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <div className="text-center">
                  <h3 className="text-lg font-medium">Cargando configuración del servidor</h3>
                  <p className="text-sm text-muted-foreground">Esto puede tomar unos segundos...</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="space-y-8 max-w-4xl mx-auto">
          <ServerPageHeader serverId={serverId} serverName={config.serverName} serverStatus={status} isProcessing={isProcessingAction} onStartServer={startServer} onStopServer={stopServer} onRestartServer={restartServer} />

          <ServerConfigTabs serverId={serverId} config={config} updateConfig={updateConfig} saveConfig={saveConfig} serverStatus={status} onClearData={clearServerData} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
