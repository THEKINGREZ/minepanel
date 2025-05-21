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
import { motion } from "framer-motion";
import Image from "next/image";

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
      <div className="flex min-h-screen flex-col bg-[url('/images/minecraft-bg-blur.png')] bg-cover bg-fixed bg-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        <Header />

        <main className="flex-1 py-12 px-4 relative z-10">
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header skeleton */}
            <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-lg border border-gray-700/60 space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-md bg-gray-700/50" />
                <Skeleton className="h-8 w-48 bg-gray-700/50" />
                <Skeleton className="h-6 w-16 rounded-full ml-auto bg-gray-700/50" />
              </div>
              <Skeleton className="h-20 w-full rounded-lg bg-gray-700/50" />
            </div>

            {/* Tabs skeleton */}
            <div className="bg-gray-900/80 backdrop-blur-md rounded-lg border border-gray-700/60 overflow-hidden">
              <div className="flex gap-1 border-b border-gray-700/60 px-4 pt-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-24 rounded-t-md bg-gray-700/50" />
                ))}
              </div>

              <motion.div className="flex flex-col items-center justify-center py-20 px-4 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="relative h-16 w-16">
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                    }}
                  >
                    <Image src="/images/loading-cube.webp" alt="Loading" width={64} height={64} className="object-contain" />
                  </motion.div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-100 font-minecraft">Cargando configuración del servidor</h3>
                  <p className="text-sm text-gray-400 mt-2">Preparando los bloques... Esto puede tomar unos segundos</p>
                </div>

                <div className="w-64 h-2 bg-gray-800 rounded-full mt-4 overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[url('/images/minecraft-bg-blur.png')] bg-cover bg-fixed bg-center">
      <Header />

      <main className="flex-1 py-12 px-4 relative z-10">
        <div className="space-y-8 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <ServerPageHeader serverId={serverId} serverName={config.serverName} serverStatus={status} isProcessing={isProcessingAction} onStartServer={startServer} onStopServer={stopServer} onRestartServer={restartServer} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <ServerConfigTabs serverId={serverId} config={config} updateConfig={updateConfig} saveConfig={saveConfig} serverStatus={status} onClearData={clearServerData} />
          </motion.div>

          {/* Elementos decorativos */}
          <div className="flex justify-center space-x-16 mt-12 opacity-60">
            <motion.div initial={{ y: 0 }} animate={{ y: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
              <Image src="/images/ender-pearl.webp" alt="Ender Pearl" width={32} height={32} className="hover:opacity-100 transition-opacity" />
            </motion.div>
            <motion.div initial={{ y: 0 }} animate={{ y: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 4, delay: 1, ease: "easeInOut" }}>
              <Image src="/images/enchanted-book.webp" alt="Enchanted Book" width={32} height={32} className="hover:opacity-100 transition-opacity" />
            </motion.div>
            <motion.div initial={{ y: 0 }} animate={{ y: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 4, delay: 2, ease: "easeInOut" }}>
              <Image src="/images/iron-pick.webp" alt="Iron Pickaxe" width={32} height={32} className="hover:opacity-100 transition-opacity" />
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
