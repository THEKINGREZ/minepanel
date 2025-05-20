import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Server } from "lucide-react"

export default function Dashboard() {
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
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
            <p className="text-muted-foreground mt-2">Selecciona un servidor para configurar</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Servidor Diario</CardTitle>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Activo
                  </Badge>
                </div>
                <CardDescription>Servidor disponible todos los días</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center gap-3">
                  <Server className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">minecraft-daily</p>
                    <p className="text-xs text-muted-foreground">Puerto: 25565</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/daily" className="w-full">
                  <Button className="w-full gap-1">
                    Configurar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Servidor Fin de Semana</CardTitle>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Inactivo
                  </Badge>
                </div>
                <CardDescription>Servidor temporal para fines de semana</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center gap-3">
                  <Server className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">minecraft-weekend</p>
                    <p className="text-xs text-muted-foreground">Puerto: 25566</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/weekend" className="w-full">
                  <Button className="w-full gap-1">
                    Configurar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
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
