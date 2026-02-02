import React, { useEffect, useState } from "react";
import axios from "axios";
import { Order } from "../types";

const API_BASE = "http://localhost:5000/api"; 
const CURRENT_RESTAURANT_ID = 1; 

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState("All"); // Thêm bộ lọc đơn giản

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      // 👇 Gọi API mới: Lấy tất cả lịch sử
      const response = await axios.get(`${API_BASE}/order/restaurant/${CURRENT_RESTAURANT_ID}`);
      
      const formattedOrders = response.data.map((o: any) => ({
        ...o,
        createdAt: new Date(o.createdAt)
      }));

      setOrders(formattedOrders);
    } catch (err) {
      console.error("Lỗi lấy lịch sử đơn:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
    // Refresh mỗi 30s vì lịch sử không cần realtime nhanh như bếp
    const interval = setInterval(fetchAllOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  // Hàm helper để chọn màu cho trạng thái
  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'completed') return 'bg-green-100 text-green-800 border-green-200';
    if (s === 'cancelled') return 'bg-red-100 text-red-800 border-red-200';
    if (s === 'paid') return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Pending/Preparing
  };

  // Lọc hiển thị
  const filteredOrders = filter === "All" 
    ? orders 
    : orders.filter(o => o.status.toLowerCase() === filter.toLowerCase());

  if (loading && orders.length === 0) return <div className="p-6">Đang tải lịch sử...</div>;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
        <button onClick={fetchAllOrders} className="text-blue-600 hover:underline">
          Làm mới
        </button>
      </div>

      {/* Bộ lọc đơn giản */}
      <div className="flex gap-2">
        {['All', 'Pending', 'Completed', 'Cancelled'].map(f => (
            <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'
                }`}
            >
                {f === 'All' ? 'Tất cả' : f}
            </button>
        ))}
      </div>

      {/* Danh sách dạng bảng hoặc Card liệt kê */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white border rounded-lg shadow-sm p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            {/* Thông tin chính */}
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg">#{order.orderNumber}</span>
                    <span className="text-sm text-gray-500">
                        • Bàn {order.tableNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                </div>
                <div className="text-sm text-gray-500 mb-2">
                    {order.createdAt.toLocaleString('vi-VN')}
                </div>
                
                {/* Chi tiết món ăn (dạng rút gọn) */}
                <ul className="text-sm text-gray-700 space-y-1">
                    {order.items.map((item, idx) => (
                        <li key={idx} className="flex gap-2">
                            <span className="font-semibold text-gray-900">{item.quantity}x</span>
                            <span>{item.dishName}</span>
                            {item.notes && <span className="text-gray-400 italic"> - {item.notes}</span>}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Tổng tiền & Hành động (nếu có) */}
            <div className="text-right min-w-[120px]">
                <div className="text-lg font-bold text-gray-900">
                    {/* Giả sử bạn có trường TotalAmount, nếu chưa tính ở backend thì tính tạm ở frontend */}
                    {/* {order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()} đ */}
                    Wait for Bill
                </div>
                {/* Ví dụ nút Hủy đơn nếu nó vẫn đang Pending */}
                {order.status.toLowerCase() === 'pending' && (
                    <button className="mt-2 text-xs text-red-600 hover:text-red-800 hover:underline">
                        Hủy đơn này
                    </button>
                )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredOrders.length === 0 && (
        <div className="text-center text-gray-500 py-10">Không tìm thấy đơn hàng nào.</div>
      )}
    </div>
  );
}