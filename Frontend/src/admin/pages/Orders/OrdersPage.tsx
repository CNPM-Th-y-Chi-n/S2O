import { useMemo, useState } from "react";
import { Search, Filter, Eye, Download } from "lucide-react";
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
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

/* ================= MOCK DATA ================= */

const orders = [
  {
    id: "ORD-1026",
    restaurant: "Phở Ông Hùng",
    customer: "Nguyễn Văn A",
    items: "2x Phở bò tái, 1x Trà đá",
    total: "110.000₫",
    status: "Completed",
    payment: "Cash",
    deliveryTime: "30 phút",
    createdAt: "26/12/2024 - 14:45",
  },
  {
    id: "ORD-1025",
    restaurant: "Phở Ông Hùng",
    customer: "Trần Thị B",
    items: "1x Phở gà, 1x Trà chanh",
    total: "55.000₫",
    status: "Completed",
    payment: "Wallet",
    deliveryTime: "14 phút",
    createdAt: "26/12/2024 - 14:38",
  },
  {
    id: "ORD-1024",
    restaurant: "Cơm Tấm Sài Gòn",
    customer: "Lê Hoàng C",
    items: "1x Cơm tấm sườn, 1x Canh rong biển",
    total: "65.000₫",
    status: "Completed",
    payment: "Card",
    deliveryTime: "25 phút",
    createdAt: "26/12/2024 - 14:20",
  },
  {
    id: "ORD-1023",
    restaurant: "Bún Bò Huế Đông Ba",
    customer: "Phạm Thị D",
    items: "2x Bún bò Huế",
    total: "90.000₫",
    status: "Cancelled",
    payment: "Card",
    deliveryTime: "-",
    createdAt: "26/12/2024 - 14:05",
  },
  {
    id: "ORD-1022",
    restaurant: "Phở Ông Hùng",
    customer: "Nguyễn Quốc E",
    items: "1x Phở đặc biệt, 1x Nước sâm",
    total: "70.000₫",
    status: "Completed",
    payment: "Cash",
    deliveryTime: "20 phút",
    createdAt: "26/12/2024 - 13:52",
  },

];

/* ================= PAGE ================= */

export function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  /* ================= FILTER LOGIC ================= */

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.restaurant.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all" || order.status === statusFilter;

      const matchPayment =
        paymentFilter === "all" || order.payment === paymentFilter;

      return matchSearch && matchStatus && matchPayment;
    });
  }, [search, statusFilter, paymentFilter]);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã đơn, khách hàng, nhà hàng..."
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Payment Filter */}
          <Select
            value={paymentFilter}
            onValueChange={setPaymentFilter}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Thanh toán" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Cash">Tiền mặt</SelectItem>
              <SelectItem value="Card">Thẻ</SelectItem>
              <SelectItem value="Wallet">Ví điện tử</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Export */}
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Xuất dữ liệu
        </Button>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
          <CardDescription>
            Tổng cộng {filteredOrders.length} đơn hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Nhà hàng</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Món ăn</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thanh toán</TableHead>
                <TableHead>Thời gian giao</TableHead>
                <TableHead>Thời điểm tạo</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.restaurant}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-gray-600">
                    {order.items}
                  </TableCell>
                  <TableCell className="font-medium">{order.total}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.payment} />
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {order.deliveryTime}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {order.createdAt}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-gray-500 py-6">
                    Không tìm thấy đơn hàng nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
