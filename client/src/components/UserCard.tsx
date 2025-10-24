import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, AlertTriangle, Star } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import StarRating from "./StarRating";
import { WhatsAppTermsModal } from "./WhatsAppTermsModal";
import { RatingModal } from "./RatingModal";
import { ReportModal } from "./ReportModal";
import { useState } from "react";

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
  onRate: (id: string, rating: number, reason: string, comment: string) => void;
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
  whatsappNumber,
  onWhatsAppContact,
  onReport,
  onRate,
}: UserCardProps) {
  const [showWhatsAppTerms, setShowWhatsAppTerms] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [currentRating, setCurrentRating] = useState(rating);
  const [currentReviewCount, setCurrentReviewCount] = useState(reviewCount);

  const handleWhatsAppClick = () => {
    // Open the WhatsApp terms modal if a number is available.
    // We intentionally rely on the modal/accept flow to handle contact permission.
    if (whatsappNumber) {
      setShowWhatsAppTerms(true);
    }
  };

  const handleWhatsAppTermsAccept = () => {
    const message = encodeURIComponent(`Olá! Encontrei seu perfil no PermutAKI e gostaria de conversar sobre uma possível permuta.`);
    window.open(`https://wa.me/${whatsappNumber?.replace(/\D/g, '')}?text=${message}`, '_blank');
    onWhatsAppContact(id);
  };

  const { toast } = useToast();

  const handleRatingSubmit = (newRating: number, reason: string, comment: string) => {
    onRate(id, newRating, reason, comment);
    // Atualizar o estado local
    const totalRating = (currentRating * currentReviewCount + newRating);
    const newReviewCount = currentReviewCount + 1;
    const newAverageRating = totalRating / newReviewCount;
    
    setCurrentRating(newAverageRating);
    setCurrentReviewCount(newReviewCount);
    setShowRatingModal(false);
    
    toast({
      title: "Avaliação enviada",
      description: "Obrigado por contribuir com a comunidade PermutAKI!",
      duration: 5000,
    });
  };

  const handleReportSubmit = (type: string, reason: string, details: string) => {
    onReport(id);
    setShowReportModal(false);
    toast({
      title: "Denúncia enviada",
      description: "Agradecemos o seu feedback. Nossa equipe irá analisar o caso.",
      duration: 5000,
      variant: "destructive",
    });
  };

  return (
    <>
      <Card className={`relative p-3 pt-7 hover:shadow-md transition-shadow ${isPriorityMatch ? 'ring-2 ring-primary' : ''}`}>
        {/* Compatível badge (floating at top) */}
        {isPriorityMatch && (
          <div className="absolute -top-1 right-3">
            <Badge variant="default" className="text-xs bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap shadow-sm">
              <span className="mr-1">✓</span> Compatível
            </Badge>
          </div>
        )}
        <div className="flex flex-col h-full space-y-3">
          {/* User Info Section */}
          <div className="flex gap-3">
            <div className="flex flex-col gap-2">
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 min-w-0">
              {/* Name and Badge */}
              <div className="flex flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground leading-tight line-clamp-2 flex-1" style={{ minHeight: '2.5rem' }} data-testid={`text-name-${id}`}>
                    {name}
                  </h3>
                </div>

                {/* Level */}
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-xs whitespace-nowrap">
                    {sector}
                  </Badge>
                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                    {`N${salaryLevel}${grade}`}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="truncate flex-1">Actual: {currentLocation}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-green-600 flex-shrink-0" />
              <span className="truncate flex-1">Deseja: {desiredLocation}</span>
            </div>
          </div>

          {/* Rating Section (stars + numeric + review count inline) */}
          <div className="flex items-center gap-2">
            <StarRating rating={currentRating} size="sm" />
            <span className="text-sm font-medium">{currentRating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">· {currentReviewCount} {currentReviewCount === 1 ? 'avaliação' : 'avaliações'}</span>
          </div>

          {/* Action Buttons: WhatsApp icon-only, Avaliar on the same row, and Denunciar */}
          <div className="flex items-center gap-2 mt-auto pt-1">
            {isPriorityMatch && whatsappNumber && (
              <Button
                onClick={handleWhatsAppClick}
                className="bg-green-600 hover:bg-green-700 text-white flex-none p-2"
                size="sm"
                aria-label="Abrir WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4 flex-shrink-0" />
              </Button>
            )}

            {/* Avaliar button placed next to WhatsApp */}
            <Button
              onClick={() => setShowRatingModal(true)}
              className="flex-1"
              size="sm"
            >
              Avaliar
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReportModal(true)}
              className="flex-none"
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Denunciar
            </Button>
          </div>
        </div>
      </Card>

    {/* Modals */}
    <WhatsAppTermsModal
      isOpen={showWhatsAppTerms}
      onClose={() => setShowWhatsAppTerms(false)}
      onAccept={handleWhatsAppTermsAccept}
      userPhone={whatsappNumber || ""}
    />
    
    <RatingModal
      isOpen={showRatingModal}
      onClose={() => setShowRatingModal(false)}
      onSubmit={handleRatingSubmit}
      userName={name}
    />
    
    <ReportModal
      isOpen={showReportModal}
      onClose={() => setShowReportModal(false)}
      onSubmit={handleReportSubmit}
      userName={name}
    />
    </>
  );
}