import {
  LayoutDashboard,
  Store,
  Users,
  ShoppingCart,
  DollarSign,
  CreditCard,
  MessageSquare,
  Brain,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/app/components/ui/utils";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Restaurants Management", icon: Store, path: "/admin/restaurants" },
  { label: "Users Management", icon: Users, path: "/admin/users" },
  { label: "Orders Management", icon: ShoppingCart, path: "/admin/orders" },
  { label: "Payments & Revenue", icon: DollarSign, path: "/admin/payments" },
  { label: "Subscriptions & Plans", icon: CreditCard, path: "/admin/subscriptions" },
  { label: "Reviews & Reports", icon: MessageSquare, path: "/admin/reviews" },
  { label: "AI Analytics", icon: Brain, path: "/admin/analytics" },
  { label: "System Settings", icon: Settings, path: "/admin/settings" },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="text-xl font-semibold">S2O Admin</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-blue-700" : "text-gray-500"
                )}
              />
              <span className={cn("text-sm", isActive && "font-medium")}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
