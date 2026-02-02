import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { StaffLayout } from "./StaffLayout";

export default function StaffLayoutWrapper() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentView = location.pathname.split("/").pop() || "dashboard";

  const onViewChange = (view: string) => {
    const base = location.pathname.split("/").slice(0, 3).join("/");
    navigate(`${base}/${view}`);
  };

  return (
    <StaffLayout currentView={currentView} onViewChange={onViewChange}>
      <Outlet />
    </StaffLayout>
  );
}
