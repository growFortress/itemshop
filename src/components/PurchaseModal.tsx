import { AnimatePresence, motion } from "framer-motion";
import {
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  X,
} from "lucide-react";
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

const productTypeLabel: Record<Product["type"], string> = {
  rank: "Ranga",
  key: "Klucz",
  chest: "Skrzynia",
  set: "Zestaw",
  other: "Dodatek",
};

function normalizeLine(line: string) {
  return line.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function uniqueLines(lines: string[]) {
  const seen = new Set<string>();

  return lines.filter((line) => {
    const normalized = normalizeLine(line);
    if (!normalized || seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);
    return true;
  });
}

function cleanLine(line: string) {
  const cleaned = line
    .replace(/^w pakiecie dostaniesz:?/i, "")
    .replace(/^w tym pakiecie dostaniesz:?/i, "")
    .replace(/^lista przedmiotow:?/i, "Lista dropu:")
    .replace(/^w kazdym mysteryboxie/i, "Kazdy MysteryBox:")
    .replace(/^znajdziesz w niej/i, "Drop:")
    .replace(/^tylko tu znajdziesz/i, "Unikalny drop:")
    .replace(/^unikalny prefix/i, "Prefix")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned || /^[*★☆]+$/u.test(cleaned)) {
    return null;
  }

  return cleaned;
}

function collectCleanLines(lines: Array<string | undefined>) {
  return uniqueLines(
    lines
      .flatMap((line) => (line ? line.split("/") : []))
      .map((segment) => cleanLine(segment))
      .filter((segment): segment is string => Boolean(segment))
  );
}

function getSummary(product: Product, modeName: string) {
  const summary =
    collectCleanLines([
      product.description,
      ...product.previewLines,
      ...(product.bonuses ?? []),
      ...product.details,
    ])[0] ?? null;

  if (summary) {
    return summary;
  }

  switch (product.type) {
    case "rank":
      return `Ranga premium dla serwera ${modeName}.`;
    case "key":
      return `Pakiet kluczy przypisany do ${modeName}.`;
    case "chest":
      return `Skrzynia z serwerowym dropem dla ${modeName}.`;
    case "set":
      return `Wiekszy pakiet dla graczy, ktorzy chca kupic wiecej naraz.`;
    default:
      return `Pakiet przygotowany dla serwera ${modeName}.`;
  }
}

function getDetailLines(product: Product, summary: string) {
  const normalizedSummary = normalizeLine(summary);

  return collectCleanLines([
    ...product.details,
    ...product.previewLines,
    ...(product.bonuses ?? []),
  ])
    .filter((line) => normalizeLine(line) !== normalizedSummary)
    .slice(0, 6);
}

function getDisplaySubtitle(product: Product) {
  const subtitle = product.subtitle?.trim();

  if (!subtitle) {
    return null;
  }

  if (/^[*★☆]+$/u.test(subtitle)) {
    return null;
  }

  return subtitle;
}

interface PurchaseModalProps {
  activeModeName: string;
  cartEnabled?: boolean;
  conflictingRankName?: string | null;
  quantityInCart?: number;
  onAddToCart?: (product: Product, quantity: number) => void;
  onBuyNow?: (product: Product) => void;
  product: Product | null;
  onClose: () => void;
  onExited?: () => void;
}

interface PurchaseModalContentProps extends Omit<PurchaseModalProps, "product" | "onExited"> {
  conflictingRankName?: string | null;
  product: Product;
}

