import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ShoppingCart } from "lucide-react";

interface NavbarProps {
  activeModeName?: string;
  cartItems?: number;
  cartModeName?: string | null;
  onOpenCart?: () => void;
}

export default function Navbar({
  activeModeName,
  cartItems = 0,
  cartModeName,
  onOpenCart,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.28 }}
      className={`fixed inset-x-0 top-0 z-50 border-b-[3px] border-[#2d3038] transition-all duration-200 ${
        scrolled
          ? "bg-[#1f242c]/96 shadow-[0_18px_32px_-28px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          : "bg-[#20252f]/94 backdrop-blur-lg"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <a href="/" className="shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-sm tracking-[0.18em] text-primary text-shadow-pixel">
              CRAFTED
            </span>
            <span className="font-pixel text-[9px] text-white/55">.PL</span>
          </div>
          <p className="mt-1 text-[10px] font-pixel uppercase tracking-[0.16em] text-white/45">
            Pixel Shop
          </p>
        </a>

        <div className="flex items-center gap-2">
          {activeModeName && (
            <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/75 lg:inline-flex">
              Sklep: <span className="ml-1 text-primary">{activeModeName}</span>
            </div>
          )}

          {cartModeName && cartItems > 0 && (
            <div className="hidden rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary xl:inline-flex">
              Koszyk: {cartModeName}
            </div>
          )}

          <button
            type="button"
            onClick={onOpenCart}
            className={`relative inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
              cartItems > 0
                ? "border-primary/35 bg-primary/12 text-white hover:bg-primary/18"
                : "border-white/10 bg-white/5 text-white/88 hover:border-primary/25 hover:text-primary"
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Koszyk</span>
            {cartItems > 0 && (
              <motion.span
                key={cartItems}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground"
              >
                {cartItems}
              </motion.span>
            )}
          </button>

          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/88 transition-colors hover:border-primary/25 hover:text-primary"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Discord</span>
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
