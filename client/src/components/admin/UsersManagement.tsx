import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Ban, CheckCircle, XCircle, Crown, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  sector: string;
  salaryLevel: number;
  grade: string;
  currentProvince: string;
  currentDistrict: string;
  isActive: boolean;
  isPremium: boolean;
  isBanned: boolean;
  isAdmin: boolean;
  createdAt: Date;
}

export default function UsersManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<"ban" | "activate" | "deactivate" | "promote" | "demote" | null>(null);
  const [promotionDuration, setPromotionDuration] = useState<number>(30);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, statusFilter, typeFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      if (statusFilter === "active") filtered = filtered.filter(u => u.isActive && !u.isBanned);
      if (statusFilter === "inactive") filtered = filtered.filter(u => !u.isActive);
      if (statusFilter === "banned") filtered = filtered.filter(u => u.isBanned);
    }

    if (typeFilter !== "all") {
      if (typeFilter === "premium") filtered = filtered.filter(u => u.isPremium);
      if (typeFilter === "free") filtered = filtered.filter(u => !u.isPremium);
      if (typeFilter === "admin") filtered = filtered.filter(u => u.isAdmin);
    }

    setFilteredUsers(filtered);
  };

  const handleUserAction = async (user: User, action: "ban" | "activate" | "deactivate" | "promote" | "demote") => {
    setSelectedUser(user);
    setActionType(action);
    if (action === "promote") {
      setPromotionDuration(30); // Default to 30 days
    }
  };

  const confirmAction = async () => {
    if (!selectedUser || !actionType) return;

    try {
      const token = localStorage.getItem('token');
      let endpoint = '';
      let body: any = {};
      
      switch (actionType) {
        case "ban":
          endpoint = `/api/admin/user/${selectedUser.id}/ban`;
          break;
        case "promote":
          endpoint = `/api/admin/user/${selectedUser.id}/promote-premium`;
          body = { duration: promotionDuration };
          break;
        case "demote":
          endpoint = `/api/admin/user/${selectedUser.id}/demote-premium`;
          break;
        default:
          endpoint = `/api/admin/user/${selectedUser.id}/status`;
          body = { isActive: actionType === "activate" };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const messages = {
          ban: "banido",
          activate: "ativado",
          deactivate: "desativado",
          promote: "promovido para Premium",
          demote: "despromovido de Premium"
        };
        
        toast({
          title: "Sucesso",
          description: `Usuário ${messages[actionType]} com sucesso`,
        });
        loadUsers();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao executar ação",
        variant: "destructive",
      });
    } finally {
      setSelectedUser(null);
      setActionType(null);
    }
  };

  const getActionMessage = () => {
    if (!actionType || !selectedUser) return "";
    const userName = `${selectedUser.firstName} ${selectedUser.lastName}`;
    
    switch (actionType) {
      case "ban":
        return `Tem certeza que deseja banir ${userName}? Esta ação impedirá o acesso do usuário ao sistema.`;
      case "activate":
        return `Deseja ativar ${userName}?`;
      case "deactivate":
        return `Deseja desativar ${userName}? O usuário não poderá acessar o sistema enquanto estiver desativado.`;
      case "promote":
        return `Deseja promover ${userName} para Premium?`;
      case "demote":
        return `Deseja despromover ${userName} de Premium? O usuário voltará a ter acesso gratuito.`;
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-users-title">Gestão de Usuários</h1>
        <p className="text-muted-foreground">Gerir e monitorar todos os usuários do sistema</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome ou telefone"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-users"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger data-testid="select-status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="banned">Banidos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger data-testid="select-type-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="free">Gratuito</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Usuários ({filteredUsers.length})
            </h3>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário encontrado
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Setor/Nível</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          {user.isAdmin && (
                            <Badge variant="secondary" className="mt-1">
                              <Crown className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{user.phone}</p>
                          {user.email && <p className="text-muted-foreground">{user.email}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{user.sector}</p>
                          <p className="text-muted-foreground">Nível {user.salaryLevel}{user.grade}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{user.currentProvince}</p>
                          <p className="text-muted-foreground">{user.currentDistrict}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isPremium ? "default" : "secondary"}>
                          {user.isPremium ? "Premium" : "Gratuito"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.isBanned ? (
                          <Badge variant="destructive">Banido</Badge>
                        ) : user.isActive ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inativo</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!user.isBanned && !user.isAdmin && (
                            <>
                              {user.isActive ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUserAction(user, "deactivate")}
                                  data-testid={`button-deactivate-${user.id}`}
                                  title="Desativar"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUserAction(user, "activate")}
                                  data-testid={`button-activate-${user.id}`}
                                  title="Ativar"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              {user.isPremium ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUserAction(user, "demote")}
                                  data-testid={`button-demote-${user.id}`}
                                  title="Despromover de Premium"
                                >
                                  <TrendingDown className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUserAction(user, "promote")}
                                  data-testid={`button-promote-${user.id}`}
                                  title="Promover para Premium"
                                >
                                  <TrendingUp className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleUserAction(user, "ban")}
                                data-testid={`button-ban-${user.id}`}
                                title="Banir"
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>

      <AlertDialog open={!!selectedUser && !!actionType} onOpenChange={() => {
        setSelectedUser(null);
        setActionType(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Ação</AlertDialogTitle>
            <AlertDialogDescription>
              {getActionMessage()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {actionType === "promote" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Duração da Promoção</label>
              <Select 
                value={promotionDuration.toString()} 
                onValueChange={(value) => setPromotionDuration(parseInt(value))}
              >
                <SelectTrigger data-testid="select-promotion-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 dias</SelectItem>
                  <SelectItem value="30">30 dias (1 mês)</SelectItem>
                  <SelectItem value="90">90 dias (3 meses)</SelectItem>
                  <SelectItem value="180">180 dias (6 meses)</SelectItem>
                  <SelectItem value="365">365 dias (1 ano)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-action">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction} data-testid="button-confirm-action">
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
