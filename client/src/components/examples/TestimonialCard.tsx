import TestimonialCard from '../TestimonialCard';
import testimonial1 from "@assets/generated_images/Female_public_servant_testimonial_e886c75d.png";
import testimonial2 from "@assets/generated_images/Male_public_servant_testimonial_ff292ae8.png";
import testimonial3 from "@assets/generated_images/Young_female_public_servant_db0ae0fd.png";

export default function TestimonialCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <TestimonialCard
        name="Maria Santos"
        role="Professora de Matemática"
        location="Maputo → Nampula"
        rating={5}
        testimonial="Consegui a minha permuta em apenas 2 semanas! A plataforma é muito fácil de usar e encontrei exatamente o que procurava."
        avatarUrl={testimonial1}
      />
      
      <TestimonialCard
        name="João Machel"
        role="Enfermeiro"
        location="Beira → Pemba"
        rating={4}
        testimonial="Excelente serviço! Finalmente consegui me transferir para perto da minha família. Recomendo a todos."
        avatarUrl={testimonial2}
      />
      
      <TestimonialCard
        name="Ana Chimoio"
        role="Administrativa"
        location="Tete → Quelimane"
        rating={5}
        testimonial="Plataforma segura e confiável. Consegui verificar todos os detalhes antes de fazer o contacto."
        avatarUrl={testimonial3}
      />
    </div>
  );
}