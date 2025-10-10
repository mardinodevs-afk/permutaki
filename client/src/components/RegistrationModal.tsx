import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { mozambiqueData, sectors, grades, salaryLevels } from "@shared/mozambique-data";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onRegister: (data: any) => void;
}

type FormData = {
  firstName: string;
  lastName: string;
  sector: string;
  salaryLevel: string;
  grade: string;
  currentProvince: string;
  currentDistrict: string;
  desiredProvince: string;
  desiredDistrict: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
};

const steps = [
  "Dados Pessoais",
  "Dados Profissionais", 
  "Localização",
  "Contactos",
  "Segurança"
];

export default function RegistrationModal({ 
  isOpen, 
  onClose, 
  onSwitchToLogin,
  onRegister 
}: RegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    sector: "",
    salaryLevel: "",
    grade: "",
    currentProvince: "",
    currentDistrict: "",
    desiredProvince: "",
    desiredDistrict: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    setIsLoading(true);
    
    const registrationData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      sector: formData.sector,
      salaryLevel: parseInt(formData.salaryLevel),
      grade: formData.grade,
      currentProvince: formData.currentProvince,
      currentDistrict: formData.currentDistrict,
      desiredProvince: formData.desiredProvince,
      desiredDistrict: formData.desiredDistrict,
      phone: formData.phone,
      email: formData.email || "",
      password: formData.password,
    };
    
    console.log("Registration data being sent:", registrationData);
    onRegister(registrationData);
    setIsLoading(false);
  };

  const getCurrentDistricts = (province: string) => {
    return province ? mozambiqueData[province as keyof typeof mozambiqueData] || [] : [];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal Data
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome *</Label>
              <Input
                id="firstName"
                placeholder="Seu primeiro nome"
                value={formData.firstName}
                onChange={(e) => updateFormData("firstName", e.target.value)}
                data-testid="input-first-name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apelido *</Label>
              <Input
                id="lastName"
                placeholder="Seu sobrenome"
                value={formData.lastName}
                onChange={(e) => updateFormData("lastName", e.target.value)}
                data-testid="input-last-name"
                required
              />
            </div>
          </div>
        );

      case 1: // Professional Data
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sector *</Label>
              <Select 
                value={formData.sector} 
                onValueChange={(value) => updateFormData("sector", value)}
              >
                <SelectTrigger data-testid="select-sector">
                  <SelectValue placeholder="Selecione o sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Nível Salarial *</Label>
              <Select 
                value={formData.salaryLevel} 
                onValueChange={(value) => updateFormData("salaryLevel", value)}
              >
                <SelectTrigger data-testid="select-salary-level">
                  <SelectValue placeholder="Selecione o nível (1-21)" />
                </SelectTrigger>
                <SelectContent>
                  {salaryLevels.map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      Nível {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Escalão *</Label>
              <Select 
                value={formData.grade} 
                onValueChange={(value) => updateFormData("grade", value)}
              >
                <SelectTrigger data-testid="select-grade">
                  <SelectValue placeholder="Selecione o escalão" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2: // Location
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <h4 className="font-medium mb-3">Localização Actual</h4>
              
              <div className="space-y-2 mb-4">
                <Label>Província Actual *</Label>
                <Select 
                  value={formData.currentProvince} 
                  onValueChange={(value) => {
                    updateFormData("currentProvince", value);
                    updateFormData("currentDistrict", ""); // Reset district
                  }}
                >
                  <SelectTrigger data-testid="select-current-province">
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

              <div className="space-y-2">
                <Label>Distrito Actual *</Label>
                <Select 
                  value={formData.currentDistrict} 
                  onValueChange={(value) => updateFormData("currentDistrict", value)}
                  disabled={!formData.currentProvince}
                >
                  <SelectTrigger data-testid="select-current-district">
                    <SelectValue placeholder="Selecione o distrito" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCurrentDistricts(formData.currentProvince).map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Localização Pretendida</h4>
              
              <div className="space-y-2 mb-4">
                <Label>Província Pretendida *</Label>
                <Select 
                  value={formData.desiredProvince} 
                  onValueChange={(value) => {
                    updateFormData("desiredProvince", value);
                    updateFormData("desiredDistrict", ""); // Reset district
                  }}
                >
                  <SelectTrigger data-testid="select-desired-province">
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

              <div className="space-y-2">
                <Label>Distrito Pretendido *</Label>
                <Select 
                  value={formData.desiredDistrict} 
                  onValueChange={(value) => updateFormData("desiredDistrict", value)}
                  disabled={!formData.desiredProvince}
                >
                  <SelectTrigger data-testid="select-desired-district">
                    <SelectValue placeholder="Selecione o distrito" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCurrentDistricts(formData.desiredProvince).map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3: // Contacts
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone (WhatsApp) *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+25884xxxxxxxx"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
                data-testid="input-phone"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail (opcional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                data-testid="input-email"
              />
            </div>
          </div>
        );

      case 4: // Security
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  className="pr-10"
                  data-testid="input-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repita a senha"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  className="pr-10"
                  data-testid="input-confirm-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  data-testid="button-toggle-confirm-password"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => updateFormData("agreeToTerms", checked as boolean)}
                data-testid="checkbox-terms"
              />
              <Label htmlFor="agreeToTerms" className="text-sm">
                Concordo com os Termos de Uso e Política de Privacidade
              </Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Conta - {steps[currentStep]}</DialogTitle>
          <DialogDescription>
            Passo {currentStep + 1} de {steps.length}
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="w-full bg-secondary rounded-full h-2 mb-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          <div className="flex justify-between pt-6">
            {currentStep > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                data-testid="button-prev-step"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={onSwitchToLogin}
                data-testid="button-switch-login"
              >
                Já tenho conta
              </Button>
            )}

            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                data-testid="button-next-step"
              >
                Próximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || !formData.agreeToTerms}
                data-testid="button-create-account"
              >
                {isLoading ? "Criando..." : "Criar Conta"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
