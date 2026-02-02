import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Utensils,
  Table2,
  LogOut,
} from "lucide-react";

interface Props {
  role: "manager" | "staff" | "kitchen";
}

export function StaffSidebar({ role }: Props) {
  const links = [
    { to: "", label: "Dashboard", icon: LayoutDashboard },
    { to: "orders", label: "Orders", icon: ClipboardList },
    { to: "tables", label: "Tables", icon: Table2 },
    ...(role === "manager"
      ? [{ to: "menu", label: "Menu", icon: Utensils }]
      : []),
  ];

  return (
    <aside className="w-64 bg-white border-r p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6 capitalize">
        {role} Panel
      </h2>

      <nav className="flex-1 space-y-1">
        {links.map(link => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.label}
              to={link.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Back to role select */}
      <NavLink
        to="/staff/select"
        className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg"
      >
        <LogOut className="w-4 h-4" />
        Change Role
      </NavLink>
    </aside>
  );
}
