import LoginForm from "../components/auth/LoginForm";
import { useNavigate } from "react-router-dom";


export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 p-4">
      <LoginForm />
    </div>
  );
}
