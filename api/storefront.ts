import { proxyLaravelRequest } from "./_lib/proxy";
import type { ApiRequestLike, ApiResponseLike } from "./_lib/proxy";
import { getStorefrontData } from "../src/lib/storefrontService";

export default async function handler(req: ApiRequestLike, res: ApiResponseLike) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  if (await proxyLaravelRequest(req, res, "api/storefront")) {
    return;
  }

  const modeId = Array.isArray(req.query?.modeId) ? req.query.modeId[0] : req.query?.modeId;

  res.status(200).json(
    getStorefrontData({
      modeId: typeof modeId === "string" ? modeId : null,
      checkoutStatus: "preview",
    })
  );
}
