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
import { ArrowLeft, CheckCircle } from "lucide-react";

const resetRequestSchema = z.object({
  phone: z.string().regex(/^\+258[0-9]{9}$/, "Número deve ser no formato +258XXXXXXXXX"),
});

type ResetRequestForm = z.infer<typeof resetRequestSchema>;

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetRequestForm>({
    resolver: zodResolver(resetRequestSchema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = async (data: ResetRequestForm) => {
    setIsLoading(true);
    try {
      await apiRequest(
        "POST",
        "/api/auth/request-password-reset",
        data
      );

      toast({
        title: "Solicitação enviada",
        description: "O administrador receberá sua solicitação e enviará um link de recuperação via WhatsApp.",
      });

      setLocation("/login");
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
            Digite seu número de telefone cadastrado. O administrador receberá sua solicitação e enviará um link de recuperação via WhatsApp.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Telefone (WhatsApp)</FormLabel>
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

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex gap-2 items-start">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-900 dark:text-blue-100 space-y-1">
                    <p className="font-medium">Como funciona a recuperação de senha:</p>
                    <ol className="list-decimal list-inside space-y-0.5 ml-1">
                      <li>Você solicita a recuperação</li>
                      <li>O administrador recebe a notificação</li>
                      <li>O administrador gera um link temporário (válido por 1 hora)</li>
                      <li>Você recebe o link via WhatsApp</li>
                      <li>Você define uma nova senha</li>
                    </ol>
                    <p className="text-muted-foreground mt-2">* Somente 1 solicitação por dia é permitida.</p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                data-testid="button-submit"
              >
                {isLoading ? "Verificando..." : "Continuar"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}