import { craftedCatalog } from "../data/craftedCatalog.generated";
import { gameModes, products } from "../data/shopData";
import type {
  CreateOrderRequestDto,
  CheckoutDraftRequestDto,
  CheckoutDraftResponseDto,
  OrderResponseDto,
  StorefrontModeDto,
  StorefrontResponseDto,
} from "../types/storefront";

const currency = "PLN" as const;
const nicknamePattern = "^[^\\s]{1,16}$";
const paymentProvider = "Cashbill" as const;

function uniqueProductTypes(modeId: string) {
  return [...new Set(products.filter((product) => product.gameMode === modeId).map((product) => product.type))];
}

function mapMode(modeId: string): StorefrontModeDto {
  const mode = gameModes.find((item) => item.id === modeId);

  if (!mode) {
    throw new Error(`Unknown storefront mode: ${modeId}`);
  }

  const modeProducts = products.filter((product) => product.gameMode === modeId);

  return {
    ...mode,
    productCount: modeProducts.length,
    availableProductTypes: uniqueProductTypes(modeId),
    rankPreviewProductIds: modeProducts
      .filter((product) => product.type === "rank")
      .sort((left, right) => left.price - right.price)
      .slice(0, 3)
      .map((product) => product.id),
  };
}

function buildStorefrontMeta(
  status: StorefrontResponseDto["storefront"]["checkout"]["status"]
): StorefrontResponseDto["storefront"] {
  const primaryMode = gameModes[0];

  return {
    sourceUrl: craftedCatalog.sourceUrl,
    syncedAt: craftedCatalog.generatedAt,
    currency,
    cartEnabled: true,
    support: {
      email: primaryMode.supportEmail,
      contactUrl: primaryMode.contactUrl,
    },
    legal: {
      regulationsUrl: primaryMode.regulationsUrl,
      privacyUrl: primaryMode.privacyUrl,
    },
    checkout: {
      status,
      provider: paymentProvider,
      quantityEnabled: true,
      nicknameField: {
        label: "Nick gracza",
        placeholder: "Twoj Nick",
        minLength: 1,
        maxLength: 16,
        pattern: nicknamePattern,
      },
    },
  };
}

function createOrderToken() {
  return `draft_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function createFinalOrderToken() {
  return `ord_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function createPreviewExpiryDate() {
  return new Date(Date.now() + 15 * 60 * 1000).toISOString();
}

function resolveCheckoutRequest(input: CheckoutDraftRequestDto) {
  const trimmedNickname = input.nickname.trim();
  const requestedItems = input.items.filter((item) => item.quantity > 0);

  if (!/^[^\s]{1,16}$/.test(trimmedNickname)) {
    throw new Error("Nickname must contain 1 to 16 non-space characters.");
  }

  if (!requestedItems.length) {
    throw new Error("Checkout draft requires at least one line item.");
  }

  const resolvedProducts = requestedItems.map((requestedItem) => {
    const product = products.find(
      (item) => item.id === requestedItem.productId && item.gameMode === input.modeId
    );

    if (!product) {
      throw new Error(`Product ${requestedItem.productId} for mode ${input.modeId} was not found.`);
    }

    const paymentOption = product.paymentOptions.find(
      (option) => option.id === input.paymentOptionId && option.price !== null
    );

    if (!paymentOption) {
      throw new Error(
        `Payment option ${input.paymentOptionId} is not available for ${requestedItem.productId}.`
      );
    }

    return {
      product,
      paymentOption,
      quantity: requestedItem.quantity,
      totalAmount: Number((paymentOption.price! * requestedItem.quantity).toFixed(2)),
    };
  });

  return {
    trimmedNickname,
    resolvedProducts,
    totalAmount: Number(
      resolvedProducts.reduce((sum, item) => sum + item.totalAmount, 0).toFixed(2)
    ),
  };
}

export function getStorefrontData(params?: {
  modeId?: string | null;
  checkoutStatus?: StorefrontResponseDto["storefront"]["checkout"]["status"];
}): StorefrontResponseDto {
  const modeId = params?.modeId ?? null;
  const visibleProducts = modeId ? products.filter((product) => product.gameMode === modeId) : products;
  const checkoutStatus = params?.checkoutStatus ?? "preview";

  return {
    storefront: buildStorefrontMeta(checkoutStatus),
    modes: gameModes.map((mode) => mapMode(mode.id)),
    products: visibleProducts,
  };
}

export function createCheckoutDraftData(
  input: CheckoutDraftRequestDto,
  options?: {
    status?: CheckoutDraftResponseDto["status"];
    checkoutUrl?: string | null;
    orderToken?: string;
  }
): CheckoutDraftResponseDto {
  const { trimmedNickname, resolvedProducts, totalAmount } = resolveCheckoutRequest(input);

  return {
    status: options?.status ?? "preview",
    checkoutUrl: options?.checkoutUrl ?? null,
    orderToken: options?.orderToken ?? createOrderToken(),
    modeId: input.modeId,
    paymentOptionId: input.paymentOptionId,
    paymentOptionLabel: resolvedProducts[0].paymentOption.label,
    nickname: trimmedNickname,
    paymentProvider,
    amount: totalAmount,
    currency,
    legalLinks: resolvedProducts[0].paymentOption.legalLinks,
    items: resolvedProducts.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitAmount: item.paymentOption.price!,
      totalAmount: item.totalAmount,
    })),
  };
}

export function createOrderData(
  input: CreateOrderRequestDto,
  options?: {
    status?: OrderResponseDto["status"];
    checkoutUrl?: string | null;
    checkoutStatusUrl?: string | null;
    orderToken?: string;
    expiresAt?: string | null;
  }
): OrderResponseDto {
  const draft = createCheckoutDraftData(input, {
    status: options?.status === "pending_payment" ? "ready" : "preview",
    checkoutUrl: options?.checkoutUrl ?? null,
    orderToken: options?.orderToken ?? createFinalOrderToken(),
  });

  return {
    status: options?.status ?? "preview_pending_payment",
    orderToken: draft.orderToken,
    checkoutUrl: options?.checkoutUrl ?? null,
    checkoutStatusUrl: options?.checkoutStatusUrl ?? null,
    modeId: draft.modeId,
    paymentOptionId: draft.paymentOptionId,
    paymentOptionLabel: draft.paymentOptionLabel,
    nickname: draft.nickname,
    paymentProvider: draft.paymentProvider,
    amount: draft.amount,
    currency: draft.currency,
    legalLinks: draft.legalLinks,
    items: draft.items,
    expiresAt: options?.expiresAt ?? createPreviewExpiryDate(),
  };
}
