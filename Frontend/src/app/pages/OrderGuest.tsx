import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
    ChevronLeft, Receipt, UtensilsCrossed, CreditCard, 
    Clock, ChefHat, CheckCircle2, XCircle 
} from "lucide-react";
import axios from "axios";
import { Button } from "../components/ui/button"; // Đảm bảo bạn có component này
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";

// Định nghĩa kiểu dữ liệu khớp với Backend
interface OrderItem {
  itemId: number; // Sửa id -> itemId cho khớp backend
  name: string;
  quantity: number;
  price: number;
  status: string; // Backend sẽ trả về string này
  note?: string;
}

export default function OrderGuest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const restaurantId = searchParams.get('restaurantId');
  const tableId = searchParams.get('tableId');

  // Khởi tạo mảng rỗng để tránh lỗi null/undefined
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState(""); // Trạng thái chung của đơn

  // --- HÀM LẤY DỮ LIỆU ---
  const fetchOrder = async () => {
    if (!tableId || !restaurantId) return;
    try {
      const response = await axios.get(`http://192.168.1.96:5000/api/order/guest-current`, {
        params: { restaurantId, tableId }
      });
      
      // ✅ SỬA LỖI QUAN TRỌNG: Lấy .items từ response object
      const data = response.data;
      setItems(data.items || []); 
      setOrderStatus(data.status); // Lưu trạng thái đơn hàng

    } catch (error: any) {
      // Nếu lỗi 404 (Chưa có đơn) -> Reset về rỗng
      if (error.response && error.response.status === 404) {
         setItems([]);
         setOrderStatus("");
      } else {
         console.error("Lỗi cập nhật đơn hàng:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- EFFECT: Polling mỗi 5 giây ---
  useEffect(() => {
    fetchOrder();
    const intervalId = setInterval(fetchOrder, 5000);
    return () => clearInterval(intervalId);
  }, [restaurantId, tableId]);

  // --- MÀU SẮC TRẠNG THÁI ---
  const renderStatus = (status: string) => {
    // Chuyển đổi về chữ thường để so sánh
    const s = status?.toLowerCase() || 'pending';
    
    if (s === 'pending') {
        return <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200"><Clock className="w-3 h-3 mr-1"/> Đang chờ xác nhận</Badge>;
    }
    if (s === 'confirmed' || s === 'cooking') {
        return <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200"><ChefHat className="w-3 h-3 mr-1"/> Đang chế biến</Badge>;
    }
    if (s === 'served' || s === 'completed') {
        return <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1"/> Đã lên món</Badge>;
    }
    if (s === 'cancelled') {
        return <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200"><XCircle className="w-3 h-3 mr-1"/> Đã hủy</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrderMore = () => {
    navigate(`/menu?restaurantId=${restaurantId}&tableId=${tableId}`);
  };

  const handlePayment = () => {
    if(window.confirm("Bạn muốn gọi nhân viên thanh toán?")) {
        alert("✅ Đã gửi yêu cầu! Nhân viên sẽ đến ngay.");
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
          <h1 className="font-bold text-lg">Đơn hàng của bạn</h1>
          <p className="text-xs text-gray-500">{tableId ? `Bàn số ${tableId}` : 'Smart Restaurant'}</p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-4">
        {loading && items.length === 0 ? (
          <div className="text-center py-10 text-gray-400">Đang tải...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-gray-400 flex flex-col items-center">
            <Receipt className="w-12 h-12 mb-2 opacity-50" />
            <p>Bạn chưa gọi món nào.</p>
            <Button className="mt-4 bg-orange-600 hover:bg-orange-700 text-white" onClick={handleOrderMore}>
                Xem Menu ngay
            </Button>
          </div>
        ) : (
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex justify-between">
                <span>Danh sách món</span>
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
                      {item.note && <div className="text-xs text-gray-400 italic">Note: {item.note}</div>}
                      <div className="mt-1">{renderStatus(item.status)}</div>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-700">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </div>
                </div>
              ))}
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-lg">Tổng cộng</span>
                <span className="font-bold text-xl text-orange-600">{totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex gap-3 z-20">
        <Button variant="outline" className="flex-1 border-orange-600 text-orange-600" onClick={handleOrderMore}>
          <UtensilsCrossed className="w-4 h-4 mr-2" /> Gọi thêm
        </Button>
        <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white" onClick={handlePayment} disabled={items.length === 0}>
          <CreditCard className="w-4 h-4 mr-2" /> Thanh toán
        </Button>
      </div>
    </div>
  );
}