import { CreditCard, TrendingUp, Users, DollarSign } from "lucide-react";
import { KPICard } from "@/admin/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { StatusBadge } from "@/admin/components";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";

const subscriptionStats = [
  {
    title: "Total Subscriptions",
    value: "1,284",
    change: 12.5,
    icon: Users,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-50"
  },
  {
    title: "Monthly Recurring Revenue",
    value: "$68,432",
    change: 18.3,
    icon: DollarSign,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-50"
  },
  {
    title: "Active Pro Plans",
    value: "473",
    change: 24.1,
    icon: TrendingUp,
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-50"
  },
  {
    title: "Churn Rate",
    value: "2.1%",
    change: -0.8,
    icon: CreditCard,
    iconColor: "text-orange-600",
    iconBgColor: "bg-orange-50"
  },
];

const planDistribution = [
  { name: "Free", count: 324, percentage: 25, revenue: "$0", color: "bg-gray-400" },
  { name: "Basic", count: 487, percentage: 38, revenue: "$14,123", color: "bg-blue-500" },
  { name: "Pro", count: 473, percentage: 37, revenue: "$46,827", color: "bg-purple-500" },
];

const recentSubscriptions = [
  {
    restaurant: "Thai Delight",
    owner: "Somchai Prasert",
    plan: "Pro",
    price: "$99/month",
    status: "Active",
    startDate: "Dec 26, 2024",
    nextBilling: "Jan 26, 2025"
  },
  {
    restaurant: "Pasta Paradise",
    owner: "Marco Rossi",
    plan: "Basic",
    price: "$29/month",
    status: "Active",
    startDate: "Dec 25, 2024",
    nextBilling: "Jan 25, 2025"
  },
  {
    restaurant: "BBQ House",
    owner: "Tom Wilson",
    plan: "Pro",
    price: "$99/month",
    status: "Active",
    startDate: "Dec 24, 2024",
    nextBilling: "Jan 24, 2025"
  },
  {
    restaurant: "Vegan Vibes",
    owner: "Emma Green",
    plan: "Free",
    price: "$0/month",
    status: "Active",
    startDate: "Dec 24, 2024",
    nextBilling: "-"
  },
  {
    restaurant: "Indian Spice",
    owner: "Raj Patel",
    plan: "Basic",
    price: "$29/month",
    status: "Cancelled",
    startDate: "Nov 15, 2024",
    nextBilling: "-"
  },
];

export function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      {/* Subscription KPIs */}
      <div className="grid grid-cols-4 gap-6">
        {subscriptionStats.map((item, index) => (
          <KPICard key={index} {...item} />
        ))}
      </div>

      {/* Plan Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan Distribution</CardTitle>
          <CardDescription>Breakdown of restaurants across subscription tiers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {planDistribution.map((plan) => (
            <div key={plan.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${plan.color}`}></div>
                  <span className="font-medium text-gray-900">{plan.name}</span>
                  <span className="text-sm text-gray-500">({plan.count} restaurants)</span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-gray-900">{plan.revenue}</span>
                  <span className="text-sm text-gray-500 ml-2">{plan.percentage}%</span>
                </div>
              </div>
              <Progress value={plan.percentage} className="h-2" />
            </div>
          ))}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Total MRR</span>
              <span className="text-2xl font-semibold text-gray-900">$60,950</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Subscription Activity</CardTitle>
          <CardDescription>Latest subscription changes and renewals</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Restaurant</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSubscriptions.map((subscription, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{subscription.restaurant}</TableCell>
                  <TableCell>{subscription.owner}</TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={subscription.plan}
                      variant={
                        subscription.plan === "Pro" ? "info" : 
                        subscription.plan === "Basic" ? "default" : 
                        "warning"
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">{subscription.price}</TableCell>
                  <TableCell>
                    <StatusBadge status={subscription.status} />
                  </TableCell>
                  <TableCell className="text-gray-500">{subscription.startDate}</TableCell>
                  <TableCell className="text-gray-500">{subscription.nextBilling}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Manage
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
