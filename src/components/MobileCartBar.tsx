import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

interface MobileCartBarProps {
  items: number;
  totalPrice: number;
  visible: boolean;
  onOpenCart: () => void;
}

export default function MobileCartBar({
  items,
  totalPrice,
  visible,
  onOpenCart,
}: MobileCartBarProps) {
  if (!visible) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 md:hidden"
    >
      <button
        type="button"
        onClick={onOpenCart}
        className="flex w-full items-center justify-between gap-3 rounded-[24px] border-[3px] border-[#2d3038] bg-[#1f242c] px-4 py-3 text-left text-white shadow-[0_10px_0_0_#2d3038,0_20px_32px_-24px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-[18px] border-2 border-[#8c5a12] bg-[#f7d04e] text-[#342203] shadow-[0_4px_0_0_#8c5a12]">
            <ShoppingCart className="h-5 w-5" />
          </span>
          <div>
            <p className="font-pixel text-[10px] uppercase tracking-[0.14em] text-[#f7d04e]">
              Koszyk
            </p>
            <p className="mt-1 text-sm font-semibold text-white/90">
              {items} {items === 1 ? "pakiet" : "pakiety"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-white/60">Do zaplaty</p>
          <p className="mt-1 text-xl font-black leading-none text-white">
            {totalPrice.toFixed(2)}
            <span className="ml-1 text-xs font-bold text-white/65">PLN</span>
          </p>
        </div>
      </button>
    </motion.div>
  );
}
