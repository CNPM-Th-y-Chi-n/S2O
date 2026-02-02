import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronRight, Receipt, Star, Heart } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

// 👇 1. Cấu hình đường dẫn API
const API_BASE_URL = "http://127.0.0.1:5000/api/users";

interface ProfileScreenProps {
  onBack?: () => void;
  onLogout?: () => void;
}

interface UserData {
  id?: number;
  username: string;
  email?: string;
  role?: string;
}

export function ProfileScreen({ onBack, onLogout }: ProfileScreenProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  
  // State lưu dữ liệu thống kê
  const [stats, setStats] = useState({ orders: 0, reviews: 0, favorites: 0 });

  // 1. Lấy dữ liệu khi component load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Gọi API lấy dữ liệu thật
        const userId = parsedUser.id || 1; 
        fetchStats(userId);

      } catch (e) {
        console.error("Lỗi đọc user data");
      }
    }
  }, []);

  const fetchStats = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/stats`);
      const data = await response.json();
      setStats(data); 
    } catch (error) {
      console.error("Không gọi được API:", error);
    }
  };

  const handleLogoutAction = () => {
    localStorage.removeItem('user');
    if (onLogout) onLogout();
    navigate('/login');
  };

  const displayProfile = {
    name: user?.username || "Guest User",
    email: user?.email || "No email provided",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Guest'}`,
    joinDate: "Member since Jan 2026",
    stats: {
      totalOrders: 0,
      reviews: 0,
      favorites: stats.favorites, 
    },
  };

  // 👇 2. CẬP NHẬT MENU ITEMS: Thêm trường 'path' để biết click vào sẽ đi đâu
 const menuItems = [
    { 
        icon: Receipt, 
        label: "Order History", 
        badge: displayProfile.stats.totalOrders,
        path: "/customer/orders" // ✅ Đúng
    },
    { 
        icon: Star, 
        label: "My Reviews", 
        badge: displayProfile.stats.reviews,
        path: "/customer/reviews" // ✅ Đúng
    },
    { 
        icon: Heart, 
        label: "Favorite Restaurants", 
        badge: displayProfile.stats.favorites,
        path: "/customer/favorites" // ✅ Đúng
    },
    { 
        icon: Settings, 
        label: "Settings & Preferences",
        path: "/customer/settings" // ✅ Đúng
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white mb-4 bg-white">
              <img
                src={displayProfile.avatar}
                alt={displayProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h2 className="text-white mb-1 font-bold text-xl">{displayProfile.name}</h2>
            <div className="text-sm text-white/80 mb-1">{displayProfile.email}</div>
            
            <div className="px-3 py-1 bg-white/20 rounded-full text-xs text-white backdrop-blur-sm mt-1">
               {user?.role || 'Customer'} Account
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <Card 
            className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/customer/orders')} // Click vào ô Orders cũng chuyển trang
          >
            <div className="text-2xl mb-1 font-bold text-blue-600">{displayProfile.stats.totalOrders}</div>
            <div className="text-xs text-muted-foreground">Orders</div>
          </Card>
          
          <Card 
            className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/customer/reviews')}
          >
            <div className="text-2xl mb-1 font-bold text-yellow-500">{displayProfile.stats.reviews}</div>
            <div className="text-xs text-muted-foreground">Reviews</div>
          </Card>
          
          <Card 
            className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate('/customer/favorites')}
          >
            <div className="text-2xl mb-1 font-bold text-red-500">{displayProfile.stats.favorites}</div>
            <div className="text-xs text-muted-foreground">Favorites</div>
          </Card>
        </div>

        {/* Menu Items */}
        <Card className="overflow-hidden border-0 shadow-md">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                // 👇 3. THÊM SỰ KIỆN CLICK Ở ĐÂY
                onClick={() => {
                    console.log("Navigating to:", item.path); // Debug
                    navigate(item.path);
                }}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b last:border-b-0 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge !== undefined && item.badge > 0 && (
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {item.badge}
                    </div>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            );
          })}
        </Card>

        {/* Account Actions */}
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start h-12" 
            onClick={() => navigate('/customer/settings')}
          >
            <Settings className="w-4 h-4 mr-3 text-gray-500" />
            Account Settings
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
            onClick={handleLogoutAction}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </Button>
        </div>

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <div>Scan2Order v1.0.0</div>
          <div className="flex justify-center gap-4 mt-2 text-xs">
            <button className="hover:text-foreground hover:underline">Privacy Policy</button>
            <span>•</span>
            <button className="hover:text-foreground hover:underline">Terms of Service</button>
          </div>
        </div>
      </div>
    </div>
  );
}