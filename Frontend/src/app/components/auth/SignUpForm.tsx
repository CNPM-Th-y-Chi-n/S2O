import React from "react";
import { Mail, Lock, Eye, User, Chrome, ArrowLeft } from "lucide-react";

const SignUpForm = () => {
  return (
    <div className="login-bg p-4 flex items-center justify-center min-h-screen">
      <div className="glass-card w-full max-w-[480px] p-8 flex flex-col items-center relative">
        
        {/* Nút quay lại trang Login */}
        <button className="absolute left-6 top-8 text-gray-400 hover:text-indigo-600 transition flex items-center gap-1 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header Section */}
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 mt-4">
          <User className="text-white w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-500 mb-8 text-center">Join us and start your journey</p>

        
        {/* Form Fields */}
        <div className="w-full space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input 
                type="email" 
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input 
                type="password" 
                placeholder="Create a password"
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <Eye className="absolute right-3 top-3 text-gray-400 w-5 h-5 cursor-pointer hover:text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Terms and Privacy */}
        <div className="w-full mt-6 mb-8">
          <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" className="mt-1 rounded text-indigo-600 focus:ring-indigo-500" />
            <span>
              I agree to the <a href="#" className="text-indigo-600 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 font-semibold hover:underline">Privacy Policy</a>
            </span>
          </label>
        </div>

        {/* Register Button */}
        <button className="w-full purple-gradient-btn text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transform active:scale-[0.98] transition-transform">
          Create Account
        </button>

        {/* Footer */}
        <p className="mt-8 text-sm text-gray-500">
          Already have an account? <a href="#" className="text-indigo-600 font-bold hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;