
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function OverviewCard({ 
  title, 
  value, 
  icon: Icon, 
  className = "bg-amber-50", 
  iconClassName = "text-amber-500",
  textClassName = "text-amber-700"
}: OverviewCardProps) {
  return (
    <div className={cn("p-4 rounded-md flex items-center", className)}>
      <Icon className={cn("h-8 w-8 mr-3", iconClassName)} />
      <div>
        <div className={cn("text-sm font-medium", textClassName)}>{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}
