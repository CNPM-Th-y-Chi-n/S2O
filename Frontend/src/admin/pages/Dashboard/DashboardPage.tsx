import { Store, ShoppingCart, DollarSign, Users, Eye } from "lucide-react";
import { KPICard } from "@/admin/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { StatusBadge } from "@/admin/components";
import { Button } from "@/app/components/ui/button";

/* ================= MOCK DATA ================= */

// Orders & Revenue (last ~2 weeks)
const ordersRevenueData = [
  { date: "Dec 12", orders: 6, revenue: 180 },
  { date: "Dec 14", orders: 9, revenue: 260 },
  { date: "Dec 16", orders: 8, revenue: 230 },
  { date: "Dec 18", orders: 11, revenue: 340 },
  { date: "Dec 20", orders: 10, revenue: 310 },
  { date: "Dec 22", orders: 14, revenue: 420 },
  { date: "Dec 24", orders: 16, revenue: 480 },
];

// Orders by restaurant category
const categoryData = [
  { category: "Fast Food", orders: 28 },
  { category: "Italian", orders: 21 },
  { category: "Asian", orders: 24 },
  { category: "Cafe", orders: 18 },
  { category: "BBQ", orders: 11 },
];

// Recent orders
const recentOrders = [
  {
    id: "ORD-1021",
    restaurant: "Pizza Palace",
    customer: "John Doe",
    total: "$18.50",
    status: "Completed",
    time: "5 mins ago",
  },
  {
    id: "ORD-1020",
    restaurant: "Sushi Express",
    customer: "Sarah Smith",
    total: "$24.00",
    status: "Pending",
    time: "12 mins ago",
  },
  {
    id: "ORD-1019",
    restaurant: "Cafe Mocha",
    customer: "David Lee",
    total: "$9.75",
    status: "Completed",
    time: "20 mins ago",
  },
  {
    id: "ORD-1018",
    restaurant: "Thai Delight",
    customer: "Emma Wilson",
    total: "$15.20",
    status: "Cancelled",
    time: "35 mins ago",
  },
  {
    id: "ORD-1017",
    restaurant: "Burger King",
    customer: "Mike Johnson",
    total: "$12.40",
    status: "Completed",
    time: "50 mins ago",
  },
];

/* ================= PAGE ================= */

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <KPICard
          title="Total Restaurants"
          value="12"
          change={8.3}
          icon={Store}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <KPICard
          title="Orders Today"
          value="16"
          change={12.5}
          icon={ShoppingCart}
          iconColor="text-green-600"
          iconBgColor="bg-green-50"
        />
        <KPICard
          title="Monthly Revenue"
          value="$3,240"
          change={9.8}
          icon={DollarSign}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
        <KPICard
          title="Active Users"
          value="87"
          change={-3.1}
          icon={Users}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Orders & Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Orders & Revenue</CardTitle>
            <CardDescription>Recent performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ordersRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis yAxisId="left" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" fontSize={12} />
                <Tooltip />
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

        {/* Orders by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Category</CardTitle>
            <CardDescription>Food type distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest order activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
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
                  <TableCell className="text-gray-500">
                    {order.time}
                  </TableCell>
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
