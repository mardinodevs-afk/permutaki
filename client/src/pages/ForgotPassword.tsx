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

const phoneSchema = z.object({
  phone: z.string().regex(/^\+258[0-9]{9}$/, "Número deve ser no formato +258XXXXXXXXX"),
});

const verificationSchema = z.object({
  answer1: z.string().min(1, "Este campo é obrigatório"),
  answer2: z.string().min(1, "Este campo é obrigatório"),
});

type PhoneForm = z.infer<typeof phoneSchema>;
type VerificationForm = z.infer<typeof verificationSchema>;

interface VerificationQuestion {
  field: string;
  question: string;
  type: 'text' | 'select';
  options?: string[];
}

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [questions, setQuestions] = useState<VerificationQuestion[]>([]);
  const [phone, setPhone] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  const phoneForm = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const verificationForm = useForm<VerificationForm>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      answer1: "",
      answer2: "",
    },
  });

  const onSubmitPhone = async (data: PhoneForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest<{ questions: VerificationQuestion[] }>(
        "POST",
        "/api/auth/get-verification-questions",
        { phone: data.phone }
      );
      
      setPhone(data.phone);
      setQuestions(response.questions);
      setStep('verify');
      
      toast({
        title: "Verificação necessária",
        description: "Por favor, confirme duas informações do seu cadastro.",
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

  const onSubmitVerification = async (data: VerificationForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest<{ token: string }>(
        "POST",
        "/api/auth/verify-and-reset",
        {
          phone,
          answers: {
            [questions[0].field]: data.answer1,
            [questions[1].field]: data.answer2,
          },
        }
      );

      toast({
        title: "Verificação bem-sucedida",
        description: "Agora você pode definir uma nova senha.",
      });

      setLocation(`/reset-password?phone=${encodeURIComponent(phone)}&token=${response.token}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Informações incorretas",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitRequestReset = async (data: PhoneForm) => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/request-password-reset", { 
        phone: data.phone 
      });

      setRequestSent(true);

      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação foi enviada ao administrador. Você receberá um link de recuperação em breve.",
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
            {step === 'phone' && !requestSent
              ? "Digite o número de telefone associado à sua conta."
              : requestSent
              ? "Sua solicitação foi enviada com sucesso!"
              : "Confirme duas informações do seu cadastro para verificar sua identidade."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'phone' && !requestSent ? (
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onSubmitPhone)} className="space-y-4">
                <FormField
                  control={phoneForm.control}
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
            </Form>
          ) : step === 'verify' ? (
            <Form {...verificationForm}>
              <form onSubmit={verificationForm.handleSubmit(onSubmitVerification)} className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <div className="flex gap-2 items-start">
                    <ShieldCheck className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      Para sua segurança, confirme as seguintes informações do seu cadastro:
                    </p>
                  </div>
                </div>

                <FormField
                  control={verificationForm.control}
                  name="answer1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{questions[0]?.question}</FormLabel>
                      <FormControl>
                        {questions[0]?.type === 'select' ? (
                          <select 
                            {...field}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            data-testid="input-answer1"
                          >
                            <option value="">Selecione...</option>
                            {questions[0]?.options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <Input 
                            placeholder="Digite sua resposta" 
                            {...field}
                            data-testid="input-answer1"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={verificationForm.control}
                  name="answer2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{questions[1]?.question}</FormLabel>
                      <FormControl>
                        {questions[1]?.type === 'select' ? (
                          <select 
                            {...field}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            data-testid="input-answer2"
                          >
                            <option value="">Selecione...</option>
                            {questions[1]?.options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <Input 
                            placeholder="Digite sua resposta" 
                            {...field}
                            data-testid="input-answer2"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStep('phone');
                      verificationForm.reset();
                    }}
                    className="w-full"
                    disabled={isLoading}
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="submit"
                    className="w-full" 
                    disabled={isLoading}
                    data-testid="button-verify"
                  >
                    {isLoading ? "Verificando..." : "Verificar"}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
             <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onSubmitRequestReset)} className="space-y-4">
                <FormField
                  control={phoneForm.control}
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
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    Após enviar a solicitação, o administrador irá gerar um link de recuperação e enviar para você.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  data-testid="button-submit"
                >
                  {isLoading ? "Enviando..." : "Enviar Solicitação"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}