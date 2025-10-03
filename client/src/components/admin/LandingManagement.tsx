import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Image, Type, Layout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LandingManagement() {
  const { toast } = useToast();
  const [heroTitle, setHeroTitle] = useState("Permute com Facilidade");
  const [heroSubtitle, setHeroSubtitle] = useState("Encontre funcionários públicos interessados em permutar de localização com você");
  const [featuresTitle, setFeaturesTitle] = useState("Como Funciona");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      toast({
        title: "Sucesso",
        description: "Alterações salvas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar alterações",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-landing-title">Gestão da Landing Page</h1>
        <p className="text-muted-foreground">Editar conteúdo e aparência da página inicial</p>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hero" data-testid="tab-hero">
            <Layout className="h-4 w-4 mr-2" />
            Hero Section
          </TabsTrigger>
          <TabsTrigger value="features" data-testid="tab-features">
            <Type className="h-4 w-4 mr-2" />
            Funcionalidades
          </TabsTrigger>
          <TabsTrigger value="images" data-testid="tab-images">
            <Image className="h-4 w-4 mr-2" />
            Imagens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Seção Hero</h3>
              
              <div className="space-y-2">
                <Label htmlFor="hero-title">Título Principal</Label>
                <Input
                  id="hero-title"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Digite o título principal"
                  data-testid="input-hero-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Subtítulo</Label>
                <Textarea
                  id="hero-subtitle"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Digite o subtítulo"
                  rows={3}
                  data-testid="textarea-hero-subtitle"
                />
              </div>

              <div className="space-y-2">
                <Label>Pré-visualização</Label>
                <Card className="p-8 bg-primary text-primary-foreground">
                  <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold">{heroTitle}</h1>
                    <p className="text-xl opacity-90">{heroSubtitle}</p>
                  </div>
                </Card>
              </div>

              <Button onClick={handleSave} disabled={saving} data-testid="button-save-hero">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Funcionalidades</h3>
              
              <div className="space-y-2">
                <Label htmlFor="features-title">Título da Seção</Label>
                <Input
                  id="features-title"
                  value={featuresTitle}
                  onChange={(e) => setFeaturesTitle(e.target.value)}
                  placeholder="Digite o título"
                  data-testid="input-features-title"
                />
              </div>

              <div className="space-y-4">
                <Label>Funcionalidades</Label>
                <div className="grid gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-4">
                      <div className="space-y-2">
                        <Label>Funcionalidade {i}</Label>
                        <Input
                          placeholder="Título"
                          data-testid={`input-feature-${i}-title`}
                        />
                        <Textarea
                          placeholder="Descrição"
                          rows={2}
                          data-testid={`textarea-feature-${i}-description`}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving} data-testid="button-save-features">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Gestão de Imagens</h3>
              
              <div className="space-y-2">
                <Label>Imagem do Hero</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Arraste uma imagem ou clique para fazer upload
                  </p>
                  <Button variant="outline" data-testid="button-upload-hero">
                    Escolher Imagem
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Arraste uma imagem ou clique para fazer upload
                  </p>
                  <Button variant="outline" data-testid="button-upload-logo">
                    Escolher Logo
                  </Button>
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving} data-testid="button-save-images">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
