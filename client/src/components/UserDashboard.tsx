
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, Search, User, MessageCircle, Calendar, Shield, Camera, Eye, EyeOff, Trash2, Pause } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  avatarUrl: "",
  whatsappContactsUsed: 1,
  maxDailyContacts: 2,
  lastProfileUpdate: new Date("2024-01-15"),
  lastLocationUpdate: new Date("2023-12-01"),
  lastDesiredLocationUpdate: new Date("2024-01-01"),
  lastSalaryUpdate: new Date("2022-01-01"),
  passwordChangesToday: 1,
  maxPasswordChangesPerDay: 3,
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

  const [profileData, setProfileData] = useState({
    salaryLevel: mockCurrentUser.salaryLevel,
    grade: mockCurrentUser.grade,
    currentProvince: "Maputo Cidade",
    currentDistrict: "Matola",
    desiredProvince: "Nampula",
    desiredDistrict: "Nacala",
    avatarUrl: mockCurrentUser.avatarUrl
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // todo: implement actual file upload
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, avatarUrl: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("As palavras-passe não coincidem");
      return;
    }
    // todo: implement actual password change
    console.log("Password change requested");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShowPasswordForm(false);
  };

  const handleSuspendAccount = () => {
    if (confirm("Tem certeza que deseja suspender a sua conta? Pode reactivá-la posteriormente.")) {
      // todo: implement account suspension
      console.log("Account suspension requested");
    }
  };

  const handleDeleteAccount = () => {
    if (confirm("ATENÇÃO: Tem certeza que deseja eliminar permanentemente a sua conta? Esta acção não pode ser desfeita.")) {
      if (confirm("Digite 'ELIMINAR' para confirmar")) {
        // todo: implement account deletion
        console.log("Account deletion requested");
      }
    }
  };

  // Validation functions
  const canEditSalaryLevel = () => {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    return mockCurrentUser.lastSalaryUpdate < twoYearsAgo;
  };

  const canEditCurrentLocation = () => {
    return !mockCurrentUser.lastLocationUpdate || mockCurrentUser.lastLocationUpdate < new Date("2024-01-01");
  };

  const canEditDesiredLocation = () => {
    if (mockCurrentUser.isPremium) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return !mockCurrentUser.lastDesiredLocationUpdate || mockCurrentUser.lastDesiredLocationUpdate < yesterday;
    } else {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return !mockCurrentUser.lastDesiredLocationUpdate || mockCurrentUser.lastDesiredLocationUpdate < oneMonthAgo;
    }
  };

  const canChangePassword = () => {
    return mockCurrentUser.passwordChangesToday < mockCurrentUser.maxPasswordChangesPerDay;
  };

  const canContactToday = mockCurrentUser.whatsappContactsUsed < mockCurrentUser.maxDailyContacts;

  const getCurrentDistricts = (province: string) => {
    return province ? mozambiqueData[province as keyof typeof mozambiqueData] || [] : [];
  };

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
            {/* Profile Photo Section */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Fotografia do Perfil</h3>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData.avatarUrl} alt={mockCurrentUser.name} />
                  <AvatarFallback className="text-lg">
                    {mockCurrentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Adicione uma fotografia ao seu perfil para melhor identificação
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <Camera className="h-4 w-4 mr-2" />
                        Alterar Foto
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                      </label>
                    </Button>
                    {profileData.avatarUrl && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setProfileData(prev => ({ ...prev, avatarUrl: "" }))}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Profile Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Informações do Perfil</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nome (não editável)</label>
                    <Input 
                      value={mockCurrentUser.name} 
                      disabled
                      data-testid="input-profile-name"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Sector (não editável)</label>
                    <Input 
                      value={mockCurrentUser.sector} 
                      disabled
                      data-testid="input-profile-sector"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Nível Salarial {!canEditSalaryLevel() && "(editável de 2 em 2 anos)"}
                    </label>
                    <div className="flex gap-2">
                      <Input 
                        type="number"
                        min="1"
                        max="21"
                        value={profileData.salaryLevel} 
                        disabled={!canEditSalaryLevel()}
                        onChange={(e) => setProfileData(prev => ({ ...prev, salaryLevel: parseInt(e.target.value) }))}
                        data-testid="input-profile-salary-level"
                        className="flex-1"
                      />
                      <Select 
                        value={profileData.grade}
                        onValueChange={(value) => setProfileData(prev => ({ ...prev, grade: value }))}
                        disabled={!canEditSalaryLevel()}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {!canEditSalaryLevel() && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Próxima edição disponível em: {new Date(mockCurrentUser.lastSalaryUpdate.getTime() + 2 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contacto WhatsApp (não editável)</label>
                    <Input 
                      value={mockCurrentUser.phone} 
                      disabled
                      data-testid="input-profile-phone"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">E-mail</label>
                    <Input 
                      value={mockCurrentUser.email} 
                      disabled
                      data-testid="input-profile-email"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Província Actual {!canEditCurrentLocation() && "(editável apenas uma vez)"}
                      </label>
                      <Select 
                        value={profileData.currentProvince} 
                        onValueChange={(value) => {
                          setProfileData(prev => ({ 
                            ...prev, 
                            currentProvince: value,
                            currentDistrict: "" // Reset district when province changes
                          }));
                        }}
                        disabled={!canEditCurrentLocation()}
                      >
                        <SelectTrigger data-testid="select-profile-current-province">
                          <SelectValue placeholder="Selecione a província" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(mozambiqueData).map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Distrito Actual {!canEditCurrentLocation() && "(editável apenas uma vez)"}
                      </label>
                      <Select 
                        value={profileData.currentDistrict} 
                        onValueChange={(value) => setProfileData(prev => ({ ...prev, currentDistrict: value }))}
                        disabled={!canEditCurrentLocation() || !profileData.currentProvince}
                      >
                        <SelectTrigger data-testid="select-profile-current-district">
                          <SelectValue placeholder="Selecione o distrito" />
                        </SelectTrigger>
                        <SelectContent>
                          {getCurrentDistricts(profileData.currentProvince).map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!canEditCurrentLocation() && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Localização já foi alterada
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Província Pretendida 
                    {mockCurrentUser.isPremium ? " (editável uma vez por dia)" : " (editável uma vez por mês)"}
                  </label>
                  <Select 
                    value={profileData.desiredProvince} 
                    onValueChange={(value) => {
                      setProfileData(prev => ({ 
                        ...prev, 
                        desiredProvince: value,
                        desiredDistrict: "" // Reset district when province changes
                      }));
                    }}
                    disabled={!canEditDesiredLocation()}
                  >
                    <SelectTrigger data-testid="select-profile-desired-province">
                      <SelectValue placeholder="Selecione a província" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(mozambiqueData).map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Distrito Pretendido 
                    {mockCurrentUser.isPremium ? " (editável uma vez por dia)" : " (editável uma vez por mês)"}
                  </label>
                  <Select 
                    value={profileData.desiredDistrict} 
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, desiredDistrict: value }))}
                    disabled={!canEditDesiredLocation() || !profileData.desiredProvince}
                  >
                    <SelectTrigger data-testid="select-profile-desired-district">
                      <SelectValue placeholder="Selecione o distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      {getCurrentDistricts(profileData.desiredProvince).map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!canEditDesiredLocation() && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {mockCurrentUser.isPremium 
                        ? "Próxima edição disponível amanhã" 
                        : `Próxima edição disponível em: ${new Date(mockCurrentUser.lastDesiredLocationUpdate.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <Button data-testid="button-save-profile">
                  Guardar Alterações
                </Button>
              </div>
            </Card>

            {/* Password Change Section */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Alterar Palavra-passe</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Alterações hoje: {mockCurrentUser.passwordChangesToday}/{mockCurrentUser.maxPasswordChangesPerDay}
              </p>
              
              {!showPasswordForm ? (
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordForm(true)}
                  disabled={!canChangePassword()}
                  data-testid="button-change-password"
                >
                  Alterar Palavra-passe
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <label className="text-sm font-medium">Palavra-passe Actual</label>
                    <div className="relative">
                      <Input 
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        data-testid="input-current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label className="text-sm font-medium">Nova Palavra-passe</label>
                    <div className="relative">
                      <Input 
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        data-testid="input-new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label className="text-sm font-medium">Confirmar Nova Palavra-passe</label>
                    <div className="relative">
                      <Input 
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        data-testid="input-confirm-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handlePasswordChange} data-testid="button-save-password">
                      Guardar Nova Palavra-passe
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPasswordForm(false)}
                      data-testid="button-cancel-password"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
              
              {!canChangePassword() && (
                <p className="text-sm text-red-600 mt-2">
                  Limite de alterações diárias atingido. Tente novamente amanhã.
                </p>
              )}
            </Card>

            {/* Account Security Section */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-red-600">Zona de Perigo</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
                  <div>
                    <h4 className="font-medium">Suspender Conta</h4>
                    <p className="text-sm text-muted-foreground">
                      Desactiva temporariamente a sua conta. Pode reactivá-la posteriormente.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleSuspendAccount}
                    data-testid="button-suspend-account"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Suspender
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
                  <div>
                    <h4 className="font-medium">Eliminar Conta</h4>
                    <p className="text-sm text-muted-foreground">
                      Remove permanentemente a sua conta e todos os dados. Esta acção não pode ser desfeita.
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    data-testid="button-delete-account"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
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
