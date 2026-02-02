import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
// Thêm Loader2 để làm icon xoay khi loading
import { User, Mail, Lock, Eye, EyeOff, UserCircle, Loader2, AtSign } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

// Import API đã cấu hình
import { authApi } from "../../services/api"; 

export default function SignUpPage() {
  const navigate = useNavigate();

  // State quản lý Form
  const [fullName, setFullName] = useState(""); // Vẫn giữ state để UI không lỗi, nhưng sẽ không gửi đi
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // State hiển thị
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // State xử lý API
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset lỗi cũ

    // 1. Validate Client
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (!agreeToTerms) {
      setError("Vui lòng đồng ý với điều khoản sử dụng.");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Gọi API đăng ký
      // 🔥 SỬA QUAN TRỌNG: Chỉ gửi đúng những trường Backend Python chấp nhận
      const payload = {
        username: username,         
        password: password,
        passwordconfirm: confirmPassword, // Python đợi 'passwordconfirm' (chữ thường)
        email: email,
        
        // ❌ Đã bỏ fullName (Vì Backend chưa hỗ trợ)
        // ❌ Đã bỏ role (Vì Backend tự set mặc định, và để tránh lỗi typo "Costumer")
      };

      console.log("Đang gửi payload:", payload); // Log ra để kiểm tra
      await authApi.register(payload);

      // 3. Thành công -> Chuyển hướng sang Login
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");

    } catch (err: any) {
      console.error("Lỗi đăng ký:", err);
      
      // Lấy thông báo lỗi chi tiết từ Server nếu có
      let message = "Đăng ký thất bại. Vui lòng thử lại.";
      if (err.response && err.response.data) {
          // Nếu server trả về object lỗi (vd: {username: ["Taken"]})
          // Ta chuyển nó thành chuỗi dễ đọc
          message = JSON.stringify(err.response.data);
          
          // Hoặc nếu server trả về field message cụ thể
          if(err.response.data.message) message = err.response.data.message;
          if(err.response.data.error) message = err.response.data.error;
      }
      
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 opacity-20 blur-xl"></div>
          
          <div className="relative bg-white/95 backdrop-blur-xl m-[1px] rounded-3xl p-8">
            
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <UserCircle className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-gray-900 mb-2 text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Create Account</h1>
              <p className="text-gray-500 text-sm">Join us and start your journey</p>
            </div>

            {/* ERROR MESSAGE ALERT */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center animate-in slide-in-from-top-2 break-words">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignUp} className="space-y-4">
              
              {/* ⚠️ LƯU Ý: FullName hiện tại nhập vào nhưng KHÔNG được lưu 
                  vì Backend chưa hỗ trợ. Bạn có thể ẩn đi nếu muốn.
              */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-1">Full Name (Optional)</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all bg-white/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* 2. Username */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-1">Username</label>
                <div className="relative group">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                  <Input
                    type="text"
                    placeholder="johndoe123"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all bg-white/50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* 3. Email */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all bg-white/50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* 4. Password */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-12 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all bg-white/50 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 transition-colors p-1 hover:bg-violet-50 rounded-lg"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 5. Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 pr-12 h-12 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all bg-white/50 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 transition-colors p-1 hover:bg-violet-50 rounded-lg"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-3 py-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="large-checkbox mt-0.5"
                />
                <label htmlFor="terms" className="text-sm font-medium text-gray-600 leading-none cursor-pointer">
                  I agree to the{" "}
                  <Link to="/terms" className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-bold hover:underline">
                    Terms of Service
                  </Link>
                  {" "}and{" "}
                  <Link to="/terms" className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-bold hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading} // Khóa nút khi đang load
                className="relative w-full h-13 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-violet-400/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 group overflow-hidden mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </span>
                {!isLoading && (
                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </Button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent hover:from-violet-700 hover:to-purple-700 transition-all font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}