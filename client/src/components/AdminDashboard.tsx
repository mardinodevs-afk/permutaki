
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, Search, Users, History, Calendar, MapPin, DollarSign } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

// todo: remove mock functionality
const mockUserEditHistory = [
  {
    id: "edit1",
    userId: "user1",
    userName: "João Silva",
    editType: "desired_location",
    oldValue: "Maputo, Matola",
    newValue: "Nampula, Nacala",
    editDate: new Date("2024-01-15T10:30:00"),
    userType: "Free"
  },
  {
    id: "edit2",
    userId: "user2",
    userName: "Maria Santos",
    editType: "current_location",
    oldValue: "Tete, Moatize",
    newValue: "Maputo, KaMpfumo",
    editDate: new Date("2024-01-14T14:22:00"),
    userType: "Premium"
  },
  {
    id: "edit3",
    userId: "user1",
    userName: "João Silva",
    editType: "salary_level",
    oldValue: "Nível 12, Escalão B",
    newValue: "Nível 15, Escalão B",
    editDate: new Date("2024-01-10T09:15:00"),
    userType: "Free"
  },
  {
    id: "edit4",
    userId: "user3",
    userName: "Carlos Machel",
    editType: "desired_location",
    oldValue: "Inhambane, Maxixe",
    newValue: "Sofala, Beira",
    editDate: new Date("2024-01-12T16:45:00"),
    userType: "Premium"
  },
  {
    id: "edit5",
    userId: "user2",
    userName: "Maria Santos",
    editType: "desired_location",
    oldValue: "Maputo, KaMpfumo",
    newValue: "Zambézia, Quelimane",
    editDate: new Date("2024-01-13T11:20:00"),
    userType: "Premium"
  }
];

