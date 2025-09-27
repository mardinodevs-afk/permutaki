import UserCard from '../UserCard';
import testimonial1 from "@assets/generated_images/Female_public_servant_testimonial_e886c75d.png";

export default function UserCardExample() {
  return (
    <div className="max-w-md mx-auto p-6">
      <UserCard
        id="user123"
        name="Maria Santos"
        sector="Educação"
        salaryLevel={12}
        grade="B"
        currentLocation="Maputo, Matola"
        desiredLocation="Nampula, Nacala"
        rating={4.5}
        reviewCount={12}
        isPriorityMatch={true}
        avatarUrl={testimonial1}
        canContact={true}
        onWhatsAppContact={(id) => console.log('WhatsApp contact:', id)}
        onReport={(id) => console.log('Report user:', id)}
        onRate={(id) => console.log('Rate user:', id)}
      />
    </div>
  );
}