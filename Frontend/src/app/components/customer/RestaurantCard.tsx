import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, MapPin, DollarSign, ChevronRight, Loader2 } from "lucide-react";
import { Card } from "@/app/components/ui/card";

// ==========================================
// 1. PHẦN ĐỊNH NGHĨA INTERFACE
// ==========================================
export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  distance: string;
  priceRange: string;
  cuisine: string;
  address?: string;
  phone?: string;
  description?: string;
}

// ==========================================
// 2. COMPONENT CON: RestaurantCard (Giao diện 1 thẻ)
// ==========================================
interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
}

export function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  return (
    <Card
      onClick={onClick}
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-white"
    >
      <div className="relative h-48 w-full">
        {/* Xử lý ảnh: dùng ảnh placeholder nếu link ảnh bị lỗi hoặc rỗng */}
        <img
          src={restaurant.image || "https://via.placeholder.com/300?text=No+Image"}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/300?text=Error";
          }}
        />
        {/* Badge món ăn (Cuisine) */}
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
          {restaurant.cuisine}
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-2 font-bold text-lg line-clamp-1">{restaurant.name}</h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-black">{restaurant.rating}</span>
            <span className="text-xs">({restaurant.reviews})</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>{restaurant.priceRange}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{restaurant.distance}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </Card>
  );
}

// ==========================================
// 3. COMPONENT CHA: CustomerPage (Logic gọi API & Hiển thị list)
// ==========================================
export default function CustomerPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 👉 QUAN TRỌNG: IP Tĩnh của bạn
  // Kiểm tra lại đường dẫn API trong Backend xem là /restaurants hay /restaurant (có 's' hay không)
  const API_URL = "http://192.168.1.96:5000/api/restaurants";

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        console.log("Đang gọi API:", API_URL);
        const response = await axios.get(API_URL);
        console.log("Dữ liệu nhận được:", response.data);
        setRestaurants(response.data);
      } catch (err) {
        console.error("Lỗi tải danh sách nhà hàng:", err);
        setError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleRestaurantClick = (id: string) => {
    // Logic điều hướng khi bấm vào nhà hàng (ví dụ chuyển sang trang Menu)
    console.log("Navigate to restaurant ID:", id);
    // navigate(`/menu/${id}`);
  };

  // --- Render Giao diện chính ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-gray-500">Đang tìm quán ngon quanh đây...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500 bg-red-50 rounded-lg mx-4 mt-8">
        <p>⚠️ {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-sm font-medium"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Khám phá nhà hàng</h1>
      
      {restaurants.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          Chưa có nhà hàng nào trong hệ thống.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {restaurants.map((item) => (
            <RestaurantCard
              key={item.id}
              restaurant={item}
              onClick={() => handleRestaurantClick(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}