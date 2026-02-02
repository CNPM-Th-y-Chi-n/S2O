import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Trash2 } from "lucide-react"; // Import icon Trash2
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { toast } from "sonner"; // Hoặc dùng alert nếu chưa cài sonner

interface Restaurant {
  id: number;
  name: string;
  address: string;
}

export function FavoritesScreen() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy User ID
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id || 1;

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = () => {
    fetch(`http://127.0.0.1:5000/api/users/${userId}/favorites`)
      .then((res) => res.json())
      .then((data) => {
        setFavorites(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // 👇 HÀM XỬ LÝ XÓA YÊU THÍCH
  const handleRemove = async (restaurantId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Ngăn không cho click vào card (chuyển trang)
    
    if (!window.confirm("Bạn có chắc muốn bỏ nhà hàng này khỏi yêu thích?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/users/${userId}/favorites/${restaurantId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Cập nhật lại giao diện ngay lập tức (xóa dòng đó đi)
        setFavorites((prev) => prev.filter((item) => item.id !== restaurantId));
      } else {
        alert("Có lỗi xảy ra khi xóa!");
      }
    } catch (error) {
      console.error("Lỗi xóa:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-bold">Nhà hàng yêu thích</h1>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Đang tải...</p>
        ) : favorites.length === 0 ? (
          <p className="text-center mt-10 text-gray-500">Danh sách trống.</p>
        ) : (
          favorites.map((item) => (
            <Card 
                key={item.id} 
                className="p-4 flex flex-row items-center gap-4 hover:shadow-md cursor-pointer group relative"
                onClick={() => navigate(`/customer/restaurant/${item.id}`)}
            >
              
              
             
            

              <div className="flex-1 pr-8">
                <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="w-4 h-4 mr-1 text-red-500" />
                  <span className="truncate max-w-[200px]">{item.address}</span>
                </div>
              </div>

              {/* Nút Xóa (Thùng rác) */}
              <button 
                onClick={(e) => handleRemove(item.id, e)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                title="Bỏ yêu thích"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}