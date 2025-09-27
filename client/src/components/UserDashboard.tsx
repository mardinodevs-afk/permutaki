import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, Search, User, MessageCircle, Calendar, Shield } from "lucide-react";
import UserCard from "./UserCard";
import ThemeToggle from "./ThemeToggle";
import { mozambiqueData, sectors } from "@shared/mozambique-data";

// todo: remove mock functionality
const mockCurrentUser = {
  id: "current-user",
  name: "João Silva",
  sector: "Educação",
  salaryLevel: 15,
  grade: "B",
  currentLocation: "Maputo, Matola",
  desiredLocation: "Nampula, Nacala",
  phone: "+258 84 123 4567",
  email: "joao@email.com",
  canEditProfile: true,
  whatsappContactsUsed: 1,
  maxDailyContacts: 2,
  lastProfileUpdate: new Date("2024-01-15"),
  isPremium: false
};

// todo: remove mock functionality
const mockUsers = [
  {
    id: "user1",
    name: "Maria Santos",
    sector: "Educação", 
    salaryLevel: 15,
    grade: "B",
    currentLocation: "Nampula, Nacala",
    desiredLocation: "Maputo, Matola",
    rating: 4.8,
    reviewCount: 15,
    isPriorityMatch: true
  },
  {
    id: "user2", 
    name: "Carlos Machel",
    sector: "Educação",
    salaryLevel: 15,
    grade: "A",
    currentLocation: "Nampula, Cidade",
    desiredLocation: "Maputo, KaMpfumo",
    rating: 4.2,
    reviewCount: 8,
    isPriorityMatch: false
  }
];

interface UserDashboardProps {
  onLogout: () => void;
}

