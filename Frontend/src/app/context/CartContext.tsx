import { createContext, useContext, useState, ReactNode } from "react";

// Kiểu dữ liệu cho món trong giỏ
export interface CartItem {
  itemId: number;
  name: string;
  price: number;
  quantity: number;
  note?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      // Kiểm tra xem món này đã có trong giỏ chưa
      const existing = prev.find((i) => i.itemId === newItem.itemId);
      if (existing) {
        // Nếu có rồi thì cộng dồn số lượng
        return prev.map((i) =>
          i.itemId === newItem.itemId
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((prev) => prev.filter((i) => i.itemId !== itemId));
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook để dùng nhanh ở các trang khác
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};