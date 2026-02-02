import { Outlet } from "react-router-dom";
import {AdminSidebar} from "../components/Sidebar/AdminSidebar";
import { AdminHeader } from "@/admin/components";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="ml-64 flex min-h-screen flex-col">
        {/* Header */}
        <AdminHeader title="Dashboard" />

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
