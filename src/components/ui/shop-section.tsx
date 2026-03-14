import * as React from "react";
import { cn } from "@/lib/utils";

export interface ShopSectionProps
  extends React.HTMLAttributes<HTMLElement> {}

export function ShopSection({
  className,
  ...props
}: ShopSectionProps) {
  return (
    <section
      className={cn(
        "relative mx-auto max-w-[1240px] px-4 py-6 pb-12",
        className,
      )}
      {...props}
    />
  );
}

