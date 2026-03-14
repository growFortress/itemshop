import type { GameMode, PaymentLink, Product } from "@/data/shopData";

export const storefrontApiRoutes = {
  storefront: "/api/storefront",
  orderDrafts: "/api/orders/drafts",
  orders: "/api/orders",
  checkoutDrafts: "/api/orders/drafts",
} as const;

export interface StorefrontMetaDto {
  sourceUrl: string;
  syncedAt: string;
  currency: "PLN";
  cartEnabled: boolean;
  support: {
    email: string;
    contactUrl: string;
  };
  legal: {
    regulationsUrl: string;
    privacyUrl: string;
  };
  checkout: {
    status: "preview" | "live";
    provider: string;
    quantityEnabled: boolean;
    nicknameField: {
      label: string;
      placeholder: string;
      minLength: number;
      maxLength: number;
      pattern: string;
    };
  };
}

export interface StorefrontModeDto extends GameMode {
  productCount: number;
  availableProductTypes: Product["type"][];
  rankPreviewProductIds: string[];
}

export interface StorefrontResponseDto {
  storefront: StorefrontMetaDto;
  modes: StorefrontModeDto[];
  products: Product[];
}

export interface CheckoutDraftRequestDto {
  modeId: string;
  paymentOptionId: string;
  nickname: string;
  items: CheckoutDraftItemRequestDto[];
}

export interface CheckoutDraftItemRequestDto {
  productId: string;
  quantity: number;
}

export interface CheckoutDraftResponseDto {
  status: "preview" | "ready";
  checkoutUrl: string | null;
  orderToken: string;
  modeId: string;
  paymentOptionId: string;
  paymentOptionLabel: string;
  nickname: string;
  paymentProvider: string;
  amount: number;
  currency: "PLN";
  legalLinks: PaymentLink[];
  items: CheckoutDraftLineDto[];
}

export interface CheckoutDraftLineDto {
  productId: string;
  productName: string;
  quantity: number;
  unitAmount: number;
  totalAmount: number;
}

export interface CreateOrderRequestDto extends CheckoutDraftRequestDto {
  draftToken?: string | null;
}

export interface OrderResponseDto {
  status: "preview_pending_payment" | "pending_payment";
  orderToken: string;
  checkoutUrl: string | null;
  checkoutStatusUrl: string | null;
  modeId: string;
  paymentOptionId: string;
  paymentOptionLabel: string;
  nickname: string;
  paymentProvider: string;
  amount: number;
  currency: "PLN";
  legalLinks: PaymentLink[];
  items: CheckoutDraftLineDto[];
  expiresAt: string | null;
}
