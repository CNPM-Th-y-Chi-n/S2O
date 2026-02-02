import React from "react";
import { mockOrders, mockTables, getDashboardStats } from "../data/mockData";
import {
  ShoppingCart,
  Table,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function Dashboard() {
  const orders = mockOrders;
  const stats = getDashboardStats(orders);
  
  // Tỷ giá quy đổi (Giả định 1 'mock unit' = 30.000 VND)
  const EXCHANGE_RATE = 30000;

  const activeTables = mockTables.filter(t => t.status === "occupied").length;

  const ordersByHour = [
    { hour: "9:00", orders: 12 },
    { hour: "10:00", orders: 18 },
    { hour: "11:00", orders: 25 },
    { hour: "12:00", orders: 42 },
    { hour: "13:00", orders: 38 },
    { hour: "14:00", orders: 28 },
    { hour: "15:00", orders: 15 },
    { hour: "16:00", orders: 10 },
  ];

  const orderTypeData = [
    { name: "Tại bàn", value: orders.filter(o => o.type === "dine-in").length },
    { name: "Mang về", value: orders.filter(o => o.type === "take-away").length },
  ];

  const COLORS = ["#2563eb", "#f97316"];

  const statCards = [
    {
      label: "Đơn hàng hôm nay",
      value: stats.todayOrders,
      icon: ShoppingCart,
      trend: "+12%",
    },
    {
      label: "Bàn có khách",
      value: activeTables,
      icon: Table,
      trend: `${activeTables}/${mockTables.length}`,
    },
    {
      label: "Đơn đang xử lý",
      value: stats.activeOrders,
      icon: Clock,
      trend: null,
    },
    {
      label: "Doanh thu ngày",
      // 👇 SỬA Ở ĐÂY: Nhân với 25000 để ra tiền Việt hợp lý
      value: `${(stats.totalRevenue * EXCHANGE_RATE).toLocaleString('vi-VN')} ₫`,
      icon: DollarSign,
      trend: "+8%",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex justify-between mb-4">
                <Icon className="w-6 h-6 text-blue-600" />
                {stat.trend && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="font-semibold mb-4 text-gray-800">Lưu lượng đơn hàng theo giờ</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersByHour}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="hour" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="orders" name="Số đơn" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="font-semibold mb-4 text-gray-800">Loại hình phục vụ</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={orderTypeData} 
                dataKey="value" 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {orderTypeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}