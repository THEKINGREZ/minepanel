import { FC } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Info, Save, HelpCircle } from "lucide-react";
import { ServerConfig } from "@/lib/types/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ModsTabProps {
  config: ServerConfig;
  updateConfig: (field: keyof ServerConfig, value: any) => void;
  onSave: () => Promise<boolean>;
}

export const ModsTab: FC<ModsTabProps> = ({ config, updateConfig, onSave }) => {
  const isCurseForge = config.serverType === "AUTO_CURSEFORGE";
  const isForge = config.serverType === "FORGE";

  if (!isCurseForge && !isForge) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Mods</CardTitle>
          <CardDescription>Esta sección solo está disponible para servidores Forge o CurseForge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40 border rounded-md bg-muted/20 gap-3 p-6">
            <HelpCircle className="h-12 w-12 text-muted-foreground/60" />
            <p className="text-muted-foreground text-center">Selecciona el tipo de servidor Forge o CurseForge en la pestaña "Tipo de Servidor" para configurar los mods.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de Mods</CardTitle>
        <CardDescription>{isCurseForge ? "Configura un modpack de CurseForge para tu servidor" : "Configura los detalles de Forge para tu servidor"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isForge && (
          <div className="space-y-2">
            <Label htmlFor="forgeBuild">Versión de Forge</Label>
            <Input id="forgeBuild" value={config.forgeBuild} onChange={(e) => updateConfig("forgeBuild", e.target.value)} placeholder="43.2.0" />
            <p className="text-xs text-muted-foreground">Número de build de Forge para la versión de Minecraft seleccionada</p>
          </div>
        )}

        {isCurseForge && (
          <>
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Información importante</p>
                  <p className="text-xs text-amber-700 mt-1">Para utilizar correctamente la funcionalidad de CurseForge, se requiere una API Key. La API key es necesaria para descargar modpacks privados o con restricciones.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="cfMethod">Método de Instalación</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md">
                      <p>Selecciona cómo quieres obtener el modpack:</p>
                      <ul className="list-disc pl-4 mt-1 text-xs">
                        <li>
                          <strong>URL:</strong> Dirección web directa al modpack en CurseForge
                        </li>
                        <li>
                          <strong>Slug:</strong> Identificador único del modpack (ej: "all-the-mods-7")
                        </li>
                        <li>
                          <strong>Archivo:</strong> Instalar desde un archivo .zip ya subido al servidor
                        </li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-4 border rounded-md cursor-pointer transition-colors hover:bg-muted/30 ${config.cfMethod === "url" ? "border-primary bg-primary/10" : ""}`} onClick={() => updateConfig("cfMethod", "url")}>
                  <p className="font-medium">URL</p>
                  <p className="text-xs text-muted-foreground">Instalar desde URL directa</p>
                </div>
                <div className={`p-4 border rounded-md cursor-pointer transition-colors hover:bg-muted/30 ${config.cfMethod === "slug" ? "border-primary bg-primary/10" : ""}`} onClick={() => updateConfig("cfMethod", "slug")}>
                  <p className="font-medium">Slug</p>
                  <p className="text-xs text-muted-foreground">Usar ID/slug del modpack</p>
                </div>
                <div className={`p-4 border rounded-md cursor-pointer transition-colors hover:bg-muted/30 ${config.cfMethod === "file" ? "border-primary bg-primary/10" : ""}`} onClick={() => updateConfig("cfMethod", "file")}>
                  <p className="font-medium">Archivo</p>
                  <p className="text-xs text-muted-foreground">Usar archivo local en el servidor</p>
                </div>
              </div>
            </div>

            {config.cfMethod === "url" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cfUrl">URL del Modpack (CF_PAGE_URL)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>URL completa a la página del modpack o a un archivo específico.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input id="cfUrl" value={config.cfUrl} onChange={(e) => updateConfig("cfUrl", e.target.value)} placeholder="https://www.curseforge.com/minecraft/modpacks/all-the-mods-7/download/3855588" />
                <p className="text-xs text-muted-foreground">URL directa de descarga del modpack de CurseForge</p>
              </div>
            )}

            {config.cfMethod === "slug" && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cfSlug">Proyecto de CurseForge (CF_SLUG)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>El identificador (slug) del modpack en CurseForge.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input id="cfSlug" value={config.cfSlug} onChange={(e) => updateConfig("cfSlug", e.target.value)} placeholder="all-the-mods-7" />
                  <p className="text-xs text-muted-foreground">Nombre del proyecto o slug en CurseForge</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cfFile">ID del Archivo (CF_FILE_ID)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>ID numérico del archivo específico a descargar. Si se omite, se usará la versión más reciente.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input id="cfFile" value={config.cfFile} onChange={(e) => updateConfig("cfFile", e.target.value)} placeholder="3855588" />
                  <p className="text-xs text-muted-foreground">ID específico del archivo a descargar. Si se deja en blanco, se usará la última versión.</p>
                </div>
              </>
            )}

            {config.cfMethod === "file" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cfFilenameMatcher">Patrón de Archivo (CF_FILENAME_MATCHER)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Especifica un substring para encontrar el archivo deseado en la carpeta /modpacks.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input id="cfFilenameMatcher" value={config.cfFilenameMatcher} onChange={(e) => updateConfig("cfFilenameMatcher", e.target.value)} placeholder="*.zip" />
                <p className="text-xs text-muted-foreground">Patrón para encontrar el archivo del modpack en la carpeta /modpacks</p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="cfApiKey">API Key de CurseForge (CF_API_KEY)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>API Key de CurseForge (Eternal) requerida para descargar algunos modpacks.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input id="cfApiKey" value={config.cfApiKey} onChange={(e) => updateConfig("cfApiKey", e.target.value)} placeholder="$2a$10$Iao..." type="password" />
              <p className="text-xs text-muted-foreground">API Key para descargar modpacks restringidos (requerida para la mayoría de modpacks)</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="advanced">
                <AccordionTrigger className="text-sm font-medium">Opciones Avanzadas</AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="cfSync">Sincronizar CurseForge (CF_FORCE_SYNCHRONIZE)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <HelpCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Fuerza la reevaluación de exclusiones/inclusiones al reiniciar el servidor.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Switch id="cfSync" checked={config.cfSync} onCheckedChange={(checked) => updateConfig("cfSync", checked)} />
                    </div>
                    <p className="text-xs text-muted-foreground">Sincroniza automáticamente actualizaciones del modpack cuando el servidor se reinicia</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cfParallelDownloads">Descargas Paralelas (CF_PARALLEL_DOWNLOADS)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Número de descargas de mods que se realizarán en paralelo. Valor por defecto: 4</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select value={config.cfParallelDownloads || "4"} onValueChange={(value) => updateConfig("cfParallelDownloads", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="4" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 descarga</SelectItem>
                        <SelectItem value="2">2 descargas</SelectItem>
                        <SelectItem value="4">4 descargas (recomendado)</SelectItem>
                        <SelectItem value="6">6 descargas</SelectItem>
                        <SelectItem value="8">8 descargas</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Especifica cuántas descargas paralelas de mods realizar</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="cfOverridesSkipExisting">Omitir Archivos Existentes (CF_OVERRIDES_SKIP_EXISTING)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <HelpCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Si está activado, los archivos existentes en el directorio de datos se mantienen y no son sobrescritos.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Switch id="cfOverridesSkipExisting" checked={config.cfOverridesSkipExisting} onCheckedChange={(checked) => updateConfig("cfOverridesSkipExisting", checked)} />
                    </div>
                    <p className="text-xs text-muted-foreground">Si se activa, los archivos que ya existen en el directorio de datos no son reemplazados</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cfSetLevelFrom">Configurar Nivel Desde (CF_SET_LEVEL_FROM)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Determina cómo establecer los datos del mundo desde el modpack.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select value={config.cfSetLevelFrom || "none"} onValueChange={(value) => updateConfig("cfSetLevelFrom", value === "none" ? "" : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No configurar</SelectItem>
                        <SelectItem value="WORLD_FILE">Archivo de Mundo</SelectItem>
                        <SelectItem value="OVERRIDES">Overrides del Modpack</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Configura cómo obtener los datos del mundo desde el modpack</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cfForceInclude">Forzar Inclusión de Mods (CF_FORCE_INCLUDE_MODS)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p>Lista de mods (separados por espacios o líneas) para incluir forzosamente, independientemente del modpack IDs o Slugs.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea id="cfForceInclude" value={config.cfForceInclude} onChange={(e) => updateConfig("cfForceInclude", e.target.value)} placeholder="699872,228404" className="min-h-20" />
                    <p className="text-xs text-muted-foreground">Lista de mods que siempre se incluirán incluso si no están en el modpack IDs o Slugs (uno por línea)</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cfExclude">Excluir Mods (CF_EXCLUDE_MODS)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p>Lista de mods (separados por espacios o líneas) que serán excluidos del modpack IDs o Slugs.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea id="cfExclude" value={config.cfExclude} onChange={(e) => updateConfig("cfExclude", e.target.value)} placeholder="699872,228404" className="min-h-20" />
                    <p className="text-xs text-muted-foreground">Lista de mods que se excluirán del modpack IDs o Slugs (uno por línea, admite patrones glob)</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-end pt-4">
        <Button type="button" onClick={onSave} className="gap-2">
          <Save className="h-4 w-4" />
          Guardar Configuración
        </Button>
      </CardFooter>
    </Card>
  );
};
