import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Sparkles } from "lucide-react";
import { Product } from "@/data/shopData";
import { toast } from "sonner";
import chestImg from "@/assets/chest.png";
import swordImg from "@/assets/sword.png";
import crownImg from "@/assets/crown.png";
import keyImg from "@/assets/key.png";

const imageMap: Record<string, string> = {
  vip: crownImg,
  rank: crownImg,
  crate: chestImg,
  kit: swordImg,
  money: keyImg,
  chest: chestImg,
  sword: swordImg,
  crown: crownImg,
  key: keyImg,
};

interface PurchaseModalProps {
  activeModeName: string;
  cartModeName?: string | null;
  onAddToCart: (product: Product, quantity: number) => void;
  product: Product | null;
  onClose: () => void;
}

export default function PurchaseModal({
  activeModeName,
  cartModeName,
  onAddToCart,
  product,
  onClose,
}: PurchaseModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleConfirm = () => {
    onAddToCart(product, quantity);
    toast.success("Dodano do koszyka", {
      description: `${product.name} x ${quantity} dla trybu ${activeModeName}.`,
      duration: 3000,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="purchase-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-md"
      >
        <motion.div
          key="purchase-modal"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={{ duration: 0.22 }}
          onClick={(event) => event.stopPropagation()}
          className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-[0_28px_70px_-30px_rgba(15,23,42,0.32)]"
        >
          <div className="grid lg:grid-cols-[230px_minmax(0,1fr)]">
            <div className="border-b border-border/50 bg-[linear-gradient(180deg,#fffdf6_0%,#f9f1df_100%)] p-5 lg:border-b-0 lg:border-r">
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-pixel uppercase tracking-[0.16em] text-primary">
                  Potwierdzenie
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-white/70 text-muted-foreground transition-colors hover:text-foreground"
                >
                  ×
                </button>
              </div>

              <div className="mt-5 flex items-center justify-center rounded-[24px] border border-amber-200 bg-white/90 p-4 shadow-inner">
                <img src={imageMap[product.image]} alt={product.name} className="h-20 w-20 pixel-art" />
              </div>

              <div className="mt-4">
                <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">Wybrany pakiet</p>
                <h2 className="mt-2.5 text-xl font-semibold leading-tight text-foreground">
                  {product.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  To jest tylko potwierdzenie dodania do koszyka.
                </p>
              </div>
            </div>

            <div className="p-5">
              <div className="rounded-[22px] border border-[#d9c9a8] bg-[linear-gradient(180deg,#fffdf8_0%,#f8f0de_100%)] p-4 text-foreground shadow-[0_18px_34px_-28px_rgba(15,23,42,0.24)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
                      Dodajesz do koszyka
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Koszyk obsluguje tylko jeden tryb naraz.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/70 bg-white/70 px-4 py-3">
                    <p className="text-[10px] font-pixel uppercase tracking-[0.16em] text-primary">Tryb</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{activeModeName}</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-white/70 px-4 py-3">
                    <p className="text-[10px] font-pixel uppercase tracking-[0.16em] text-primary">Koszyk</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {cartModeName ?? "Zostanie przypisany po tym dodaniu"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[170px_minmax(0,1fr)]">
                <div className="rounded-[22px] border border-border/70 bg-background p-4">
                  <label className="font-pixel text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Ilosc
                  </label>
                  <div className="mt-3 flex items-center justify-between rounded-2xl border border-border/70 bg-card p-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-background text-lg font-semibold text-foreground"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-lg font-bold text-foreground">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-background text-lg font-semibold text-foreground"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="rounded-[22px] border border-border/70 bg-background p-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-pixel text-[10px] uppercase tracking-[0.16em]">
                      Krotka informacja
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Po dodaniu pakiet pojawi sie w koszyku przypisanym do tego trybu. Dane gracza i platnosc beda kolejnym krokiem.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-[22px] border border-border/70 bg-background p-4">
                <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
                  Podsumowanie
                </p>
                <div className="mt-4 flex flex-col gap-3 border-t border-border/50 pt-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Do zaplaty</p>
                    <p className="mt-1 text-3xl font-bold tracking-tight text-primary">
                      {(product.price * quantity).toFixed(2)}
                      <span className="ml-1 text-sm font-semibold text-muted-foreground">PLN</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="btn-premium rounded-xl px-5 py-3 text-sm font-bold tracking-wider text-primary-foreground"
                  >
                    <span className="font-pixel text-[11px]">DODAJ DO KOSZYKA</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
