import React, { useState, useEffect } from "react";
import axios from "axios";

// Định nghĩa kiểu dữ liệu
interface MenuItem {
  id: number;
  name: string;
  categoryId: number; 
  price: number;
  available: boolean;
  image: string | null;
  description?: string;
}

const API_URL = "http://localhost:5000/api";
const RESTAURANT_ID = 2; 

export default function Menu() {
  // State danh sách menu
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  
  // State cho Modal và Form thêm món
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    categoryId: "",
    price: "",
    description: "",
    imageType: "link", // 'link' hoặc 'file'
    imageUrl: "",
    imageFile: null as File | null
  });

  // Load danh sách món
  const fetchMenu = async () => {
    try {
      setLoading(true);
      // Gọi API Manager
      const response = await axios.get(`${API_URL}/menu/restaurant/${RESTAURANT_ID}`);
      setMenuItems(response.data);
    } catch (err) {
      console.error("Lỗi tải menu:", err);
      // alert("Không thể tải thực đơn."); // Tắt alert nếu thấy phiền khi debug
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Xử lý Input form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Xử lý chọn File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewItem({ ...newItem, imageFile: e.target.files[0] });
    }
  };

  // Submit thêm món
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("restaurantId", RESTAURANT_ID.toString());
    formData.append("name", newItem.name);
    formData.append("categoryId", newItem.categoryId);
    formData.append("price", newItem.price);
    formData.append("description", newItem.description);
    
    // Gửi link hoặc file tùy chọn
    if (newItem.imageType === "link") {
      formData.append("imageUrl", newItem.imageUrl);
    } else if (newItem.imageFile) {
      formData.append("imageFile", newItem.imageFile);
    }

    try {
      await axios.post(`${API_URL}/menu/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Thêm món thành công!");
      setIsModalOpen(false);
      // Reset form về rỗng
      setNewItem({ 
        name: "", 
        categoryId: "", 
        price: "", 
        description: "", 
        imageType: "link", 
        imageUrl: "", 
        imageFile: null 
      });
      fetchMenu(); // Refresh lại danh sách
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm món. Vui lòng thử lại.");
    }
  };

  // Helper hiển thị tên nhóm (Tạm thời)
  const getCategoryName = (id: number) => `Nhóm ${id}`;

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header & Button Add */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Thực đơn (Nhà hàng {RESTAURANT_ID})</h1>
        <div className="flex gap-2">
            <button onClick={fetchMenu} className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm">
            Làm mới
            </button>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium flex items-center gap-1"
            >
                + Thêm Món
            </button>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Tìm món ăn..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Table List */}
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Hình</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Món ăn</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Danh mục</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Giá</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMenu.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                   {item.image ? (
                     <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover border" />
                   ) : (
                     <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No img</div>
                   )}
                </td>
                <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{item.description}</div>
                </td>
                <td className="px-4 py-3 text-gray-600 text-sm">
                    {getCategoryName(item.categoryId)}
                </td>
                <td className="px-4 py-3 text-gray-900 font-semibold text-sm">
                  {item.price.toLocaleString('vi-VN')} đ
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {item.available ? "Còn hàng" : "Hết hàng"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMenu.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-500">Không tìm thấy món nào.</div>
        )}
      </div>

      {/* MODAL THÊM MÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Thêm Món Ăn Mới</h2>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Tên món */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên món <span className="text-red-500">*</span></label>
                <input 
                    required 
                    name="name" 
                    value={newItem.name || ""} 
                    onChange={handleInputChange} 
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              {/* Giá & Danh mục */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Giá (VNĐ) <span className="text-red-500">*</span></label>
                    <input 
                        required 
                        type="number" 
                        name="price" 
                        value={newItem.price || ""} 
                        onChange={handleInputChange} 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">ID Danh mục <span className="text-red-500">*</span></label>
                    <input 
                        required 
                        type="number" 
                        name="categoryId" 
                        placeholder="VD: 3" 
                        value={newItem.categoryId || ""} 
                        onChange={handleInputChange} 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2" 
                    />
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <textarea 
                    name="description" 
                    value={newItem.description || ""} 
                    onChange={handleInputChange} 
                    rows={2} 
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                ></textarea>
              </div>

              {/* Ảnh */}
              <div className="border p-3 rounded-md bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh món ăn</label>
                <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="imageType" value="link" checked={newItem.imageType === "link"} onChange={() => setNewItem({...newItem, imageType: "link"})} /> 
                        Dùng Link Online
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="imageType" value="file" checked={newItem.imageType === "file"} onChange={() => setNewItem({...newItem, imageType: "file"})} /> 
                        Upload File (Máy tính)
                    </label>
                </div>

                {newItem.imageType === "link" ? (
                    <input 
                        type="text" 
                        name="imageUrl" 
                        placeholder="https://example.com/food.jpg" 
                        value={newItem.imageUrl || ""} 
                        onChange={handleInputChange} 
                        className="w-full border rounded-md p-2 text-sm" 
                    />
                ) : (
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                    />
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 font-medium">Hủy bỏ</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white font-medium shadow-sm">
                    Xác nhận thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}