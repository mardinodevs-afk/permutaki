import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Mozambican_government_building_hero_2cec9db6.png";

interface HeroProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export default function Hero({ onLoginClick, onRegisterClick }: HeroProps) {
  return (
    <section 
      className="relative min-h-[600px] flex items-center justify-center text-center px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.8), rgba(37, 99, 235, 0.6)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-6xl mx-auto px-4 text-center py-24">
        <img src="/logo.png" alt="Permutaki Logo" className="w-32 h-32 mx-auto mb-8" />
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          PermutAKI
        </h1>
        <p className="text-xl md:text-2xl mb-4 font-medium">
          Facilitando a sua transferência por permuta
        </p>
        <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Plataforma gratuita para funcionários públicos de Moçambique encontrarem parceiros compatíveis para transferência por permuta de forma segura.
        </p>

        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Button
            size="lg"
            onClick={onRegisterClick}
            data-testid="button-hero-register"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm w-full sm:w-auto"
            variant="outline"
          >
            Começar / Criar Conta
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onLoginClick}
            data-testid="button-hero-login"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm w-full sm:w-auto"
          >
            Entrar
          </Button>
        </div>

        <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 max-w-2xl mx-auto">
          <p className="text-lg font-semibold mb-2">⚠️ Importante</p>
          <p className="text-sm">
            A Permuta é <strong>GRÁTIS</strong> • Denuncie e evite burlas • 
            Este sistema não pertence ao Estado - é uma iniciativa pessoal que necessita de apoio
          </p>
        </div>
      </div>
    </section>
  );
}