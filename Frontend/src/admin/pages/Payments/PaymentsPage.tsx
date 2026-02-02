import { DollarSign, TrendingUp, CreditCard, Wallet } from "lucide-react";
import { KPICard } from "@/admin/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { StatusBadge } from "@/admin/components";
import { Badge } from "@/app/components/ui/badge";

const revenueData = [
  {
    title: "Total Revenue",
    value: "$458,234",
    change: 15.3,
    icon: DollarSign,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-50"
  },
  {
    title: "This Month",
    value: "$67,890",
    change: 12.1,
    icon: TrendingUp,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-50"
  },
  {
    title: "Commission Earned",
    value: "$34,156",
    change: 18.5,
    icon: Wallet,
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-50"
  },
  {
    title: "Pending Payouts",
    value: "$12,450",
    change: -5.2,
    icon: CreditCard,
    iconColor: "text-orange-600",
    iconBgColor: "bg-orange-50"
  },
];

const subscriptionPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    restaurants: 324,
    features: ["5 menu items", "Basic analytics", "Email support"],
    color: "border-gray-300"
  },
  {
    name: "Basic",
    price: "$29",
    period: "/month",
    restaurants: 487,
    features: ["Unlimited menu items", "Advanced analytics", "Priority support", "Custom branding"],
    color: "border-blue-300"
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    restaurants: 473,
    features: ["Everything in Basic", "AI-powered insights", "Multi-location", "API access", "Dedicated manager"],
    color: "border-purple-300"
  },
];

const transactions = [
  {
    id: "TXN-8472",
    restaurant: "Pizza Palace",
    amount: "$1,245.50",
    commission: "$124.55",
    method: "Stripe",
    status: "Paid",
    date: "Dec 26, 2024"
  },
  {
    id: "TXN-8471",
    restaurant: "Sushi Express",
    amount: "$987.30",
    commission: "$98.73",
    method: "PayPal",
    status: "Paid",
    date: "Dec 26, 2024"
  },
  {
    id: "TXN-8470",
    restaurant: "Burger King",
    amount: "$2,156.80",
    commission: "$215.68",
    method: "Stripe",
    status: "Pending",
    date: "Dec 25, 2024"
  },
  {
    id: "TXN-8469",
    restaurant: "Taco Supreme",
    amount: "$567.20",
    commission: "$56.72",
    method: "PayPal",
    status: "Paid",
    date: "Dec 25, 2024"
  },
  {
    id: "TXN-8468",
    restaurant: "Thai Delight",
    amount: "$1,432.90",
    commission: "$143.29",
    method: "Stripe",
    status: "Failed",
    date: "Dec 24, 2024"
  },
];

export function PaymentsPage() {
  return (
    <div className="space-y-6">
      {/* Revenue KPIs */}
      <div className="grid grid-cols-4 gap-6">
        {revenueData.map((item, index) => (
          <KPICard key={index} {...item} />
        ))}
      </div>

      {/* Subscription Plans */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plans</h2>
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
                  {plan.restaurants} restaurants subscribed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
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

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Payment history and commission tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Commission (10%)</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.restaurant}</TableCell>
                  <TableCell className="font-medium">{transaction.amount}</TableCell>
                  <TableCell className="text-green-600 font-medium">{transaction.commission}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-gray-50">
                      {transaction.method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={transaction.status} />
                  </TableCell>
                  <TableCell className="text-gray-500">{transaction.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
