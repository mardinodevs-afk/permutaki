import { Phone, Mail, Facebook } from "lucide-react";
import { useLocation } from "wouter";

export default function Footer() {
  const [, setLocation] = useLocation();

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Permutaki Logo" className="w-10 h-10" />
              <h3 className="text-2xl font-bold text-primary">PermutAKI</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Facilitando a sua transferência por permuta de forma gratuita e segura.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Importante:</strong> Este sistema não pertence ao Estado - é uma iniciativa pessoal que necessita de apoio.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contactos de Suporte</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-foreground">Telefone / WhatsApp</p>
                  <a 
                    href="tel:+258845691442" 
                    className="text-muted-foreground hover:text-primary"
                    data-testid="link-phone"
                  >
                    +258 84/86 56 91 442
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-foreground">E-mail</p>
                  <a 
                    href="mailto:mardino.vilanculo@outlook.com" 
                    className="text-muted-foreground hover:text-primary"
                    data-testid="link-email"
                  >
                    mardino.vilanculo@outlook.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Facebook className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-foreground">Facebook</p>
                  <a 
                    href="https://facebook.com/permutAKI" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                    data-testid="link-facebook"
                  >
                    facebook.com/permutAKI
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Links Importantes</h4>
            <div className="space-y-2">
              <button 
                onClick={() => alert('Página em construção. Para mais informações, contacte-nos através dos meios disponíveis.')}
                className="block text-sm text-muted-foreground hover:text-primary cursor-pointer text-left"
                data-testid="link-about"
              >
                Sobre Nós
              </button>
              <button 
                onClick={() => setLocation('/terms')}
                className="block text-sm text-muted-foreground hover:text-primary cursor-pointer text-left"
                data-testid="link-terms"
              >
                Termos de Uso
              </button>
              <button 
                onClick={() => setLocation('/privacy')}
                className="block text-sm text-muted-foreground hover:text-primary cursor-pointer text-left"
                data-testid="link-privacy"
              >
                Política de Privacidade
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 PermutAKI. Todos os direitos reservados. | Versão 1.2 (Beta 1)
          </p>
        </div>
      </div>
    </footer>
  );
}