export default function UserDashboard({ onLogout }: UserDashboardProps) {
  const [searchFilters, setSearchFilters] = useState({
    sector: "all-sectors",
    currentProvince: "all-provinces",
    desiredProvince: "all-provinces"
  });

  const handleWhatsAppContact = (userId: string) => {
    console.log("WhatsApp contact initiated for user:", userId);
    // todo: remove mock functionality - implement actual WhatsApp contact
  };

  const handleReportUser = (userId: string) => {
    console.log("Report user:", userId);
    // todo: remove mock functionality - implement user reporting
  };

  const handleRateUser = (userId: string) => {
    console.log("Rate user:", userId);
    // todo: remove mock functionality - implement user rating
  };

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      onLogout();
    }
  };

  const canEditProfile = () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const oneWeekAfterSignup = new Date(mockCurrentUser.lastProfileUpdate);
    oneWeekAfterSignup.setDate(oneWeekAfterSignup.getDate() + 7);
    
    return mockCurrentUser.canEditProfile && 
           (mockCurrentUser.lastProfileUpdate < sixMonthsAgo || new Date() < oneWeekAfterSignup);
  };

  const canContactToday = mockCurrentUser.whatsappContactsUsed < mockCurrentUser.maxDailyContacts;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Permutaki</h1>
            <p className="text-sm text-muted-foreground">Dashboard do Usuário</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-foreground">{mockCurrentUser.name}</p>
              <div className="flex items-center gap-2">
                <Badge variant={mockCurrentUser.isPremium ? "default" : "secondary"}>
                  {mockCurrentUser.isPremium ? "Premium" : "Gratuito"}
                </Badge>
              </div>
            </div>
            
            <ThemeToggle />
            
            <Button 
              variant="outline" 
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search" data-testid="tab-search">
              <Search className="h-4 w-4 mr-2" />
              Pesquisar Parceiros
            </TabsTrigger>
            <TabsTrigger value="profile" data-testid="tab-profile">
              <User className="h-4 w-4 mr-2" />
              Meu Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {/* Contact Limit Warning */}
            <Card className="p-4 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-orange-600" />
                <p className="text-sm">
                  Contactos WhatsApp hoje: <strong>{mockCurrentUser.whatsappContactsUsed}/{mockCurrentUser.maxDailyContacts}</strong>
                  {!canContactToday && (
                    <span className="text-orange-600 ml-2">
                      Limite diário atingido. Tente novamente amanhã.
                    </span>
                  )}
                </p>
              </div>
            </Card>

            {/* Search Filters */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Filtros de Pesquisa</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sector</label>
                  <Select 
                    value={searchFilters.sector} 
                    onValueChange={(value) => setSearchFilters(prev => ({ ...prev, sector: value }))}
                  >
                    <SelectTrigger data-testid="select-search-sector">
                      <SelectValue placeholder="Todos os sectores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-sectors">Todos os sectores</SelectItem>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Província Actual</label>
                  <Select 
                    value={searchFilters.currentProvince} 
                    onValueChange={(value) => setSearchFilters(prev => ({ ...prev, currentProvince: value }))}
                  >
                    <SelectTrigger data-testid="select-search-current-province">
                      <SelectValue placeholder="Todas as províncias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-provinces">Todas as províncias</SelectItem>
                      {Object.keys(mozambiqueData).map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Província Pretendida</label>
                  <Select 
                    value={searchFilters.desiredProvince} 
                    onValueChange={(value) => setSearchFilters(prev => ({ ...prev, desiredProvince: value }))}
                  >
                    <SelectTrigger data-testid="select-search-desired-province">
                      <SelectValue placeholder="Todas as províncias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-provinces">Todas as províncias</SelectItem>
                      {Object.keys(mozambiqueData).map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Search Results */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Parceiros Compatíveis</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    {...user}
                    canContact={canContactToday}
                    onWhatsAppContact={handleWhatsAppContact}
                    onReport={handleReportUser}
                    onRate={handleRateUser}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Edit Warning */}
            {!canEditProfile() && (
              <Card className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm">
                    Só pode editar o perfil uma vez a cada 6 meses ou até 1 semana após o cadastro.
                  </p>
                </div>
              </Card>
            )}

            {/* Profile Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Informações do Perfil</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nome</label>
                    <Input 
                      value={mockCurrentUser.name} 
                      disabled={!canEditProfile()}
                      data-testid="input-profile-name"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Sector</label>
                    <Input 
                      value={mockCurrentUser.sector} 
                      disabled={!canEditProfile()}
                      data-testid="input-profile-sector"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nível Salarial</label>
                    <Input 
                      value={`${mockCurrentUser.salaryLevel}${mockCurrentUser.grade}`} 
                      disabled={!canEditProfile()}
                      data-testid="input-profile-level"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                    <Input 
                      value={mockCurrentUser.phone} 
                      disabled={!canEditProfile()}
                      data-testid="input-profile-phone"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">E-mail</label>
                    <Input 
                      value={mockCurrentUser.email} 
                      disabled={!canEditProfile()}
                      data-testid="input-profile-email"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Localização Actual</label>
                    <Input 
                      value={mockCurrentUser.currentLocation} 
                      disabled={!canEditProfile()}
                      data-testid="input-profile-current-location"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium text-muted-foreground">Localização Pretendida</label>
                <Input 
                  value={mockCurrentUser.desiredLocation} 
                  disabled={!canEditProfile()}
                  data-testid="input-profile-desired-location"
                />
              </div>

              {canEditProfile() && (
                <div className="mt-6">
                  <Button data-testid="button-save-profile">
                    Guardar Alterações
                  </Button>
                </div>
              )}
            </Card>

            {/* Account Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <Calendar className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Membro desde</p>
                <p className="font-semibold">Janeiro 2024</p>
              </Card>
              
              <Card className="p-4 text-center">
                <MessageCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <p className="text-sm text-muted-foreground">Contactos hoje</p>
                <p className="font-semibold">{mockCurrentUser.whatsappContactsUsed}/{mockCurrentUser.maxDailyContacts}</p>
              </Card>
              
              <Card className="p-4 text-center">
                <Shield className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                <p className="text-sm text-muted-foreground">Tipo de conta</p>
                <p className="font-semibold">{mockCurrentUser.isPremium ? "Premium" : "Gratuito"}</p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}