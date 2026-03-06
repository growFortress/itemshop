import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Product, products, rankDefinitions, rankPerks } from "@/data/shopData";
import crownImg from "@/assets/crown.png";

interface RankComparisonModalProps {
  gameMode: string;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export default function RankComparisonModal({
  gameMode,
  onClose,
  onSelectProduct,
}: RankComparisonModalProps) {
  const definitions = rankDefinitions[gameMode] || [];

  if (definitions.length === 0) return null;

  const rankProducts = definitions
    .map((definition) => {
      const product = products.find((item) => item.id === definition.productId);
      return product ? { ...definition, product } : null;
    })
    .filter(Boolean) as (typeof definitions[number] & { product: Product })[];

  return (
    <AnimatePresence>
      <motion.div
        key="rank-compare-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4 backdrop-blur-md"
      >
        <motion.div
          key="rank-compare-modal"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={{ duration: 0.24 }}
          onClick={(event) => event.stopPropagation()}
          className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[30px] border-[3px] border-[#d8cfbf] bg-[#fffaf0] shadow-[0_12px_0_0_#d8cfbf,0_30px_80px_-28px_rgba(15,23,42,0.42)]"
        >
          <div className="border-b-[3px] border-[#eadfcb] bg-[linear-gradient(180deg,#fff9eb_0%,#fff0c9_100%)] px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-[20px] border-2 border-[#8c5a12] bg-[#f7d04e] p-3 shadow-[0_4px_0_0_#8c5a12]">
                  <img src={crownImg} alt="" className="h-10 w-10 pixel-art" />
                </div>
                <div>
                  <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
                    Porownanie rang
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground">
                    Sprawdz, ktora ranga najlepiej pasuje do tego trybu
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Jedna plansza, szybkie porownanie i od razu dodanie najlepszej rangi do koszyka.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-[16px] border-2 border-[#d8cfbf] bg-white text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Zamknij porownanie rang"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-auto p-6">
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${rankProducts.length}, minmax(240px, 1fr))` }}
            >
              {rankProducts.map((rank, index) => {
                const isHighest = index === rankProducts.length - 1;

                return (
                  <motion.div
                    key={rank.productId}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className={`flex flex-col overflow-hidden rounded-[26px] border-[3px] bg-white ${
                      isHighest
                        ? "border-primary shadow-[0_8px_0_0_rgba(245,158,11,0.35),0_18px_40px_-28px_rgba(245,158,11,0.45)]"
                        : "border-[#d8cfbf] shadow-[0_8px_0_0_#d8cfbf]"
                    }`}
                  >
                    <div className="border-b-[3px] border-[#eadfcb] bg-[#fffaf0] p-5 text-center">
                      {isHighest && (
                        <span className="inline-flex rounded-full border-2 border-[#8c5a12] bg-primary px-3 py-1 text-[10px] font-pixel uppercase tracking-[0.16em] text-primary-foreground shadow-[0_3px_0_0_#8c5a12]">
                          Najwyzsza ranga
                        </span>
                      )}
                      <img src={crownImg} alt={rank.rankName} className="mx-auto mt-4 h-16 w-16 pixel-art" />
                      <h3 className="mt-4 font-pixel text-sm uppercase tracking-[0.14em] text-foreground">
                        {rank.rankName}
                      </h3>
                      <p className="mt-3 text-3xl font-black tracking-tight text-primary">
                        {rank.product.price.toFixed(2)}
                        <span className="ml-1 text-sm font-bold text-muted-foreground">PLN</span>
                      </p>
                    </div>

                    <div className="flex-1 p-5">
                      <div className="space-y-0">
                        {rankPerks.map((perk, perkIndex) => {
                          const value = rank.perks[perk.name];

                          return (
                            <div
                              key={perk.name}
                              className={`flex items-center gap-3 py-3 text-sm ${perkIndex < rankPerks.length - 1 ? "border-b border-[#efe7d7]" : ""}`}
                            >
                              <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
                              <span className="flex-1 text-muted-foreground">{perk.name}</span>
                              <span className="font-semibold text-foreground">
                                {typeof value === "boolean" ? (value ? "Tak" : "Nie") : value}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProduct(rank.product);
                          onClose();
                        }}
                        className={`w-full rounded-[18px] border-2 px-4 py-3 font-pixel text-[11px] uppercase tracking-[0.16em] ${
                          isHighest
                            ? "border-[#8c5a12] bg-[linear-gradient(180deg,#ffd65a_0%,#f4b51f_100%)] text-[#342203] shadow-[0_5px_0_0_#8c5a12]"
                            : "border-[#d8cfbf] bg-[#fffaf0] text-foreground shadow-[0_5px_0_0_#d8cfbf]"
                        }`}
                      >
                        Dodaj te range
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
