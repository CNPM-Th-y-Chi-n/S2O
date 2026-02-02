import { useState } from "react";
import { Plus, Search, Filter, Eye, Edit, XCircle } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";

const restaurants = [
  {
    id: 1,
    name: "Pizza Palace",
    owner: "John Smith",
    plan: "Pro",
    status: "Active",
    orders: 1247,
    revenue: "$45,890"
  },
  {
    id: 2,
    name: "Sushi Express",
    owner: "Yuki Tanaka",
    plan: "Basic",
    status: "Active",
    orders: 892,
    revenue: "$32,150"
  },
  {
    id: 3,
    name: "Burger King",
    owner: "Mike Johnson",
    plan: "Pro",
    status: "Active",
    orders: 1456,
    revenue: "$52,340"
  },
  {
    id: 4,
    name: "Taco Supreme",
    owner: "Carlos Rodriguez",
    plan: "Free",
    status: "Active",
    orders: 324,
    revenue: "$8,920"
  },
  {
    id: 5,
    name: "Cafe Mocha",
    owner: "Sarah Williams",
    plan: "Basic",
    status: "Suspended",
    orders: 567,
    revenue: "$15,780"
  },
  {
    id: 6,
    name: "Thai Delight",
    owner: "Somchai Prasert",
    plan: "Pro",
    status: "Active",
    orders: 998,
    revenue: "$38,670"
  },
];

export function RestaurantsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
              placeholder="Search restaurants..." 
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-plans">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-plans">All Plans</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add Button */}
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Restaurant
        </Button>
      </div>

      {/* Restaurants Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Restaurants</CardTitle>
          <CardDescription>Manage and monitor all restaurants on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Restaurant Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Subscription Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restaurants.map((restaurant) => (
                <TableRow key={restaurant.id}>
                  <TableCell className="font-medium">{restaurant.name}</TableCell>
                  <TableCell>{restaurant.owner}</TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={restaurant.plan}
                      variant={restaurant.plan === "Pro" ? "info" : restaurant.plan === "Basic" ? "default" : "warning"}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={restaurant.status} />
                  </TableCell>
                  <TableCell>{restaurant.orders.toLocaleString()}</TableCell>
                  <TableCell>{restaurant.revenue}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Restaurant Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Restaurant</DialogTitle>
            <DialogDescription>
              Add a new restaurant to the S2O platform
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="restaurant-name">Restaurant Name</Label>
              <Input id="restaurant-name" placeholder="Enter restaurant name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner-name">Owner Name</Label>
              <Input id="owner-name" placeholder="Enter owner name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter email address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription Plan</Label>
              <Select defaultValue="free">
                <SelectTrigger id="plan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="basic">Basic - $29/month</SelectItem>
                  <SelectItem value="pro">Pro - $99/month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>
              Add Restaurant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
