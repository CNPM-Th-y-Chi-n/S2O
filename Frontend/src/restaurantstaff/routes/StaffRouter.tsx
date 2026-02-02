import { Routes, Route, Navigate } from "react-router-dom";

import RoleSelectScreen from "../screens/RoleSelectScreen";
import StaffLayout from "../layouts/StaffLayout";
import {KitchenLayout} from "../layouts/KitchenLayout";

import { Dashboard } from "../screens/Dashboard";
import  Orders  from "../screens/Orders";
import  Tables  from "../screens/Tables";
import  Menu  from "../screens/Menu";
import { Staff } from "../screens/Staff";
import { Settings } from "../screens/Settings";
import { Kitchen } from "../screens/Kitchen";

export default function StaffRouter() {
  return (
    <Routes>
      {/* ===== ROLE SELECT ===== */}
      <Route index element={<RoleSelectScreen />} />

      {/* ===== MANAGER ===== */}
      <Route path="manager" element={<StaffLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="tables" element={<Tables />} />
        <Route path="menu" element={<Menu />} />
        <Route path="staff" element={<Staff />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* ===== STAFF (PHỤC VỤ) ===== */}
      <Route path="staff" element={<StaffLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="tables" element={<Tables />} />
      </Route>

      {/* ===== KITCHEN ===== */}
      <Route path="kitchen" element={<KitchenLayout />}>
        <Route index element={<Kitchen />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/staff" replace />} />
    </Routes>
  );
}
