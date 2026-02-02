import { useState } from 'react';
import { Lock, Eye, EyeOff, User, ShieldCheck, ChefHat } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import api from "../../../services/api"; 

// Khai báo kiểu dữ liệu cho Role ở Frontend
type UserRole = 'user' | 'admin' | 'staff';

export default function LoginForm() {
  const navigate = useNavigate();
  
  // State quản lý form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(false);

  // Cấu hình giao diện cho từng vai trò
  const roles: { id: UserRole; label: string; icon: any; color: string; dbValue: string }[] = [
    { id: 'user', label: 'Customer', icon: User, color: 'from-blue-500 to-blue-600', dbValue: 'Customer' },
    { id: 'staff', label: 'Restaurant Staff', icon: ChefHat, color: 'from-orange-500 to-orange-600', dbValue: 'Staff' },
    { id: 'admin', label: 'Administrator', icon: ShieldCheck, color: 'from-purple-500 to-purple-600', dbValue: 'Admin' },
  ];

  const currentRole = roles.find(r => r.id === selectedRole) || roles[0];

  // =================================================================
  // XỬ LÝ ĐĂNG NHẬP
  // =================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Chuẩn bị dữ liệu gửi lên Backend
    // Gửi kèm 'role' để Backend đối chiếu với Role thực tế trong DB
    const loginData = {
      username: username,
      password: password,
      role: currentRole.dbValue // Gửi "Customer", "Staff" hoặc "Admin"
    };

    console.log('🚀 Gửi yêu cầu đăng nhập:', loginData);

    try {
      // 1. Gọi API Login
      const res = await api.post("/auth/login", loginData);

      if (res.status === 200) {
        const data = res.data;
        const token = data.token || data.accessToken;
        const userObj = data.user || data;

        // --- A. Lưu thông tin xác thực vào LocalStorage ---
        localStorage.setItem('token', token);
        
        // Lấy ID chuẩn từ DB (ưu tiên UserID viết hoa theo DB của bạn)
        const userId = userObj.UserID || userObj.id;
        localStorage.setItem('userId', String(userId)); 
        localStorage.setItem('user', JSON.stringify(userObj));
        
        // --- B. Lấy Role thật từ Database trả về ---
        const dbRole = (userObj.Role || userObj.role || '').toLowerCase();
        localStorage.setItem('role', dbRole);
        
        const finalUsername = userObj.Username || userObj.username || username;
        localStorage.setItem('username', finalUsername);

        console.log("✅ Đăng nhập thành công. Role thực tế:", dbRole);

        // --- C. ĐIỀU HƯỚNG DỰA TRÊN ROLE THỰC TẾ ---
        if (dbRole === 'admin') {
          navigate('/admin');
        } else if (['staff', 'manager', 'kitchen', 'service'].includes(dbRole)) {
          // Gom nhóm các role nhân viên vào trang staff
          navigate('/staff'); 
        } else {
          // Mặc định là khách hàng
          navigate('/customer/home'); 
        }
      }
    } catch (err: any) {
      console.error("❌ Lỗi đăng nhập:", err);
      
      // Lấy thông báo lỗi từ Backend (Ví dụ: "Tài khoản không có quyền Admin")
      const errorMessage = err.response?.data?.error || 
                           err.response?.data?.message || 
                           "Đăng nhập thất bại. Vui lòng kiểm tra lại!";
      
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
        <p className="text-center text-white/80 text-sm">Sign in as {currentRole.label}</p>

        {/* Role Selector Tabs */}
        <div className="flex justify-center mt-6 bg-black/10 p-1 rounded-xl">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
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

      {/* Form đăng nhập */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        
        {/* Username */}
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
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="Enter your username"
            />
          </div>
        </div>

        {/* Password */}
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
              className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Remember & Forgot */}
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

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r ${currentRole.color} text-white py-3.5 rounded-xl font-bold text-lg hover:shadow-xl transition-all shadow-md active:scale-95 disabled:opacity-70`}
        >
          {loading ? "Signing in..." : `Sign In as ${currentRole.label}`}
        </button>
      </form>

      {/* Link đăng ký - Chỉ hiện khi chọn vai trò User */}
      {selectedRole === 'user' && (
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
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