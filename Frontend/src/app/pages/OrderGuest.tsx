import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
    ChevronLeft, Receipt, UtensilsCrossed, CreditCard, 
    Clock, ChefHat, CheckCircle2, XCircle 
} from "lucide-react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";

// Định nghĩa kiểu dữ liệu
interface OrderItem {
  id: string; 
  name: string;
  quantity: number;
  price: number;
  status: 'pending' | 'confirmed' | 'cooking' | 'served' | 'cancelled'; // Các trạng thái có thể có
  note?: string;
}

export default function OrderGuest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const restaurantId = searchParams.get('restaurantId');
  const tableId = searchParams.get('tableId');

  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  // --- HÀM LẤY DỮ LIỆU ---
  const fetchOrder = async () => {
    if (!tableId || !restaurantId) return;
    try {
      // Gọi API Backend Python
      const response = await axios.get(`http://192.168.1.81:5000/api/order/guest-current?restaurantId=${restaurantId}&tableId=${tableId}`);
      setItems(response.data);
    } catch (error) {
      console.error("Lỗi cập nhật đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- EFFECT: Lấy dữ liệu và TỰ ĐỘNG CẬP NHẬT mỗi 5 giây ---
  useEffect(() => {
    fetchOrder(); // Gọi ngay lần đầu

    // Thiết lập interval để tự động refresh trạng thái (Polling)
    const intervalId = setInterval(() => {
        fetchOrder();
    }, 5000); // 5000ms = 5 giây

    // Dọn dẹp khi thoát trang
    return () => clearInterval(intervalId);
  }, [restaurantId, tableId]);

  // --- LOGIC HIỂN THỊ TRẠNG THÁI (Màu sắc & Icon) ---
  const renderStatus = (status: string) => {
    switch (status) {
        case 'pending':
            return (
                <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-yellow-50">
                    <Clock className="w-3 h-3 mr-1"/> Chờ xác nhận
                </Badge>
            );
        case 'confirmed':
        case 'cooking':
            return (
                <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50">
                    <ChefHat className="w-3 h-3 mr-1"/> Đang chế biến
                </Badge>
            );
        case 'served':
        case 'completed':
            return (
                <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                    <CheckCircle2 className="w-3 h-3 mr-1"/> Đã lên món
                </Badge>
            );
        case 'cancelled':
            return (
                <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50">
                    <XCircle className="w-3 h-3 mr-1"/> Đã hủy
                </Badge>
            );
        default:
            return <Badge variant="outline">Đang xử lý</Badge>;
    }
  };

  // Tính tổng tiền (chỉ tính món chưa bị hủy)
  const totalAmount = items
    .filter(item => item.status !== 'cancelled')
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Điều hướng
  const handleOrderMore = () => {
    if (restaurantId && tableId) {
      navigate(`/menu?restaurantId=${restaurantId}&tableId=${tableId}`);
    } else {
      navigate("/menu");
    }
  };

  const handlePayment = () => {
    const confirmed = window.confirm("Bạn muốn gọi nhân viên thanh toán?");
    if (confirmed) {
        alert("✅ Đã gửi yêu cầu thanh toán! Nhân viên sẽ đến ngay.");
        // Ở đây bạn có thể gọi thêm API /notify-payment nếu muốn
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handleOrderMore}>
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="font-bold text-lg">Theo dõi đơn hàng</h1>
          <p className="text-xs text-gray-500">
            {tableId ? `Bàn số ${tableId}` : 'Chưa chọn bàn'}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-4">
        {loading && items.length === 0 ? (
          <div className="text-center py-10 text-gray-400">Đang tải trạng thái...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-gray-400 flex flex-col items-center">
            <Receipt className="w-12 h-12 mb-2 opacity-50" />
            <p>Bàn chưa gọi món nào.</p>
            <Button className="mt-4 bg-orange-600 hover:bg-orange-700" onClick={handleOrderMore}>
                Xem Menu ngay
            </Button>
          </div>
        ) : (
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex justify-between">
                <span>Món đã gọi</span>
                <span className="text-sm font-normal text-gray-500">{items.length} món</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-start border-b border-dashed pb-4 last:border-0 last:pb-0">
                  <div className="flex gap-3">
                    <div className="bg-orange-50 w-8 h-8 rounded flex items-center justify-center font-bold text-orange-600 text-sm shrink-0">
                      x{item.quantity}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{item.name}</div>
                      {item.note && <div className="text-xs text-gray-400 italic">Ghi chú: {item.note}</div>}
                      
                      {/* --- HIỂN THỊ TRẠNG THÁI Ở ĐÂY --- */}
                      <div className="mt-2 animate-in fade-in">
                        {renderStatus(item.status)}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-700 whitespace-nowrap ml-2">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </div>
                </div>
              ))}
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-lg">Tạm tính</span>
                <span className="font-bold text-xl text-orange-600">{totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex gap-3 z-20">
        <Button 
            variant="outline" 
            className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50" 
            onClick={handleOrderMore}
        >
          <UtensilsCrossed className="w-4 h-4 mr-2" />
          Gọi thêm
        </Button>
        <Button 
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            onClick={handlePayment}
            disabled={items.length === 0}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Thanh toán
        </Button>
      </div>
    </div>
  );
}