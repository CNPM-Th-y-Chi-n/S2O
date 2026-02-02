import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/app/components/ui/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const getVariantClasses = () => {
    switch (variant || status.toLowerCase()) {
      case "success":
      case "completed":
      case "active":
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "warning":
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "danger":
      case "cancelled":
      case "suspended":
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      case "info":
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium", getVariantClasses())}
    >
      {status}
    </Badge>
  );
}
