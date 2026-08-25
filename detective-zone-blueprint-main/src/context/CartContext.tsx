import React, { createContext, useContext, useState } from "react";

export interface CartItem {
  id: string;
  productId?: number;
  title: string;
  caseNumber: string;
  price: number;
  shippingFee?: number;
  quantity: number;
  image: string;
  type: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("dz_cart_items");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const saveItems = (newItems: CartItem[]) => {
    setItems(newItems);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("dz_cart_items", JSON.stringify(newItems));
      } catch {
        // ignore
      }
    }
  };

  const addToCart = (newItem: Omit<CartItem, "quantity">) => {
    const existingIndex = items.findIndex((i) => i.id === newItem.id);
    let nextItems: CartItem[];
    if (existingIndex > -1) {
      nextItems = items.map((item, idx) =>
        idx === existingIndex
          ? { ...item, ...newItem, quantity: item.quantity + 1 }
          : item,
      );
    } else {
      nextItems = [...items, { ...newItem, quantity: 1 }];
    }
    saveItems(nextItems);
  };

  const removeFromCart = (id: string) => {
    saveItems(items.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    const nextItems = items
      .map((item) => {
        if (item.id === id) {
          const nextQty = item.quantity + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];
    saveItems(nextItems);
  };

  const clearCart = () => {
    saveItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
