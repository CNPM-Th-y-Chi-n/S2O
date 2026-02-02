import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, MapPin, Utensils, LayoutGrid, User, Phone, CheckCircle, Heart 
} from "lucide-react"; 
import api from "../../services/api"; 

// --- TYPES ---
interface Restaurant {
  id: string | number;
  name: string;
  address: string;
  image: string;
  rating: number;
}

interface MenuItem {
  id: number | string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface Table {
  id: number | string;
  name: string;
  status: 'Available' | 'Occupied' | 'Reserved' | 'Booked'; 
  capacity: number;
}

export default function RestaurantDetailScreen() {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const location = useLocation();

  // State
  const [restaurant, setRestaurant] = useState<Restaurant | null>(location.state?.restaurant || null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [activeTab, setActiveTab] = useState<'menu' | 'table'>('menu');
  const [loading, setLoading] = useState(false);
  
  // Booking State
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // ❤️ Favorite State
  const [isLiked, setIsLiked] = useState(false);

  // --- HÀM LẤY USER ID AN TOÀN (FIX LỖI NULL) ---
  const getUserId = () => {
    try {
        const userStr = localStorage.getItem("user");
        // Kiểm tra kỹ các trường hợp chuỗi "null" hoặc "undefined"
        if (userStr && userStr !== "undefined" && userStr !== "null") {
            const user = JSON.parse(userStr);
            return user.id;
        }
        
        // Fallback: Kiểm tra userId lẻ
        const simpleId = localStorage.getItem("userId");
        if (simpleId && simpleId !== "undefined" && simpleId !== "null") {
            return simpleId;
        }
    } catch (e) {
        return null;
    }
    return null;
  };

  const currentUserId = getUserId();

  // --- 1. FETCH DỮ LIỆU ---
  useEffect(() => {
    const fetchRealData = async () => {
      if (!restaurant) setLoading(true);

      try {
        // 1. Lấy chi tiết nhà hàng
        const res = await api.get(`/restaurants/${paramId}`);
        setRestaurant(res.data);

        if (res.data.menu) setMenuItems(res.data.menu);
        if (res.data.tables) setTables(res.data.tables);

        // 2. Kiểm tra đã Like chưa (CHỈ GỌI KHI CÓ USER ID HỢP LỆ)
        if (currentUserId && paramId && currentUserId !== "null") {
            checkIfLiked(currentUserId, paramId);
        } else {
            setIsLiked(false);
        }

      } catch (err: any) {
        console.error("❌ Lỗi API:", err);
      } finally {
        setLoading(false);
      }
    };

    if (paramId) {
        fetchRealData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId]); // Bỏ currentUserId khỏi deps để tránh loop nếu id thay đổi liên tục

  // --- Helper: Check Favorite Status ---
  const checkIfLiked = async (userId: any, restaurantId: any) => {
      try {
          const res = await api.get(`/users/${userId}/favorites`);
          // Kiểm tra xem nhà hàng hiện tại có trong list không
          const found = res.data.some((fav: any) => fav.id === Number(restaurantId));
          setIsLiked(found);
      } catch (error) {
          console.error("Lỗi kiểm tra favorite (có thể do chưa có list)", error);
      }
  };

  // --- ❤️ XỬ LÝ CLICK TIM (TOGGLE) ---
  const handleToggleFavorite = async () => {
      // Chặn nếu chưa đăng nhập
      if (!currentUserId || currentUserId === "null") {
          const confirmLogin = window.confirm("Bạn cần đăng nhập để lưu nhà hàng yêu thích. Đi đến trang đăng nhập?");
          if (confirmLogin) navigate('/login');
          return;
      }

      // Cập nhật UI ngay lập tức (Optimistic)
      const previousState = isLiked;
      setIsLiked(!previousState);

      try {
          if (previousState) {
              // Đang like -> Bấm để Bỏ like (DELETE)
              await api.delete(`/users/${currentUserId}/favorites/${paramId}`);
              console.log("Đã bỏ yêu thích");
          } else {
              // Chưa like -> Bấm để Like (POST)
              await api.post(`/users/${currentUserId}/favorites`, { restaurant_id: paramId });
              console.log("Đã thêm yêu thích");
          }
      } catch (error) {
          console.error("Lỗi thao tác favorite:", error);
          // Hoàn tác UI nếu lỗi
          setIsLiked(previousState);
          alert("Có lỗi xảy ra, vui lòng thử lại sau.");
      }
  };

  // --- 2. XỬ LÝ ĐẶT BÀN ---
  const submitBooking = async () => {
      if (!guestName.trim() || !guestPhone.trim()) {
          return alert("Vui lòng nhập đầy đủ Tên và Số điện thoại!");
      }
      
      if (!currentUserId || currentUserId === "null") {
          alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          navigate('/login');
          return;
      }
      
      if (!selectedTable || !restaurant) return;

      // Format Time SQL (YYYY-MM-DD HH:mm:ss)
      const now = new Date();
      // Chỉnh múi giờ nếu cần, ở đây dùng toISOString cắt chuỗi cho đơn giản
      // Lưu ý: toISOString là giờ UTC. Nếu muốn giờ địa phương:
      const offset = now.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 19).replace('T', ' ');

      try {
          const payload = {
              restaurant_id: restaurant.id,
              table_id: selectedTable.id,
              user_id: currentUserId,
              reservation_time: localISOTime,
              guestName: guestName.trim(),
              guestPhone: guestPhone.trim()
          };

          const response = await api.post('/restaurants/book-table', payload);
          
          if (response.status === 200 || response.status === 201) {
              alert(`✅ Đặt bàn thành công!\nBàn số: ${selectedTable.name}`);
              setShowModal(false);
              
              // Cập nhật UI bàn
              setTables(prev => prev.map(t => 
                  t.id === selectedTable.id ? {...t, status: 'Booked'} : t
              ));
          }

      } catch (error: any) {
          console.error("❌ Lỗi Server:", error);
          const msg = error.response?.data?.message || "Lỗi kết nối server";
          alert(`⚠️ Thất bại: ${msg}`);
      }
  };

  if (loading || !restaurant) {
      return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* HEADER */}
      <div className="relative h-64 w-full">
        <img 
            src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"} 
            alt="Cover" 
            className="w-full h-full object-cover" 
            onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80";
            }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white/30 p-2 rounded-full text-white backdrop-blur-sm hover:bg-white/50 transition">
           <ArrowLeft size={24} />
        </button>

        {/* ❤️ NÚT TIM (Đã sửa) */}
        <button 
            onClick={handleToggleFavorite}
            className="absolute top-4 right-4 bg-white/30 p-2 rounded-full backdrop-blur-sm hover:bg-white/50 transition active:scale-90"
        >
           <Heart 
             size={24} 
             className={isLiked ? "fill-red-500 text-red-500" : "text-white"} 
           />
        </button>

        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
           <h1 className="text-3xl font-bold leading-tight">{restaurant.name}</h1>
           <div className="flex items-center gap-2 mt-2 opacity-90 text-sm font-medium">
               <MapPin size={16} className="text-yellow-400"/> {restaurant.address || "Địa chỉ chưa cập nhật"}
           </div>
           <div className="flex items-center gap-4 mt-3">
               <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                   <Star size={12} fill="currentColor"/> {restaurant.rating || 0}
               </span>
               <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">Đang mở cửa</span>
           </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex bg-white shadow-sm sticky top-0 z-20">
        <button onClick={() => setActiveTab('menu')} className={`flex-1 py-4 text-sm font-bold border-b-2 transition ${activeTab==='menu'?'border-indigo-600 text-indigo-600':'border-transparent text-gray-400 hover:text-gray-600'}`}>
            THỰC ĐƠN ({menuItems.length})
        </button>
        <button onClick={() => setActiveTab('table')} className={`flex-1 py-4 text-sm font-bold border-b-2 transition ${activeTab==='table'?'border-indigo-600 text-indigo-600':'border-transparent text-gray-400 hover:text-gray-600'}`}>
            ĐẶT BÀN ({tables.length})
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4 max-w-lg mx-auto">
        
        {/* MENU */}
        {activeTab === 'menu' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {menuItems.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed">
                        <Utensils className="mx-auto mb-2 opacity-50" size={32}/>
                        <p>Chưa có món ăn nào.</p>
                    </div>
                ) : (
                    menuItems.map((item, i) => (
                        <div key={i} className="flex bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <img 
                                src={item.image} 
                                className="w-24 h-24 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                                onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80"}
                                alt={item.name}
                            />
                            <div className="ml-4 flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">{item.name}</h4>
                                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                                </div>
                                <div className="flex justify-between items-end mt-2">
                                    <span className="text-indigo-600 font-bold text-lg">{item.price?.toLocaleString()}đ</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}

        {/* TABLES */}
        {activeTab === 'table' && (
            <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {tables.length === 0 ? (
                     <div className="col-span-3 text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed">
                        <LayoutGrid className="mx-auto mb-2 opacity-50" size={32}/>
                        <p>Chưa có sơ đồ bàn.</p>
                    </div>
                ) : (
                    tables.map((table, i) => {
                        const isFree = table.status === 'Available' || table.status === null;
                        
                        return (
                            <div 
                                key={i} 
                                onClick={() => isFree && (setSelectedTable(table), setShowModal(true))}
                                className={`
                                    h-28 rounded-2xl border-2 flex flex-col items-center justify-center relative transition-all duration-300
                                    ${isFree 
                                        ? 'bg-white border-green-100 text-gray-700 hover:border-green-500 hover:shadow-lg cursor-pointer active:scale-95' 
                                        : 'bg-gray-100 border-transparent text-gray-400 cursor-not-allowed opacity-70 grayscale'}
                                `}
                            >
                                <LayoutGrid size={28} className={isFree ? "text-indigo-500 mb-2" : "text-gray-400 mb-2"} />
                                <span className="font-bold text-sm">{table.name}</span>
                                <span className="text-[10px] uppercase font-bold tracking-wider mt-1">{table.capacity} GHẾ</span>
                                
                                {/* Status Dot */}
                                <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ring-2 ring-white ${isFree ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-400'}`}></div>
                            </div>
                        )
                    })
                )}
            </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && selectedTable && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-sm p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
                  <div className="text-center mb-6">
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <CheckCircle size={24}/>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Xác nhận đặt bàn</h3>
                      <p className="text-indigo-600 font-medium">Bàn {selectedTable.name} ({selectedTable.capacity} người)</p>
                  </div>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Họ tên</label>
                          <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
                              <User size={18} className="text-gray-400 mr-3"/>
                              <input 
                                className="bg-transparent w-full outline-none text-sm font-medium text-gray-800" 
                                placeholder="Nhập tên của bạn" 
                                value={guestName} 
                                onChange={e=>setGuestName(e.target.value)}
                              />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Số điện thoại</label>
                          <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
                              <Phone size={18} className="text-gray-400 mr-3"/>
                              <input 
                                className="bg-transparent w-full outline-none text-sm font-medium text-gray-800" 
                                placeholder="Nhập số điện thoại" 
                                type="tel" 
                                value={guestPhone} 
                                onChange={e=>setGuestPhone(e.target.value)}
                              />
                          </div>
                      </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                      <button onClick={()=>setShowModal(false)} className="flex-1 py-3.5 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition">Hủy</button>
                      <button onClick={submitBooking} className="flex-1 py-3.5 text-white font-bold bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition active:scale-95">Đặt Bàn</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}