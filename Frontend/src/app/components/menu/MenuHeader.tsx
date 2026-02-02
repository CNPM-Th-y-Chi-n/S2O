import { useNavigate } from "react-router-dom";

export default function MenuHeader() {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Restaurant Menu</h1>

        <button
          onClick={() => navigate("/login")}
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          Login
        </button>
      </div>
    </header>
  );
}
