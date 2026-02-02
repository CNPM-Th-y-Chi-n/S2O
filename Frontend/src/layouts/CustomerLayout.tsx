import { Outlet } from "react-router-dom";
import TopBar from "@/app/components/customer/TopBar";
import BottomNav from "../app/components/customer/BottomNav";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <main className="pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
