import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";


// pages
import {DashboardPage} from "../pages/Dashboard/DashboardPage";
import {AnalyticsPage} from "../pages/Analytics/AnalyticsPage";
import {OrdersPage} from "../pages/Orders/OrdersPage";
import {PaymentsPage} from "../pages/Payments/PaymentsPage";
import {RestaurantsPage} from "../pages/Restaurants/RestaurantsPage";
import {ReviewsPage} from "../pages/Reviews/ReviewsPage";
import {UsersPage} from "../pages/Users/UsersPage";
import {SubscriptionsPage} from "../pages/Subscriptions/SubscriptionsPage";
import {SettingsPage} from "../pages/Settings/SettingsPage";



export default function AdminRouter() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        {/* /admin */}
        <Route index element={<DashboardPage />} />

        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="restaurants" element={<RestaurantsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="subscriptions" element={<SubscriptionsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
