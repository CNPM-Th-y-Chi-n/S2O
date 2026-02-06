import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios"; 
import {
  ChefHat,
  Menu,
  ClipboardList,
  Bell,
  ChevronDown,
  User,
  AlertCircle,
  Loader2
} from "lucide-react";

// Giữ nguyên đường dẫn import của bạn
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // --- STATE ---
  const [showStaffAlert, setShowStaffAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [isOccupied, setIsOccupied] = useState(false); 
  
  // 1. Lấy ID từ URL hoặc LocalStorage
  const urlTableId = searchParams.get('tableId');
  const urlRestaurantId = searchParams.get('restaurantId');

  const [tableId, setTableId] = useState(urlTableId || localStorage.getItem('tableId') || "");
  const [restaurantId, setRestaurantId] = useState(urlRestaurantId || localStorage.getItem('restaurantId') || "");

  const [displayTable, setDisplayTable] = useState("Scan QR");

  // --- EFFECT 1: Sync URL & LocalStorage ---
  useEffect(() => {
    if (urlTableId && urlRestaurantId) {
      setTableId(urlTableId);
      setRestaurantId(urlRestaurantId);
      localStorage.setItem('tableId', urlTableId);
      localStorage.setItem('restaurantId', urlRestaurantId);
    }
  }, [urlTableId, urlRestaurantId]);

  // --- EFFECT 2: Hiển thị tên bàn ---
  useEffect(() => {
    if (tableId) {
      setDisplayTable(`Table ${tableId.toString().padStart(2, '0')}`);
    }
  }, [tableId]);

  // --- EFFECT 3: (QUAN TRỌNG - ĐÃ SỬA LỖI) ---
  useEffect(() => {
    const checkTableStatus = async () => {
      if (!tableId) {
        setIsLoading(false);
        return;
      }

      try {
        console.log("🔍 Đang kiểm tra bàn:", tableId);

        // Gọi API (Đảm bảo IP máy bạn đúng)
        const res = await axios.get(`http://192.168.1.96:5000/api/table/status?tableId=${tableId}`);
        
        console.log("📡 Kết quả từ Server:", res.data); // Hãy xem dòng này ở Console (F12)

        // --- SỬA LỖI Ở ĐÂY ---
        // 1. toString(): Chuyển thành chuỗi để tránh lỗi
        // 2. trim(): Cắt bỏ khoảng trắng thừa (Quan trọng nhất)
        // 3. toLowerCase(): Chuyển về chữ thường để so sánh
        const status = res.data.status ? res.data.status.toString().trim().toLowerCase() : "";

        console.log("Status sau khi xử lý:", status);

        if (status === 'occupied') {
            setIsOccupied(true); // Kích hoạt màn hình chặn
        } else {
            setIsOccupied(false);
        }
      } catch (error) {
        console.error("❌ Lỗi kiểm tra bàn:", error);
      } finally {
        setIsLoading(false); 
      }
    };

    checkTableStatus();
  }, [tableId]); 

  // --- LOGIC ĐIỀU HƯỚNG ---
  const handleViewMenu = () => {
    if (!restaurantId) return alert("⚠️ Vui lòng quét mã QR!");
    navigate(`/menu?restaurantId=${restaurantId}&tableId=${tableId}`);
  };

  const handleViewOrder = () => {
    if (!restaurantId) return alert("Chưa xác định bàn!");
    navigate(`/guest-order?restaurantId=${restaurantId}&tableId=${tableId}`);
  };

  const handleLogin = () => navigate("/login");

  const handleCallStaff = () => {
    if (!tableId) return alert("Vui lòng quét mã QR.");
    setShowStaffAlert(true);
    setTimeout(() => setShowStaffAlert(false), 3000);
  };

  // ==========================================
  // 1. MÀN HÌNH LOADING
  // ==========================================
  if (isLoading) {
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
            <p className="text-gray-500 text-sm">Đang kết nối đến bàn {tableId}...</p>
        </div>
    );
  }

  // ==========================================
  // 2. MÀN HÌNH CHẶN (OCCUPIED)
  // ==========================================
  if (isOccupied) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 animate-in fade-in">
        <Card className="w-full max-w-sm shadow-xl border-none">
            <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Bàn đang phục vụ</h2>
                    <p className="text-gray-500 text-sm">
                        Hệ thống ghi nhận <b>{displayTable}</b> đang có khách.
                    </p>
                </div>

                <div className="space-y-3">
                    <Button 
                        onClick={handleViewOrder}
                        className="w-full py-6 bg-orange-600 hover:bg-orange-700 text-lg font-bold shadow-lg shadow-orange-200"
                    >
                        Xem đơn món của tôi
                    </Button>

                    <Button 
                        onClick={() => setIsOccupied(false)} 
                        variant="outline"
                        className="w-full py-6 text-gray-600 hover:bg-gray-50"
                    >
                        Tôi muốn gọi thêm món
                    </Button>
                </div>
                
                <p className="text-xs text-gray-400">
                    Nếu bạn mới đến và thấy thông báo này, vui lòng liên hệ nhân viên.
                </p>
            </CardContent>
        </Card>
      </div>
    );
  }

  // ==========================================
  // 3. MÀN HÌNH CHÍNH
  // ==========================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 p-4">
      <div className="flex justify-between items-center max-w-md mx-auto mb-6">
        <div className="flex items-center gap-2">
          <ChefHat className="w-8 h-8 text-orange-600" />
          <span className="font-semibold text-lg">The Savory Kitchen</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogin} className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Login
        </Button>
      </div>

      <div className="max-w-md mx-auto">
        {/* TABLE INFO */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border ${restaurantId ? 'border-green-200' : 'border-orange-200'}`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${restaurantId ? 'bg-green-500' : 'bg-orange-500'}`} />
            <span className="text-neutral-600 font-medium">
              {restaurantId ? displayTable : "Chưa xác định bàn"}
            </span>
          </div>
          {!restaurantId && (
            <p className="text-xs text-orange-600 mt-2">
              *Vui lòng quét mã QR dán trên bàn
            </p>
          )}
        </div>

        {/* STAFF ALERT */}
        {showStaffAlert && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <Bell className="w-5 h-5 text-green-600" />
            <p className="text-green-800 text-sm">
              Đã gọi nhân viên! Vui lòng đợi trong giây lát.
            </p>
          </div>
        )}

        {/* ACTIONS */}
        <Card className="shadow-lg border-none">
          <CardContent className="p-6 space-y-3">
            {/* VIEW MENU */}
            <Button
              onClick={handleViewMenu}
              className="w-full py-8 bg-orange-600 hover:bg-orange-700 text-white flex justify-between shadow-md transition-transform active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <Menu className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">Gọi Món</div>
                  <div className="text-xs opacity-90">Xem thực đơn & đặt món</div>
                </div>
              </div>
              <ChevronDown className="w-5 h-5" />
            </Button>

            {/* VIEW ORDER */}
            <Button
              onClick={handleViewOrder}
              variant="outline"
              className="w-full py-6 flex justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full bg-gray-100">
                    <ClipboardList className="w-6 h-6 text-gray-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-700">Đơn Đã Gọi</div>
                  <div className="text-xs text-neutral-500">Kiểm tra món đã đặt</div>
                </div>
              </div>
            </Button>

            {/* CALL STAFF */}
            <Button
              onClick={handleCallStaff}
              variant="outline"
              className="w-full py-6 border-red-100 hover:border-red-200 hover:bg-red-50 flex justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full bg-red-50">
                    <Bell className="w-6 h-6 text-red-500 group-hover:animate-bounce" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-red-600">Gọi Nhân Viên</div>
                  <div className="text-xs text-red-400">Hỗ trợ / Tính tiền</div>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* FOOTER */}
        <p className="text-center text-xs text-neutral-400 mt-8">
          Scan2Order (S2O) • Powered by QR Technology
        </p>
      </div>
    </div>
  );
}