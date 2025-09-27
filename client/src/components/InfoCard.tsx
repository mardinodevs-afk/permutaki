import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: "primary" | "success" | "warning" | "default";
}

export default function InfoCard({ 
  icon: Icon, 
  title, 
  description, 
  color = "default" 
}: InfoCardProps) {
  const colorClasses = {
    primary: "text-primary",
    success: "text-green-600",
    warning: "text-orange-600",
    default: "text-foreground"
  };

  return (
    <Card className="p-6 text-center hover-elevate">
      <div className="flex justify-center mb-4">
        <div className={`p-3 rounded-full bg-secondary ${colorClasses[color]}`}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-foreground" data-testid={`text-title-${title}`}>
        {title}
      </h3>
      <p className="text-muted-foreground text-sm" data-testid={`text-description-${title}`}>
        {description}
      </p>
    </Card>
  );
}