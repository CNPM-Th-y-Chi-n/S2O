import { useEffect, useState } from "react";
import { MapPin, ChevronRight } from "lucide-react";

interface TopBarProps {
  location?: string;
  onLocationClick?: () => void;
  onProfileClick?: () => void;
  // Các props cũ (avatarUrl, userName) có thể giữ lại làm fallback nếu muốn
  avatarUrl?: string; 
  userName?: string;
}

export default function TopBar({
  location = "TP.HCM",
  avatarUrl: defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
  userName: defaultName = "Guest",
  onLocationClick,
  onProfileClick,
}: TopBarProps) {
  
  // State lưu thông tin user lấy từ LocalStorage
  const [userInfo, setUserInfo] = useState({
    name: defaultName,
    avatar: defaultAvatar
  });

  // 👇 Lấy dữ liệu user thực tế khi component load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.username) {
          setUserInfo({
            name: parsed.username,
            // Tạo avatar dựa trên username giống bên ProfileScreen
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${parsed.username}`
          });
        }
      } catch (error) {
        console.error("Lỗi đọc thông tin user trên TopBar:", error);
      }
    }
  }, []); // Chỉ chạy 1 lần khi mount

  return (
    <div className="bg-white border-b border-border sticky top-0 z-40">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Location Button */}
        <button
          onClick={onLocationClick}
          className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity"
        >
          <MapPin className="w-5 h-5 text-primary" />
          <div className="text-left">
            <div className="text-xs text-muted-foreground">Location</div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{location}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* Profile Button (Đã đồng bộ) */}
        <button
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary hover:opacity-80 transition-opacity bg-gray-100"
        >
          <img 
            src={userInfo.avatar} 
            alt={userInfo.name} 
            className="w-full h-full object-cover" 
          />
        </button>
      </div>
    </div>
  );
}