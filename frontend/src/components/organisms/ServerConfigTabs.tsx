import { FormEvent, FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServerConfig } from "@/lib/types/types";
import { LogsTab } from "../molecules/Tabs/LogsTab";
import { CommandsTab } from "../molecules/Tabs/CommandsTab";
import { AdvancedTab } from "../molecules/Tabs/AdvancedTab";
import { ModsTab } from "../molecules/Tabs/ModsTab";
import { ResourcesTab } from "../molecules/Tabs/ResourcesTab";
import { GeneralSettingsTab } from "../molecules/Tabs/GeneralSettingsTab";
import { ServerTypeTab } from "../molecules/Tabs/ServerTypeTab";

interface ServerConfigTabsProps {
  readonly serverId: string;
  readonly config: ServerConfig;
  readonly updateConfig: (field: keyof ServerConfig, value: any) => void;
  readonly saveConfig: () => Promise<boolean>;
  readonly serverStatus: string;
  readonly onClearData: () => Promise<boolean>;
}

export const ServerConfigTabs: FC<ServerConfigTabsProps> = ({
  serverId,
  config,
  updateConfig,
  saveConfig,
  serverStatus,
  onClearData,
}) => {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await saveConfig();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="type">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="type">Tipo de Servidor</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="resources">Recursos</TabsTrigger>
          <TabsTrigger value="mods">Mods</TabsTrigger>
          <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="commands">Comandos</TabsTrigger>
        </TabsList>

        <TabsContent value="type" className="space-y-4 pt-4">
          <ServerTypeTab
            config={config}
            updateConfig={updateConfig}
            onSave={saveConfig}
          />
        </TabsContent>

        <TabsContent value="general" className="space-y-4 pt-4">
          <GeneralSettingsTab
            config={config}
            updateConfig={updateConfig}
            onSave={saveConfig}
            onClearData={onClearData}
          />
        </TabsContent>

        <TabsContent value="resources" className="space-y-4 pt-4">
          <ResourcesTab
            config={config}
            updateConfig={updateConfig}
            onSave={saveConfig}
          />
        </TabsContent>

        <TabsContent value="mods" className="space-y-4 pt-4">
          <ModsTab
            config={config}
            updateConfig={updateConfig}
            onSave={saveConfig}
          />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4 pt-4">
          <AdvancedTab
            config={config}
            updateConfig={updateConfig}
            onSave={saveConfig}
          />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4 pt-4">
          <LogsTab serverId={serverId} />
        </TabsContent>

        <TabsContent value="commands" className="space-y-4 pt-4">
          <CommandsTab serverId={serverId} serverStatus={serverStatus} />
        </TabsContent>
      </Tabs>
    </form>
  );
};
