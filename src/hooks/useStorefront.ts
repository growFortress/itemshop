import { useQuery } from "@tanstack/react-query";
import { getStorefront } from "@/lib/storefrontApi";

export function useStorefront(modeId?: string | null) {
  return useQuery({
    queryKey: ["storefront", modeId ?? "all"],
    queryFn: () => getStorefront({ modeId }),
    staleTime: 5 * 60 * 1000,
  });
}
