import { useState, useEffect } from "react";
import axios from "axios";
import { OrderCard } from "../components/OrderCard";
import { Order } from "../types"; 

const API_URL = "http://localhost:5000/api/order"; 

// 👇 GIẢ LẬP: Bếp này thuộc nhà hàng số 2
const CURRENT_RESTAURANT_ID = 2;

export function Kitchen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchKitchenOrders = async () => {
    try {
      // 👇 SỬA ĐỔI: Truyền restaurantId vào params
      const res = await axios.get(`${API_URL}/kitchen`, {
        params: {
            restaurantId: CURRENT_RESTAURANT_ID
        }
      });

      const formattedOrders = res.data.map((o: any) => ({
        ...o,
        createdAt: new Date(o.createdAt)
      }));
      setOrders(formattedOrders);
    } catch (error) {
      console.error("❌ Lỗi lấy đơn bếp:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenOrders();
    const interval = setInterval(fetchKitchenOrders, 10000); // 10s refresh
    return () => clearInterval(interval);
  }, []);

  const handleBump = async (orderId: string) => {
    try {
      await axios.put(`${API_URL}/${orderId}/status`, {
        status: 'completed'
      });
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (error) {
      alert("Lỗi cập nhật trạng thái đơn hàng!");
      console.error(error);
    }
  };

  if (loading && orders.length === 0) return <div className="p-4">Đang tải đơn hàng...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
            KDS - Kitchen (Nhà hàng {CURRENT_RESTAURANT_ID})
        </h2>
        <button 
          onClick={fetchKitchenOrders}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Làm mới
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          Hiện tại không có đơn hàng nào cần làm.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onBump={() => handleBump(order.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}