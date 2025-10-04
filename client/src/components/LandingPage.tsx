import { useState } from "react";
import Hero from "./Hero";
import TestimonialCard from "./TestimonialCard";
import InfoCard from "./InfoCard";
import Footer from "./Footer";
import LoginModal from "./LoginModal";
import RegistrationModal from "./RegistrationModal";
import ThemeToggle from "./ThemeToggle";
import { Shield, Users, MessageCircle, Award, CheckCircle, AlertTriangle } from "lucide-react";
import testimonial1 from "@assets/generated_images/Female_public_servant_testimonial_e886c75d.png";
import testimonial2 from "@assets/generated_images/Male_public_servant_testimonial_ff292ae8.png";
import testimonial3 from "@assets/generated_images/Young_female_public_servant_db0ae0fd.png";

interface LandingPageProps {
  onLogin: (phone: string, password: string) => void;
  onRegister: (data: any) => void;
}

export default function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // todo: remove mock functionality - testimonials data
  const testimonials = [
    {
      name: "Maria Santos",
      role: "Professora de Matemática",
      location: "Maputo → Nampula",
      rating: 5,
      testimonial: "Consegui a minha permuta em apenas 2 semanas! A plataforma é muito fácil de usar e encontrei exatamente o que procurava.",
      avatarUrl: testimonial1
    },
    {
      name: "João Machel",
      role: "Enfermeiro",
      location: "Beira → Pemba",
      rating: 4,
      testimonial: "Excelente serviço! Finalmente consegui me transferir para perto da minha família. Recomendo a todos.",
      avatarUrl: testimonial2
    },
    {
      name: "Ana Chimoio",
      role: "Administrativa",
      location: "Tete → Quelimane",
      rating: 5,
      testimonial: "Plataforma segura e confiável. Consegui verificar todos os detalhes antes de fazer o contacto.",
      avatarUrl: testimonial3
    }
  ];

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegistrationModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegistrationModal(false);
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-xl font-bold">Permutaki</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <Hero
        onLoginClick={() => setShowLoginModal(true)}
        onRegisterClick={() => setShowRegistrationModal(true)}
      />

      {/* Features Section */}
      <section className="py-16 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Porque escolher o Permutaki?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oferecemos a plataforma mais segura e eficiente para funcionários públicos
              encontrarem parceiros para transferência por permuta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoCard
              icon={Shield}
              title="100% Gratuito"
              description="Serviço completamente gratuito para funcionários públicos de Moçambique."
              color="success"
            />
            <InfoCard
              icon={Users}
              title="Correspondência Inteligente"
              description="Sistema que encontra parceiros compatíveis baseado no sector e localização."
              color="primary"
            />
            <InfoCard
              icon={MessageCircle}
              title="Contacto Seguro"
              description="Sistema de contactos controlado com limite diário para evitar spam."
              color="default"
            />
            <InfoCard
              icon={Award}
              title="Sistema de Avaliação"
              description="Avalie outros usuários e denuncie tentativas de burla para manter a segurança."
              color="warning"
            />
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">
              Segurança em Primeiro Lugar
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="font-semibold text-foreground">A Permuta é GRÁTIS</h4>
                  <p className="text-sm text-muted-foreground">
                    Nunca pague por transferências. Qualquer cobrança é burla.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="font-semibold text-foreground">Denuncie Burlas</h4>
                  <p className="text-sm text-muted-foreground">
                    Sistema de denúncias para reportar tentativas de fraude.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="font-semibold text-foreground">Verificação de Dados</h4>
                  <p className="text-sm text-muted-foreground">
                    Todos os perfis são verificados para garantir autenticidade.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="font-semibold text-foreground">Limite de Contactos</h4>
                  <p className="text-sm text-muted-foreground">
                    Máximo 2 contactos por dia para evitar spam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              O que dizem os nossos utilizadores
            </h2>
            <p className="text-lg text-muted-foreground">
              Histórias reais de funcionários públicos que conseguiram a sua transferência
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                {...testimonial}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para encontrar o seu parceiro de permuta?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a centenas de funcionários públicos que já conseguiram a sua transferência
          </p>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button
              onClick={() => setShowRegistrationModal(true)}
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors w-full sm:w-auto"
              data-testid="button-cta-register"
            >
              Começar Agora
            </button>
            <button
              onClick={() => setShowLoginModal(true)}
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-lg font-semibold transition-colors w-full sm:w-auto"
              data-testid="button-cta-login"
            >
              Já tenho conta
            </button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
        onLogin={onLogin}
      />

      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
        onRegister={onRegister}
      />
    </div>
  );
}