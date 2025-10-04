
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const forgotPasswordSchema = z.object({
  phone: z.string().regex(/^\+258[0-9]{9}$/, "Número deve ser no formato +258XXXXXXXXX"),
  confirmationDigits: z.string().optional(),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'confirm'>('phone');
  const [maskedPhone, setMaskedPhone] = useState("");

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      phone: "",
      confirmationDigits: "",
    },
  });

  const onSubmitPhone = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      // Mask the phone number showing only last 4 digits
      const phone = data.phone;
      const masked = phone.substring(0, phone.length - 4).replace(/\d/g, '*') + phone.substring(phone.length - 4);
      setMaskedPhone(masked);
      
      setStep('confirm');
      toast({
        title: "Confirmação necessária",
        description: "Por favor, confirme os últimos 4 dígitos do seu número.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao processar solicitação",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onConfirmAndSend = async () => {
    setIsLoading(true);
    try {
      const phone = form.getValues('phone');
      const confirmationDigits = form.getValues('confirmationDigits');
      
      // Verify the last 4 digits
      const lastFourDigits = phone.substring(phone.length - 4);
      if (confirmationDigits !== lastFourDigits) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Os dígitos de confirmação não correspondem.",
        });
        setIsLoading(false);
        return;
      }

      const response = await apiRequest("/api/auth/request-password-reset", "POST", { 
        phone,
        confirmationDigits 
      });
      
      // Generate WhatsApp link with reset token
      const resetToken = response.token;
      const resetLink = `${window.location.origin}/reset-password?phone=${encodeURIComponent(phone)}&token=${resetToken}`;
      const whatsappMessage = encodeURIComponent(
        `Olá! Aqui está o seu link de recuperação de senha do Permutaki:\n\n${resetLink}\n\nEste link é válido por 15 minutos.\n\nSe você não solicitou esta recuperação, ignore esta mensagem.`
      );
      const whatsappNumber = phone.replace('+', '');
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

      toast({
        title: "Link enviado",
        description: "O link de recuperação será enviado via WhatsApp.",
      });

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      // Redirect to reset password page after a short delay
      setTimeout(() => {
        setLocation(`/reset-password?phone=${encodeURIComponent(phone)}`);
      }, 2000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao solicitar recuperação de senha",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/login">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <CardTitle>Recuperar Senha</CardTitle>
          </div>
          <CardDescription>
            {step === 'phone' 
              ? "Digite o número de telefone associado à sua conta."
              : "Confirme os últimos 4 dígitos do seu número para receber o link de recuperação."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            {step === 'phone' ? (
              <form onSubmit={form.handleSubmit(onSubmitPhone)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Telefone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+258840000000" 
                          {...field}
                          data-testid="input-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  data-testid="button-submit"
                >
                  {isLoading ? "Processando..." : "Continuar"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Número cadastrado:</span>
                  </div>
                  <p className="text-lg font-mono">{maskedPhone}</p>
                </div>

                <FormField
                  control={form.control}
                  name="confirmationDigits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Últimos 4 dígitos do número</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0000" 
                          maxLength={4}
                          {...field}
                          data-testid="input-confirmation-digits"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground mt-2">
                        Digite os últimos 4 dígitos do número de telefone cadastrado para confirmar.
                      </p>
                    </FormItem>
                  )}
                />

                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex gap-2 items-start">
                    <MessageCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      Após a confirmação, você receberá um link de recuperação via WhatsApp no número cadastrado.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setStep('phone')}
                    className="w-full"
                    disabled={isLoading}
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="button"
                    onClick={onConfirmAndSend}
                    className="w-full" 
                    disabled={isLoading}
                    data-testid="button-confirm-and-send"
                  >
                    {isLoading ? "Enviando..." : "Enviar Link"}
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
