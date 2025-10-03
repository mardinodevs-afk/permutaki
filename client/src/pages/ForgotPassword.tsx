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
import { ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
  phone: z.string().regex(/^\+258[0-9]{9}$/, "Número deve ser no formato +258XXXXXXXXX"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("/api/auth/request-password-reset", "POST", data);
      
      toast({
        title: "Código enviado",
        description: "Um código de verificação foi enviado para o seu telefone.",
      });

      setLocation(`/reset-password?phone=${encodeURIComponent(data.phone)}`);
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
            Digite o número de telefone associado à sua conta para receber um código de verificação.
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
                {isLoading ? "Enviando..." : "Enviar Código"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
