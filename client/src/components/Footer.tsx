import { Phone, Mail, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary mb-4">Permutaki</h3>
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
              <a 
                href="#sobre" 
                className="block text-sm text-muted-foreground hover:text-primary"
                data-testid="link-about"
              >
                Sobre Nós
              </a>
              <a 
                href="#termos" 
                className="block text-sm text-muted-foreground hover:text-primary"
                data-testid="link-terms"
              >
                Termos de Uso
              </a>
              <a 
                href="#privacidade" 
                className="block text-sm text-muted-foreground hover:text-primary"
                data-testid="link-privacy"
              >
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Permutaki. Todos os direitos reservados. • 
            <span className="font-medium text-foreground ml-2">
              A Permuta é GRÁTIS - Denuncie e evite burlas
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}