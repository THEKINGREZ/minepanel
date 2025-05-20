"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Server } from "lucide-react"

export default function ServerConfig() {
  const params = useParams()
  const serverId = params.server as string

  const [isActive, setIsActive] = useState(serverId === "daily")
  const [memory, setMemory] = useState("4096")
  const [port, setPort] = useState(serverId === "daily" ? "25565" : "25566")

  const serverName = serverId === "daily" ? "Servidor Diario" : "Servidor Fin de Semana"
  const containerName = serverId === "daily" ? "minecraft-daily" : "minecraft-weekend"

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">MinecraftManager</span>
          </Link>
          <Link href="/">
            <Button variant="outline">Cerrar Sesión</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 container py-12 px-4">
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{serverName}</h1>
            <Badge
              variant={isActive ? "outline" : "secondary"}
              className={
                isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
              }
            >
              {isActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>

          <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/40">
            <Server className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{containerName}</p>
              <p className="text-xs text-muted-foreground">Docker Container</p>
            </div>
          </div>

          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="resources">Recursos</TabsTrigger>
              <TabsTrigger value="advanced">Avanzado</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Estado del Servidor</CardTitle>
                  <CardDescription>Controla si el servidor está activo o inactivo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Switch id="server-status" checked={isActive} onCheckedChange={setIsActive} />
                    <Label htmlFor="server-status">{isActive ? "Servidor Activo" : "Servidor Inactivo"}</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configuración Básica</CardTitle>
                  <CardDescription>Ajusta la configuración básica del servidor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="server-name">Nombre del Servidor</Label>
                    <Input id="server-name" defaultValue={`Minecraft ${serverName}`} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="server-port">Puerto</Label>
                    <Input id="server-port" value={port} onChange={(e) => setPort(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="server-motd">Mensaje del Día (MOTD)</Label>
                    <Textarea id="server-motd" defaultValue={`Bienvenido al ${serverName}`} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Guardar Cambios
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recursos del Servidor</CardTitle>
                  <CardDescription>Configura los recursos asignados al servidor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="server-memory">Memoria RAM (MB)</Label>
                    <Input id="server-memory" value={memory} onChange={(e) => setMemory(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="server-cpu">Límite de CPU</Label>
                    <Input id="server-cpu" defaultValue="2" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Guardar Cambios
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración Avanzada</CardTitle>
                  <CardDescription>Ajustes avanzados del servidor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="java-args">Argumentos de Java</Label>
                    <Textarea
                      id="java-args"
                      defaultValue="-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="docker-volumes">Volúmenes de Docker</Label>
                    <Textarea id="docker-volumes" defaultValue={`./data/${containerName}:/data`} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="env-vars">Variables de Entorno</Label>
                    <Textarea
                      id="env-vars"
                      defaultValue="EULA=TRUE
DIFFICULTY=normal
GAMEMODE=survival
ALLOW_NETHER=true
ENABLE_COMMAND_BLOCK=true"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Guardar Cambios
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MinecraftManager. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
