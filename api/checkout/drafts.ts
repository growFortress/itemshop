import { proxyLaravelRequest } from "../_lib/proxy";
import type { ApiRequestLike, ApiResponseLike } from "../_lib/proxy";
import { createCheckoutDraftData } from "../../src/lib/storefrontService";

export default async function handler(req: ApiRequestLike, res: ApiResponseLike) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  if (await proxyLaravelRequest(req, res, "api/orders/drafts")) {
    return;
  }

  try {
    res.status(200).json(createCheckoutDraftData(req.body as any, { status: "preview" }));
  } catch (error) {
    res.status(422).json({
      message: error instanceof Error ? error.message : "Unable to create checkout draft.",
    });
  }
}