function PurchaseModalContent({
  activeModeName,
  cartEnabled = false,
  conflictingRankName = null,
  quantityInCart = 0,
  onAddToCart,
  onBuyNow,
  product,
  onClose,
}: PurchaseModalContentProps) {
  const subtitle = getDisplaySubtitle(product);
  const summary = getSummary(product, activeModeName);
  const detailLines = getDetailLines(product, summary);
  const alreadyInCart = quantityInCart > 0;
  const hasRankConflict = Boolean(conflictingRankName);
  const canAddToCart = cartEnabled && Boolean(onAddToCart) && !alreadyInCart && !hasRankConflict;
  const canBuyNow = Boolean(onBuyNow);

  return (
    <motion.div
      key={`purchase-backdrop-${product.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4 backdrop-blur-md"
    >
      <motion.div
        key={`purchase-modal-${product.id}`}
        initial={{ opacity: 0, y: 24, scale: 0.965 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[30px] border-[3px] border-[#d8cfbf] bg-[#fffaf0] shadow-[0_12px_0_0_#d8cfbf,0_30px_80px_-28px_rgba(15,23,42,0.42)]"
      >
        <div className="minecraft-strip absolute inset-x-0 top-0 h-[5px]" />

        <div className="relative border-b-[3px] border-[#eadfcb] bg-[linear-gradient(180deg,#fff9eb_0%,#fff0c9_100%)] px-5 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              <div className="inventory-slot mt-1 flex h-20 w-20 shrink-0 items-center justify-center rounded-[22px] p-4">
                <img
                  src={imageMap[product.image] ?? keyImg}
                  alt={product.name}
                  className="h-14 w-14 pixel-art"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="shop-badge border-primary/24 bg-primary/10 text-[#7a5714]">
                    Szczegoly produktu
                  </span>
                  <span className="shop-badge border-[#d8cfbf] bg-white/85 text-muted-foreground">
                    {productTypeLabel[product.type]}
                  </span>
                  {quantityInCart > 0 ? (
                    <span className="shop-badge border-[#d4c18f] bg-[#fff4d8] text-[#7a5714]">
                      Juz w koszyku
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-4 text-2xl font-black leading-[1.02] tracking-tight text-foreground sm:text-[2rem]">
                  {product.name}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm leading-relaxed text-muted-foreground">
                  {subtitle ? <span>{subtitle}</span> : null}
                  <span>{activeModeName}</span>
                </div>
                <p className="mt-4 max-w-3xl text-sm leading-[1.7] text-muted-foreground">
                  {summary}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inventory-slot mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] border-2 border-[#d8cfbf] bg-white text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Zamknij szczegoly oferty"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              <section className="rounded-[24px] border-[3px] border-[#d8cfbf] bg-white p-5 shadow-[0_10px_0_0_#d8cfbf]">
                <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
                  Szczegoly pakietu
                </p>

                  {detailLines.length > 0 ? (
                    <div className="mt-4 grid gap-2.5">
                      {detailLines.map((detail) => (
                        <div
                          key={detail}
                          className="rounded-[18px] border border-[#eadfcb] bg-[#fffaf0] px-4 py-3 text-sm leading-relaxed text-[#4e4a42]"
                        >
                          {detail}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      Szczegolowe informacje o tym pakiecie pojawia sie tutaj, gdy tylko sa dostepne w katalogu.
                    </p>
                  )}
                </section>

              {(product.lowestPriceLabel || product.lowestPriceLines.length > 0) ? (
                <section className="rounded-[24px] border-[3px] border-[#d8cfbf] bg-white p-5 shadow-[0_10px_0_0_#d8cfbf]">
                  <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
                    Dodatkowe info
                  </p>

                    {product.lowestPriceLabel ? (
                      <div className="mt-4 rounded-[18px] border border-[#eadfcb] bg-[#fffaf0] px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Najnizsza cena
                        </p>
                        <p className="mt-2 text-sm font-semibold text-foreground">
                          {product.lowestPriceLabel}
                        </p>
                      </div>
                    ) : null}

                    {product.lowestPriceLines.length > 0 ? (
                      <div className="mt-3 grid gap-2">
                        {product.lowestPriceLines.map((line) => (
                          <div
                            key={line}
                            className="rounded-[16px] border border-[#eadfcb] bg-[#fffaf0] px-4 py-3 text-sm text-muted-foreground"
                          >
                            {line}
                          </div>
                        ))}
                      </div>
                    ) : null}
                </section>
              ) : null}
            </div>

            <aside className="space-y-4">
              <section className="rounded-[24px] border-[3px] border-[#d8cfbf] bg-white p-5 shadow-[0_10px_0_0_#d8cfbf]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
                      Zakup
                    </p>
                    <p className="mt-2 text-xl font-black text-foreground">{activeModeName}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Realizacja po oplaceniu na nick gracza.
                    </p>
                  </div>

                    <div className="rounded-[18px] border border-[#eadfcb] bg-[#fffaf0] px-4 py-3 text-right">
                      <p className="font-pixel text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        Cena
                      </p>
                      <p className="mt-2 text-3xl font-black leading-none text-[#18223c]">
                        {product.price.toFixed(2)}
                        <span className="ml-1 text-sm font-bold text-muted-foreground">PLN</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-[18px] border border-[#eadfcb] bg-[#fffaf0] px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                        Typ pakietu
                      </p>
                      <p className="mt-2 text-sm font-semibold text-foreground">
                        {productTypeLabel[product.type]}
                      </p>
                    </div>

                    <div className="rounded-[18px] border border-[#eadfcb] bg-[#fffaf0] px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                        Tryb zakupu
                      </p>
                      <p className="mt-2 text-sm font-semibold text-foreground">
                        {canAddToCart ? "Kup teraz lub dodaj do koszyka" : "Szybki zakup"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-2.5">
                    <button
                      type="button"
                      onClick={() => onBuyNow?.(product)}
                      disabled={!canBuyNow}
                      className="shop-button btn-premium w-full disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-55"
                    >
                      Kup teraz
                      <ShoppingBag className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onAddToCart?.(product, 1)}
                      disabled={!canAddToCart}
                      className="shop-button shop-button-secondary w-full disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-55"
                    >
                      {alreadyInCart ? "Juz w koszyku" : hasRankConflict ? "Inna ranga w koszyku" : "Dodaj do koszyka"}
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 rounded-[18px] border border-[#eadfcb] bg-[#fffaf0] px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                    {cartEnabled
                      ? hasRankConflict
                        ? `W koszyku moze byc tylko jedna ranga naraz. Najpierw usun ${conflictingRankName}, jesli chcesz dodac ten pakiet.`
                        : "Koszyk na tej stronie trzyma pakiety tylko dla jednego serwera i po jednej sztuce kazdego produktu."
                      : "Koszyk jest jeszcze w trybie preview."}
                  </div>
              </section>

              <section className="rounded-[24px] border-[3px] border-[#d8cfbf] bg-white p-5 shadow-[0_10px_0_0_#d8cfbf]">
                <div className="flex items-start gap-3">
                  <span className="inventory-slot flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
                      Realizacja
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      W checkoutcie wybierzesz metode platnosci i wpiszesz nick gracza.
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PurchaseModal({
  activeModeName,
  cartEnabled = false,
  quantityInCart = 0,
  conflictingRankName = null,
  onAddToCart,
  onBuyNow,
  product,
  onClose,
  onExited,
}: PurchaseModalProps) {
  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        if (!product) {
          onExited?.();
        }
      }}
    >
      {product ? (
        <PurchaseModalContent
          key={product.id}
          activeModeName={activeModeName}
          cartEnabled={cartEnabled}
          conflictingRankName={conflictingRankName}
          quantityInCart={quantityInCart}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
          product={product}
          onClose={onClose}
        />
      ) : null}
    </AnimatePresence>
  );
}
