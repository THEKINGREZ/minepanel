"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Settings, User, Bell, Search, ChevronDown } from "lucide-react";
import { logout } from "@/services/auth/auth.service";
import { motion, AnimatePresence } from "framer-motion";

export function DashboardHeader() {
  const router = useRouter();
  const [notifications] = useState(3);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="sticky top-0 z-40 w-full border-b border-gray-700/60 bg-gray-900/95 backdrop-blur-md shadow-lg">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search Bar */}
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Buscar servidores..." className="w-full pl-10 pr-4 py-2 bg-gray-800/60 border border-gray-700/60 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300 font-minecraft">Sistema Activo</span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-2 hover:bg-gray-800/60">
            <Bell className="h-5 w-5 text-gray-400" />
            {notifications > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {notifications}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <Button variant="ghost" className="flex items-center gap-3 hover:bg-gray-800/60 p-2" onClick={() => setShowUserMenu(!showUserMenu)}>
              <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center overflow-hidden">
                <Image src="/images/player-head.png" alt="User" width={32} height={32} className="rounded-full object-cover" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white font-minecraft">Admin</p>
                <p className="text-xs text-gray-400">Administrador</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
            </Button>

            {/* User Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl z-50">
                  <div className="flex items-center gap-3 p-4 border-b border-gray-700">
                    <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center overflow-hidden">
                      <Image src="/images/player-head.png" alt="User" width={40} height={40} className="rounded-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium font-minecraft text-white">Admin</p>
                      <p className="text-sm text-gray-400">admin@minecraft.local</p>
                    </div>
                  </div>

                  <div className="py-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-gray-800/60 transition-colors">
                      <User className="h-4 w-4" />
                      Perfil
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-gray-800/60 transition-colors">
                      <Settings className="h-4 w-4" />
                      Configuración
                    </button>
                    <hr className="my-2 border-gray-700" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-600/20 transition-colors">
                      <LogOut className="h-4 w-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Minecraft decoration */}
          <div className="hidden lg:flex items-center gap-2">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
              <Image src="/images/diamond.webp" alt="Diamond" width={24} height={24} className="opacity-70" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
