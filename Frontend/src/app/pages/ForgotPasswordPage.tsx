import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reset password for:", email);
    setSubmitted(true);
  };

  return (
    <div className="login-bg p-4 flex items-center justify-center min-h-screen">
      <div className="glass-card w-full max-w-md relative">
        
        {/* Back to login */}
        <button
          onClick={() => navigate("/login")}
          className="absolute left-6 top-6 flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {!submitted ? (
          <>
            {/* Header */}
            <div className="text-center mb-8 mt-6">
              <div className="w-14 h-14 mx-auto mb-4 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Forgot your password?
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                Enter your email and we’ll send you a reset link
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full purple-gradient-btn py-4 rounded-xl shadow-lg shadow-indigo-200"
              >
                Send reset link
              </button>
            </form>
          </>
        ) : (
          /* Success state */
          <div className="text-center py-10">
            <div className="w-14 h-14 mx-auto mb-4 bg-green-500 rounded-xl flex items-center justify-center">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Check your email
            </h2>
            <p className="text-gray-600 text-sm">
              We’ve sent a password reset link to  
              <br />
              <span className="font-medium text-gray-800">{email}</span>
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-6 text-indigo-600 font-semibold hover:underline"
            >
              Back to Sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
