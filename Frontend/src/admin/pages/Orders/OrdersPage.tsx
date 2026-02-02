import { Search, Filter, Eye, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
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

const orders = [
  {
    id: "ORD-2847",
    restaurant: "Pizza Palace",
    customer: "John Doe",
    items: "2x Margherita Pizza, 1x Garlic Bread",
    total: "$45.99",
    status: "Completed",
    payment: "Card",
    deliveryTime: "35 mins",
    createdAt: "Dec 26, 2024 - 2:45 PM"
  },
  {
    id: "ORD-2846",
    restaurant: "Sushi Express",
    customer: "Sarah Smith",
    items: "1x Dragon Roll, 1x Miso Soup",
    total: "$78.50",
    status: "Pending",
    payment: "Card",
    deliveryTime: "Estimating...",
    createdAt: "Dec 26, 2024 - 2:40 PM"
  },
  {
    id: "ORD-2845",
    restaurant: "Burger King",
    customer: "Mike Johnson",
    items: "1x Whopper Combo, 1x Fries",
    total: "$32.25",
    status: "Completed",
    payment: "Cash",
    deliveryTime: "28 mins",
    createdAt: "Dec 26, 2024 - 2:18 PM"
  },
  {
    id: "ORD-2844",
    restaurant: "Taco Supreme",
    customer: "Emma Wilson",
    items: "3x Beef Tacos, 1x Nachos",
    total: "$28.75",
    status: "Cancelled",
    payment: "Card",
    deliveryTime: "-",
    createdAt: "Dec 26, 2024 - 2:05 PM"
  },
  {
    id: "ORD-2843",
    restaurant: "Cafe Mocha",
    customer: "David Lee",
    items: "2x Cappuccino, 1x Croissant",
    total: "$15.50",
    status: "Completed",
    payment: "Card",
    deliveryTime: "20 mins",
    createdAt: "Dec 26, 2024 - 1:52 PM"
  },
  {
    id: "ORD-2842",
    restaurant: "Thai Delight",
    customer: "Lisa Chen",
    items: "1x Pad Thai, 1x Spring Rolls",
    total: "$42.80",
    status: "Processing",
    payment: "Card",
    deliveryTime: "Preparing...",
    createdAt: "Dec 26, 2024 - 1:45 PM"
  },
];

export function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Search orders by ID, restaurant, or customer..." 
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <Select defaultValue="all-status">
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-payment">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-payment">All Payment Methods</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="wallet">Wallet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Export Button */}
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>Complete order history and management</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Delivery Time</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.restaurant}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="max-w-xs truncate text-gray-600 text-sm">
                    {order.items}
                  </TableCell>
                  <TableCell className="font-medium">{order.total}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.payment} variant="default" />
                  </TableCell>
                  <TableCell className="text-gray-600">{order.deliveryTime}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{order.createdAt}</TableCell>
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
