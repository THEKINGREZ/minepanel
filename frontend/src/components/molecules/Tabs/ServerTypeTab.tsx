import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { ServerConfig } from "@/lib/types/types";

interface ServerTypeTabProps {
  config: ServerConfig;
  updateConfig: (field: keyof ServerConfig, value: any) => void;
  onSave: () => Promise<boolean>;
}

export const ServerTypeTab: FC<ServerTypeTabProps> = ({
  config,
  updateConfig,
  onSave,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipo de Servidor</CardTitle>
        <CardDescription>
          Selecciona el tipo de servidor de Minecraft que deseas configurar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={config.serverType}
          onValueChange={(value: "VANILLA" | "FORGE" | "AUTO_CURSEFORGE") =>
            updateConfig("serverType", value)
          }
          className="space-y-4"
        >
          <div className="flex items-start space-x-4 rounded-md border p-4">
            <RadioGroupItem value="VANILLA" id="vanilla" />
            <div className="flex flex-col space-y-2">
              <Label htmlFor="vanilla" className="text-base font-medium">
                Vanilla
              </Label>
              <p className="text-sm text-muted-foreground">
                Servidor básico de Minecraft sin mods ni plugins. Ideal para
                jugar en modo supervivencia clásico.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 rounded-md border p-4">
            <RadioGroupItem value="FORGE" id="forge" />
            <div className="flex flex-col space-y-2">
              <Label htmlFor="forge" className="text-base font-medium">
                Forge
              </Label>
              <p className="text-sm text-muted-foreground">
                Servidor con soporte para mods usando Forge. Requiere configurar
                la versión de Forge específica a utilizar.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 rounded-md border p-4">
            <RadioGroupItem value="AUTO_CURSEFORGE" id="curseforge" />
            <div className="flex flex-col space-y-2">
              <Label htmlFor="curseforge" className="text-base font-medium">
                CurseForge Modpack
              </Label>
              <p className="text-sm text-muted-foreground">
                Instala automáticamente modpacks de CurseForge. Se puede
                configurar mediante URL, Slug o ZIP del modpack.
              </p>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="button" onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Guardar
        </Button>
      </CardFooter>
    </Card>
  );
};
