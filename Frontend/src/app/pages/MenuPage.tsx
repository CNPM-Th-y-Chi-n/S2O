import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, ChevronLeft, Plus, Minus, X, MessageSquare } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useCart } from "@/app/context/CartContext"; 
import api from "@/services/api"; 

/* ================= TYPES ================= */
// Cập nhật Interface để linh hoạt hơn
interface MenuItemData {
  id: number;           // Frontend dùng cái này
  MenuItemID?: number;  // Backend có thể trả về cái này
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

/* ================= PAGE ================= */
export default function MenuPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const restaurantId = searchParams.get("restaurantId");
  const tableId = searchParams.get("tableId");

  // --- GLOBAL STATE (CART) ---
  const { addToCart, cart, clearCart, totalPrice } = useCart(); 

  // --- LOCAL STATE ---
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  
  // State cho Modal
  const [selectedItem, setSelectedItem] = useState<MenuItemData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState(""); 

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchMenu = async () => {
      if (!restaurantId) return;
      try {
        setLoading(true);
        const response = await api.get(`/menu?restaurantId=${restaurantId}`);
        
        // 🔥 QUAN TRỌNG: Map dữ liệu để đảm bảo luôn có ID
        const rawData = response.data || [];
        const mappedData: MenuItemData[] = rawData.map((item: any) => ({
            ...item,
            // Ưu tiên lấy id, nếu không có thì lấy MenuItemID, nếu không thì lấy index ngẫu nhiên (phòng hờ)
            id: item.id || item.MenuItemID || Math.random(), 
            // Đảm bảo category luôn là chuỗi
            category: item.Category || item.category || "Other" 
        }));

        setMenuItems(mappedData);

        // Lọc danh mục duy nhất (loại bỏ trùng lặp và loại bỏ null)
        const uniqueCats = Array.from(new Set(mappedData.map(item => item.category))).filter(Boolean);
        setCategories(["All", ...uniqueCats]);

      } catch (error) {
        console.error("Lỗi tải menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId]);

  // --- FILTER LOGIC ---
  const filteredItems = menuItems.filter((item) => {
    const itemName = item.name || ""; // Phòng trường hợp name null
    const matchesSearch = itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // --- HANDLERS ---
  const openModal = (item: MenuItemData) => {
    setSelectedItem(item);
    setQuantity(1);
    setNote(""); 
  };

  const handleAddToCart = () => {
    if (selectedItem) {
      addToCart({
        itemId: selectedItem.id, // ID chắc chắn đã tồn tại nhờ bước map ở trên
        name: selectedItem.name,
        price: selectedItem.price,
        quantity: quantity,
        note: note 
      });
      setSelectedItem(null);
    }
  };

  const handleSubmitOrder = async () => {
    if (!restaurantId || !tableId) {
        alert("Lỗi: Thiếu thông tin bàn hoặc nhà hàng trên URL!");
        return;
    }

    try {
        const payload = {
            restaurantId: restaurantId,
            tableId: tableId,
            items: cart.map(item => ({
                itemId: item.itemId,
                quantity: item.quantity,
                note: item.note 
            }))
        };

        await api.post('/order/submit', payload);
        if (clearCart) clearCart(); 
        navigate(`/guest-order?restaurantId=${restaurantId}&tableId=${tableId}`);

    } catch (error) {
        console.error("Lỗi gửi đơn:", error);
        alert("Gửi đơn thất bại. Vui lòng thử lại.");
    }
  };

  const handleViewOrder = () => {
      if (restaurantId && tableId) {
          navigate(`/guest-order?restaurantId=${restaurantId}&tableId=${tableId}`);
      }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24">
      
      {/* HEADER & SEARCH */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Tìm món ăn..." 
              className="pl-9 bg-gray-100 border-none rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat, index) => (
            <button
              // 🔥 FIX KEY: Dùng kết hợp cat và index để chắc chắn không trùng
              key={`${cat}-${index}`} 
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors border
                ${activeCategory === cat 
                  ? "bg-orange-600 text-white border-orange-600" 
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
            >
              {cat === "All" ? "Tất cả" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* MENU GRID */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
            <div className="text-center py-10 text-gray-400">Đang tải thực đơn...</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
                <div 
                    // 🔥 FIX KEY: ID đã được chuẩn hóa ở useEffect, đảm bảo unique
                    key={item.id} 
                    className="bg-white rounded-2xl p-3 shadow-sm flex gap-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => openModal(item)}
                >
                    <img 
                        src={item.image} 
                        onError={(e: any) => e.target.src = "https://via.placeholder.com/150"}
                        className="w-24 h-24 rounded-xl object-cover bg-gray-100 shrink-0"
                    />
                    <div className="flex flex-col justify-between flex-1">
                        <div>
                            <h3 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="font-bold text-orange-600">
                                {item.price?.toLocaleString('vi-VN')}đ
                            </span>
                            <div className="bg-orange-100 p-1.5 rounded-full text-orange-600">
                                <Plus className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )}
      </main>

      {/* MODAL CHI TIẾT MÓN */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full relative overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Nút đóng */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:bg-white"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            {/* Ảnh món */}
            <div className="overflow-y-auto">
                <div className="h-64 w-full bg-gray-100">
                    <img
                    src={selectedItem.image}
                    onError={(e: any) => e.target.src = "https://via.placeholder.com/400"}
                    className="w-full h-full object-cover"
                    />
                </div>

                <div className="p-6 pb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedItem.name}</h2>
                    <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                        {selectedItem.description}
                    </p>

                    {/* GIAO DIỆN NHẬP GHI CHÚ */}
                    <div className="mt-6">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <MessageSquare className="w-4 h-4" />
                            Ghi chú cho bếp
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="VD: Không hành, ít cay, mang ra sau..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none transition-all"
                            rows={2}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-2 bg-white border-t border-gray-50 mt-auto">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 bg-gray-100 rounded-full px-4 py-2">
                    <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm active:scale-95"
                    >
                        <Minus className="w-4 h-4 text-gray-700" />
                    </button>
                    <span className="font-bold text-lg w-4 text-center">{quantity}</span>
                    <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm active:scale-95"
                    >
                        <Plus className="w-4 h-4 text-gray-700" />
                    </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="bg-orange-600 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-700 active:scale-95 transition-all shadow-orange-200 shadow-lg ml-3 flex-1"
                >
                  Thêm • {(selectedItem.price * quantity).toLocaleString('vi-VN')}đ
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* ================= CART OVERLAY ================= */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-40 animate-in slide-in-from-bottom-4">
            <div className="bg-gray-900 text-white rounded-2xl p-4 shadow-xl flex flex-col gap-3">
                <div className="flex justify-between items-center cursor-pointer" onClick={handleViewOrder}>
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-500 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                            {cart.reduce((acc, item) => acc + item.quantity, 0)}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm">Giỏ hàng tạm tính</span>
                            <span className="text-xs text-gray-400">{cart.length} món chờ gửi</span>
                        </div>
                    </div>
                    <span className="font-bold text-lg text-orange-400">
                        {totalPrice.toLocaleString('vi-VN')}đ
                    </span>
                </div>

                <button 
                    onClick={handleSubmitOrder}
                    className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors"
                >
                    Gửi gọi món ngay
                </button>
            </div>
        </div>
      )}
    </div>
  );
}