"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/services/auth/auth.service";

export function Header() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Obtener nombre de usuario
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="bg-background border-b">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <span className="text-xl">MinecraftManager</span>
        </Link>
        <div className="flex items-center gap-4">
          {username && (
            <span className="text-sm text-muted-foreground hidden md:inline">
              Hola, {username}
            </span>
          )}
          <Button variant="outline" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
}
