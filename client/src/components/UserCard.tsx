import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, MessageCircle, AlertTriangle, Star } from "lucide-react";
import StarRating from "./StarRating";

interface UserCardProps {
  id: string;
  name: string;
  sector: string;
  salaryLevel: number;
  grade: string;
  currentLocation: string;
  desiredLocation: string;
  rating: number;
  reviewCount: number;
  isPriorityMatch: boolean;
  canContact: boolean;
  avatarUrl?: string;
  compatibility?: number;
  whatsappNumber?: string;
  onWhatsAppContact: (id: string) => void;
  onReport: (id: string) => void;
  onRate: (id: string) => void;
}

export default function UserCard({
  id,
  name,
  sector,
  salaryLevel,
  grade,
  currentLocation,
  desiredLocation,
  rating,
  reviewCount,
  isPriorityMatch = false,
  canContact,
  avatarUrl,
  compatibility = 0,
  whatsappNumber,
  onWhatsAppContact,
  onReport,
  onRate,
}: UserCardProps) {
  const handleWhatsAppClick = () => {
    if (whatsappNumber && canContact) {
      const message = encodeURIComponent(`Olá! Encontrei seu perfil no PermutAKI e gostaria de conversar sobre uma possível permuta.`);
      window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${message}`, '_blank');
      onWhatsAppContact(id);
    }
  };

  return (
    <Card className={`p-4 hover-elevate ${isPriorityMatch ? 'ring-2 ring-primary' : ''}`}>
      {isPriorityMatch && (
        <div className="mb-3">
          <Badge variant="default" className="text-xs">
            <Star className="h-3 w-3 mr-1" />
            Correspondência Prioritária
          </Badge>
        </div>
      )}

      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate" data-testid={`text-name-${id}`}>
            {name}
          </h3>

          <div className="flex items-center gap-2 mt-1 mb-2">
            <Badge variant="secondary" className="text-xs">
              {sector}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Nível {salaryLevel}{grade}
            </Badge>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-primary" />
              <span>Actual: {currentLocation}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-green-600" />
              <span>Deseja: {desiredLocation}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <StarRating rating={rating} size="sm" />
            <span className="text-xs text-muted-foreground">
              ({reviewCount} avaliações)
            </span>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleWhatsAppClick}
                disabled={!canContact || !whatsappNumber}
                data-testid="button-whatsapp-contact"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRate(id)}
                data-testid={`button-rate-${id}`}
              >
                <Star className="h-3 w-3 mr-1" />
                Avaliar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReport(id)}
                data-testid={`button-report-${id}`}
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <AlertTriangle className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}