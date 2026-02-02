import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useApp } from "../context/AppContext";

export default function StaffLayout() {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  // 🔴 Nếu vào thẳng mà chưa chọn role → quay lại role select
  useEffect(() => {
    if (!currentUser) {
      navigate("/staff", { replace: true });
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const basePath =
    currentUser.role === "manager"
      ? "/staff/manager"
      : "/staff/staff";

  const go = (path: string) => {
    navigate(path ? `${basePath}/${path}` : basePath);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r p-4 space-y-2">
        <h2 className="font-bold text-lg mb-4">Staff Panel</h2>

        <button onClick={() => go("")} className="block w-full text-left">
          Dashboard
        </button>

        <button onClick={() => go("orders")} className="block w-full text-left">
          Orders
        </button>

        <button onClick={() => go("tables")} className="block w-full text-left">
          Tables
        </button>

        {currentUser.role === "manager" && (
          <>
            <button onClick={() => go("menu")} className="block w-full text-left">
              Menu
            </button>
            <button onClick={() => go("staff")} className="block w-full text-left">
              Staff
            </button>
            <button onClick={() => go("settings")} className="block w-full text-left">
              Settings
            </button>
          </>
        )}

        <hr className="my-3" />

        {/* 🔙 BACK TO ROLE */}
        <button
          onClick={() => navigate("/staff")}
          className="text-sm text-red-600"
        >
          ← Change role
        </button>
      </aside>

      {/* ================= CONTENT ================= */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
