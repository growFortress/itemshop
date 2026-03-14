import * as React from "react";
import { cn } from "@/lib/utils";

type ShopBadgeTone =
  | "neutral"
  | "highlight"
  | "count"
  | "status-popular"
  | "status-premium"
  | "status-value"
  | "status-new";

export interface ShopBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: ShopBadgeTone;
}

const toneClassName: Record<ShopBadgeTone, string> = {
  neutral: "border-white/18 bg-black/16 text-white/84",
  highlight: "border-primary/22 bg-primary/12 text-[#7a5714]",
  count: "border-[#d6c09a] bg-[#fff5dd] text-[#7a5714]",
  "status-popular": "border-[#ffe08a]/35 bg-[#fff1b9]/14 text-[#fff4d3]",
  "status-premium": "border-[#ffd8a0]/30 bg-[#fff0d5]/14 text-[#fff4e4]",
  "status-value": "border-[#f7d1a6]/32 bg-[#fff2dc]/14 text-[#fff4e2]",
  "status-new": "border-[#d2ffd7]/32 bg-[#effff1]/14 text-[#f2fff3]",
};

export function ShopBadge({
  tone = "neutral",
  className,
  ...props
}: ShopBadgeProps) {
  return (
    <span
      className={cn(
        "shop-badge inline-flex items-center gap-1 rounded-full border px-2.5 py-[5px] text-[11px] font-semibold uppercase tracking-[0.16em]",
        toneClassName[tone],
        className,
      )}
      {...props}
    />
  );
}

