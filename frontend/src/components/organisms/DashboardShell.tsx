"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/services/auth/auth.service";
import { Sidebar } from "@/components/organisms/Sidebar";
import { DashboardHeader } from "@/components/organisms/DashboardHeader";
import { motion } from "framer-motion";

interface DashboardShellProps {
  readonly children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    // Marcar como hidratado para evitar mismatches
    setIsHydrated(true);

    // Verificar autenticación solo después de la hidratación
    const checkAuth = () => {
      try {
        if (!isAuthenticated()) {
          router.push("/");
        } else {
          setIsAuthChecked(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.push("/");
      }
    };

    // Pequeño delay para asegurar que la hidratación esté completa
    const timeoutId = setTimeout(checkAuth, 100);

    return () => clearTimeout(timeoutId);
  }, [router]);

  // Mostrar loading durante la hidratación y verificación de autenticación
  // Mostrar loading durante la hidratación y verificación de autenticación
  if (!isHydrated || !isAuthChecked) {
    return (
      <div className="flex min-h-screen bg-gray-900 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">{!isHydrated ? "Inicializando..." : "Verificando autenticación..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[url('/images/minecraft-bg-blur.png')] bg-cover bg-fixed bg-center relative">
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      {/* Contenido principal */}
      <div className={`flex-1 flex flex-col relative z-10 transition-all duration-300 ${isSidebarCollapsed ? "ml-16" : "ml-64"}`}>
        {/* Header */}
        <DashboardHeader />

        {/* Área de contenido */}
        <main className="flex-1 p-6 overflow-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto">
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
