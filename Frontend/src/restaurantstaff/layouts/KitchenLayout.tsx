import { Outlet, useNavigate } from "react-router-dom";

export function KitchenLayout() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <header className="p-4 border-b border-gray-700 flex justify-between">
        <h1 className="font-bold text-lg">Kitchen Display</h1>
        <button
          onClick={() => navigate("/staff")}
          className="text-sm underline"
        >
          ← Back to role selection
        </button>
      </header>

      {/* ⬅️ BẮT BUỘC */}
      <main className="flex-1 p-4 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
