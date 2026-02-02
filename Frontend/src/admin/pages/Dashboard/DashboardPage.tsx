import { Store, ShoppingCart, DollarSign, Users, Eye, Edit, X } from "lucide-react";
import { KPICard } from "@/admin/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { StatusBadge } from "@/admin/components";
import { Button } from "@/app/components/ui/button";

const ordersRevenueData = [
  { date: "Dec 1", orders: 45, revenue: 12500 },
  { date: "Dec 5", orders: 52, revenue: 14200 },
  { date: "Dec 10", orders: 48, revenue: 13100 },
  { date: "Dec 15", orders: 61, revenue: 16800 },
  { date: "Dec 20", orders: 55, revenue: 15200 },
  { date: "Dec 25", orders: 68, revenue: 18900 },
  { date: "Dec 26", orders: 73, revenue: 20100 },
];

const categoryData = [
  { category: "Fast Food", orders: 245 },
  { category: "Italian", orders: 189 },
  { category: "Asian", orders: 167 },
  { category: "Mexican", orders: 134 },
  { category: "Cafe", orders: 112 },
  { category: "BBQ", orders: 98 },
];

const recentOrders = [
  {
    id: "ORD-2847",
    restaurant: "Pizza Palace",
    customer: "John Doe",
    total: "$45.99",
    status: "Completed",
    time: "2 mins ago"
  },
  {
    id: "ORD-2846",
    restaurant: "Sushi Express",
    customer: "Sarah Smith",
    total: "$78.50",
    status: "Pending",
    time: "5 mins ago"
  },
  {
    id: "ORD-2845",
    restaurant: "Burger King",
    customer: "Mike Johnson",
    total: "$32.25",
    status: "Completed",
    time: "12 mins ago"
  },
  {
    id: "ORD-2844",
    restaurant: "Taco Supreme",
    customer: "Emma Wilson",
    total: "$28.75",
    status: "Cancelled",
    time: "18 mins ago"
  },
  {
    id: "ORD-2843",
    restaurant: "Cafe Mocha",
    customer: "David Lee",
    total: "$15.50",
    status: "Completed",
    time: "25 mins ago"
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <KPICard
          title="Total Restaurants"
          value="1,284"
          change={12.5}
          icon={Store}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <KPICard
          title="Total Orders Today"
          value="342"
          change={8.2}
          icon={ShoppingCart}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <KPICard
          title="Monthly Revenue"
          value="$458.2K"
          change={15.3}
          icon={DollarSign}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
        <KPICard
          title="Active Users"
          value="24,583"
          change={-2.4}
          icon={Users}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Orders & Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders & Revenue (Last 30 Days)</CardTitle>
            <CardDescription>Daily performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ordersRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                <YAxis yAxisId="left" stroke="#888888" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px' 
                  }} 
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Orders"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Revenue ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders by Category Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Restaurant Category</CardTitle>
            <CardDescription>Distribution across food types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px' 
                  }} 
                />
                <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest order activity across all restaurants</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.restaurant}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-gray-500">{order.time}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
