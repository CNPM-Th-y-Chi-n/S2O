import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, MapPin, Utensils, LayoutGrid, User, Phone, CheckCircle, Heart, Calendar, Clock 
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

// Cập nhật interface Table để chấp nhận cả id thường và TableID từ SQL
interface Table {
  id?: number | string;
  TableID?: number | string; // Quan trọng: Khớp với SQL
  name?: string;
  TableName?: string;        // Quan trọng: Khớp với SQL
  status: 'Available' | 'Occupied' | 'Reserved' | 'Booked'; 
  capacity: number;
}

export default function RestaurantDetailScreen() {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const location = useLocation();

  // State Data
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
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  // Favorite State
  const [isLiked, setIsLiked] = useState(false);

  // --- GET USER ID ---
  const getUserId = () => {
    try {
        const userStr = localStorage.getItem("user");
        if (userStr && userStr !== "undefined" && userStr !== "null") {
            const user = JSON.parse(userStr);
            // Kiểm tra mọi trường hợp có thể của ID
            return user.id || user.userId || user.UserID || user.user_id; 
        }
        const simpleId = localStorage.getItem("userId");
        if (simpleId && simpleId !== "undefined") return simpleId;
    } catch (e) { return null; }
    return null;
  };

  const currentUserId = getUserId();

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchRealData = async () => {
      if (!restaurant) setLoading(true);
      try {
        const res = await api.get(`/restaurants/${paramId}`);
        setRestaurant(res.data);
        if (res.data.menu) setMenuItems(res.data.menu);
        if (res.data.tables) {
            console.log("🔥 Danh sách bàn từ API:", res.data.tables); // Debug xem cấu trúc bàn
            setTables(res.data.tables);
        }
        if (currentUserId && paramId) checkIfLiked(currentUserId, paramId);
      } catch (err) { console.error("Lỗi API:", err); } 
      finally { setLoading(false); }
    };
    if (paramId) fetchRealData();
  }, [paramId]); 

  const checkIfLiked = async (userId: any, restaurantId: any) => {
      try {
          const res = await api.get(`/users/${userId}/favorites`);
          const found = res.data.some((fav: any) => fav.id === Number(restaurantId));
          setIsLiked(found);
      } catch (error) {}
  };

  const handleToggleFavorite = async () => {
      if (!currentUserId) {
          if (window.confirm("Bạn cần đăng nhập để lưu yêu thích. Đi đến trang đăng nhập?")) navigate('/login');
          return;
      }
      const previousState = isLiked;
      setIsLiked(!previousState);
      try {
          if (previousState) await api.delete(`/users/${currentUserId}/favorites/${paramId}`);
          else await api.post(`/users/${currentUserId}/favorites`, { restaurant_id: paramId });
      } catch (error) { setIsLiked(previousState); }
  };

  // --- 2. XỬ LÝ ĐẶT BÀN (Final Fix) ---
  const submitBooking = async () => {
      // 1. Validate Input
      if (!guestName.trim() || !guestPhone.trim() || !bookingDate || !bookingTime) {
          return alert("Vui lòng nhập đầy đủ: Tên, SĐT, Ngày và Giờ!");
      }

      if (!currentUserId) {
          alert("Phiên đăng nhập hết hạn.");
          navigate('/login');
          return;
      }

      if (!selectedTable || !restaurant) return;

      // 2. Lấy ID chuẩn xác
      // Ưu tiên lấy TableID nếu có, nếu không thì lấy id
      const finalTableId = Number(selectedTable.TableID || selectedTable.id);
      const finalRestaurantId = Number(restaurant.id);
      const finalUserId = Number(currentUserId);
      const reservationTime = `${bookingDate} ${bookingTime}:00`;

      // 3. CHIẾN THUẬT "BAO VÂY": Gửi mọi kiểu tên biến có thể (Snake, Pascal, Camel)
      // Server sẽ tự lấy cái nó cần và bỏ qua cái thừa
      const payload = {
          // --- Kiểu 1: Snake Case (Chuẩn Python/Flask) ---
          restaurant_id: finalRestaurantId,
          table_id: finalTableId,
          user_id: finalUserId,
          reservation_time: reservationTime,
          guest_name: guestName.trim(),
          guest_phone: guestPhone.trim(),

          // --- Kiểu 2: Pascal Case (Chuẩn C#/SQL) ---
          RestaurantID: finalRestaurantId,
          TableID: finalTableId,
          UserID: finalUserId,
          ReservationTime: reservationTime,
          GuestName: guestName.trim(),
          GuestPhone: guestPhone.trim(),
          
          // --- Kiểu 3: Camel Case (Chuẩn JS) ---
          restaurantId: finalRestaurantId,
          tableId: finalTableId,
          userId: finalUserId,
          reservationTime: reservationTime,
          guestName: guestName.trim(),
          guestPhone: guestPhone.trim(),
          
          // Các trường phụ trợ (đề phòng backend cần)
          number_of_guests: selectedTable.capacity,
          note: "Đặt bàn từ App Mobile"
      };

      console.log("📤 Payload Bao Vây:", payload);

      try {
          const response = await api.post('/restaurants/book-table', payload);
          
          if (response.status === 200 || response.status === 201) {
              alert(`✅ Đặt bàn thành công!\nBàn số: ${selectedTable.name || finalTableId}`);
              setShowModal(false);
              
              // Cập nhật trạng thái bàn trên UI
              setTables(prev => prev.map(t => 
                  (t.id === selectedTable.id || t.TableID === selectedTable.TableID) 
                  ? {...t, status: 'Booked'} : t
              ));
          }
      } catch (error: any) {
          console.error("❌ Lỗi Server:", error);
          
          let serverMessage = "Lỗi không xác định";
          if (error.response?.data) {
              // Lấy message chuẩn nhất từ backend
              serverMessage = error.response.data.message || 
                              error.response.data.error || 
                              JSON.stringify(error.response.data);
          }
          
          alert(`⚠️ Đặt bàn thất bại!\nLý do: ${serverMessage}`);
      }
  };

  const handleOpenModal = (table: Table) => {
      console.log("🛠 Mở modal bàn:", table); // Debug xem bàn được chọn có ID không
      setSelectedTable(table);
      const now = new Date();
      setBookingDate(now.toISOString().split('T')[0]); 
      setBookingTime(`${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`);
      setShowModal(true);
  };

  if (loading || !restaurant) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Header Image */}
      <div className="relative h-64 w-full">
        <img src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white/30 p-2 rounded-full text-white backdrop-blur-sm"><ArrowLeft size={24} /></button>
        <button onClick={handleToggleFavorite} className="absolute top-4 right-4 bg-white/30 p-2 rounded-full backdrop-blur-sm"><Heart size={24} className={isLiked ? "fill-red-500 text-red-500" : "text-white"} /></button>
        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
           <h1 className="text-3xl font-bold">{restaurant.name}</h1>
           <div className="flex items-center gap-2 mt-2 opacity-90 text-sm font-medium"><MapPin size={16} className="text-yellow-400"/> {restaurant.address}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white shadow-sm sticky top-0 z-20">
        <button onClick={() => setActiveTab('menu')} className={`flex-1 py-4 text-sm font-bold border-b-2 ${activeTab==='menu'?'border-indigo-600 text-indigo-600':'border-transparent text-gray-400'}`}>THỰC ĐƠN</button>
        <button onClick={() => setActiveTab('table')} className={`flex-1 py-4 text-sm font-bold border-b-2 ${activeTab==='table'?'border-indigo-600 text-indigo-600':'border-transparent text-gray-400'}`}>ĐẶT BÀN ({tables.length})</button>
      </div>

      {/* Content */}
      <div className="p-4 max-w-lg mx-auto">
        {activeTab === 'menu' && (
            <div className="space-y-4">
                {menuItems.map((item, i) => (
                    <div key={i} className="flex bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                        <img src={item.image} className="w-24 h-24 rounded-xl object-cover bg-gray-100" onError={(e)=>(e.target as any).src="https://placehold.co/100"} />
                        <div className="ml-4 flex-1 flex flex-col justify-between py-1">
                            <h4 className="font-bold text-gray-800">{item.name}</h4>
                            <span className="text-indigo-600 font-bold">{item.price?.toLocaleString()}đ</span>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'table' && (
            <div className="grid grid-cols-3 gap-4">
                {tables.map((table, i) => {
                    // Logic hiển thị bàn: Kiểm tra cả status null hoặc 'Available'
                    const isFree = table.status === 'Available' || table.status === null;
                    const displayName = table.TableName || table.name || `Bàn ${i + 1}`;
                    
                    return (
                        <div key={i} onClick={() => isFree && handleOpenModal(table)}
                            className={`h-28 rounded-2xl border-2 flex flex-col items-center justify-center relative ${isFree ? 'bg-white border-green-100 cursor-pointer hover:border-green-500' : 'bg-gray-100 border-transparent opacity-70 cursor-not-allowed'}`}>
                            <LayoutGrid size={28} className={isFree ? "text-indigo-500 mb-2" : "text-gray-400 mb-2"} />
                            <span className="font-bold text-sm text-center px-1 truncate w-full">{displayName}</span>
                            <span className="text-[10px] uppercase font-bold text-gray-400">{table.capacity} Ghế</span>
                            <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${isFree ? 'bg-green-500' : 'bg-red-400'}`}></div>
                        </div>
                    )
                })}
            </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && selectedTable && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white w-full max-w-sm p-6 rounded-3xl shadow-2xl animate-in zoom-in-95">
                  <div className="text-center mb-6">
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3"><CheckCircle size={24}/></div>
                      <h3 className="text-xl font-bold">Xác nhận đặt bàn</h3>
                      <p className="text-indigo-600 font-medium">{selectedTable.TableName || selectedTable.name}</p>
                  </div>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Họ tên</label>
                          <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border focus-within:border-indigo-500">
                              <User size={18} className="text-gray-400 mr-3"/>
                              <input className="bg-transparent w-full outline-none text-sm" placeholder="Tên của bạn" value={guestName} onChange={e=>setGuestName(e.target.value)}/>
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Số điện thoại</label>
                          <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border focus-within:border-indigo-500">
                              <Phone size={18} className="text-gray-400 mr-3"/>
                              <input className="bg-transparent w-full outline-none text-sm" placeholder="SĐT liên hệ" type="tel" value={guestPhone} onChange={e=>setGuestPhone(e.target.value)}/>
                          </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ngày</label>
                            <div className="flex items-center bg-gray-50 rounded-xl px-3 py-3 border focus-within:border-indigo-500">
                                <Calendar size={18} className="text-gray-400 mr-2"/>
                                <input type="date" className="bg-transparent w-full outline-none text-sm" value={bookingDate} onChange={e => setBookingDate(e.target.value)}/>
                            </div>
                        </div>
                        <div className="w-1/3">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Giờ</label>
                            <div className="flex items-center bg-gray-50 rounded-xl px-3 py-3 border focus-within:border-indigo-500">
                                <Clock size={18} className="text-gray-400 mr-2"/>
                                <input type="time" className="bg-transparent w-full outline-none text-sm" value={bookingTime} onChange={e => setBookingTime(e.target.value)}/>
                            </div>
                        </div>
                      </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                      <button onClick={()=>setShowModal(false)} className="flex-1 py-3 bg-gray-100 font-bold rounded-xl text-gray-600">Hủy</button>
                      <button onClick={submitBooking} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">Đặt Bàn</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}