import InfoCard from '../InfoCard';
import { Shield, Users, MessageCircle, Award } from 'lucide-react';

export default function InfoCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <InfoCard
        icon={Shield}
        title="100% Gratuito"
        description="Serviço completamente gratuito para funcionários públicos de Moçambique."
        color="success"
      />
      
      <InfoCard
        icon={Users}
        title="Correspondência Inteligente"
        description="Sistema que encontra parceiros compatíveis baseado no sector e localização."
        color="primary"
      />
      
      <InfoCard
        icon={MessageCircle}
        title="Contacto Seguro"
        description="Sistema de contactos controlado com limite diário para evitar spam."
        color="default"
      />
      
      <InfoCard
        icon={Award}
        title="Sistema de Avaliação"
        description="Avalie outros usuários e denuncie tentativas de burla para manter a segurança."
        color="warning"
      />
    </div>
  );
}