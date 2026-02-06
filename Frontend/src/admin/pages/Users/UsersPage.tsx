import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Eye, Ban, Filter, Trash2 } from "lucide-react";
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

const BASE_URL = "http://localhost:5000/api";

// Định nghĩa Interface cho User
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdDate: string;
  lastLogin: string;
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Hàm lấy dữ liệu từ API
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/users`);
      setUsers(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Hàm Xóa User
  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa user này không?")) return;

    try {
      await axios.delete(`${BASE_URL}/admin/users/${userId}`);
      alert("Xóa thành công!");
      // Cập nhật lại danh sách trên UI mà không cần load lại trang
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Lỗi xóa user:", error);
      alert("Không thể xóa user này (có thể do ràng buộc dữ liệu).");
    }
  };

  // 3. Logic Filter (Search + Role) - ĐÃ FIX LỖI CRASH NULL
  const filteredUsers = users.filter((user) => {
    // Phòng thủ: Nếu dữ liệu null thì gán bằng chuỗi rỗng ""
    const safeRole = (user.role || "").toLowerCase();
    const safeName = (user.name || "").toLowerCase();
    const safeEmail = (user.email || "").toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    // Logic lọc
    const matchesRole = selectedRole === "all" || safeRole === selectedRole.toLowerCase();
    const matchesSearch = safeName.includes(searchLower) || safeEmail.includes(searchLower);

    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* HEADER ACTIONS */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users by name or email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Role Filter */}
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* USERS TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage platform users and their access</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">Đang tải dữ liệu...</TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || "Unnamed User"}</TableCell>
                    <TableCell>{user.email || "No Email"}</TableCell>
                    <TableCell>
                      <StatusBadge
                        status={user.role || "Unknown"}
                        variant={
                          (user.role || "").toLowerCase() === "admin" ? "danger" : 
                          (user.role || "").toLowerCase() === "staff" ? "info" : "default"
                        }
                      />
                    </TableCell>
                    <TableCell>
                       {/* Hardcode Active như yêu cầu */}
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Active
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500">
                        {user.createdDate ? new Date(user.createdDate).toLocaleDateString('vi-VN') : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}