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
import { ArrowLeft, ShieldCheck, CheckCircle } from "lucide-react";

const resetRequestSchema = z.object({
  phone: z.string().regex(/^\+258[0-9]{9}$/, "Número deve ser no formato +258XXXXXXXXX"),
  masterKey: z.string().length(6, "Chave mestra deve ter exatamente 6 caracteres"),
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
      masterKey: "",
    },
  });

  const onSubmit = async (data: ResetRequestForm) => {
    setIsLoading(true);
    try {
      const response: any = await apiRequest(
        "POST",
        "/api/auth/request-password-reset",
        data
      );

      toast({
        title: "Verificação bem-sucedida",
        description: "Agora você pode definir uma nova senha.",
      });

      setLocation(`/reset-password?token=${encodeURIComponent(response.resetToken)}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Telefone ou chave mestra incorretos",
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
            Digite o número de telefone e a chave mestra que você criou no cadastro.
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

              <FormField
                control={form.control}
                name="masterKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chave Mestra de Recuperação</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="6 caracteres" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        maxLength={6}
                        data-testid="input-master-key"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex gap-2 items-start">
                  <ShieldCheck className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    A chave mestra foi fornecida no momento do seu cadastro. Se você esqueceu, entre em contato com o suporte.
                  </p>
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