import { describe, expect, it } from "vitest";
import { products } from "@/data/shopData";
import { getCartPaymentOptions, isValidNickname } from "@/lib/checkout";
import { createCheckoutDraftData, createOrderData, getStorefrontData } from "@/lib/storefrontService";

describe("checkout helpers", () => {
  it("builds shared payment options and totals from cart items", () => {
    const firstProduct = products.find((product) => product.id === "survival-dzialki-644");
    const secondProduct = products.find((product) => product.id === "survival-dzialki-645");

    expect(firstProduct).toBeDefined();
    expect(secondProduct).toBeDefined();

    const items = [
      { product: firstProduct!, quantity: 1 },
      { product: secondProduct!, quantity: 2 },
    ];
    const paymentOptions = getCartPaymentOptions(items);
    const transferOption = paymentOptions.find((option) => option.id === "transfer");
    const expectedTotal =
      firstProduct!.paymentOptions.find((option) => option.id === "transfer")!.price! +
      secondProduct!.paymentOptions.find((option) => option.id === "transfer")!.price! * 2;

    expect(paymentOptions.length).toBeGreaterThan(0);
    expect(transferOption?.totalAmount).toBeCloseTo(expectedTotal);
  });

  it("creates a draft with server-side totals and rejects invalid nicknames", () => {
    const draft = createCheckoutDraftData({
      modeId: "survival-dzialki",
      paymentOptionId: "transfer",
      nickname: "Player123",
      items: [
        { productId: "survival-dzialki-644", quantity: 1 },
        { productId: "survival-dzialki-645", quantity: 2 },
      ],
    });

    expect(draft.items).toHaveLength(2);
    expect(draft.amount).toBeGreaterThan(0);
    expect(draft.nickname).toBe("Player123");
    expect(draft.paymentProvider).toBe("Cashbill");
    expect(isValidNickname("Player123")).toBe(true);
    expect(isValidNickname("bad nick")).toBe(false);
    expect(() =>
      createCheckoutDraftData({
        modeId: "survival-dzialki",
        paymentOptionId: "transfer",
        nickname: "bad nick",
        items: [{ productId: "survival-dzialki-644", quantity: 1 }],
      })
    ).toThrow("Nickname");
  });

  it("creates an order confirmation from the server-priced draft input", () => {
    const order = createOrderData({
      modeId: "survival-dzialki",
      paymentOptionId: "transfer",
      nickname: "Player123",
      draftToken: "draft_preview_token",
      items: [
        { productId: "survival-dzialki-644", quantity: 1 },
        { productId: "survival-dzialki-645", quantity: 2 },
      ],
    });

    expect(order.status).toBe("preview_pending_payment");
    expect(order.orderToken.startsWith("ord_")).toBe(true);
    expect(order.items).toHaveLength(2);
    expect(order.nickname).toBe("Player123");
    expect(order.expiresAt).toBeTruthy();
  });

  it("returns storefront metadata with an active cart flow", () => {
    const storefront = getStorefrontData({ modeId: "survival-dzialki" });

    expect(storefront.storefront.cartEnabled).toBe(true);
    expect(storefront.storefront.checkout.quantityEnabled).toBe(true);
    expect(storefront.products.every((product) => product.gameMode === "survival-dzialki")).toBe(true);
  });
});
