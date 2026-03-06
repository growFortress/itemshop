import { useState, useCallback, useEffect } from "react";
import { Product } from "@/data/shopData";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface AddItemResult {
  status: "added" | "mode-mismatch";
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [modeId, setModeId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0 && modeId !== null) {
      setModeId(null);
    }
  }, [items, modeId]);

  const addItem = useCallback((product: Product, quantity = 1, targetModeId?: string): AddItemResult => {
    const nextModeId = targetModeId ?? product.gameMode;

    if (modeId && modeId !== nextModeId && items.length > 0) {
      return { status: "mode-mismatch" };
    }

    setModeId(nextModeId);
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
    return { status: "added" };
  }, [items.length, modeId]);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev.flatMap((item) => {
        if (item.product.id !== productId) {
          return [item];
        }

        if (quantity <= 0) {
          return [];
        }

        return [{ ...item, quantity }];
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setModeId(null);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return {
    items,
    modeId,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };
}
