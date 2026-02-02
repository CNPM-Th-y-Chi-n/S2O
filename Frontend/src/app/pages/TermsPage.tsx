import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Điều khoản & Bảo mật</h1>
        
        {/* Nội dung bạn yêu cầu */}
        <p className="text-xl text-violet-600 font-medium mb-8">
          Không có gì
        </p>

        <button
          onClick={() => navigate(-1)} // Quay lại trang trước
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
      </div>
    </div>
  );
}