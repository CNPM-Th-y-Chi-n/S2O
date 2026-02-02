import { useEffect, useState } from "react";
import { Plus, Search, Filter, Edit, XCircle, Loader2 } from "lucide-react";

import { restaurantApi } from "@/services/api";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";

/* ================= MOCK ADMIN DATA ================= */
const restaurantAdminMock: Record<number, any> = {
  1: { owner: "Gojo Satoru", plan: "Pro", orders: 1245, revenue: "1.250.000.000 đ" },
  2: { owner: "Mai Trí Hùng", plan: "Basic", orders: 642, revenue: "420.000.000 đ" },
  3: { owner: "Lê Hoàng Phúc", plan: "Pro", orders: 1890, revenue: "1.980.000.000 đ" },
  4: { owner: "Phạm Quốc Huy", plan: "Free", orders: 210, revenue: "85.000.000 đ" },
  5: { owner: "Đỗ Minh Tâm", plan: "Basic", orders: 534, revenue: "310.000.000 đ" },
};

export function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    address: "",
    phone: "",
    opening_hours: "",
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);

  /* ================= FETCH ================= */
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await restaurantApi.getAll();

      const merged = res.data.map((r: any, i: number) => {
        const mock = restaurantAdminMock[r.id];
        return {
          ...r,
          owner: mock?.owner ?? "Chưa xác định",
          plan: mock?.plan ?? "Free",
          orders: mock?.orders ?? 0,
          revenue: mock?.revenue ?? "0 đ",
          _key: r.id ?? `row-${i}`,
        };
      });

      setRestaurants(merged);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  /* ================= CRUD ================= */
  const handleCreateRestaurant = async () => {
    try {
      await restaurantApi.create(newRestaurant);
      setIsAddOpen(false);
      setNewRestaurant({
        name: "",
        address: "",
        phone: "",
        opening_hours: "",
      });
      fetchRestaurants();
    } catch {
      alert("Thêm nhà hàng thất bại");
    }
  };

  const handleUpdateRestaurant = async () => {
    try {
      await restaurantApi.update(selectedRestaurant.id, {
        name: selectedRestaurant.name,
      });
      setIsEditOpen(false);
      fetchRestaurants();
    } catch {
      alert("Cập nhật thất bại");
    }
  };

  const handleDeleteRestaurant = async (id: number) => {
    if (!confirm("Bạn chắc chắn muốn xoá nhà hàng này?")) return;
    await restaurantApi.delete(id);
    fetchRestaurants();
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <Input placeholder="Tìm kiếm nhà hàng..." />
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Thêm nhà hàng
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhà hàng</CardTitle>
          <CardDescription>Quản lý toàn bộ nhà hàng</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Chủ</TableHead>
                  <TableHead>Gói</TableHead>
                  <TableHead>Đơn</TableHead>
                  <TableHead>Doanh thu</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restaurants.map((r) => (
                  <TableRow key={r._key}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.owner}</TableCell>
                    <TableCell>
                      <StatusBadge status={r.plan} />
                    </TableCell>
                    <TableCell>{r.orders}</TableCell>
                    <TableCell>{r.revenue}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedRestaurant(r);
                            setIsEditOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                          onClick={() => handleDeleteRestaurant(r.id)}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ADD DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-white text-gray-900 z-50">
          <DialogHeader>
            <DialogTitle>Thêm nhà hàng</DialogTitle>
            <DialogDescription>
              Nhập thông tin nhà hàng mới
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Tên nhà hàng</Label>
              <Input
                className="bg-white text-black"
                value={newRestaurant.name}
                onChange={(e) =>
                  setNewRestaurant({ ...newRestaurant, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Địa chỉ</Label>
              <Input
                className="bg-white text-black"
                value={newRestaurant.address}
                onChange={(e) =>
                  setNewRestaurant({ ...newRestaurant, address: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Số điện thoại</Label>
              <Input
                className="bg-white text-black"
                value={newRestaurant.phone}
                onChange={(e) =>
                  setNewRestaurant({ ...newRestaurant, phone: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Giờ mở cửa</Label>
              <Input
                className="bg-white text-black"
                value={newRestaurant.opening_hours}
                onChange={(e) =>
                  setNewRestaurant({
                    ...newRestaurant,
                    opening_hours: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Huỷ
            </Button>
            <Button onClick={handleCreateRestaurant}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white text-gray-900 z-50">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa nhà hàng</DialogTitle>
          </DialogHeader>

          <div>
            <Label>Tên nhà hàng</Label>
            <Input
              className="bg-white text-black"
              value={selectedRestaurant?.name ?? ""}
              onChange={(e) =>
                setSelectedRestaurant({
                  ...selectedRestaurant,
                  name: e.target.value,
                })
              }
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Huỷ
            </Button>
            <Button onClick={handleUpdateRestaurant}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
