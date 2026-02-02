import { CreditCard, TrendingUp, Users, DollarSign } from "lucide-react";
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
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";

/* =======================
   KPI – SUBSCRIPTIONS
======================= */
const subscriptionStats = [
  {
    title: "Tổng số nhà hàng",
    value: "5",
    change: 11.1,
    icon: Users,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-50",
  },
  {
    title: "Doanh thu định kỳ / tháng",
    value: "4.197.000 ₫",
    change: 18.3,
    icon: DollarSign,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-50",
  },
  {
    title: "Gói Pro đang hoạt động",
    value: "2",
    change: 25.0,
    icon: TrendingUp,
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-50",
  },
  {
    title: "Tỷ lệ huỷ gói",
    value: "0%",
    change: 0,
    icon: CreditCard,
    iconColor: "text-orange-600",
    iconBgColor: "bg-orange-50",
  },
];

/* =======================
   PHÂN BỐ GÓI
======================= */
const planDistribution = [
  {
    name: "Free",
    count: 1,
    percentage: 20,
    revenue: "0 ₫",
    color: "bg-gray-400",
  },
  {
    name: "Basic",
    count: 2,
    percentage: 40,
    revenue: "1.398.000 ₫",
    color: "bg-blue-500",
  },
  {
    name: "Pro",
    count: 2,
    percentage: 40,
    revenue: "2.799.000 ₫",
    color: "bg-purple-500",
  },
];

/* =======================
   GIAO DỊCH GẦN ĐÂY
======================= */
const recentSubscriptions = [
  {
    restaurant: "Cơm Tấm Sài Gòn",
    owner: "Gojo Satoru",
    plan: "Pro",
    price: "2.499.000 ₫ / tháng",
    status: "Active",
    startDate: "01/01/2026",
    nextBilling: "01/02/2026",
  },
  {
    restaurant: "Ốc Đêm Bình Thạnh",
    owner: "Lê Hoàng Phúc",
    plan: "Pro",
    price: "2.499.000 ₫ / tháng",
    status: "Active",
    startDate: "05/01/2026",
    nextBilling: "05/02/2026",
  },
  {
    restaurant: "Phở Ông Hùng",
    owner: "Mai Trí Hùng",
    plan: "Basic",
    price: "699.000 ₫ / tháng",
    status: "Active",
    startDate: "10/01/2026",
    nextBilling: "10/02/2026",
  },
  {
    restaurant: "Baoz Dimsum",
    owner: "Đỗ Minh Tâm",
    plan: "Basic",
    price: "699.000 ₫ / tháng",
    status: "Active",
    startDate: "15/01/2026",
    nextBilling: "15/02/2026",
  },
  {
    restaurant: "Bún Bò Huế Đông Ba",
    owner: "Phạm Quốc Huy",
    plan: "Free",
    price: "0 ₫",
    status: "Active",
    startDate: "20/01/2026",
    nextBilling: "-",
  },
];

export function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-4 gap-6">
        {subscriptionStats.map((item, index) => (
          <KPICard key={index} {...item} />
        ))}
      </div>

      {/* Plan Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Phân bố gói đăng ký</CardTitle>
          <CardDescription>
            Thống kê nhà hàng theo từng gói dịch vụ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {planDistribution.map((plan) => (
            <div key={plan.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${plan.color}`} />
                  <span className="font-medium text-gray-900">
                    {plan.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({plan.count} nhà hàng)
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-gray-900">
                    {plan.revenue}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {plan.percentage}%
                  </span>
                </div>
              </div>
              <Progress value={plan.percentage} className="h-2" />
            </div>
          ))}

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">
                Tổng doanh thu / tháng
              </span>
              <span className="text-2xl font-semibold text-gray-900">
                4.197.000 ₫
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động đăng ký gần đây</CardTitle>
          <CardDescription>
            Các thay đổi và gia hạn gói mới nhất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhà hàng</TableHead>
                <TableHead>Chủ</TableHead>
                <TableHead>Gói</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Gia hạn tiếp</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSubscriptions.map((subscription, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {subscription.restaurant}
                  </TableCell>
                  <TableCell>{subscription.owner}</TableCell>
                  <TableCell>
                    <StatusBadge
                      status={subscription.plan}
                      variant={
                        subscription.plan === "Pro"
                          ? "info"
                          : subscription.plan === "Basic"
                          ? "default"
                          : "warning"
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {subscription.price}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={subscription.status} />
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {subscription.startDate}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {subscription.nextBilling}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Quản lý
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
