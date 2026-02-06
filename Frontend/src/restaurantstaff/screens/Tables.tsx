import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Định nghĩa kiểu dữ liệu khớp với SQL Server trả về
interface Table {
  id: number;
  name: string;
  status: string;
}

// 👇 SỬA Ở ĐÂY: Đổi tên thành BASE_URL để khớp với bên dưới
const BASE_URL = "http://localhost:5000/api";
const CURRENT_RESTAURANT_ID = 2; 

export default function Tables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      // 1. Gọi API lấy thông tin nhà hàng (Sửa API_URL -> BASE_URL)
      const resInfo = await axios.get(`${BASE_URL}/manager/restaurant/${CURRENT_RESTAURANT_ID}/info`);
      setRestaurantName(resInfo.data.name);

      // 2. Gọi API lấy danh sách bàn (Code này giờ đã đúng biến BASE_URL)
      const resTables = await axios.get(`${BASE_URL}/manager/restaurant/${CURRENT_RESTAURANT_ID}/tables`);
      
      const mappedTables = resTables.data.map((t: any) => ({
        id: t.TableID || t.id,
        name: t.TableName || t.name,
        status: t.Status || t.status || 'Available'
      }));
      setTables(mappedTables);

      // 3. Gọi API lấy đơn (Sửa API_URL -> BASE_URL)
      const resOrders = await axios.get(`${BASE_URL}/order/kitchen`, {
        params: { restaurantId: CURRENT_RESTAURANT_ID }
      });
      setActiveOrders(resOrders.data);

      setError(null);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
      if (tables.length === 0) setError("Không thể tải dữ liệu bàn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getTableStatus = (tableId: number, dbStatus: string) => {
    const hasActiveOrder = activeOrders.some((order: any) => 
        order.tableId == tableId || order.TableID == tableId
    );

    if (hasActiveOrder) return 'serving';
    if (dbStatus === 'Booked') return 'booked';
    return 'empty';
  };

  if (loading && tables.length === 0) return <div className="p-8 text-center">⏳ Đang tải sơ đồ...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Sơ đồ bàn - {restaurantName}
        </h1>
        <div className="flex gap-2">
            <div className="flex items-center gap-1 text-sm"><span className="w-3 h-3 bg-green-100 border border-green-300 rounded"></span> Trống</div>
            <div className="flex items-center gap-1 text-sm"><span className="w-3 h-3 bg-red-100 border border-red-300 rounded"></span> Có khách</div>
            <div className="flex items-center gap-1 text-sm"><span className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></span> Đặt trước</div>
            <button onClick={() => fetchData()} className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition">
                Làm mới
            </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {tables.map((table) => {
          const status = getTableStatus(table.id, table.status);
          
          let colorClass = "";
          let statusText = "";

          switch (status) {
            case 'serving':
                colorClass = "bg-red-50 border-red-300 text-red-700 shadow-red-100";
                statusText = "Đang phục vụ";
                break;
            case 'booked':
                colorClass = "bg-yellow-50 border-yellow-300 text-yellow-700 shadow-yellow-100";
                statusText = "Đã đặt trước";
                break;
            default:
                colorClass = "bg-green-50 border-green-300 text-green-700 hover:bg-green-100 shadow-green-100";
                statusText = "Bàn trống";
          }

          return (
            <div 
              key={table.id}
              className={`relative h-32 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all transform hover:-translate-y-1 shadow-md ${colorClass}`}
            >
              <span className="text-2xl font-bold">{table.name}</span>
              <span className="text-sm mt-2 font-medium opacity-80">
                {statusText}
              </span>
              {status === 'serving' && (
                <span className="absolute top-3 right-3 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      {tables.length === 0 && (
          <div className="text-center text-gray-500 mt-10">Chưa có dữ liệu bàn nào.</div>
      )}
    </div>
  );
}