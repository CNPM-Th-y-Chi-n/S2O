import { Search, Eye, Ban } from "lucide-react";
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
import { Filter } from "lucide-react";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Customer",
    status: "Active",
    createdDate: "Jan 15, 2024",
    lastLogin: "2 hours ago"
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah.smith@pizzapalace.com",
    role: "Restaurant Staff",
    status: "Active",
    createdDate: "Feb 3, 2024",
    lastLogin: "5 mins ago"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@example.com",
    role: "Customer",
    status: "Active",
    createdDate: "Mar 12, 2024",
    lastLogin: "1 day ago"
  },
  {
    id: 4,
    name: "Admin User",
    email: "admin@s2o.com",
    role: "Admin",
    status: "Active",
    createdDate: "Jan 1, 2024",
    lastLogin: "Just now"
  },
  {
    id: 5,
    name: "Emma Wilson",
    email: "emma.w@example.com",
    role: "Customer",
    status: "Suspended",
    createdDate: "Apr 8, 2024",
    lastLogin: "2 weeks ago"
  },
  {
    id: 6,
    name: "David Lee",
    email: "david@sushiexpress.com",
    role: "Restaurant Staff",
    status: "Active",
    createdDate: "May 20, 2024",
    lastLogin: "30 mins ago"
  },
  {
    id: 7,
    name: "Lisa Chen",
    email: "lisa.chen@example.com",
    role: "Customer",
    status: "Active",
    createdDate: "Jun 5, 2024",
    lastLogin: "3 hours ago"
  },
];

export function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Search users by name or email..." 
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <Select defaultValue="all-roles">
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-roles">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="restaurant-staff">Restaurant Staff</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all-status">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
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
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={user.role}
                      variant={user.role === "Admin" ? "danger" : user.role === "Restaurant Staff" ? "info" : "default"}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  <TableCell className="text-gray-500">{user.createdDate}</TableCell>
                  <TableCell className="text-gray-500">{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Ban className="w-4 h-4" />
                      </Button>
                    </div>
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
