import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Settings, Bell, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AppManagement() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    allowRegistration: true,
    requireEmailVerification: false,
    maintenanceMode: false,
    maxContactsPerDay: 5,
    premiumMaxContactsPerDay: 20,
    enableNotifications: true,
    enableLocationTracking: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-app-title">Gestão do App</h1>
        <p className="text-muted-foreground">Configurar funcionalidades e comportamentos da aplicação</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" data-testid="tab-general">
            <Settings className="h-4 w-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="features" data-testid="tab-app-features">
            <Shield className="h-4 w-4 mr-2" />
            Funcionalidades
          </TabsTrigger>
          <TabsTrigger value="notifications" data-testid="tab-notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Configurações Gerais</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allow-registration">Permitir Novos Registos</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir que novos usuários se registem na plataforma
                  </p>
                </div>
                <Switch
                  id="allow-registration"
                  checked={settings.allowRegistration}
                  onCheckedChange={() => handleToggle('allowRegistration')}
                  data-testid="switch-allow-registration"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-verification">Verificação de Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Exigir verificação de email para novos usuários
                  </p>
                </div>
                <Switch
                  id="email-verification"
                  checked={settings.requireEmailVerification}
                  onCheckedChange={() => handleToggle('requireEmailVerification')}
                  data-testid="switch-email-verification"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Modo de Manutenção</Label>
                  <p className="text-sm text-muted-foreground">
                    Desativar o acesso temporariamente para manutenção
                  </p>
                </div>
                <Switch
                  id="maintenance-mode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={() => handleToggle('maintenanceMode')}
                  data-testid="switch-maintenance-mode"
                />
              </div>

              <Button onClick={handleSave} disabled={saving} data-testid="button-save-general">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Limites de Funcionalidades</h3>
              
              <div className="space-y-2">
                <Label htmlFor="max-contacts-free">Máximo de Contactos por Dia (Gratuito)</Label>
                <Input
                  id="max-contacts-free"
                  type="number"
                  value={settings.maxContactsPerDay}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    maxContactsPerDay: parseInt(e.target.value) 
                  }))}
                  data-testid="input-max-contacts-free"
                />
                <p className="text-sm text-muted-foreground">
                  Número máximo de contactos WhatsApp por dia para usuários gratuitos
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-contacts-premium">Máximo de Contactos por Dia (Premium)</Label>
                <Input
                  id="max-contacts-premium"
                  type="number"
                  value={settings.premiumMaxContactsPerDay}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    premiumMaxContactsPerDay: parseInt(e.target.value) 
                  }))}
                  data-testid="input-max-contacts-premium"
                />
                <p className="text-sm text-muted-foreground">
                  Número máximo de contactos WhatsApp por dia para usuários premium
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="location-tracking">Rastreamento de Localização</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir que o app rastreie alterações de localização
                  </p>
                </div>
                <Switch
                  id="location-tracking"
                  checked={settings.enableLocationTracking}
                  onCheckedChange={() => handleToggle('enableLocationTracking')}
                  data-testid="switch-location-tracking"
                />
              </div>

              <Button onClick={handleSave} disabled={saving} data-testid="button-save-features">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Notificações</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-notifications">Ativar Notificações</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir envio de notificações para usuários
                  </p>
                </div>
                <Switch
                  id="enable-notifications"
                  checked={settings.enableNotifications}
                  onCheckedChange={() => handleToggle('enableNotifications')}
                  data-testid="switch-enable-notifications"
                />
              </div>

              <div className="space-y-4">
                <Label>Tipos de Notificações</Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Novo Match Encontrado</p>
                      <p className="text-sm text-muted-foreground">
                        Notificar quando um match de permuta for encontrado
                      </p>
                    </div>
                    <Switch defaultChecked data-testid="switch-notify-match" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Mensagem Recebida</p>
                      <p className="text-sm text-muted-foreground">
                        Notificar quando receber uma nova mensagem
                      </p>
                    </div>
                    <Switch defaultChecked data-testid="switch-notify-message" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Atualizações do Sistema</p>
                      <p className="text-sm text-muted-foreground">
                        Notificar sobre atualizações e manutenções
                      </p>
                    </div>
                    <Switch defaultChecked data-testid="switch-notify-system" />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving} data-testid="button-save-notifications">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
