import React from 'react';
import { Order } from '../types'; // Đảm bảo đường dẫn import đúng file types của bạn

interface OrderCardProps {
  order: Order;
  onBump: () => void; // Hàm callback được truyền từ Kitchen xuống
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onBump }) => {
  // Tính thời gian đã trôi qua (phút)
  const [elapsedTime, setElapsedTime] = React.useState<number>(0);

  React.useEffect(() => {
    const calculateTime = () => {
      const start = new Date(order.createdAt).getTime();
      const now = new Date().getTime();
      setElapsedTime(Math.floor((now - start) / 60000));
    };

    calculateTime();
    const timer = setInterval(calculateTime, 60000); // Cập nhật mỗi phút
    return () => clearInterval(timer);
  }, [order.createdAt]);

  // Đổi màu header dựa trên thời gian chờ (Cảnh báo nếu > 15 phút)
  const headerColor = elapsedTime > 15 ? 'bg-red-500' : 'bg-blue-600';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col h-full">
      {/* HEADER: Số bàn & Thời gian */}
      <div className={`${headerColor} text-white p-3 flex justify-between items-center`}>
        <div className="font-bold text-lg">
          {order.type === 'take-away' ? 'Mang về' : `Bàn ${order.tableNumber}`}
        </div>
        <div className="font-mono text-sm bg-black/20 px-2 py-1 rounded">
          {elapsedTime} phút
        </div>
      </div>

      {/* BODY: Danh sách món */}
      <div className="p-4 flex-grow overflow-y-auto max-h-64">
        <div className="text-sm text-gray-500 mb-2">Order #{order.orderNumber}</div>
        <ul className="space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="border-b pb-2 last:border-0">
              <div className="flex justify-between items-start">
                <span className="font-bold text-lg w-8 text-center bg-gray-100 rounded mr-2">
                  {item.quantity}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{item.dishName}</div>
                  {item.notes && (
                    <div className="text-red-500 text-sm italic mt-1">
                      ⚠️ Note: {item.notes}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* FOOTER: Nút BUMP */}
      <div className="p-3 border-t bg-gray-50">
        <button
          onClick={onBump}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded shadow-sm transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <span>✅</span>
          <span>HOÀN THÀNH (BUMP)</span>
        </button>
      </div>
    </div>
  );
};