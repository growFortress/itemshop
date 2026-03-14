import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { GameMode, Product } from "@/data/shopData";
import { ProductCategoryId, buildCategories, filterByCategory } from "@/lib/productCategory";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "./ProductCard";
import CategoryTabs from "./CategoryTabs";

interface ProductGridProps {
  activeGameMode: string;
  gameModes: GameMode[];
  products: Product[];
  isLoading?: boolean;
  cartEnabled?: boolean;
  cartProductQuantities: Record<string, number>;
  onOpenProduct: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onCompareRanks: () => void;
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

const categoryArtMap = {
  island: "/kategorie/wszystkie.png",
  crown: "/kategorie/rangi.png",
  key: "/kategorie/klucze.png",
  chest: "/kategorie/skrzynie.png",
  bundle: "/kategorie/zestawy.png",
  spark: "/kategorie/dodatki.png",
} as const;

function sortProductsForStorefront(left: Product, right: Product) {
  const priorityDiff = (left.sortPriority ?? 999) - (right.sortPriority ?? 999);
  if (priorityDiff !== 0) {
    return priorityDiff;
  }

  if (left.popular !== right.popular) {
    return left.popular ? -1 : 1;
  }

  const badgeDiff =
    (left.badge ? badgeWeight[left.badge] : 99) -
    (right.badge ? badgeWeight[right.badge] : 99);
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

  // Group same-name products together (e.g. all "Konto SuperVip" variants, then all "Konto VIP")
  const nameCmp = left.name.localeCompare(right.name, "pl");
  if (nameCmp !== 0) {
    return nameCmp;
  }

  // Within the same name, sort by price descending (longest/most expensive first)
  return right.price - left.price;
}

export default function ProductGrid({
  activeGameMode,
  gameModes,
  products,
  isLoading = false,
  cartEnabled = true,
  cartProductQuantities,
  onOpenProduct,
  onBuyNow,
  onCompareRanks,
}: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<ProductCategoryId>("all");
  const offerHeadingRef = useRef<HTMLDivElement | null>(null);
  const hasSelectedMode = Boolean(activeGameMode);

  const modeProducts = useMemo(
    () =>
      products
        .filter((product) => product.gameMode === activeGameMode)
        .sort(sortProductsForStorefront),
    [activeGameMode, products]
  );
  const categories = useMemo(() => buildCategories(modeProducts), [modeProducts]);
  const filteredProducts = useMemo(
    () => filterByCategory(modeProducts, activeCategory),
    [modeProducts, activeCategory]
  );
  const activeModeLabel = useMemo(
    () => gameModes.find((mode) => mode.id === activeGameMode)?.name ?? "Wybrany tryb",
    [activeGameMode, gameModes]
  );
  const hasRanks = useMemo(
    () => modeProducts.some((product) => product.type === "rank"),
    [modeProducts]
  );
  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === activeCategory),
    [activeCategory, categories]
  );
  const heroCategory = selectedCategory ?? categories[0];
  const heroArt = heroCategory ? categoryArtMap[heroCategory.art] : categoryArtMap.island;
  const heroDescription = heroCategory
    ? activeCategory === "all"
      ? `To jest glowne wejscie do sklepu dla ${activeModeLabel}. Przelaczaj kategorie jak w launcherze i wchodz tylko w te pakiety, ktore faktycznie chcesz porownac lub kupic.`
      : `${heroCategory.description} W tej sekcji pokazujemy tylko oferty dla ${activeModeLabel}, zeby caly listing byl szybszy, czytelniejszy i bardziej skupiony.`
    : "";

  useEffect(() => {
    setActiveCategory("all");
  }, [activeGameMode]);

  const handleCategoryChange = useCallback(
    (nextCategory: ProductCategoryId) => {
      if (nextCategory === activeCategory) {
        return;
      }

      setActiveCategory(nextCategory);

      if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
        requestAnimationFrame(() => {
          offerHeadingRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
    },
    [activeCategory]
  );

  if (isLoading) {
    return (
      <section className="relative mx-auto max-w-[1240px] px-4 py-6 pb-12">
        <div className="panel-soft relative mb-6 overflow-hidden rounded-[30px] p-5 sm:p-6">
          <div className="minecraft-strip absolute inset-x-0 top-0 h-[4px]" />
          <div className="max-w-3xl">
            <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
              Kategorie sklepu
            </p>
            <Skeleton className="mt-2 h-9 w-full max-w-[30rem] rounded-2xl sm:h-10" />
            <Skeleton className="mt-3 h-4 w-full max-w-[18rem] rounded-full" />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-11 w-[140px] rounded-full"
            />
          ))}
        </div>

        <div className="mb-5">
          <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
            Widok oferty
          </p>
          <Skeleton className="mt-2 h-8 w-full max-w-[24rem] rounded-2xl" />
          <Skeleton className="mt-3 h-4 w-full max-w-[16rem] rounded-full" />
        </div>

        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,270px),1fr))]">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="panel-soft relative overflow-hidden rounded-[28px] p-4 sm:p-5"
            >
              <div className="minecraft-strip absolute inset-x-0 top-0 h-[4px] opacity-75" />
              <Skeleton className="h-40 w-full rounded-[22px]" />
              <Skeleton className="mt-4 h-5 w-2/3 rounded-full" />
              <Skeleton className="mt-3 h-4 w-full rounded-full" />
              <Skeleton className="mt-2 h-4 w-4/5 rounded-full" />
              <div className="mt-5 flex items-center justify-between gap-3">
                <Skeleton className="h-10 w-24 rounded-xl" />
                <Skeleton className="h-10 w-28 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!hasSelectedMode) {
    return (
      <section className="relative mx-auto max-w-[1240px] px-4 py-6 pb-12">
        <div className="panel-soft relative overflow-hidden rounded-[30px] p-6 sm:p-7">
          <div className="minecraft-strip absolute inset-x-0 top-0 h-[4px]" />
          <div className="max-w-3xl">
            <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
              Widok oferty
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-[2rem]">
              Czekamy na wybor serwera
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              Wybierz jeden z trybow powyzej, a od razu pokazemy tylko kategorie i pakiety z tego
              konkretnego sklepu.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="inventory-slot rounded-[20px] px-4 py-3.5">
              <p className="font-pixel text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Serwer
              </p>
              <p className="mt-2 text-sm font-bold text-foreground">Jeszcze nie wybrany</p>
            </div>

            <div className="inventory-slot rounded-[20px] px-4 py-3.5">
              <p className="font-pixel text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Kategorie
              </p>
              <p className="mt-2 text-sm font-bold text-foreground">Pokazemy po wyborze</p>
            </div>

            <div className="inventory-slot rounded-[20px] px-4 py-3.5">
              <p className="font-pixel text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Pakiety
              </p>
              <p className="mt-2 text-sm font-bold text-foreground">Bez mieszania miedzy trybami</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative mx-auto max-w-[1240px] px-4 py-6 pb-12">


      {categories.length > 1 && (
        <>
          <h2 className="mb-4 text-lg font-bold text-foreground sm:text-xl">
            Wybierz kategorię dla serwera{" "}
            <span className="text-primary">{activeModeLabel}</span>
          </h2>
          <CategoryTabs
            activeCategory={activeCategory}
            categories={categories}
            onCategoryChange={handleCategoryChange}
          />
        </>
      )}

      <div
        ref={offerHeadingRef}
        id="offer-view"
        className="mb-6 scroll-mt-24"
      >
        <div className="flex flex-col gap-3 border-b border-[#dcc7a2] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
              Widok oferty
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-foreground">
              {activeCategory === "all"
                ? `Wszystkie pakiety dla ${activeModeLabel}`
                : `${selectedCategory?.label ?? "Wybrana kategoria"} dla ${activeModeLabel}`}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {activeCategory === "all"
                ? "Przegladasz cala oferte tego serwera. Kliknij pakiet, zeby wejsc w szczegoly i podjac decyzje dopiero w modalu produktu."
                : `Pokazujemy tylko pakiety z kategorii ${selectedCategory?.label?.toLowerCase() ?? "wybranej kategorii"}, zeby ten listing dzialal szybciej i byl bardziej skupiony.`}
            </p>
          </div>

          <span className="shop-badge border-[#d6c09a] bg-[#fff5dd] text-[#7a5714]">
            {filteredProducts.length} pakietow
          </span>
        </div>
      </div>

      {hasRanks && activeCategory === "rank" && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-[22px] border border-primary/20 bg-primary/5 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Nie wiesz, która ranga jest dla Ciebie?
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Porównaj wszystkie rangi obok siebie i sprawdź, co dostajesz w każdym pakiecie.
            </p>
          </div>
          <button
            type="button"
            onClick={onCompareRanks}
            className="shrink-0 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Porównaj rangi
          </button>
        </div>
      )}

      <motion.div
        key={`${activeGameMode}-${activeCategory}`}
        initial={{ opacity: 0.72, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,270px),1fr))]"
      >
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            cartEnabled={cartEnabled}
            quantityInCart={cartProductQuantities[product.id] ?? 0}
            onOpenProduct={onOpenProduct}
            onBuyNow={onBuyNow}
          />
        ))}
      </motion.div>

      {filteredProducts.length === 0 && (
        <div className="panel-soft relative overflow-hidden rounded-[28px] border-dashed py-16 text-center text-muted-foreground">
          <div className="minecraft-strip absolute inset-x-0 top-0 h-[4px]" />
          <Package className="mx-auto mb-4 h-10 w-10 opacity-40" />
          <p className="text-base font-semibold text-foreground">Brak pakietow w tej kategorii</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed">
            Sprobuj innej kategorii albo przelacz serwer, jesli szukasz pakietow dla innej oferty.
          </p>
        </div>
      )}
    </section>
  );
}
