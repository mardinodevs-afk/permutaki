import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, History, Calendar, MapPin, Activity, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  freeUsers: number;
  editsToday: number;
  editsThisWeek: number;
  editsThisMonth: number;
}

interface EditHistory {
  id: string;
  userId: string;
  userName: string;
  editType: string;
  oldValue: string;
  newValue: string;
  editDate: Date;
  userType: string;
}

export default function SystemManagement() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    freeUsers: 0,
    editsToday: 0,
    editsThisWeek: 0,
    editsThisMonth: 0
  });
  const [editHistory, setEditHistory] = useState<EditHistory[]>([]);

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const statsResponse = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setUserStats(stats);
      }

      const historyResponse = await fetch('/api/admin/location-history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (historyResponse.ok) {
        const history = await historyResponse.json();
        setEditHistory(history.slice(0, 10));
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do sistema",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getEditTypeLabel = (editType: string) => {
    switch (editType) {
      case "desired_location":
        return "Localização Pretendida";
      case "current_location":
        return "Localização Actual";
      default:
        return editType;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-system-title">Gestão do Sistema</h1>
        <p className="text-muted-foreground">Monitorar estatísticas e atividades do sistema</p>
      </div>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stats" data-testid="tab-stats">
            <Activity className="h-4 w-4 mr-2" />
            Estatísticas
          </TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history">
            <History className="h-4 w-4 mr-2" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="database" data-testid="tab-database">
            <Database className="h-4 w-4 mr-2" />
            Base de Dados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Total de Usuários</p>
              <p className="text-2xl font-bold" data-testid="text-total-users">
                {userStats.totalUsers.toLocaleString()}
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-8 w-8 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-2">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground">Usuários Activos</p>
              <p className="text-2xl font-bold text-green-600" data-testid="text-active-users">
                {userStats.activeUsers.toLocaleString()}
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-8 w-8 mx-auto bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-2">
                <Users className="h-4 w-4 text-orange-600" />
              </div>
              <p className="text-sm text-muted-foreground">Usuários Premium</p>
              <p className="text-2xl font-bold text-orange-600" data-testid="text-premium-users">
                {userStats.premiumUsers.toLocaleString()}
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <History className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <p className="text-sm text-muted-foreground">Edições Este Mês</p>
              <p className="text-2xl font-bold text-blue-600" data-testid="text-edits-month">
                {userStats.editsThisMonth.toLocaleString()}
              </p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Estatísticas de Edições</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Hoje</p>
                <p className="text-xl font-bold" data-testid="text-edits-today">
                  {userStats.editsToday}
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Esta Semana</p>
                <p className="text-xl font-bold" data-testid="text-edits-week">
                  {userStats.editsThisWeek}
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Este Mês</p>
                <p className="text-xl font-bold" data-testid="text-edits-month-detail">
                  {userStats.editsThisMonth}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Atividade Recente ({editHistory.length} registos)
            </h3>
            
            <div className="space-y-4">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">
                  Carregando histórico...
                </p>
              ) : editHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma atividade recente
                </p>
              ) : (
                editHistory.map((edit) => (
                  <div 
                    key={edit.id} 
                    className="border rounded-lg p-4 hover-elevate"
                    data-testid={`history-item-${edit.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{edit.userName}</h4>
                            <Badge variant="secondary">
                              {getEditTypeLabel(edit.editType)}
                            </Badge>
                            <Badge variant={edit.userType === "Premium" ? "default" : "secondary"}>
                              {edit.userType}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p><strong>Anterior:</strong> {edit.oldValue}</p>
                            <p><strong>Novo:</strong> {edit.newValue}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(edit.editDate).toLocaleDateString('pt-PT')}
                        </div>
                        <div className="mt-1">
                          {new Date(edit.editDate).toLocaleTimeString('pt-PT', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Informações da Base de Dados</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Tipo de Base de Dados</p>
                  <p className="text-lg font-semibold">PostgreSQL (Neon)</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Status da Conexão</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <p className="text-lg font-semibold text-green-600">Conectado</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Tabelas</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">users</span>
                    <Badge variant="secondary">{userStats.totalUsers} registos</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">location_history</span>
                    <Badge variant="secondary">{editHistory.length}+ registos</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">reports</span>
                    <Badge variant="secondary">0 registos</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">ratings</span>
                    <Badge variant="secondary">0 registos</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
