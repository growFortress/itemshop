import { useState, useCallback, useEffect } from "react";
import { Product } from "@/data/shopData";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AddItemResult {
  status: "added" | "already-in-cart" | "mode-mismatch" | "rank-conflict";
  conflictingProduct?: Product;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [modeId, setModeId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0 && modeId !== null) {
      setModeId(null);
    }
  }, [items, modeId]);

  const addItem = useCallback((product: Product, _quantity = 1, targetModeId?: string): AddItemResult => {
    const nextModeId = targetModeId ?? product.gameMode;

    if (modeId && modeId !== nextModeId && items.length > 0) {
      return { status: "mode-mismatch" };
    }

    const existing = items.find((item) => item.product.id === product.id);
    if (existing) {
      return { status: "already-in-cart" };
    }

    if (product.type === "rank") {
      const conflictingRank = items.find((item) => item.product.type === "rank");
      if (conflictingRank) {
        return {
          status: "rank-conflict",
          conflictingProduct: conflictingRank.product,
        };
      }
    }

    setModeId(nextModeId);
    setItems((prev) => [...prev, { product, quantity: 1 }]);
    return { status: "added" };
  }, [items, modeId]);

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

        return [{ ...item, quantity: 1 }];
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
