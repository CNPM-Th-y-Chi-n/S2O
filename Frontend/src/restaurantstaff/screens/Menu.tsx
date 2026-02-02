import React, { useState, useEffect } from "react";
import axios from "axios";

// Định nghĩa kiểu dữ liệu khớp với API mới sửa
interface MenuItem {
  id: number;
  name: string;
  categoryId: number; // Đổi thành number vì DB trả về ID
  price: number;
  available: boolean;
  image: string | null;
}

const API_URL = "http://localhost:5000/api";
const RESTAURANT_ID = 2; 

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/menu/restaurant/${RESTAURANT_ID}`);
      setMenuItems(response.data);
      setError(null);
    } catch (err) {
      console.error("Lỗi tải menu:", err);
      setError("Không thể tải thực đơn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Helper đơn giản để hiển thị tên nhóm (nếu bạn muốn hardcode tạm)
  // Sau này nếu có bảng Categories thì ta sẽ Join ở Backend sau.
  const getCategoryName = (id: number) => {
    // Ví dụ tạm:
    // if (id === 1) return "Khai vị";
    // if (id === 2) return "Món chính";
    return `Nhóm ${id}`; // Mặc định hiện ID nhóm
  };

  if (loading) return <div className="p-6">Đang tải thực đơn...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Thực đơn (Nhà hàng {RESTAURANT_ID})</h1>
        <button onClick={fetchMenu} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">
          Làm mới
        </button>
      </div>

      <input
        type="text"
        placeholder="Tìm món ăn..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Món ăn</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Danh mục</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Giá</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMenu.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    {/* Nếu có ảnh thì hiện ở đây, ví dụ: */}
                    {/* {item.image && <img src={item.image} className="w-10 h-10 mt-1 rounded object-cover"/>} */}
                </td>
                <td className="px-4 py-3 text-gray-600">
                    {getCategoryName(item.categoryId)}
                </td>
                <td className="px-4 py-3 text-gray-900 font-semibold">
                  {item.price.toLocaleString('vi-VN')} đ
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.available ? "Còn hàng" : "Hết hàng"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredMenu.length === 0 && (
            <div className="p-4 text-center text-gray-500">Không tìm thấy món nào.</div>
        )}
      </div>
    </div>
  );
}