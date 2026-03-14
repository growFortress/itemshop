import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ShoppingCart } from "lucide-react";

interface NavbarProps {
  cartItems?: number;
  cartEnabled?: boolean;
  onOpenCart?: () => void;
}

export default function Navbar({
  cartItems = 0,
  cartEnabled = true,
  onOpenCart,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shellClassName = scrolled
    ? "border-[#ddd2c1]/95 bg-[#fffaf2]/86 shadow-[0_18px_36px_-28px_rgba(15,23,42,0.18)] backdrop-blur-2xl"
    : "border-[#e9dfcf]/95 bg-[#fffbf4]/96 shadow-[0_12px_28px_-28px_rgba(15,23,42,0.12)] backdrop-blur-xl";
  const neutralButtonClassName =
    "shop-button-secondary border-[#ddd3c4] bg-white/90 text-foreground hover:border-primary/28 hover:bg-white";
  const iconShellClassName = "bg-[#f5efe5] text-[#2a3140]";
  const neutralActionClassName = `shop-button ${neutralButtonClassName}`;
  const cartButtonClassName = !cartEnabled
    ? `${neutralActionClassName} cursor-not-allowed opacity-70 hover:border-[#ddd3c4] hover:bg-white/90`
    : cartItems > 0
      ? "shop-button btn-premium"
      : neutralActionClassName;
  const actionButtonLayoutClassName = "h-[50px] px-3.5 sm:px-5";
  const cartButtonLabel = cartEnabled ? "Koszyk" : "Koszyk wkrotce";

  return (
    <motion.nav
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.28 }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-250 ${shellClassName}`}
    >
      <div className="minecraft-strip absolute inset-x-0 top-0 h-[4px]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/18 to-transparent" />

      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 py-2.5">
        <a href="/" className="shrink-0">
          <img
            src="/logo.png"
            alt="Crafted.pl"
            className="-ml-3 h-8 w-auto opacity-95 [filter:brightness(0)_saturate(100%)] sm:h-10"
            draggable={false}
          />
        </a>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cartEnabled ? onOpenCart : undefined}
            disabled={!cartEnabled}
            aria-label={cartEnabled ? (cartItems > 0 ? "Otworz koszyk" : "Koszyk") : "Koszyk wkrotce"}
            className={`justify-center ${actionButtonLayoutClassName} ${cartButtonClassName}`}
          >
            <span
              className={`inventory-slot inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[12px] ${
                cartEnabled && cartItems > 0 ? "bg-[#342203]/10 text-[#342203]" : iconShellClassName
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
            </span>
            <span className="hidden text-sm font-semibold sm:inline">{cartButtonLabel}</span>
            {cartEnabled && cartItems > 0 && (
              <motion.span
                key={cartItems}
                initial={{ scale: 0.65, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="shop-badge border-[#c28b1c]/40 bg-[#342203] px-2 text-[#ffe8a3]"
              >
                {cartItems}
              </motion.span>
            )}
          </button>

          <a href="#" className={`justify-center ${actionButtonLayoutClassName} ${neutralActionClassName}`}>
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Discord</span>
          </a>
        </div>
      </div>
    </motion.nav>
  );
}

