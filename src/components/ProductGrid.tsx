import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BarChart3, Package, ShoppingCart, Sparkles } from "lucide-react";
import { Product, gameModes, products } from "@/data/shopData";
import { ProductCategoryId, buildCategories, filterByCategory } from "@/lib/productCategory";
import ProductCard from "./ProductCard";
import CategoryTabs from "./CategoryTabs";

interface ProductGridProps {
  activeGameMode: string;
  activeCartMode: string | null;
  cartItems: number;
  cartProductQuantities: Record<string, number>;
  onAddProduct: (product: Product) => void;
  onCompareRanks: () => void;
  onOpenCart: () => void;
}

const categorySortWeight: Record<Product["type"], number> = {
  rank: 0,
  set: 1,
  key: 2,
  chest: 3,
  other: 4,
};

const rarityWeight: Record<Product["rarity"], number> = {
  legendary: 0,
  epic: 1,
  rare: 2,
  common: 3,
};

const badgeWeight: Record<NonNullable<Product["badge"]>, number> = {
  hot: 0,
  sale: 1,
  new: 2,
};

function sortProductsForStorefront(left: Product, right: Product) {
  const priorityDiff = (left.sortPriority ?? 999) - (right.sortPriority ?? 999);
  if (priorityDiff !== 0) {
    return priorityDiff;
  }

  if (left.popular !== right.popular) {
    return left.popular ? -1 : 1;
  }

  const badgeDiff = (left.badge ? badgeWeight[left.badge] : 99) - (right.badge ? badgeWeight[right.badge] : 99);
  if (badgeDiff !== 0) {
    return badgeDiff;
  }

  const categoryDiff = categorySortWeight[left.type] - categorySortWeight[right.type];
  if (categoryDiff !== 0) {
    return categoryDiff;
  }

  const rarityDiff = rarityWeight[left.rarity] - rarityWeight[right.rarity];
  if (rarityDiff !== 0) {
    return rarityDiff;
  }

  const priceDiff = right.price - left.price;
  if (priceDiff !== 0) {
    return priceDiff;
  }

  return left.name.localeCompare(right.name, "pl");
}

