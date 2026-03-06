import { motion } from "framer-motion";
import { Crown, Sparkles } from "lucide-react";
import { Product } from "@/data/shopData";
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

const rarityLabel: Record<string, string> = {
  legendary: "Legendarny",
  epic: "Epicki",
};

const rarityTone: Record<string, string> = {
  legendary: "border-amber-200 bg-amber-50/70",
  epic: "border-purple-200 bg-purple-50/70",
};

interface FeaturedCarouselProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function FeaturedCarousel({ products, onSelectProduct }: FeaturedCarouselProps) {
  const featured = products
    .filter((p) => p.rarity === "legendary" || p.rarity === "epic")
    .slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-[10px] font-pixel uppercase tracking-[0.2em] text-primary">
              Top Oferty
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Najciekawsze pozycje dla aktualnie wybranego trybu.
          </p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {featured.map((product, index) => (
          <motion.button
            key={product.id}
            type="button"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            onClick={() => onSelectProduct(product)}
            className={`group rounded-3xl border p-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${rarityTone[product.rarity]}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-[0_12px_24px_-18px_rgba(15,23,42,0.45)]">
                <img
                  src={imageMap[product.image]}
                  alt={product.name}
                  className="h-16 w-16 object-contain pixel-art transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Crown className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[10px] font-pixel uppercase tracking-[0.16em] text-primary">
                    {rarityLabel[product.rarity]}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.type === "rank"
                    ? "Mocniejsza pozycja dla graczy szukających stałych bonusów."
                    : product.type === "set"
                      ? "Pakiet premium dla szybkiego progresu i lepszej wartości."
                      : "Oferta premium dla aktualnego trybu gry."}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-3xl font-bold tracking-tight text-primary">
                    {product.price.toFixed(2)}
                    <span className="ml-1 text-sm text-primary/70">PLN</span>
                  </span>
                  <span className="rounded-full bg-foreground px-3 py-1.5 text-[10px] font-pixel uppercase tracking-[0.16em] text-background">
                    Zobacz
                  </span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
