import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { products } from "@/data/shopData";
import { useCart } from "@/hooks/useCart";

describe("useCart", () => {
  it("supports quantity updates and blocks mixing game modes", async () => {
    const startingProduct = products.find((product) => product.id === "survival-dzialki-645");
    const otherModeProduct = products.find((product) => product.id === "oneblock-854");

    expect(startingProduct).toBeDefined();
    expect(otherModeProduct).toBeDefined();

    const { result } = renderHook(() => useCart());

    let firstAddResult: { status: "added" | "mode-mismatch" } | undefined;
    act(() => {
      firstAddResult = result.current.addItem(startingProduct!, 1, startingProduct!.gameMode);
    });

    expect(firstAddResult?.status).toBe("added");
    expect(result.current.modeId).toBe("survival-dzialki");
    expect(result.current.totalItems).toBe(1);

    act(() => {
      result.current.updateQuantity(startingProduct!.id, 3);
    });

    expect(result.current.items[0]?.quantity).toBe(3);
    expect(result.current.totalPrice).toBeCloseTo(startingProduct!.price * 3);

    let mismatchResult: { status: "added" | "mode-mismatch" } | undefined;
    act(() => {
      mismatchResult = result.current.addItem(otherModeProduct!, 1, otherModeProduct!.gameMode);
    });

    expect(mismatchResult?.status).toBe("mode-mismatch");
    expect(result.current.items).toHaveLength(1);
    expect(result.current.modeId).toBe("survival-dzialki");

    act(() => {
      result.current.updateQuantity(startingProduct!.id, 0);
    });

    expect(result.current.items).toHaveLength(0);
    await waitFor(() => expect(result.current.modeId).toBe(null));
  });
});
