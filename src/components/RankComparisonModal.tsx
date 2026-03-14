import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Product } from "@/data/shopData";
import crownImg from "@/assets/crown.png";

interface RankComparisonModalProps {
  gameMode: string;
  products: Product[];
  cartEnabled?: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export default function RankComparisonModal({
  gameMode,
  products,
  cartEnabled = true,
  onClose,
  onSelectProduct,
}: RankComparisonModalProps) {
  const rankProducts = products
    .filter((item) => item.gameMode === gameMode && item.type === "rank")
    .sort((left, right) => left.price - right.price);

  if (rankProducts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="rank-compare-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/55 p-4 backdrop-blur-md sm:p-6"
      >
        <motion.div
          key="rank-compare-modal"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={{ duration: 0.24 }}
          onClick={(event) => event.stopPropagation()}
          className="relative my-auto flex max-h-[min(92vh,960px)] w-full max-w-6xl flex-col overflow-hidden rounded-[32px] border-[3px] border-[#d8cfbf] bg-[#fffaf0] shadow-[0_12px_0_0_#d8cfbf,0_30px_80px_-28px_rgba(15,23,42,0.42)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rank-comparison-title"
          aria-describedby="rank-comparison-description"
        >
          <div className="minecraft-strip absolute inset-x-0 top-0 h-[5px]" />
          <div className="relative border-b-[3px] border-[#eadfcb] bg-[linear-gradient(180deg,#fff9eb_0%,#fff0c9_100%)] px-5 pb-6 pt-6 sm:px-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-4">
                <div className="inventory-slot mt-1 rounded-[20px] border-2 border-[#8c5a12] bg-[#f7d04e] p-3 shadow-[0_4px_0_0_#8c5a12]">
                  <img src={crownImg} alt="" className="h-10 w-10 pixel-art" />
                </div>
                <div className="min-w-0 max-w-4xl">
                  <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
                    Porownanie rang
                  </p>
                  <h2
                    id="rank-comparison-title"
                    className="mt-3 text-[1.75rem] font-black leading-[1.08] tracking-[-0.03em] text-foreground sm:text-[2rem]"
                  >
                    Sprawdz, ktora ranga najlepiej pasuje do tego trybu
                  </h2>
                  <p
                    id="rank-comparison-description"
                    className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]"
                  >
                    {cartEnabled
                      ? "Jedna plansza, szybkie porownanie i wygodny wybor najlepszej rangi."
                      : "Jedna plansza i szybkie porownanie bonusow wszystkich rang."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inventory-slot inline-flex h-10 w-10 items-center justify-center rounded-[16px] border-2 border-[#d8cfbf] bg-white text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Zamknij porownanie rang"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="scrollbar-shop overflow-y-auto overflow-x-hidden px-5 pb-5 pt-5 sm:px-7 sm:pb-7">
            <div
              className="grid items-stretch gap-5"
              style={{
                gridAutoRows: "1fr",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              }}
            >
              {rankProducts.map((rank, index) => {
                const isHighest = index === rankProducts.length - 1;

                return (
                  <motion.div
                    key={rank.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className={`relative flex min-h-full flex-col overflow-hidden rounded-[28px] border-[3px] bg-white ${
                      isHighest
                        ? "border-primary shadow-[0_8px_0_0_rgba(245,158,11,0.35),0_18px_40px_-28px_rgba(245,158,11,0.45)]"
                        : "border-[#d8cfbf] shadow-[0_8px_0_0_#d8cfbf]"
                    }`}
                  >
                    <div className="minecraft-strip absolute inset-x-0 top-0 h-[4px]" />
                    <div className="flex min-h-[15.25rem] flex-col items-center border-b-[3px] border-[#eadfcb] bg-[#fffaf0] px-5 pb-6 pt-6 text-center sm:px-6">
                      <div className="flex h-9 items-start justify-center">
                        {isHighest ? (
                          <span className="shop-badge border-[#efd9a0] bg-[#fff7df] text-[#8b6410]">
                            Najwyzsza ranga
                          </span>
                        ) : null}
                      </div>
                      <div className="inventory-slot mx-auto mt-3 flex h-20 w-20 items-center justify-center rounded-[22px]">
                        <img src={crownImg} alt={rank.name} className="h-16 w-16 pixel-art" />
                      </div>
                      {rank.subtitle ? (
                        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          {rank.subtitle}
                        </p>
                      ) : null}
                      <h3 className="mt-4 text-[1.55rem] font-bold leading-tight text-foreground sm:text-[1.65rem]">
                        {rank.name}
                      </h3>
                      <p className="mt-3 text-[2.2rem] font-black leading-none tracking-[-0.04em] text-primary">
                        {rank.price.toFixed(2)}
                        <span className="ml-1 text-base font-bold tracking-normal text-muted-foreground">PLN</span>
                      </p>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="space-y-2.5">
                        {rank.details.map((detail) => (
                          <div
                            key={`${rank.id}-${detail}`}
                            className="rounded-[18px] border border-[#eadfcb] bg-[#fffaf0] px-4 py-3 text-sm leading-relaxed text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                          >
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 pt-0 sm:px-6 sm:pb-6">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProduct(rank as Product);
                          onClose();
                        }}
                        className={`shop-button w-full ${
                          isHighest
                            ? "btn-premium"
                            : "shop-button-secondary"
                        }`}
                      >
                        {cartEnabled ? "Zobacz szczegoly rangi" : "Podejrzyj range"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
