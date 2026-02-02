import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Định nghĩa kiểu dữ liệu
interface Table {
  id: number;
  name: string;
  status: string;
}

interface RestaurantInfo {
  id: number;
  name: string;
  tables: Table[];
}

const API_URL = "http://localhost:5000/api";
const CURRENT_RESTAURANT_ID = 2; // Giả lập ID nhà hàng

export default function Tables() {
  const [info, setInfo] = useState<RestaurantInfo | null>(null);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Gọi API lấy thông tin bàn (Sửa lỗi 404)
      const resRestaurant = await axios.get(`${API_URL}/restaurant/${CURRENT_RESTAURANT_ID}`);
      
      // 2. Gọi API lấy đơn đang hoạt động (Sửa lỗi 400 - Thêm params)
      const resOrders = await axios.get(`${API_URL}/order/kitchen`, {
        params: {
          restaurantId: CURRENT_RESTAURANT_ID // 👈 QUAN TRỌNG: Phải có dòng này
        }
      });

      setInfo(resRestaurant.data);
      setActiveOrders(resOrders.data);
      setError(null);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
      setError("Không thể tải dữ liệu bàn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh trạng thái bàn mỗi 10 giây
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Hàm kiểm tra bàn nào đang có đơn active
  const isTableBusy = (tableId: number) => {
    // Tìm xem tableId này có nằm trong danh sách activeOrders không
    return activeOrders.some((order: any) => order.tableNumber === tableId);
  };

  if (loading && !info) return <div className="p-4">Đang tải sơ đồ bàn...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Sơ đồ bàn - {info?.name}
        </h1>
        <button onClick={fetchData} className="bg-gray-200 px-3 py-1 rounded">Làm mới</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {info?.tables.map((table) => {
          const busy = isTableBusy(table.id);
          return (
            <div 
              key={table.id}
              className={`
                relative h-32 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition
                ${busy 
                  ? 'bg-red-50 border-red-300 text-red-700' 
                  : 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'}
              `}
            >
              <span className="text-xl font-bold">{table.name}</span>
              <span className="text-sm mt-1">
                {busy ? 'Đang phục vụ' : 'Trống'}
              </span>

              {/* Nếu đang bận, hiện số lượng đơn (tùy chọn) */}
              {busy && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}