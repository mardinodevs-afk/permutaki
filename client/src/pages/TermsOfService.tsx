import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function TermsOfService() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="mb-4"
            data-testid="button-back-home"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Termos de Uso</h1>
          <p className="text-muted-foreground mt-2">
            Última actualização: 27 de Setembro de 2025
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Aceitação dos Termos</h2>
            <p className="text-muted-foreground">
              Ao utilizar a plataforma Permutaki, concorda automaticamente com estes termos de uso. 
              Se não concordar com qualquer parte destes termos, não deve utilizar a plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Descrição do Serviço</h2>
            <p className="text-muted-foreground mb-3">
              O Permutaki é uma plataforma gratuita que facilita a permuta entre funcionários públicos 
              moçambicanos. A plataforma permite:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Registo de perfis profissionais para permuta</li>
              <li>Pesquisa de parceiros de permuta por localização e sector</li>
              <li>Contacto directo entre utilizadores interessados em permuta</li>
              <li>Sistema de avaliação e feedback entre utilizadores</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Responsabilidades do Utilizador</h2>
            <div className="text-muted-foreground space-y-3">
              <p><strong>3.1.</strong> Fornecer informações verdadeiras e actualizadas no seu perfil.</p>
              <p><strong>3.2.</strong> Manter a confidencialidade das suas credenciais de acesso.</p>
              <p><strong>3.3.</strong> Utilizar a plataforma de forma respeitosa e profissional.</p>
              <p><strong>3.4.</strong> Não utilizar a plataforma para fins fraudulentos ou ilegais.</p>
              <p><strong>3.5.</strong> Respeitar a privacidade e dados pessoais de outros utilizadores.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Política Anti-Fraude</h2>
            <div className="text-muted-foreground space-y-3">
              <p>
                <strong>IMPORTANTE:</strong> A permuta é um processo GRATUITO. Nunca pague nem solicite 
                pagamentos para efectuar uma permuta através desta plataforma.
              </p>
              <p>
                Qualquer utilizador que solicite pagamentos será imediatamente banido da plataforma 
                e reportado às autoridades competentes.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Limitação de Responsabilidade</h2>
            <div className="text-muted-foreground space-y-3">
              <p><strong>5.1.</strong> O Permutaki é apenas uma plataforma de facilitação de contactos.</p>
              <p><strong>5.2.</strong> Não somos responsáveis pela veracidade das informações fornecidas pelos utilizadores.</p>
              <p><strong>5.3.</strong> Não garantimos o sucesso de qualquer processo de permuta.</p>
              <p><strong>5.4.</strong> Os processos oficiais de permuta devem ser tratados com as entidades competentes.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Propriedade Intelectual</h2>
            <p className="text-muted-foreground">
              Todo o conteúdo da plataforma Permutaki, incluindo design, logótipo e funcionalidades, 
              é propriedade exclusiva dos criadores da plataforma e está protegido por direitos autorais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Modificações dos Termos</h2>
            <p className="text-muted-foreground">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. 
              As alterações serão comunicadas através da plataforma e entrarão em vigor imediatamente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Contacto</h2>
            <div className="text-muted-foreground space-y-2">
              <p>Para questões relacionadas com estes termos, contacte-nos:</p>
              <p><strong>Email:</strong> mardino.vilanculo@outlook.com</p>
              <p><strong>Telefone/WhatsApp:</strong> +258 84/86 56 91 442</p>
            </div>
          </section>

          <section className="border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Ao continuar a utilizar a plataforma Permutaki, confirma que leu, compreendeu e 
              aceita estes termos de uso na sua totalidade.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}