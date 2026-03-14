import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { products } from "@/data/shopData";
import { useCart } from "@/hooks/useCart";

describe("useCart", () => {
  it("keeps unique products, blocks multiple ranks, and blocks mixing game modes", async () => {
    const startingProduct = products.find((product) => product.id === "survival-dzialki-645");
    const duplicateProduct = products.find((product) => product.id === "survival-dzialki-645");
    const firstRank = products.find((product) => product.id === "survival-extreme-1000");
    const secondRank = products.find((product) => product.id === "survival-extreme-1002");
    const otherModeProduct = products.find((product) => product.id === "oneblock-854");

    expect(startingProduct).toBeDefined();
    expect(duplicateProduct).toBeDefined();
    expect(firstRank).toBeDefined();
    expect(secondRank).toBeDefined();
    expect(otherModeProduct).toBeDefined();

    const { result } = renderHook(() => useCart());

    let firstAddResult:
      | { status: "added" | "already-in-cart" | "mode-mismatch" | "rank-conflict" }
      | undefined;
    act(() => {
      firstAddResult = result.current.addItem(startingProduct!, 1, startingProduct!.gameMode);
    });

    expect(firstAddResult?.status).toBe("added");
    expect(result.current.modeId).toBe("survival-dzialki");
    expect(result.current.totalItems).toBe(1);

    let duplicateResult:
      | { status: "added" | "already-in-cart" | "mode-mismatch" | "rank-conflict" }
      | undefined;
    act(() => {
      duplicateResult = result.current.addItem(duplicateProduct!, 3, duplicateProduct!.gameMode);
    });

    expect(duplicateResult?.status).toBe("already-in-cart");
    expect(result.current.items[0]?.quantity).toBe(1);
    expect(result.current.totalPrice).toBeCloseTo(startingProduct!.price);

    act(() => {
      result.current.updateQuantity(startingProduct!.id, 3);
    });

    expect(result.current.items[0]?.quantity).toBe(1);

    act(() => {
      result.current.updateQuantity(startingProduct!.id, 0);
    });

    expect(result.current.items).toHaveLength(0);
    await waitFor(() => expect(result.current.modeId).toBe(null));

    let firstRankResult:
      | { status: "added" | "already-in-cart" | "mode-mismatch" | "rank-conflict" }
      | undefined;
    act(() => {
      firstRankResult = result.current.addItem(firstRank!, 1, firstRank!.gameMode);
    });

    expect(firstRankResult?.status).toBe("added");

    let rankConflictResult:
      | { status: "added" | "already-in-cart" | "mode-mismatch" | "rank-conflict"; conflictingProduct?: unknown }
      | undefined;
    act(() => {
      rankConflictResult = result.current.addItem(secondRank!, 1, secondRank!.gameMode);
    });

    expect(rankConflictResult?.status).toBe("rank-conflict");
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]?.product.id).toBe(firstRank!.id);

    act(() => {
      result.current.removeItem(firstRank!.id);
    });

    await waitFor(() => expect(result.current.modeId).toBe(null));

    let mismatchResult:
      | { status: "added" | "already-in-cart" | "mode-mismatch" | "rank-conflict" }
      | undefined;
    act(() => {
      mismatchResult = result.current.addItem(otherModeProduct!, 1, otherModeProduct!.gameMode);
    });

    expect(mismatchResult?.status).toBe("added");
    expect(result.current.modeId).toBe("oneblock");

    let secondModeMismatchResult:
      | { status: "added" | "already-in-cart" | "mode-mismatch" | "rank-conflict" }
      | undefined;
    act(() => {
      secondModeMismatchResult = result.current.addItem(startingProduct!, 1, startingProduct!.gameMode);
    });

    expect(secondModeMismatchResult?.status).toBe("mode-mismatch");
    expect(result.current.items).toHaveLength(1);
    expect(result.current.modeId).toBe("oneblock");
  });
});
