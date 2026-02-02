import { MapPin, ChevronRight } from "lucide-react";

interface TopBarProps {
  location?: string;
  avatarUrl?: string;
  userName?: string;
  onLocationClick?: () => void;
  onProfileClick?: () => void;
}

export default function TopBar({
  location = "TP.HCM",
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  userName = "John",
  onLocationClick,
  onProfileClick,
}: TopBarProps) {
  return (
    <div className="bg-white border-b border-border sticky top-0 z-40">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={onLocationClick}
          className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity"
        >
          <MapPin className="w-5 h-5 text-primary" />
          <div className="text-left">
            <div className="text-xs text-muted-foreground">Location</div>
            <div className="flex items-center gap-1">
              <span className="text-sm">{location}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </button>
        <button
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary hover:opacity-80 transition-opacity"
        >
          <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
        </button>
      </div>
    </div>
  );
}
