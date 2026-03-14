import * as React from "react";
import { cn } from "@/lib/utils";

type ShopButtonVariant = "primary" | "secondary" | "ghost";
type ShopButtonSize = "md" | "lg";

export interface ShopButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ShopButtonVariant;
  size?: ShopButtonSize;
}

const variantClassName: Record<ShopButtonVariant, string> = {
  primary: "shop-button btn-premium shop-button-arcade",
  secondary: "shop-button shop-button-arcade-secondary",
  ghost:
    "inline-flex items-center justify-center rounded-xl border border-transparent bg-transparent text-foreground/80 hover:bg-white/10",
};

const sizeClassName: Record<ShopButtonSize, string> = {
  md: "h-10 px-3.5 text-sm",
  lg: "h-12 px-5 text-sm sm:text-[15px]",
};

export const ShopButton = React.forwardRef<HTMLButtonElement, ShopButtonProps>(
  (
    { variant = "primary", size = "md", className, type = "button", ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
          variantClassName[variant],
          sizeClassName[size],
          className,
        )}
        {...props}
      />
    );
  },
);

ShopButton.displayName = "ShopButton";

