import { useState } from 'react';
import { Lock, Eye, EyeOff, User, ShieldCheck, ChefHat } from 'lucide-react';
import { useNavigate } from "react-router-dom";
// 👇 Đảm bảo đường dẫn này đúng với dự án của bạn
import api from "../../../services/api"; 

type UserRole = 'user' | 'admin' | 'staff';

export default function LoginForm() {
  const navigate = useNavigate();
  
  // State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(false);

  // Cấu hình giao diện cho từng Role
  const roles: { id: UserRole; label: string; icon: any; color: string }[] = [
    { id: 'user', label: 'Customer', icon: User, color: 'from-blue-500 to-blue-600' },
    { id: 'staff', label: 'Restaurant Staff', icon: ChefHat, color: 'from-orange-500 to-orange-600' },
    { id: 'admin', label: 'Administrator', icon: ShieldCheck, color: 'from-purple-500 to-purple-600' },
  ];

  const currentRole = roles.find(r => r.id === selectedRole) || roles[0];

  // =================================================================
  // 👇 HÀM XỬ LÝ ĐĂNG NHẬP (ĐÃ FIX LỖI UserID)
  // =================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loginData = {
      username: username,
      password: password,
    };

    console.log('🚀 Đang gửi login:', loginData);

    try {
      // 1. Gọi API
      const res = await api.post("/auth/login", loginData);

      // 2. Xử lý khi thành công
      if (res.status === 200) {
        console.log("📡 Full Server Response:", res.data);

        const data = res.data;
        
        // --- A. Lấy Token ---
        const token = data.token || data.accessToken || data.access_token;
        
        // --- B. Lấy Object User ---
        // Backend có thể trả về: { user: {...} } hoặc { data: {...} } hoặc phẳng {...}
        const userObj = data.user || data.data || data;

        // --- C. Lấy User ID (QUAN TRỌNG: Đã thêm UserID viết hoa) ---
        // Dựa vào ảnh database của bạn, cột tên là "UserID"
        const userId = userObj.UserID || userObj.id || userObj.userId || userObj.User_ID || userObj._id || data.UserID;

        console.log("✅ ID tìm thấy:", userId);

        if (!userId) {
            alert(`Lỗi: Không tìm thấy UserID. Server trả về: ${JSON.stringify(userObj)}`);
            setLoading(false);
            return;
        }

        if (!token) {
            alert("Lỗi: Server không trả về Token!");
            setLoading(false);
            return;
        }

        // --- D. Lưu vào LocalStorage ---
        localStorage.setItem('token', token);
        
        // 🔥 Lưu ID dưới dạng chuỗi (tránh undefined)
        localStorage.setItem('userId', String(userId)); 
        
        // Lưu toàn bộ object user để dùng chỗ khác
        localStorage.setItem('user', JSON.stringify(userObj));
        
        // Lưu role (Ưu tiên role từ DB trả về, nếu không có thì lấy role đang chọn)
        // Database của bạn cột Role viết hoa chữ R (Role), nên cần check cả userObj.Role
        const finalRole = userObj.Role || userObj.role || selectedRole;
        localStorage.setItem('role', finalRole);
        
        // Lưu Username (Database viết hoa chữ U: Username)
        const finalUsername = userObj.Username || userObj.username || username;
        localStorage.setItem('username', finalUsername);

        // --- E. Điều hướng ---
        alert(`Đăng nhập thành công! Xin chào ${finalUsername}`);

        const normalizedRole = String(finalRole).toLowerCase();
        
        if (normalizedRole === 'admin') {
           navigate('/admin');
        } else if (normalizedRole.includes('staff') || normalizedRole.includes('manager') || normalizedRole.includes('kitchen') || normalizedRole.includes('service')) {
           // Database bạn có các role: Manager, Kitchen, Service -> Đều cho vào trang staff
           navigate('/staff'); 
        } else {
           // Là Customer
           navigate('/customer/home'); 
        }
      }
    } catch (err: any) {
      console.error("❌ Lỗi đăng nhập:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại!";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
      
      {/* Header & Role Switcher */}
      <div className={`p-8 bg-gradient-to-r ${currentRole.color} text-white transition-all duration-500`}>
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
            <currentRole.icon size={40} className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-center text-white/80 text-sm">Sign in to continue to Scan2Order</p>

        {/* Role Selector Tabs */}
        <div className="flex justify-center mt-6 bg-black/10 p-1 rounded-xl">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
                selectedRole === role.id 
                  ? 'bg-white text-gray-900 shadow-md' 
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        
        {/* Username Input */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-600 ml-1">Username</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="Enter your username"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-600 ml-1">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600 cursor-pointer select-none">
              Remember me
            </label>
          </div>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r ${currentRole.color} text-white py-3.5 rounded-xl font-bold text-lg hover:shadow-xl transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {loading ? "Signing in..." : `Sign In as ${currentRole.label}`}
        </button>
      </form>

      {/* Sign Up Link (Chỉ hiện cho User) */}
      {selectedRole === 'user' && (
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate("/signup")}
              className="text-indigo-600 hover:text-indigo-700 font-bold"
            >
              Sign up now
            </button>
          </p>
        </div>
      )}
    </div>
  );
}