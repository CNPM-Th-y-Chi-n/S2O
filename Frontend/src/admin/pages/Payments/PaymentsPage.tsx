import { DollarSign, TrendingUp, CreditCard, Wallet } from "lucide-react";
import { KPICard } from "@/admin/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { StatusBadge } from "@/admin/components";
import { Badge } from "@/app/components/ui/badge";

/* =======================
   KPI – DOANH THU (VNĐ)
======================= */
const revenueData = [
  {
    title: "Tổng doanh thu",
    value: "4.045.000.000 ₫",
    change: 15.3,
    icon: DollarSign,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-50",
  },
  {
    title: "Tháng này",
    value: "685.000.000 ₫",
    change: 12.1,
    icon: TrendingUp,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-50",
  },
  {
    title: "Hoa hồng nền tảng",
    value: "404.500.000 ₫",
    change: 18.5,
    icon: Wallet,
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-50",
  },
  {
    title: "Chờ thanh toán",
    value: "92.000.000 ₫",
    change: -5.2,
    icon: CreditCard,
    iconColor: "text-orange-600",
    iconBgColor: "bg-orange-50",
  },
];

/* =======================
   GÓI ĐĂNG KÝ
======================= */
const subscriptionPlans = [
  {
    name: "Free",
    price: "0 ₫",
    period: "/tháng",
    restaurants: 1,
    features: [
      "Menu giới hạn",
      "Thống kê cơ bản",
      "Hỗ trợ email",
    ],
    color: "border-gray-300",
  },
  {
    name: "Basic",
    price: "699.000 ₫",
    period: "/tháng",
    restaurants: 2,
    features: [
      "Menu không giới hạn",
      "Thống kê nâng cao",
      "Hỗ trợ ưu tiên",
    ],
    color: "border-blue-300",
  },
  {
    name: "Pro",
    price: "2.499.000 ₫",
    period: "/tháng",
    restaurants: 2,
    features: [
      "Tất cả tính năng Basic",
      "AI phân tích",
      "Quản lý đa chi nhánh",
    ],
    color: "border-purple-300",
  },
];

/* =======================
   GIAO DỊCH GẦN ĐÂY
======================= */
const transactions = [
  {
    id: "TXN-1001",
    restaurant: "Cơm Tấm Sài Gòn",
    amount: "1.250.000.000 ₫",
    commission: "125.000.000 ₫",
    method: "Stripe",
    status: "Paid",
    date: "02/02/2026",
  },
  {
    id: "TXN-1002",
    restaurant: "Ốc Đêm Bình Thạnh",
    amount: "1.980.000.000 ₫",
    commission: "198.000.000 ₫",
    method: "Stripe",
    status: "Paid",
    date: "01/02/2026",
  },
  {
    id: "TXN-1003",
    restaurant: "Phở Ông Hùng",
    amount: "420.000.000 ₫",
    commission: "42.000.000 ₫",
    method: "Momo",
    status: "Paid",
    date: "31/01/2026",
  },
  {
    id: "TXN-1004",
    restaurant: "Baoz Dimsum",
    amount: "310.000.000 ₫",
    commission: "31.000.000 ₫",
    method: "ZaloPay",
    status: "Pending",
    date: "30/01/2026",
  },
  {
    id: "TXN-1005",
    restaurant: "Bún Bò Huế Đông Ba",
    amount: "85.000.000 ₫",
    commission: "8.500.000 ₫",
    method: "Momo",
    status: "Paid",
    date: "28/01/2026",
  },
];

export function PaymentsPage() {
  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-4 gap-6">
        {revenueData.map((item, index) => (
          <KPICard key={index} {...item} />
        ))}
      </div>

      {/* Subscription Plans */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Gói đăng ký
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.name} className={`border-2 ${plan.color}`}>
              <CardHeader>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  {plan.restaurants} nhà hàng đang sử dụng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span className="text-green-600 mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Giao dịch gần đây</CardTitle>
          <CardDescription>
            Lịch sử thanh toán & hoa hồng nền tảng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã giao dịch</TableHead>
                <TableHead>Nhà hàng</TableHead>
                <TableHead>Doanh thu</TableHead>
                <TableHead>Hoa hồng (10%)</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.id}
                  </TableCell>
                  <TableCell>{transaction.restaurant}</TableCell>
                  <TableCell className="font-medium">
                    {transaction.amount}
                  </TableCell>
                  <TableCell className="text-green-600 font-medium">
                    {transaction.commission}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-gray-50">
                      {transaction.method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={transaction.status} />
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {transaction.date}
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
