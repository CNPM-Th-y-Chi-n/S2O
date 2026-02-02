import { ArrowLeft, Plus, Minus, ShoppingBag, X } from "lucide-react";
import { Restaurant } from "../components/RestaurantCard";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { useState } from "react";
import { Badge } from "../../components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface QROrderScreenProps {
  restaurant: Restaurant;
  onBack: () => void;
}

export function QROrderScreen({ restaurant, onBack }: QROrderScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState("Popular");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [orderStatus, setOrderStatus] = useState<"ordering" | "sent" | "preparing" | "ready">(
    "ordering"
  );

  const categories = ["Popular", "Appetizers", "Main Course", "Desserts", "Drinks"];

  const menuItems: MenuItem[] = [
    {
      id: "1",
      name: "Margherita Pizza",
      description: "Fresh mozzarella, tomato sauce, and basil",
      price: 14.99,
      image: "https://images.unsplash.com/photo-1563245738-9169ff58eccf?w=400",
      category: "Popular",
    },
    {
      id: "2",
      name: "Caesar Salad",
      description: "Romaine lettuce, parmesan, croutons",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
      category: "Appetizers",
    },
    {
      id: "3",
      name: "Pasta Carbonara",
      description: "Creamy sauce, bacon, parmesan cheese",
      price: 16.99,
      image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",
      category: "Main Course",
    },
    {
      id: "4",
      name: "Tiramisu",
      description: "Classic Italian dessert with coffee",
      price: 7.99,
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
      category: "Desserts",
    },
  ];

  const filteredItems = menuItems.filter((item) => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((i) => i.id !== itemId);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getStatusColor = () => {
    switch (orderStatus) {
      case "sent":
        return "bg-blue-500";
      case "preparing":
        return "bg-yellow-500";
      case "ready":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (orderStatus) {
      case "sent":
        return "Order Sent";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h2>{restaurant.name}</h2>
              <div className="text-sm text-muted-foreground">Table 12</div>
            </div>
          </div>

          {/* Order Status */}
          {orderStatus !== "ordering" && (
            <div className={`${getStatusColor()} text-white rounded-lg p-3 text-center`}>
              {getStatusText()}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="overflow-x-auto">
          <div className="flex gap-2 px-4 pb-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-4 p-4">
                <div className="flex-1">
                  <h4 className="mb-1">{item.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <div className="text-primary">${item.price.toFixed(2)}</div>
                </div>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Bottom Sheet */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
          <div className="max-w-md mx-auto p-4">
            <Sheet>
              <SheetTrigger asChild>
                <button className="w-full bg-primary text-primary-foreground rounded-xl py-4 px-6 flex items-center justify-between hover:bg-primary/90 transition-colors">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    <span>{cartCount} items</span>
                  </div>
                  <span>View Cart • ${cartTotal.toFixed(2)}</span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh]">
                <SheetHeader>
                  <SheetTitle>Your Order</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4 max-h-[50vh] overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-sm">{item.name}</div>
                        <div className="text-sm text-primary">${item.price.toFixed(2)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-muted rounded-full"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="p-1 hover:bg-muted rounded-full"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Tax</span>
                    <span>${(cartTotal * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span className="text-primary">${(cartTotal * 1.1).toFixed(2)}</span>
                  </div>
                  <Button
                    onClick={() => setOrderStatus("sent")}
                    className="w-full"
                  >
                    Send Order to Kitchen
                  </Button>
                  {orderStatus !== "ordering" && (
                    <Button variant="outline" className="w-full">
                      Request Bill
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3>{selectedItem.name}</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-muted rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              className="w-full h-48 rounded-xl object-cover mb-4"
            />
            <p className="text-sm text-muted-foreground mb-4">{selectedItem.description}</p>
            <div className="text-primary mb-6">${selectedItem.price.toFixed(2)}</div>
            <Button
              onClick={() => {
                addToCart(selectedItem);
                setSelectedItem(null);
              }}
              className="w-full"
            >
              Add to Order
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
