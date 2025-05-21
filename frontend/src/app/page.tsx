"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isAuthenticated, login } from "@/services/auth/auth.service";

// Importar el servicio de autenticación

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Redirigir al dashboard si ya está autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        toast.success("Inicio de sesión exitoso");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en inicio de sesión:", error);
      toast.error("Error al intentar iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background border-b">
        <div className="flex h-16 items-center px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">MinecraftManager</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="mx-auto max-w-md space-y-6 w-full">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Bienvenido</h1>
            <p className="text-muted-foreground">
              Inicia sesión para administrar tus servidores de Minecraft
            </p>
          </div>
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Iniciar Sesión</CardTitle>
                <CardDescription>
                  Ingresa tus credenciales para continuar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuario</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="username"
                      required
                      autoComplete="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MinecraftManager. Todos los
            derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
