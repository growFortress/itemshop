import {
  storefrontApiRoutes,
  CreateOrderRequestDto,
  CheckoutDraftRequestDto,
  CheckoutDraftResponseDto,
  OrderResponseDto,
  StorefrontResponseDto,
} from "@/types/storefront";
import { createCheckoutDraftData, createOrderData, getStorefrontData } from "@/lib/storefrontService";

const allowLocalPreviewFallback =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);
const useDirectLocalPreviewFallback =
  allowLocalPreviewFallback && import.meta.env.DEV;

async function readJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getStorefront(params?: { modeId?: string | null }): Promise<StorefrontResponseDto> {
  if (useDirectLocalPreviewFallback) {
    return getStorefrontData({ modeId: params?.modeId ?? null });
  }

  try {
    const query = params?.modeId ? `?modeId=${encodeURIComponent(params.modeId)}` : "";
    const response = await fetch(`${storefrontApiRoutes.storefront}${query}`);
    return await readJsonResponse<StorefrontResponseDto>(response);
  } catch (error) {
    if (!allowLocalPreviewFallback) {
      throw error;
    }

    return getStorefrontData({ modeId: params?.modeId ?? null });
  }
}

export async function createCheckoutDraft(
  input: CheckoutDraftRequestDto
): Promise<CheckoutDraftResponseDto> {
  if (useDirectLocalPreviewFallback) {
    return createCheckoutDraftData(input);
  }

  try {
    const response = await fetch(storefrontApiRoutes.orderDrafts, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    return await readJsonResponse<CheckoutDraftResponseDto>(response);
  } catch (error) {
    if (!allowLocalPreviewFallback) {
      throw error;
    }

    return createCheckoutDraftData(input);
  }
}

export async function createOrder(
  input: CreateOrderRequestDto
): Promise<OrderResponseDto> {
  if (useDirectLocalPreviewFallback) {
    return createOrderData(input);
  }

  try {
    const response = await fetch(storefrontApiRoutes.orders, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    return await readJsonResponse<OrderResponseDto>(response);
  } catch (error) {
    if (!allowLocalPreviewFallback) {
      throw error;
    }

    return createOrderData(input);
  }
}
