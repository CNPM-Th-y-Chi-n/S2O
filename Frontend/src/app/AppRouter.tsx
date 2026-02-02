import { Routes, Route } from "react-router-dom";

import OrderGuest from "./pages/OrderGuest";
import LandingPage from "./pages/LandingPage";
import MenuPage from "./pages/MenuPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SignupPage from "./pages/SignupPage";

import { OrderHistoryScreen } from "@/customer/screens/OrderHistoryScreen";
import { AIChatScreen } from "@/customer/screens/AIChatScreen";
import { ProfileScreen } from "@/customer/screens/ProfileScreen";
import { HomeScreen } from "@/customer/screens/HomeScreen";
import RestaurantDetailScreen from "@/customer/screens/RestaurantDetailScreen";
import { FavoritesScreen } from "@/customer/screens/FavoritesScreen";
import Myreviews from "@/customer/screens/MyReviews";
import AccountSettings from "../customer/screens/AccountSettings";

import CustomerLayout from "../layouts/CustomerLayout";
import AdminRouter from "@/admin/routes/AdminRouter";
import StaffRouter from "@/restaurantstaff/routes/StaffRouter";
import { AppProvider } from "@/restaurantstaff/context/AppContext";
import TermsPage from "./pages/TermsPage"; 
import { CartProvider } from "@/app/context/CartContext";

export default function AppRouter() {
  return (
    <CartProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/guest-order" element={<OrderGuest />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* 👇 CUSTOMER ROUTES (Sửa đoạn này) */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<HomeScreen />} />
          <Route path="home" element={<HomeScreen />} />
          <Route path="restaurant/:id" element={<RestaurantDetailScreen />} />
          <Route path="ai" element={<AIChatScreen />} />
          <Route path="profile" element={<ProfileScreen />} />
          <Route path="reviews" element={<Myreviews />} />
          <Route path="settings" element={<AccountSettings />} />
          
          {/* ✅ Đã có orders, nhưng link phải đúng là /customer/orders */}
          <Route path="orders" element={<OrderHistoryScreen />} /> 

          {/* ✅ THÊM 3 ROUTE CÒN THIẾU (Dùng tạm div để hiển thị) */}
          <Route path="favorites" element={<FavoritesScreen />} />
          <Route path="reviews" element={<div className="p-4">⭐ Trang Đánh Giá (Đang phát triển)</div>} />
          <Route path="settings" element={<div className="p-4">⚙️ Trang Cài Đặt (Đang phát triển)</div>} />
        </Route>

        {/* Admin & Staff Routes */}
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="/staff/*"
          element={
            <AppProvider>
              <StaffRouter />
            </AppProvider>
          }
        />
      </Routes>
    </CartProvider>
  );
}