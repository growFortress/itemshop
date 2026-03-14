import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Product } from "@/data/shopData";
import chestImg from "@/assets/chest.png";
import swordImg from "@/assets/sword.png";
import crownImg from "@/assets/crown.png";
import keyImg from "@/assets/key.png";
import { ShopBadge } from "@/components/ui/shop-badge";
import { ShopButton } from "@/components/ui/shop-button";

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

const typePriceSurface: Record<Product["type"], string> = {
  rank: "border-[#ecdcb8] bg-[#fffaf0]",
  key: "border-[#d8e8f2] bg-[#fbfdff]",
  chest: "border-[#ead9c1] bg-[#fff9f1]",
  set: "border-[#d9e6cc] bg-[#fbfff8]",
  other: "border-[#e0d8f4] bg-[#fcfbff]",
};

const typePosterArt: Record<Product["type"], string> = {
  rank: "/kategorie/rangi.png",
  key: "/kategorie/klucze.png",
  chest: "/kategorie/skrzynie.png",
  set: "/kategorie/zestawy.png",
  other: "/kategorie/dodatki.png",
};

const typePosterSurface: Record<Product["type"], string> = {
  rank: "from-[#ff5b73] via-[#d61d50] to-[#6f1738]",
  key: "from-[#35d7ff] via-[#1d8ee1] to-[#24436f]",
  chest: "from-[#ffca6c] via-[#d68436] to-[#6b2c23]",
  set: "from-[#8bd562] via-[#4da451] to-[#295846]",
  other: "from-[#9f88ff] via-[#6956df] to-[#2f2a6a]",
};

type ProductSignalTone = "popular" | "premium" | "value" | "new";

function getProductSignal(product: Product): { label: string; tone: ProductSignalTone } | null {
  if (product.badge === "sale") {
    return { label: "Best value", tone: "value" };
  }

  if (product.badge === "new") {
    return { label: "Nowosc", tone: "new" };
  }

  if (product.popular || product.badge === "hot") {
    return { label: "Popularny", tone: "popular" };
  }

  if (product.rarity === "legendary") {
    return { label: "Premium", tone: "premium" };
  }

  return null;
}

const signalStyles: Record<ProductSignalTone, { badge: string; priceBox: string }> = {
  popular: {
    badge: "border-[#ffe08a]/35 bg-[#fff1b9]/14 text-[#fff4d3]",
    priceBox: "border-primary/22 bg-[#fff9ec]",
  },
  premium: {
    badge: "border-[#ffd8a0]/30 bg-[#fff0d5]/14 text-[#fff4e4]",
    priceBox: "border-[#eadcb8] bg-[#fffaf0]",
  },
  value: {
    badge: "border-[#f7d1a6]/32 bg-[#fff2dc]/14 text-[#fff4e2]",
    priceBox: "border-[#ead6bc] bg-[#fff8ef]",
  },
  new: {
    badge: "border-[#d2ffd7]/32 bg-[#effff1]/14 text-[#f2fff3]",
    priceBox: "border-[#d5eadf] bg-[#f7fcf9]",
  },
};

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

function cleanTeaserLine(line: string) {
  const cleaned = line
    .replace(/^w pakiecie dostaniesz:?/i, "")
    .replace(/^w tym pakiecie dostaniesz:?/i, "")
    .replace(/^lista przedmiotow:?/i, "")
    .replace(/^w mysteryboxie znajdziesz:?/i, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || null;
}

function getCardTeaser(product: Product) {
  const teaser = [
    ...product.previewLines,
    ...product.details,
    product.description,
  ]
    .map((line) => cleanTeaserLine(line))
    .find((line) => Boolean(line));

  return teaser ?? product.description;
}

interface ProductCardProps {
  product: Product;
  index: number;
  cartEnabled?: boolean;
  quantityInCart?: number;
  onOpenProduct: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export default function ProductCard({
  product,
  index,
  cartEnabled = true,
  quantityInCart = 0,
  onOpenProduct,
  onBuyNow,
}: ProductCardProps) {
  const subtitle = getDisplaySubtitle(product);
  const isInCart = cartEnabled && quantityInCart > 0;
  const signal = getProductSignal(product);
  const signalStyle = signal ? signalStyles[signal.tone] : null;
  const teaser = getCardTeaser(product);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <div
        className={`panel-soft relative flex h-full flex-col overflow-hidden rounded-[28px] border transition-all duration-200 ${isInCart
          ? "border-primary/35 ring-2 ring-primary/25 shadow-[0_24px_44px_-30px_rgba(122,87,20,0.32)]"
          : "border-[#d4be97] shadow-[0_22px_40px_-30px_rgba(15,23,42,0.22)] hover:-translate-y-0.5 hover:shadow-[0_26px_46px_-30px_rgba(15,23,42,0.26)]"
          }`}
      >
        <div
          className={`relative overflow-hidden rounded-[24px] border border-white/12 bg-gradient-to-br px-5 pb-6 pt-4 ${typePosterSurface[product.type]}`}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.07)_0_8%,transparent_8%_16%),linear-gradient(180deg,rgba(255,255,255,0.05)_0_10%,transparent_10%_20%)] opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_34%),linear-gradient(180deg,rgba(18,8,12,0)_0%,rgba(18,8,12,0.14)_38%,rgba(18,8,12,0.72)_100%)]" />
          <img
            src={typePosterArt[product.type]}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-24 mix-blend-screen transition-transform duration-300 group-hover:scale-[1.08]"
          />

          <div className="relative z-10 flex min-h-[220px] flex-col">
            <div className="flex items-start justify-between gap-3">
              <ShopBadge tone="neutral">
                {productTypeLabel[product.type]}
              </ShopBadge>
            </div>

            <div className="mt-auto">
              {subtitle ? (
                <p className="font-pixel text-[10px] uppercase tracking-[0.14em] text-white/70">
                  {subtitle}
                </p>
              ) : null}
              <h3 className="mt-3 text-[1.38rem] font-black leading-[1.04] text-white [text-shadow:0_2px_0_rgba(49,17,27,0.45)]">
                {product.name}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col px-5 py-4">
          <div className="rounded-[18px] border border-[#d7c29c] bg-[#fff4df] px-4 py-3 text-sm leading-relaxed text-[#5b5146] shadow-[inset_0_1px_0_rgba(255,255,255,0.54)]">
            {teaser}
          </div>

          <div className="mt-4">
            <div
              className={`rounded-[22px] border p-4 shadow-[0_18px_30px_-28px_rgba(15,23,42,0.18)] ${signalStyle ? signalStyle.priceBox : typePriceSurface[product.type]
                }`}
            >
              <div className="flex items-end gap-3">
                <div>
                  <p className="font-pixel text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Cena
                  </p>
                  <p className="mt-2 text-[2rem] font-black leading-none text-[#18223c]">
                    {product.price.toFixed(2)}
                    <span className="ml-1 text-sm font-bold text-muted-foreground">PLN</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                <ShopButton
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => onOpenProduct(product)}
                  aria-label={`Pokaz szczegoly produktu ${product.name}`}
                >
                  Szczegoly produktu
                  <ArrowRight className="h-4 w-4" />
                </ShopButton>

                <ShopButton
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={() => onBuyNow(product)}
                  aria-label={`Kup teraz produkt ${product.name}`}
                >
                  Kup teraz
                  <ShoppingBag className="h-4 w-4" />
                </ShopButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
