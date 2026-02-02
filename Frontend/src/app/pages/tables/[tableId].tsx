import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, Receipt, Bell } from "lucide-react";

export default function TableLandingPage() {
  const router = useRouter();
  const { tableId } = router.query;

  // Mock data – sau này thay bằng API
  const restaurant = {
    name: "Sushi Go 🍣",
    logo: "/logo.png",
    zone: "VIP Zone",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-xl rounded-2xl">
        <CardContent className="flex flex-col items-center gap-6 p-6">
          {/* Logo */}
          <img
            src={restaurant.logo}
            alt="Restaurant Logo"
            className="w-24 h-24 object-contain"
          />

          {/* Restaurant Info */}
          <div className="text-center">
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>
            <p className="text-gray-500 mt-1">
              Table #{tableId} · {restaurant.zone}
            </p>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col gap-3">
            <Button
              className="w-full h-12 text-base"
              onClick={() => router.push(`/menu?tableId=${tableId}`)}
            >
              <Utensils className="mr-2" size={20} />
              View Menu
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 text-base"
              onClick={() => router.push(`/order/current?tableId=${tableId}`)}
            >
              <Receipt className="mr-2" size={20} />
              View Current Order
            </Button>

            <Button
              variant="destructive"
              className="w-full h-12 text-base"
              onClick={() => alert("Staff has been notified")}
            >
              <Bell className="mr-2" size={20} />
              Call Staff / Request Bill
            </Button>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-400 mt-4">
            Powered by Scan2Order
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
