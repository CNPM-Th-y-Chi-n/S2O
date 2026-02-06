import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronRight, Receipt, Star, Heart, Crown, Zap } from "lucide-react"; // Thêm icon Crown, Zap
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

// Interface cho cấp bậc
interface RankInfo {
  currentRank: string;
  nextRank: string;
  target: number;
  progress: number;
  color: string;
}

export function ProfileScreen({ onBack, onLogout }: ProfileScreenProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  
  // 👇 CẬP NHẬT 1: Thêm 'points' vào stats (mặc định là 0)
  const [stats, setStats] = useState({ orders: 0, reviews: 0, favorites: 0, points: 0 });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
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
      
      // Nếu API chưa trả về points, ta giả lập số điểm để test giao diện
      // data.points = data.points || 340; // Uncomment dòng này để test nếu API chưa có
      
      setStats(data); 
    } catch (error) {
      console.error("Không gọi được API:", error);
      // Fallback data khi lỗi
      setStats({ orders: 12, reviews: 5, favorites: 3, points: 680 });
    }
  };

  const handleLogoutAction = () => {
    localStorage.removeItem('user');
    if (onLogout) onLogout();
    navigate('/login');
  };

  // 👇 CẬP NHẬT 2: Hàm tính toán Rank dựa trên điểm số
  const getMemberRank = (points: number): RankInfo => {
    if (points < 100) return { 
        currentRank: 'Bronze Member', nextRank: 'Silver', target: 100, 
        progress: (points / 100) * 100, color: 'text-amber-700' 
    };
    if (points < 500) return { 
        currentRank: 'Silver Member', nextRank: 'Gold', target: 500, 
        progress: ((points - 100) / 400) * 100, color: 'text-gray-400' 
    };
    if (points < 1000) return { 
        currentRank: 'Gold Member', nextRank: 'Platinum', target: 1000, 
        progress: ((points - 500) / 500) * 100, color: 'text-yellow-500' 
    };
    return { 
        currentRank: 'Platinum Member', nextRank: 'Diamond', target: 5000, 
        progress: 100, color: 'text-cyan-500' 
    };
  };

  const rankInfo = getMemberRank(stats.points || 0);

  const displayProfile = {
    name: user?.username || "Guest User",
    email: user?.email || "No email provided",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Guest'}`,
  };

  const menuItems = [
    { 
        icon: Receipt, 
        label: "Order History", 
        badge: stats.orders,
        path: "/customer/orders"
    },
    { 
        icon: Star, 
        label: "My Reviews", 
        badge: stats.reviews,
        path: "/customer/reviews"
    },
    { 
        icon: Heart, 
        label: "Favorite Restaurants", 
        badge: stats.favorites,
        path: "/customer/favorites"
    },
    { 
        icon: Settings, 
        label: "Settings & Preferences",
        path: "/customer/settings"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white pb-12">
        <div className="max-w-md mx-auto px-4 pt-8 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/50 bg-white">
              <img
                src={displayProfile.avatar}
                alt={displayProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
                <h2 className="text-white font-bold text-xl">{displayProfile.name}</h2>
                <div className="text-sm text-blue-100">{displayProfile.email}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-8 space-y-6 relative z-10">
        
        {/* 👇 CẬP NHẬT 3: CARD TÍCH ĐIỂM (LOYALTY CARD) */}
        <Card className="p-5 shadow-lg border-0 bg-white overflow-hidden relative">
            {/* Background trang trí mờ */}
            <div className="absolute -right-4 -top-4 opacity-5">
                <Crown size={100} />
            </div>

            <div className="flex justify-between items-end mb-2">
                <div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                        Current Rank
                    </div>
                    <div className={`text-xl font-bold flex items-center gap-2 ${rankInfo.color}`}>
                        <Crown className="w-5 h-5 fill-current" />
                        {rankInfo.currentRank}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{stats.points}</div>
                    <div className="text-xs text-muted-foreground">Points</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${rankInfo.progress}%` }}
                ></div>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
                <span>Currently {Math.round(rankInfo.progress)}% to next tier</span>
                {rankInfo.target < 5000 ? (
                    <span className="flex items-center gap-1 font-medium text-blue-600">
                        <Zap className="w-3 h-3" />
                        {rankInfo.target - stats.points} to {rankInfo.nextRank}
                    </span>
                ) : (
                    <span className="text-purple-600 font-bold">Max Rank Reached!</span>
                )}
            </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <Card 
            className="p-3 text-center hover:shadow-md transition-shadow cursor-pointer border-none shadow-sm"
            onClick={() => navigate('/customer/orders')}
          >
            <div className="text-xl mb-1 font-bold text-blue-600">{stats.orders}</div>
            <div className="text-xs text-gray-600 font-medium">Orders</div>
          </Card>
          
          <Card 
            className="p-3 text-center hover:shadow-md transition-shadow cursor-pointer border-none shadow-sm"
            onClick={() => navigate('/customer/reviews')}
          >
            <div className="text-xl mb-1 font-bold text-yellow-500">{stats.reviews}</div>
            <div className="text-xs text-gray-600 font-medium">Reviews</div>
          </Card>
          
          <Card 
            className="p-3 text-center hover:shadow-md transition-shadow cursor-pointer border-none shadow-sm"
            onClick={() => navigate('/customer/favorites')}
          >
            <div className="text-xl mb-1 font-bold text-red-500">{stats.favorites}</div>
            <div className="text-xs text-gray-600 font-medium">Favorites</div>
          </Card>
        </div>

        {/* Menu Items */}
        <Card className="overflow-hidden border-0 shadow-sm">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge !== undefined && item.badge > 0 && (
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
                      {item.badge}
                    </div>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </button>
            );
          })}
        </Card>

        {/* Account Actions */}
        <div className="space-y-3 pb-8">
          <Button 
            variant="outline" 
            className="w-full justify-start h-12 bg-white border-gray-200" 
            onClick={() => navigate('/customer/settings')}
          >
            <Settings className="w-4 h-4 mr-3 text-gray-500" />
            Account Settings
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 bg-white"
            onClick={handleLogoutAction}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}