const mockUserStats = {
  totalUsers: 1247,
  activeUsers: 892,
  premiumUsers: 156,
  freeUsers: 1091,
  editsToday: 23,
  editsThisWeek: 167,
  editsThisMonth: 542
};

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [searchFilters, setSearchFilters] = useState({
    userName: "",
    editType: "all",
    userType: "all",
    dateRange: "all"
  });

  const [filteredHistory, setFilteredHistory] = useState(mockUserEditHistory);

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      onLogout();
    }
  };

  const getEditTypeIcon = (editType: string) => {
    switch (editType) {
      case "desired_location":
      case "current_location":
        return <MapPin className="h-4 w-4" />;
      case "salary_level":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  const getEditTypeLabel = (editType: string) => {
    switch (editType) {
      case "desired_location":
        return "Localização Pretendida";
      case "current_location":
        return "Localização Actual";
      case "salary_level":
        return "Nível Salarial";
      default:
        return editType;
    }
  };

  const getEditTypeBadgeColor = (editType: string) => {
    switch (editType) {
      case "desired_location":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "current_location":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "salary_level":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const applyFilters = () => {
    let filtered = mockUserEditHistory;

    if (searchFilters.userName) {
      filtered = filtered.filter(edit => 
        edit.userName.toLowerCase().includes(searchFilters.userName.toLowerCase())
      );
    }

    if (searchFilters.editType !== "all") {
      filtered = filtered.filter(edit => edit.editType === searchFilters.editType);
    }

    if (searchFilters.userType !== "all") {
      filtered = filtered.filter(edit => edit.userType === searchFilters.userType);
    }

    if (searchFilters.dateRange !== "all") {
      const now = new Date();
      const days = searchFilters.dateRange === "today" ? 1 : 
                   searchFilters.dateRange === "week" ? 7 : 30;
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(edit => edit.editDate >= cutoff);
    }

    setFilteredHistory(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Permutaki Admin</h1>
            <p className="text-sm text-muted-foreground">Dashboard do Administrador</p>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <Button 
              variant="outline" 
              onClick={handleLogout}
              data-testid="button-admin-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stats" data-testid="tab-stats">
              <Users className="h-4 w-4 mr-2" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">
              <History className="h-4 w-4 mr-2" />
              Histórico de Edições
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Total de Usuários</p>
                <p className="text-2xl font-bold">{mockUserStats.totalUsers.toLocaleString()}</p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="h-8 w-8 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-2">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-sm text-muted-foreground">Usuários Activos</p>
                <p className="text-2xl font-bold text-green-600">{mockUserStats.activeUsers.toLocaleString()}</p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="h-8 w-8 mx-auto bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-2">
                  <Users className="h-4 w-4 text-orange-600" />
                </div>
                <p className="text-sm text-muted-foreground">Usuários Premium</p>
                <p className="text-2xl font-bold text-orange-600">{mockUserStats.premiumUsers.toLocaleString()}</p>
              </Card>
              
              <Card className="p-6 text-center">
                <History className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <p className="text-sm text-muted-foreground">Edições Este Mês</p>
                <p className="text-2xl font-bold text-blue-600">{mockUserStats.editsThisMonth.toLocaleString()}</p>
              </Card>
            </div>

            {/* Edit Statistics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Estatísticas de Edições</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Hoje</p>
                  <p className="text-xl font-bold">{mockUserStats.editsToday}</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Esta Semana</p>
                  <p className="text-xl font-bold">{mockUserStats.editsThisWeek}</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Este Mês</p>
                  <p className="text-xl font-bold">{mockUserStats.editsThisMonth}</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {/* Filters */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Filtros de Pesquisa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome do Usuário</label>
                  <Input 
                    placeholder="Pesquisar por nome"
                    value={searchFilters.userName}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, userName: e.target.value }))}
                    data-testid="input-search-user"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Edição</label>
                  <Select 
                    value={searchFilters.editType} 
                    onValueChange={(value) => setSearchFilters(prev => ({ ...prev, editType: value }))}
                  >
                    <SelectTrigger data-testid="select-edit-type">
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      <SelectItem value="current_location">Localização Actual</SelectItem>
                      <SelectItem value="desired_location">Localização Pretendida</SelectItem>
                      <SelectItem value="salary_level">Nível Salarial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Usuário</label>
                  <Select 
                    value={searchFilters.userType} 
                    onValueChange={(value) => setSearchFilters(prev => ({ ...prev, userType: value }))}
                  >
                    <SelectTrigger data-testid="select-user-type">
                      <SelectValue placeholder="Todos os usuários" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os usuários</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Free">Gratuito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Período</label>
                  <Select 
                    value={searchFilters.dateRange} 
                    onValueChange={(value) => setSearchFilters(prev => ({ ...prev, dateRange: value }))}
                  >
                    <SelectTrigger data-testid="select-date-range">
                      <SelectValue placeholder="Todos os períodos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os períodos</SelectItem>
                      <SelectItem value="today">Hoje</SelectItem>
                      <SelectItem value="week">Esta semana</SelectItem>
                      <SelectItem value="month">Este mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4">
                <Button onClick={applyFilters} data-testid="button-apply-filters">
                  <Search className="h-4 w-4 mr-2" />
                  Aplicar Filtros
                </Button>
              </div>
            </Card>

            {/* Edit History */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Histórico de Edições ({filteredHistory.length} registos)
              </h3>
              
              <div className="space-y-4">
                {filteredHistory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma edição encontrada com os filtros aplicados.
                  </p>
                ) : (
                  filteredHistory.map((edit) => (
                    <div 
                      key={edit.id} 
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getEditTypeIcon(edit.editType)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{edit.userName}</h4>
                              <Badge 
                                variant="secondary" 
                                className={getEditTypeBadgeColor(edit.editType)}
                              >
                                {getEditTypeLabel(edit.editType)}
                              </Badge>
                              <Badge variant={edit.userType === "Premium" ? "default" : "secondary"}>
                                {edit.userType}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p><strong>Valor anterior:</strong> {edit.oldValue}</p>
                              <p><strong>Novo valor:</strong> {edit.newValue}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {edit.editDate.toLocaleDateString('pt-PT')}
                          </div>
                          <div className="mt-1">
                            {edit.editDate.toLocaleTimeString('pt-PT', { 
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
        </Tabs>
      </div>
    </div>
  );
}
