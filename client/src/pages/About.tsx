import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Sobre Nós</h1>
          <p className="text-muted-foreground mt-2">Quem somos e por que criámos o PermutAKI</p>
        </div>

        <Card className="p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Missão</h2>
            <p className="text-muted-foreground">
              O PermutAKI nasceu para facilitar a mobilidade entre funcionários públicos em Moçambique,
              através de uma plataforma simples, gratuita e orientada para a comunidade. Pretendemos
              ligar colegas com interesses e necessidades compatíveis para que possam coordenar processos
              de permuta de forma mais eficiente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Como Funciona</h2>
            <p className="text-muted-foreground">
              Os utilizadores criam um perfil com dados profissionais e de localização. A plataforma
              permite filtrar e encontrar perfis compatíveis, contactar via WhatsApp (com consentimento)
              e registar avaliações e denúncias para manter a confiança entre a comunidade.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Transparência e Segurança</h2>
            <p className="text-muted-foreground">
              Não partilhamos os seus dados para fins comerciais. Implementámos medidas básicas de
              segurança, mas recomendamos prudência — confirme sempre a documentação oficial junto
              das entidades competentes antes de avançar com processos administrativos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Aviso</h2>
            <p className="text-muted-foreground">
              O PermutAKI é uma iniciativa independente e não é uma plataforma governamental. A
              utilização da plataforma não substitui os procedimentos oficiais de permuta previstos
              pelas entidades empregadoras.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Como Ajudar</h2>
            <p className="text-muted-foreground">
              Pode contribuir reportando comportamentos suspeitos, partilhando a plataforma com
              colegas, ou apoiando tecnicamente o projecto. Para parcerias ou suporte técnico,
              contacte-nos através dos canais disponíveis no rodapé.
            </p>
          </section>

          <section className="border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Para mais informações, contacte: mardino.vilanculo@outlook.com
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}
