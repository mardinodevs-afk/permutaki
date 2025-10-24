import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LogOut, Search, User, MessageCircle, Calendar, Shield, Camera, Eye, EyeOff, Trash2, Pause, HelpCircle, Send, Key } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import UserCard from "./UserCard";
import CardSkeleton from "@/components/ui/CardSkeleton";
import ThemeToggle from "./ThemeToggle";
import { mozambiqueData, sectors } from "@shared/mozambique-data";
import ChangePasswordModal from "./ChangePasswordModal";

interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  sector: string;
  salaryLevel: number;
  grade: string;
  currentProvince: string;
  currentDistrict: string;
  desiredProvince: string;
  desiredDistrict: string;
  phone: string;
  email: string;
  isPremium: boolean;
  isAdmin: boolean;
  whatsappContactsToday: number;
}

interface SearchUser {
  id: string;
  firstName: string;
  lastName: string;
  sector: string;
  salaryLevel: number;
  grade: string;
  currentProvince: string;
  currentDistrict: string;
  desiredProvince: string;
  desiredDistrict: string;
  phone: string;
  rating?: number;
  reviewCount?: number;
}

interface UserDashboardProps {
  onLogout: () => void;
}

export default function UserDashboard({ onLogout }: UserDashboardProps) {
  const [, setLocation] = useLocation();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [searchUsers, setSearchUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchFilters, setSearchFilters] = useState({
    sector: "all-sectors",
    currentProvince: "all-provinces",
    desiredProvince: "all-provinces"
  });

  const [feedbackForm, setFeedbackForm] = useState({
    type: "",
    subject: "",
    message: "",
    email: "",
    name: ""
  });

  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const [profileData, setProfileData] = useState({
    salaryLevel: 15,
    grade: "B",
    currentProvince: "",
    currentDistrict: "",
    desiredProvince: "",
    desiredDistrict: "",
    avatarUrl: ""
  });

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
          setProfileData({
            salaryLevel: userData.salaryLevel,
            grade: userData.grade,
            currentProvince: userData.currentProvince,
            currentDistrict: userData.currentDistrict,
            desiredProvince: userData.desiredProvince,
            desiredDistrict: userData.desiredDistrict,
            avatarUrl: ""
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Calculate compatibility percentage
  const calculateCompatibility = (user: SearchUser): number => {
    if (!currentUser) return 0;
    
    let score = 0;
    
    // Perfect match: their desired = my current AND my desired = their current
    if (user.desiredProvince === currentUser.currentProvince && 
        user.desiredDistrict === currentUser.currentDistrict &&
        currentUser.desiredProvince === user.currentProvince &&
        currentUser.desiredDistrict === user.currentDistrict) {
      score += 50;
    }
    
    // Same sector
    if (user.sector === currentUser.sector) {
      score += 20;
    }
    
    // Same salary level
    if (user.salaryLevel === currentUser.salaryLevel) {
      score += 15;
    }
    
    // Same grade
    if (user.grade === currentUser.grade) {
      score += 15;
    }
    
    return Math.min(100, score);
  };

  // Load search results
  useEffect(() => {
    const loadSearchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const params = new URLSearchParams();
        if (searchFilters.sector !== "all-sectors") {
          params.append('sector', searchFilters.sector);
        }
        if (searchFilters.currentProvince !== "all-provinces") {
          params.append('currentProvince', searchFilters.currentProvince);
        }
        if (searchFilters.desiredProvince !== "all-provinces") {
          params.append('desiredProvince', searchFilters.desiredProvince);
        }

        const response = await fetch(`/api/users/search?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const users = await response.json();
          setSearchUsers(users);
        }
      } catch (error) {
        console.error('Error loading search users:', error);
      }
    };

    if (currentUser) {
      loadSearchUsers();
    }
  }, [searchFilters, currentUser]);

  const handleWhatsAppContact = (userId: string) => {
    console.log("WhatsApp contact initiated for user:", userId);
    // todo: remove mock functionality - implement actual WhatsApp contact
  };

  const handleReportUser = (userId: string) => {
    console.log("Report user:", userId);
    // todo: remove mock functionality - implement user reporting
  };

  const handleRateUser = async (userId: string, rating: number, reason: string, comment: string) => {
    console.log("Rate user:", userId, rating, reason, comment);
    try {
      const token = localStorage.getItem('token');
      const resp = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ ratedUserId: userId, rating, comment, reason })
      });

      if (!resp.ok) {
        console.error('Failed to persist rating', await resp.text());
        return;
      }

      const data = await resp.json();
      if (data && typeof data.rating === 'number' && typeof data.reviewCount === 'number') {
        setSearchUsers(prev => prev.map(u => u.id === userId ? { ...u, rating: data.rating, reviewCount: data.reviewCount } : u));
      } else {
        // fallback: optimistic update
        setSearchUsers(prev => prev.map(u => {
          if (u.id !== userId) return u;
          const prevRating = u.rating || 0;
          const prevCount = u.reviewCount || 0;
          const total = prevRating * prevCount + rating;
          const newCount = prevCount + 1;
          const newAvg = total / newCount;
          return { ...u, rating: parseFloat(newAvg.toFixed(2)), reviewCount: newCount };
        }));
      }

    } catch (error) {
      console.error('Error saving rating:', error);
    }
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
    // For now, allow editing (would need to implement last update tracking)
    return true;
  };

  const canEditCurrentLocation = () => {
    // For now, allow editing (would need to implement tracking)
    return true;
  };

  const canEditDesiredLocation = () => {
    // For now, allow editing (would need to implement tracking)
    return true;
  };

  const canContactToday = currentUser ? (currentUser.whatsappContactsToday < (currentUser.isPremium ? 10 : 2)) : false;

  const getCurrentDistricts = (province: string) => {
    return province ? mozambiqueData[province as keyof typeof mozambiqueData] || [] : [];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">PermutAKI</h1>
            <p className="text-sm text-muted-foreground">Painel do Usuário</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-foreground">
                {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Carregando..."}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant={currentUser?.isPremium ? "default" : "secondary"}>
                  {currentUser?.isPremium ? "Premium" : "Gratuito"}
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search" data-testid="tab-search">
              <Search className="h-4 w-4 mr-2" />
              Pesquisar Parceiros
            </TabsTrigger>
            <TabsTrigger value="profile" data-testid="tab-profile">
              <User className="h-4 w-4 mr-2" />
              Meu Perfil
            </TabsTrigger>
            <TabsTrigger value="support" data-testid="tab-support">
              <HelpCircle className="h-4 w-4 mr-2" />
              Suporte & Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {/* Contact Limit Warning */}
            <Card className="p-4 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-orange-600" />
                <p className="text-sm">
                  Contactos WhatsApp hoje: <strong>{currentUser?.whatsappContactsToday || 0}/{currentUser?.isPremium ? 10 : 2}</strong>
                  {currentUser && (currentUser.whatsappContactsToday >= (currentUser.isPremium ? 10 : 2)) && (
                    <span className="text-orange-600 ml-2">
                      Limite diário atingido. Tente novamente amanhã.
                    </span>
                  )}
                </p>
              </div>
            </Card>

            {/* Hidden Search Filters (functionality preserved) */}

            {/* Search Results */}
            <div>
              {/* Compatible Profiles */}
              <h3 className="text-lg font-semibold mb-4">Perfis Compatíveis</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {searchUsers.length > 0 && currentUser ? (
                  (() => {
                    const compatible = searchUsers.filter(u => calculateCompatibility(u) >= 80);
                    if (compatible.length === 0) return (
                      <p className="text-muted-foreground col-span-1">Nenhum perfil compatível encontrado.</p>
                    );
                    return compatible.map(user => (
                      <UserCard
                        key={user.id}
                        id={user.id}
                        name={`${user.firstName} ${user.lastName}`}
                        sector={user.sector}
                        salaryLevel={user.salaryLevel}
                        grade={user.grade}
                        currentLocation={`${user.currentProvince}, ${user.currentDistrict}`}
                        desiredLocation={`${user.desiredProvince}, ${user.desiredDistrict}`}
                        rating={user.rating || 0}
                        reviewCount={user.reviewCount || 0}
                        isPriorityMatch={true}
                        compatibility={calculateCompatibility(user)}
                        whatsappNumber={user.phone}
                        canContact={canContactToday}
                        onWhatsAppContact={handleWhatsAppContact}
                        onReport={handleReportUser}
                        onRate={handleRateUser}
                      />
                    ));
                  })()
                ) : (
                  // show skeleton placeholders while loading
                  <>
                    <div className="col-span-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="w-full">
                                      <CardSkeleton />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Other Profiles (same sector & level) */}
              <h3 className="text-lg font-semibold mt-8 mb-4">Outros Perfis</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {searchUsers.length > 0 && currentUser ? (
                  (() => {
                    const compatible = searchUsers.filter(u => calculateCompatibility(u) >= 80).map(u => u.id);
                    const others = searchUsers.filter(u => u.sector === currentUser.sector && u.salaryLevel === currentUser.salaryLevel && !compatible.includes(u.id));
                    if (others.length === 0) return (
                      <p className="text-muted-foreground col-span-1">Nenhum outro perfil encontrado.</p>
                    );
                    return others.map(user => (
                      <UserCard
                        key={user.id}
                        id={user.id}
                        name={`${user.firstName} ${user.lastName}`}
                        sector={user.sector}
                        salaryLevel={user.salaryLevel}
                        grade={user.grade}
                        currentLocation={`${user.currentProvince}, ${user.currentDistrict}`}
                        desiredLocation={`${user.desiredProvince}, ${user.desiredDistrict}`}
                        rating={user.rating || 0}
                        reviewCount={user.reviewCount || 0}
                        isPriorityMatch={false}
                        whatsappNumber={user.phone}
                        canContact={canContactToday}
                        onWhatsAppContact={handleWhatsAppContact}
                        onReport={handleReportUser}
                        onRate={handleRateUser}
                      />
                    ));
                  })()
                ) : (
                  <>
                    <div className="col-span-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="w-full">
                            <CardSkeleton />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Photo Section */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Fotografia do Perfil</h3>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData.avatarUrl} alt={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : ""} />
                  <AvatarFallback className="text-lg">
                    {currentUser ? `${currentUser.firstName[0]}${currentUser.lastName[0]}` : ""}
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
              
              <div className="space-y-6">
                {/* Linha 1: Nome e Apelido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Nome
                    </label>
                    <Input 
                      value={currentUser?.firstName || ""} 
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Não editável após registo
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Apelido
                    </label>
                    <Input 
                      value={currentUser?.lastName || ""} 
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Não editável após registo
                    </p>
                  </div>
                </div>

                {/* Linha 2: Sector, Nível Salarial e Grau */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Sector
                    </label>
                    <Input 
                      value={currentUser?.sector || ""} 
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Não editável após registo
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Nível Salarial
                    </label>
                    <Select 
                      value={profileData.salaryLevel.toString()} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, salaryLevel: parseInt(value) }))}
                      disabled={!canEditSalaryLevel()}
                    >
                      <SelectTrigger data-testid="select-profile-salary-level">
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 21 }, (_, i) => i + 1).map((level) => (
                          <SelectItem key={level} value={level.toString()}>
                            Nível {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Escalão
                    </label>
                    <Select 
                      value={profileData.grade} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, grade: value }))}
                      disabled={!canEditSalaryLevel()}
                    >
                      <SelectTrigger data-testid="select-profile-grade">
                        <SelectValue placeholder="Selecione o Escalão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Escalão A</SelectItem>
                        <SelectItem value="B">Escalão B</SelectItem>
                        <SelectItem value="C">Escalão C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Linha 3: Província e Distrito Actual */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Província Actual
                    </label>
                    <Select 
                      value={profileData.currentProvince} 
                      onValueChange={(value) => {
                        setProfileData(prev => ({ 
                          ...prev, 
                          currentProvince: value,
                          currentDistrict: ""
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
                      Distrito Actual
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
                  </div>
                </div>

                {/* Linha 4: Província e Distrito Pretendido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Província Pretendida {currentUser?.isPremium ? "(editável uma vez por dia)" : "(editável uma vez por mês)"}
                    </label>
                    <Select 
                      value={profileData.desiredProvince} 
                      onValueChange={(value) => {
                        setProfileData(prev => ({ 
                          ...prev, 
                          desiredProvince: value,
                          desiredDistrict: ""
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
                      Distrito Pretendido {currentUser?.isPremium ? "(editável uma vez por dia)" : "(editável uma vez por mês)"}
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
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      
                      // Update salary level
                      const salaryResponse = await fetch('/api/user/salary', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          salaryLevel: profileData.salaryLevel,
                          grade: profileData.grade,
                        }),
                      });

                      // Update current location
                      const currentLocationResponse = await fetch('/api/user/location', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          type: 'current',
                          province: profileData.currentProvince,
                          district: profileData.currentDistrict,
                        }),
                      });

                      // Update desired location
                      const desiredLocationResponse = await fetch('/api/user/location', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          type: 'desired',
                          province: profileData.desiredProvince,
                          district: profileData.desiredDistrict,
                        }),
                      });

                      if (salaryResponse.ok && currentLocationResponse.ok && desiredLocationResponse.ok) {
                        alert('Perfil atualizado com sucesso!');
                        // Reload user data
                        const response = await fetch('/api/user/profile', {
                          headers: {
                            'Authorization': `Bearer ${token}`,
                          },
                        });
                        if (response.ok) {
                          const userData = await response.json();
                          setCurrentUser(userData);
                        }
                      } else {
                        const error = await salaryResponse.json();
                        alert(error.message || 'Erro ao atualizar perfil');
                      }
                    } catch (error) {
                      alert('Erro de conexão');
                    }
                  }}
                  data-testid="button-save-profile"
                >
                  Guardar Alterações
                </Button>
              </div>
            </Card>

            {/* Password Change Section */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Segurança da Conta</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Mantenha sua conta segura alterando sua senha regularmente.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowChangePasswordModal(true)}
                    data-testid="button-change-password"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Alterar Senha
                  </Button>
                </div>
              </div>
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
                <p className="font-semibold">{currentUser?.whatsappContactsToday || 0}/{currentUser?.isPremium ? 10 : 2}</p>
              </Card>
              
              <Card className="p-4 text-center">
                <Shield className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                <p className="text-sm text-muted-foreground">Tipo de conta</p>
                <p className="font-semibold">{currentUser?.isPremium ? "Premium" : "Gratuito"}</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            {/* Support Links */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Links de Apoio</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg hover-elevate cursor-pointer">
                  <HelpCircle className="h-8 w-8 mx-auto text-primary mb-2" />
                  <h4 className="font-medium mb-2">Centro de Ajuda</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Perguntas frequentes e guias de uso
                  </p>
                  <Button variant="outline" size="sm" data-testid="button-help-center">
                    Aceder
                  </Button>
                </div>
                
                <div className="text-center p-4 border rounded-lg hover-elevate cursor-pointer">
                  <Shield className="h-8 w-8 mx-auto text-primary mb-2" />
                  <h4 className="font-medium mb-2">Termos de Uso</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Condições de utilização da plataforma
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setLocation('/terms')} data-testid="button-terms">
                    Ver Termos
                  </Button>
                </div>
                
                <div className="text-center p-4 border rounded-lg hover-elevate cursor-pointer">
                  <Eye className="h-8 w-8 mx-auto text-primary mb-2" />
                  <h4 className="font-medium mb-2">Política de Privacidade</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Como protegemos os seus dados
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setLocation('/privacy')} data-testid="button-privacy">
                    Ver Política
                  </Button>
                </div>
              </div>
            </Card>

            {/* Feedback Form */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Enviar Feedback</h3>
              <p className="text-sm text-muted-foreground mb-6">
                A sua opinião é importante para nós. Partilhe testemunhos, sugestões, críticas ou propostas de parcerias.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback-type">Tipo de Feedback</Label>
                  <Select 
                    value={feedbackForm.type} 
                    onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger data-testid="select-feedback-type">
                      <SelectValue placeholder="Seleccione o tipo de feedback" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="testimony">Testemunho</SelectItem>
                      <SelectItem value="suggestion">Sugestão</SelectItem>
                      <SelectItem value="criticism">Crítica Construtiva</SelectItem>
                      <SelectItem value="partnership">Proposta de Parceria</SelectItem>
                      <SelectItem value="bug">Reportar Problema</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="feedback-name">Nome (opcional)</Label>
                    <Input
                      id="feedback-name"
                      value={feedbackForm.name}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="O seu nome"
                      data-testid="input-feedback-name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="feedback-email">Email (opcional)</Label>
                    <Input
                      id="feedback-email"
                      type="email"
                      value={feedbackForm.email}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="exemplo@email.com"
                      data-testid="input-feedback-email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback-subject">Assunto</Label>
                  <Input
                    id="feedback-subject"
                    value={feedbackForm.subject}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Resumo do seu feedback"
                    data-testid="input-feedback-subject"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback-message">Mensagem</Label>
                  <Textarea
                    id="feedback-message"
                    value={feedbackForm.message}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Descreva o seu feedback em detalhe..."
                    rows={6}
                    data-testid="textarea-feedback-message"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setFeedbackForm({ type: "", subject: "", message: "", email: "", name: "" })}
                    data-testid="button-clear-feedback"
                  >
                    Limpar
                  </Button>
                  <Button 
                    onClick={async () => {
                      setIsSubmittingFeedback(true);
                      try {
                        const token = localStorage.getItem('token');
                        const response = await fetch('/api/feedback', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                          },
                          body: JSON.stringify(feedbackForm),
                        });
                        
                        if (response.ok) {
                          alert("Obrigado pelo seu feedback! A sua mensagem foi enviada com sucesso.");
                          setFeedbackForm({ type: "", subject: "", message: "", email: "", name: "" });
                        } else {
                          alert("Erro ao enviar feedback. Tente novamente.");
                        }
                      } catch (error) {
                        alert("Erro de conexão. Tente novamente.");
                      }
                      setIsSubmittingFeedback(false);
                    }}
                    disabled={!feedbackForm.type || !feedbackForm.message || isSubmittingFeedback}
                    data-testid="button-submit-feedback"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmittingFeedback ? "Enviando..." : "Enviar Feedback"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6 bg-muted/30">
              <h3 className="text-lg font-semibold mb-4">Contactos Directos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Pode também contactar-nos directamente através dos seguintes meios:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <span>WhatsApp: +258 84/86 56 91 442</span>
                </div>
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-primary" />
                  <span>Email: mardino.vilanculo@outlook.com</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <ChangePasswordModal 
        isOpen={showChangePasswordModal} 
        onClose={() => setShowChangePasswordModal(false)} 
      />
    </div>
  );
}