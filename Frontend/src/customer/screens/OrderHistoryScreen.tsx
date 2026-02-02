import { Receipt, Clock, ChevronRight, ArrowLeft } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { useState, useEffect } from "react";

// --- HELPERS ---

// 1. Hàm format tiền tệ VNĐ (Ví dụ: 150000 -> 150.000 đ)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// ... (Giữ nguyên các Interface OrderItem, Order, Props...)

export function OrderHistoryScreen({ onBack }: OrderHistoryScreenProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ⚠️ GIẢ LẬP USER ID: Vì chưa có login thật, ta gán cứng UserID = 1 để test
  // Sau này bạn sẽ lấy biến này từ Context hoặc localStorage
  const currentUserId = "1"; 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!currentUserId) return;

        // 2. Gửi userId lên API (Thêm ?userId=...)
        const response = await fetch(`http://localhost:5000/api/orders/history?userId=${currentUserId}`);
        
        if (!response.ok) throw new Error("Lỗi kết nối server");
        
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("❌ Không lấy được lịch sử đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUserId]);

  // --- MÀN HÌNH CHI TIẾT (DETAIL) ---
  if (selectedOrder) {
    const subtotal = selectedOrder.total;
    const tax = subtotal * 0.1;
    const finalTotal = subtotal + tax;

    return (
      <div className="min-h-screen bg-background pb-6">
        {/* ... Header giữ nguyên ... */}
        <div className="bg-white border-b border-border sticky top-0 z-40">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-muted rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2>Chi tiết đơn #{selectedOrder.id}</h2>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Info Nhà hàng */}
          <Card className="p-4 flex items-center gap-4">
            <img
              src={selectedOrder.restaurantImage || "https://placehold.co/150"}
              alt={selectedOrder.restaurantName}
              className="w-16 h-16 rounded-lg object-cover"
              onError={(e) => (e.currentTarget.src = "https://placehold.co/150")}
            />
            <div className="flex-1">
              <h4 className="font-semibold">{selectedOrder.restaurantName}</h4>
              <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4" />
                {selectedOrder.date}
              </div>
            </div>
            <Badge variant={selectedOrder.status === "completed" ? "default" : "secondary"}>
              {selectedOrder.status}
            </Badge>
          </Card>

          {/* Danh sách món */}
          <div>
            <h3 className="mb-4 font-semibold">Danh sách món</h3>
            <Card className="p-4 space-y-4">
              {selectedOrder.items.map((item, index) => (
                <div key={index}>
                  {index > 0 && <div className="h-px bg-border my-4" />}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">SL: {item.quantity}</div>
                      {item.notes && <div className="text-xs text-orange-500 italic">Ghi chú: {item.notes}</div>}
                    </div>
                    {/* 👇 ĐỔI TIỀN TỆ TẠI ĐÂY */}
                    <div className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Tổng tiền */}
          <div>
            <h3 className="mb-4 font-semibold">Thanh toán</h3>
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Tạm tính</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Thuế (10%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatCurrency(finalTotal)}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // --- MÀN HÌNH DANH SÁCH (LIST) ---
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <button onClick={onBack} className="p-2 hover:bg-muted rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg font-bold">Lịch sử đơn hàng</h2>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {loading ? (
           <div className="text-center py-10 text-muted-foreground">Đang tải dữ liệu...</div>
        ) : (
          <>
            {orders.map((order) => (
              <Card
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={order.restaurantImage || "https://placehold.co/150"}
                    alt={order.restaurantName}
                    className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                    onError={(e) => (e.currentTarget.src = "https://placehold.co/150")}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="mb-1 font-semibold text-base">{order.restaurantName}</h4>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {order.date}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                        {order.status}
                      </Badge>
                      {/* 👇 ĐỔI TIỀN TỆ TẠI ĐÂY */}
                      <div className="text-sm font-medium">
                        {order.items.length} món • {formatCurrency(order.total * 1.1)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            {!loading && orders.length === 0 && (
              <div className="text-center py-12">
                 <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                 <h3 className="mb-2 font-semibold">Chưa có đơn hàng nào</h3>
                 <p className="text-sm text-muted-foreground">Bạn chưa có đơn hàng nào trong lịch sử.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}