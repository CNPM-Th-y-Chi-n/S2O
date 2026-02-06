import { Save, Settings as SettingsIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import { Separator } from "@/app/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Platform Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
          <CardDescription>Manage core platform settings and parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="platform-name">Platform Name</Label>
              <Input id="platform-name" defaultValue="S2O - Restaurant Ordering" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Support Email</Label>
              <Input id="support-email" type="email" defaultValue="support@s2o.com" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="commission-rate">Commission Rate (%)</Label>
              <Input id="commission-rate" type="number" defaultValue="10" />
              <p className="text-xs text-gray-500">Platform commission on each order</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select defaultValue="vnd">
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vnd">VND ($)</SelectItem>
                  <SelectItem value="usd">USD (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-delivery-distance">Maximum Delivery Distance (km)</Label>
            <Input id="max-delivery-distance" type="number" defaultValue="15" />
          </div>
        </CardContent>
      </Card>

      {/* AI Features */}
      <Card>
        <CardHeader>
          <CardTitle>AI Features</CardTitle>
          <CardDescription>Configure artificial intelligence capabilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <Label className="text-base">Enable AI Analytics</Label>
              <p className="text-sm text-gray-500">
                Provide AI-powered insights and recommendations
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <Label className="text-base">AI Menu Optimization</Label>
              <p className="text-sm text-gray-500">
                Suggest menu improvements based on order patterns
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <Label className="text-base">Predictive Demand Forecasting</Label>
              <p className="text-sm text-gray-500">
                Help restaurants predict busy periods
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <Label className="text-base">Smart Pricing Recommendations</Label>
              <p className="text-sm text-gray-500">
                AI-driven pricing strategy suggestions
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Order Management */}
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>Configure order processing settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="auto-cancel-time">Auto-cancel Unpaid Orders (minutes)</Label>
              <Input id="auto-cancel-time" type="number" defaultValue="15" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-prep-time">Maximum Preparation Time (minutes)</Label>
              <Input id="max-prep-time" type="number" defaultValue="60" />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <Label className="text-base">Allow Pre-orders</Label>
              <p className="text-sm text-gray-500">
                Enable customers to schedule orders in advance
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <Label className="text-base">Require Order Confirmation</Label>
              <p className="text-sm text-gray-500">
                Restaurants must manually confirm each order
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* System Maintenance */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-900">System Maintenance</CardTitle>
          <CardDescription className="text-orange-700">
            Critical system operations and maintenance mode
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <Label className="text-base text-orange-900">Maintenance Mode</Label>
              <p className="text-sm text-orange-700">
                Temporarily disable platform for maintenance (shows notice to users)
              </p>
            </div>
            <Switch />
          </div>

          <Separator className="bg-orange-200" />

          <div className="flex items-center justify-between py-3">
            <div className="space-y-0.5">
              <Label className="text-base text-orange-900">New Restaurant Registrations</Label>
              <p className="text-sm text-orange-700">
                Allow new restaurants to register on the platform
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
