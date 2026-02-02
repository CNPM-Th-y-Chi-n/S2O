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
  const activeTables = mockTables.filter(t => t.status === "occupied").length;

  const ordersByHour = [
    { hour: "9AM", orders: 12 },
    { hour: "10AM", orders: 18 },
    { hour: "11AM", orders: 25 },
    { hour: "12PM", orders: 42 },
    { hour: "1PM", orders: 38 },
    { hour: "2PM", orders: 28 },
    { hour: "3PM", orders: 15 },
    { hour: "4PM", orders: 10 },
  ];

  const orderTypeData = [
    { name: "Dine In", value: orders.filter(o => o.type === "dine-in").length },
    { name: "Take Away", value: orders.filter(o => o.type === "take-away").length },
  ];

  const COLORS = ["#2563eb", "#f97316"];

  const statCards = [
    {
      label: "Today's Orders",
      value: stats.todayOrders,
      icon: ShoppingCart,
      trend: "+12%",
    },
    {
      label: "Active Tables",
      value: activeTables,
      icon: Table,
      trend: `${activeTables}/${mockTables.length}`,
    },
    {
      label: "Orders in Progress",
      value: stats.activeOrders,
      icon: Clock,
    },
    {
      label: "Today's Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
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
            <div key={i} className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between mb-4">
                <Icon className="w-6 h-6 text-blue-600" />
                {stat.trend && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border">
          <h3 className="font-semibold mb-4">Orders by Hour</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersByHour}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-semibold mb-4">Order Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={orderTypeData} dataKey="value" outerRadius={80} label>
                {orderTypeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
