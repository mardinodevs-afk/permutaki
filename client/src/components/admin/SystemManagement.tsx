import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, History, Calendar, MapPin, Activity, Database, KeyRound, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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

interface PasswordResetRequest {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  requestedAt: Date;
  hasActiveToken: boolean;
  lastTokenGeneratedAt?: Date;
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
  const [resetRequests, setResetRequests] = useState<PasswordResetRequest[]>([]);
  const [generatingToken, setGeneratingToken] = useState<string | null>(null);

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

      const resetResponse = await fetch('/api/admin/password-reset-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (resetResponse.ok) {
        const requests = await resetResponse.json();
        setResetRequests(requests);
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

  const handleGenerateToken = async (userId: string) => {
    try {
      setGeneratingToken(userId);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/admin/generate-reset-token/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      
      await navigator.clipboard.writeText(data.resetLink);
      
      toast({
        title: "Token gerado!",
        description: `Link de recuperação copiado para área de transferência. Envie via WhatsApp para ${data.phone}. Válido por 1 hora.`,
      });

      loadSystemData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao gerar token",
        variant: "destructive",
      });
    } finally {
      setGeneratingToken(null);
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stats" data-testid="tab-stats">
            <Activity className="h-4 w-4 mr-2" />
            Estatísticas
          </TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history">
            <History className="h-4 w-4 mr-2" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="password-reset" data-testid="tab-password-reset">
            <KeyRound className="h-4 w-4 mr-2" />
            Recuperação de Senha
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
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Skeleton className="h-4 w-28" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-1/2 mb-2" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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

        <TabsContent value="password-reset" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Solicitações de Recuperação de Senha ({resetRequests.length})
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={loadSystemData}
                data-testid="button-refresh-requests"
              >
                Atualizar
              </Button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <div className="flex gap-2 items-start">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900 dark:text-blue-100 space-y-1">
                  <p className="font-medium">Regras:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Apenas 1 token pode ser gerado por usuário por dia</li>
                    <li>Tokens têm validade de 1 hora</li>
                    <li>O link de recuperação é copiado automaticamente</li>
                    <li>Envie o link para o usuário via WhatsApp</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-1/3 mb-2" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : resetRequests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma solicitação pendente
                </p>
              ) : (
                resetRequests.map((request) => {
                  const canGenerateToken = !request.lastTokenGeneratedAt || 
                    (new Date().getTime() - new Date(request.lastTokenGeneratedAt).getTime()) >= 24 * 60 * 60 * 1000;

                  return (
                    <div 
                      key={request.id} 
                      className="border rounded-lg p-4 hover-elevate"
                      data-testid={`reset-request-${request.id}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">
                              {request.firstName} {request.lastName}
                            </h4>
                            {request.hasActiveToken && (
                              <Badge variant="default">Token Ativo</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p className="flex items-center gap-2">
                              <strong>Telefone:</strong> {request.phone}
                            </p>
                            {request.email && (
                              <p className="flex items-center gap-2">
                                <strong>Email:</strong> {request.email}
                              </p>
                            )}
                            <p className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              <strong>Solicitado:</strong>{" "}
                              {new Date(request.requestedAt).toLocaleString('pt-PT')}
                            </p>
                            {request.lastTokenGeneratedAt && (
                              <p className="flex items-center gap-2">
                                <KeyRound className="h-3 w-3" />
                                <strong>Último token:</strong>{" "}
                                {new Date(request.lastTokenGeneratedAt).toLocaleString('pt-PT')}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleGenerateToken(request.id)}
                          disabled={!canGenerateToken || generatingToken === request.id}
                          data-testid={`button-generate-token-${request.id}`}
                          size="sm"
                        >
                          {generatingToken === request.id ? (
                            "Gerando..."
                          ) : !canGenerateToken ? (
                            "Limite diário atingido"
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Gerar Link
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })
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
