import { proxyLaravelRequest } from "./_lib/proxy";
import type { ApiRequestLike, ApiResponseLike } from "./_lib/proxy";
import { createOrderData } from "../src/lib/storefrontService";
import type { CreateOrderRequestDto } from "../src/types/storefront";

export default async function handler(req: ApiRequestLike, res: ApiResponseLike) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  if (await proxyLaravelRequest(req, res, "api/orders")) {
    return;
  }

  try {
    res.status(200).json(
      createOrderData(req.body as CreateOrderRequestDto, { status: "preview_pending_payment" })
    );
  } catch (error) {
    res.status(422).json({
      message: error instanceof Error ? error.message : "Unable to create order.",
    });
  }
}
