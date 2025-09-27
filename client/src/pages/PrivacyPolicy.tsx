import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Shield, Lock, Eye } from "lucide-react";
import { useLocation } from "wouter";

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl font-bold text-foreground">Política de Privacidade</h1>
          <p className="text-muted-foreground mt-2">
            Última actualização: 27 de Setembro de 2025
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">Compromisso com a Privacidade</h3>
              <p className="text-sm text-muted-foreground">
                A sua privacidade é fundamental para nós. Esta política explica como protegemos os seus dados.
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Informações que Recolhemos</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Dados Pessoais
                </h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-6">
                  <li>Nome completo</li>
                  <li>Número de telefone</li>
                  <li>Endereço de email (opcional)</li>
                  <li>Informações profissionais (sector, nível salarial, grau)</li>
                  <li>Localização actual e pretendida</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Dados de Utilização
                </h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-6">
                  <li>Histórico de pesquisas na plataforma</li>
                  <li>Contactos estabelecidos com outros utilizadores</li>
                  <li>Avaliações e comentários deixados</li>
                  <li>Data e frequência de acesso à plataforma</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Como Utilizamos as Suas Informações</h2>
            <div className="text-muted-foreground space-y-3">
              <p><strong>2.1.</strong> Para facilitar o processo de permuta entre funcionários públicos.</p>
              <p><strong>2.2.</strong> Para permitir que outros utilizadores encontrem o seu perfil nas pesquisas.</p>
              <p><strong>2.3.</strong> Para melhorar a funcionalidade e segurança da plataforma.</p>
              <p><strong>2.4.</strong> Para comunicar actualizações importantes sobre o serviço.</p>
              <p><strong>2.5.</strong> Para prevenir fraudes e actividades maliciosas.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Partilha de Informações</h2>
            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg mb-4">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                <strong>Compromisso de Confidencialidade:</strong> Nunca vendemos, alugamos ou partilhamos 
                os seus dados pessoais com terceiros para fins comerciais.
              </p>
            </div>
            
            <div className="text-muted-foreground space-y-3">
              <p><strong>3.1.</strong> Partilhamos apenas as informações necessárias para facilitar contactos de permuta.</p>
              <p><strong>3.2.</strong> O seu número de telefone é partilhado apenas quando autoriza o contacto.</p>
              <p><strong>3.3.</strong> Informações podem ser partilhadas se exigido por lei ou autoridades.</p>
              <p><strong>3.4.</strong> Utilizadores administradores podem aceder a dados para fins de moderação.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Protecção de Dados</h2>
            <div className="text-muted-foreground space-y-3">
              <p><strong>4.1.</strong> Utilizamos encriptação para proteger senhas e dados sensíveis.</p>
              <p><strong>4.2.</strong> Acesso aos dados é limitado apenas ao pessoal autorizado.</p>
              <p><strong>4.3.</strong> Implementamos medidas de segurança para prevenir acessos não autorizados.</p>
              <p><strong>4.4.</strong> Realizamos backups regulares para garantir a integridade dos dados.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Os Seus Direitos</h2>
            <div className="text-muted-foreground space-y-3">
              <p><strong>5.1.</strong> <strong>Direito de Acesso:</strong> Pode solicitar uma cópia dos seus dados pessoais.</p>
              <p><strong>5.2.</strong> <strong>Direito de Rectificação:</strong> Pode corrigir informações incorrectas no seu perfil.</p>
              <p><strong>5.3.</strong> <strong>Direito de Eliminação:</strong> Pode solicitar a eliminação da sua conta e dados.</p>
              <p><strong>5.4.</strong> <strong>Direito de Portabilidade:</strong> Pode solicitar os seus dados num formato legível.</p>
              <p><strong>5.5.</strong> <strong>Direito de Oposição:</strong> Pode opor-se ao processamento dos seus dados.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Retenção de Dados</h2>
            <div className="text-muted-foreground space-y-3">
              <p>
                Mantemos os seus dados apenas pelo tempo necessário para fornecer o serviço 
                ou conforme exigido por lei.
              </p>
              <p>
                Contas inactivas por mais de 2 anos podem ser automaticamente eliminadas, 
                com notificação prévia de 30 dias.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Cookies e Tecnologias Similares</h2>
            <p className="text-muted-foreground">
              Utilizamos tecnologias essenciais para manter a sua sessão activa e melhorar 
              a experiência de utilização. Não utilizamos cookies de rastreamento para fins publicitários.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Alterações a Esta Política</h2>
            <p className="text-muted-foreground">
              Podemos actualizar esta política de privacidade periodicamente. Notificaremos sobre 
              alterações significativas através da plataforma ou email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Contacto para Questões de Privacidade</h2>
            <div className="text-muted-foreground space-y-2">
              <p>Para questões sobre privacidade ou exercer os seus direitos, contacte-nos:</p>
              <p><strong>Email:</strong> mardino.vilanculo@outlook.com</p>
              <p><strong>Telefone/WhatsApp:</strong> +258 84/86 56 91 442</p>
              <p><strong>Assunto:</strong> "Questão de Privacidade - Permutaki"</p>
            </div>
          </section>

          <section className="border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Esta política de privacidade faz parte integrante dos nossos termos de uso. 
              Ao utilizar a plataforma, confirma que leu e compreendeu esta política.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}