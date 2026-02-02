import { SearchBar } from "@/app/components/customer/SearchBar";
import { RestaurantCard } from "@/app/components/customer/RestaurantCard";
import { useState, useEffect } from "react";
import { Card } from "@/app/components/ui/card";
import { Bot, MapPin, RefreshCw, AlertCircle } from "lucide-react";
import api from "../../services/api"; 
// 👇 1. Import useNavigate từ react-router-dom
import { useNavigate } from "react-router-dom"; 

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  distance: string;
  priceRange: string;
  cuisine: string;
  address: string;
  phone?: string;
  description?: string;
  status?: string;
}

// 👇 2. Bỏ interface Props phức tạp, không cần bắt buộc truyền onRestaurantClick nữa
export function HomeScreen() {
  const navigate = useNavigate(); // Khởi tạo hook điều hướng
  
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await api.get("/restaurants"); 
      const mappedData: Restaurant[] = response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        image: item.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
        rating: item.rating ? parseFloat(item.rating) : 4.5,
        address: item.address || "Đang cập nhật địa chỉ",
        reviews: item.reviews ?? 100, 
        distance: item.distance || "Gần đây",
        priceRange: item.priceRange || "$$",
        cuisine: item.cuisine || "Ẩm thực",
        description: item.description || "Món ngon",
        status: item.status || "Open"
      }));
      setRestaurants(mappedData);
    } catch (err) {
      setError("Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // 👇 3. Hàm xử lý Click: Chuyển trang và GỬI KÈM DATA nhà hàng
  const handleRestaurantClick = (restaurant: Restaurant) => {
    console.log("Navigating to:", restaurant.name);
    // Chuyển sang đường dẫn /restaurant/ID và gửi kèm state (dữ liệu nhà hàng)
    // để trang chi tiết không cần gọi API lại lần nữa (tùy chọn)
    navigate(`/customer/restaurant/${restaurant.id}`, { state: { restaurant } });
  };

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topRestaurant = restaurants.length > 0 
    ? restaurants.reduce((prev, current) => (prev.rating > current.rating) ? prev : current)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm pt-2 pb-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* ... (Phần Loading và Error giữ nguyên như cũ) ... */}
        
        {!loading && !error && (
          <>
             {/* Banner Gợi ý */}
            {topRestaurant && !searchQuery && (
              <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-5 shadow-xl relative rounded-2xl overflow-hidden">
                 {/* ...Code UI Banner giữ nguyên... */}
                 <div className="relative z-10 flex items-start gap-4">
                    <div className="flex-1">
                        <h4 className="font-bold text-lg">{topRestaurant.name}</h4>
                        <button 
                          // 👇 Gọi hàm handleRestaurantClick
                          onClick={() => handleRestaurantClick(topRestaurant)}
                          className="mt-2 px-4 py-1.5 bg-white text-indigo-700 rounded-full text-xs font-bold"
                        >
                          Xem ngay
                        </button>
                    </div>
                 </div>
              </Card>
            )}

            {/* Danh sách nhà hàng */}
            <div className="space-y-5">
               <h2 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                <MapPin size={20} className="text-red-500"/> Nhà hàng quanh bạn
              </h2>
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  // 👇 Gọi hàm handleRestaurantClick
                  onClick={() => handleRestaurantClick(restaurant)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}