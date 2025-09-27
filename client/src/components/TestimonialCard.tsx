import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StarRating from "./StarRating";

interface TestimonialCardProps {
  name: string;
  role: string;
  location: string;
  rating: number;
  testimonial: string;
  avatarUrl?: string;
}

export default function TestimonialCard({
  name,
  role,
  location,
  rating,
  testimonial,
  avatarUrl
}: TestimonialCardProps) {
  return (
    <Card className="p-6 hover-elevate">
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground" data-testid={`text-name-${name}`}>
            {name}
          </h3>
          <p className="text-sm text-muted-foreground" data-testid={`text-role-${name}`}>
            {role}
          </p>
          <p className="text-sm text-muted-foreground" data-testid={`text-location-${name}`}>
            {location}
          </p>
        </div>
        <StarRating rating={rating} size="sm" />
      </div>
      
      <blockquote className="text-sm text-foreground italic">
        "{testimonial}"
      </blockquote>
    </Card>
  );
}