export default function ProductGrid({
  activeGameMode,
  activeCartMode,
  cartItems,
  cartProductQuantities,
  onAddProduct,
  onCompareRanks,
  onOpenCart,
}: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<ProductCategoryId>("all");

  const modeProducts = useMemo(
    () => products.filter((product) => product.gameMode === activeGameMode).sort(sortProductsForStorefront),
    [activeGameMode]
  );
  const categories = useMemo(() => buildCategories(modeProducts), [modeProducts]);
  const filteredProducts = useMemo(
    () => filterByCategory(modeProducts, activeCategory),
    [modeProducts, activeCategory]
  );
  const activeModeLabel = useMemo(
    () => gameModes.find((mode) => mode.id === activeGameMode)?.name ?? "Wybrany tryb",
    [activeGameMode]
  );
  const hasRanks = useMemo(
    () => modeProducts.some((product) => product.type === "rank"),
    [modeProducts]
  );
  const activeCategoryLabel =
    categories.find((category) => category.id === activeCategory)?.label ?? "Wybrana plansza";
  const hasCartForActiveMode = cartItems > 0 && (!activeCartMode || activeCartMode === activeGameMode);
  const cartSummaryLabel =
    cartItems === 1 ? "1 pakiet w koszyku" : `${cartItems} szt. w koszyku`;

  useEffect(() => {
    setActiveCategory("all");
  }, [activeGameMode]);

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-6 pb-10">
      <div className="mb-6 overflow-hidden rounded-[32px] border-[3px] border-[#2d3038] bg-[#1f242c] text-white shadow-[0_10px_0_0_#2d3038,0_28px_40px_-30px_rgba(0,0,0,0.5)]">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_380px]">
          <div className="border-b border-white/10 px-5 py-5 lg:border-b-0 lg:border-r lg:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border-2 border-[#9d7b0b] bg-[#f7d04e] px-3 py-1 font-pixel text-[10px] uppercase tracking-[0.16em] text-[#342203] shadow-[0_3px_0_0_#9d7b0b]">
                Aktywny sklep
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                Serwer: {activeModeLabel}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                {modeProducts.length} pakietow
              </span>
              {hasCartForActiveMode && (
                <span className="rounded-full border border-[#f7d04e]/40 bg-[#f7d04e]/10 px-3 py-1 text-xs font-semibold text-[#f7d04e]">
                  {cartSummaryLabel}
                </span>
              )}
            </div>

            <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-[2.5rem]">
              Pakiety dla <span className="text-[#f7d04e]">{activeModeLabel}</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              Ponizej masz plansze kategorii i gotowe pakiety tylko dla tego serwera. Zacznij od
              planszy "Wszystko" albo kliknij od razu w Rangi, Klucze lub Bundle.
            </p>
          </div>

          <div className="bg-[linear-gradient(180deg,#252b34_0%,#1b2028_100%)] px-5 py-5 lg:px-6">
            <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-[#f7d04e]">
              Co teraz?
            </p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] border-2 border-[#9d7b0b] bg-[#f7d04e] font-pixel text-[11px] text-[#342203] shadow-[0_3px_0_0_#9d7b0b]">
                    1
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Jestes w dobrym miejscu</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/65">
                      Ogladasz sklep dla trybu {activeModeLabel}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] border-2 border-[#9d7b0b] bg-[#f7d04e] font-pixel text-[11px] text-[#342203] shadow-[0_3px_0_0_#9d7b0b]">
                    2
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {activeCategory === "all" ? "Wybierz plansze lub pakiet" : `Plansza: ${activeCategoryLabel}`}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-white/65">
                      {activeCategory === "all"
                        ? "Masz nizej kategorie Wszystko, Rangi, Klucze, Skrzynie i Bundle."
                        : "Wszystkie produkty nizej naleza do tej kategorii i tego trybu."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] border-2 border-[#9d7b0b] bg-[#f7d04e] font-pixel text-[11px] text-[#342203] shadow-[0_3px_0_0_#9d7b0b]">
                    3
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">
                      {hasCartForActiveMode ? "Masz juz cos w koszyku" : "Dodaj pierwszy pakiet"}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-white/65">
                      {hasCartForActiveMode
                        ? `W koszyku czeka ${cartSummaryLabel.toLowerCase()}. Otworz koszyk i przejdz dalej do danych gracza oraz platnosci.`
                        : "Kliknij przycisk Dodaj do koszyka na wybranej karcie produktu."}
                    </p>

                    {hasCartForActiveMode && (
                      <button
                        type="button"
                        onClick={onOpenCart}
                        className="mt-3 inline-flex items-center gap-2 rounded-[16px] border-2 border-[#8c5a12] bg-[#f7d04e] px-4 py-2.5 font-pixel text-[11px] uppercase tracking-[0.14em] text-[#342203] shadow-[0_4px_0_0_#8c5a12] transition-transform hover:translate-y-[-1px]"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Otworz koszyk
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {categories.length > 1 && (
        <CategoryTabs
          activeCategory={activeCategory}
          categories={categories}
          onCategoryChange={setActiveCategory}
        />
      )}

      {hasRanks && activeCategory === "rank" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col gap-3 rounded-[28px] border-[3px] border-[#d8cfbf] bg-[#fffaf0] p-4 shadow-[0_8px_0_0_#d8cfbf]"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
                Porownanie rang
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Nie musisz otwierac kazdej karty osobno. Tu szybko sprawdzisz, ktora ranga daje
                najwiecej.
              </p>
            </div>

            <button
              type="button"
              onClick={onCompareRanks}
              className="inline-flex items-center justify-center gap-2 rounded-[18px] border-2 border-[#8c5a12] bg-[#f7d04e] px-4 py-3 font-pixel text-[11px] uppercase tracking-[0.14em] text-[#342203] shadow-[0_4px_0_0_#8c5a12] transition-transform hover:translate-y-[-1px]"
            >
              <BarChart3 className="h-4 w-4" />
              Porownaj rangi
            </button>
          </div>
        </motion.div>
      )}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
            Aktualna oferta
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-foreground">
            {activeCategory === "all"
              ? `Wszystkie pakiety dla ${activeModeLabel}`
              : `Pakiety: ${categories.find((category) => category.id === activeCategory)?.label ?? "Wybrana kategoria"}`}
          </h3>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full border-[2px] border-[#d8cfbf] bg-[#fffaf0] px-4 py-2 shadow-[0_4px_0_0_#d8cfbf]">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            {filteredProducts.length} pakietow na tej planszy
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeGameMode}-${activeCategory}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              quantityInCart={cartProductQuantities[product.id] ?? 0}
              onAddToCart={onAddProduct}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredProducts.length === 0 && (
        <div className="rounded-[28px] border-[3px] border-dashed border-[#d8cfbf] bg-[#fffaf0] py-16 text-center text-muted-foreground">
          <Package className="mx-auto mb-4 h-10 w-10 opacity-40" />
          <p className="font-pixel text-sm text-foreground">Brak pakietow w tej kategorii</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed">
            Sprobuj innej planszy albo przelacz tryb, jesli szukasz pakietow dla innego serwera.
          </p>
        </div>
      )}

      {filteredProducts.length > 0 && (
        <div className="mt-8 rounded-[28px] border-[3px] border-[#d8cfbf] bg-[#fffaf0] px-5 py-5 shadow-[0_8px_0_0_#d8cfbf]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
                Koniec listy
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                To sa wszystkie oferty dla tego trybu i aktualnej planszy kategorii.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#d8cfbf] bg-white px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              Wroc do wszystkich
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
