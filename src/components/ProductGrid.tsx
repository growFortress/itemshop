import { AnimatePresence, motion } from "framer-motion";
import { Product, products } from "@/data/shopData";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  activeGameMode: string;
  onSelectProduct: (product: Product) => void;
}

const imageOrder: Record<string, number> = { crown: 0, chest: 1, sword: 2, key: 3 };

export default function ProductGrid({ activeGameMode, onSelectProduct }: ProductGridProps) {
  const modeProducts = products
    .filter((p) => p.gameMode === activeGameMode)
    .sort((a, b) => (imageOrder[a.image] ?? 9) - (imageOrder[b.image] ?? 9));

  return (
    <section className="max-w-6xl mx-auto px-4 py-6 relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeGameMode}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {modeProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onSelect={onSelectProduct}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {modeProducts.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="font-pixel text-sm">Brak produktów w tym trybie</p>
          <p className="text-xs mt-2">Sprawdź inne tryby gry</p>
        </div>
      )}
    </section>
  );
}
