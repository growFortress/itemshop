import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
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
  set: "Bundle",
  other: "Dodatek",
};

const rarityLabel: Record<Product["rarity"], string> = {
  common: "Starter",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legend",
};

const rarityClassName: Record<Product["rarity"], string> = {
  common: "border-[#ddd4c3] bg-[#f7f1e5] text-[#685a42]",
  rare: "border-[#b9d8ff] bg-[#eef7ff] text-[#21598d]",
  epic: "border-[#d9c0ff] bg-[#f5eeff] text-[#6c3fab]",
  legendary: "border-[#ffd375] bg-[#fff0c4] text-[#8a5307]",
};

const badgeLabel: Record<NonNullable<Product["badge"]>, string> = {
  hot: "HOT",
  new: "NOWE",
  sale: "VALUE",
};

const badgeClassName: Record<NonNullable<Product["badge"]>, string> = {
  hot: "border-[#7a2127] bg-[#c73242] text-white",
  new: "border-[#2f5f96] bg-[#4b8fd8] text-white",
  sale: "border-[#8c5a12] bg-[#ebad27] text-[#322103]",
};

function getProductSummary(product: Product) {
  if (product.description !== "Produkt Crafted.pl") {
    return product.description;
  }

  switch (product.type) {
    case "rank":
      return "Bonusy premium, lepszy start i wygodniejsze granie.";
    case "key":
      return "Szybki dostep do dropu, skrzyn i losowan.";
    case "chest":
      return "Otwarcia skrzyn i eventowe paczki dla tego trybu.";
    case "set":
      return "Duze pakiety z najlepszym value dla aktywnych graczy.";
    case "other":
      return "Specjalne dodatki, przedmioty i szybkie boosty.";
    default:
      return "Oferta Crafted.pl dla aktualnego trybu gry.";
  }
}

function getProductHighlights(product: Product) {
  if (product.bonuses?.length) {
    return product.bonuses.slice(0, 2);
  }

  switch (product.type) {
    case "rank":
      return ["Lepsze komendy", "Premium status"];
    case "key":
      return ["Szybkie otwarcie", "Losowy drop"];
    case "chest":
      return ["Skrzynie serwerowe", "Losowe nagrody"];
    case "set":
      return ["Najlepszy value pack", "Wiele bonusow naraz"];
    case "other":
      return ["Specjalny dodatek", "Dziala od razu"];
    default:
      return ["Oferta serwerowa", "Kupujesz online"];
  }
}

interface ProductCardProps {
  product: Product;
  index: number;
  quantityInCart?: number;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({
  product,
  index,
  quantityInCart = 0,
  onAddToCart,
}: ProductCardProps) {
  const highlights = getProductHighlights(product);
  const isInCart = quantityInCart > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <div
        className={`flex h-full flex-col overflow-hidden rounded-[28px] border-[3px] bg-[#fffaf0] transition-shadow duration-200 hover:shadow-[0_8px_0_0_#d8cfbf,0_24px_36px_-22px_rgba(45,33,5,0.42)] ${
          isInCart
            ? "border-[#f2c94c] shadow-[0_8px_0_0_#c79112,0_18px_28px_-22px_rgba(45,33,5,0.34)]"
            : "border-[#d8cfbf] shadow-[0_8px_0_0_#d8cfbf,0_18px_28px_-22px_rgba(45,33,5,0.34)]"
        }`}
      >
        <div className="relative overflow-hidden border-b-[3px] border-[#eadfcb] bg-[linear-gradient(180deg,#fffdf7_0%,#f7edd7_100%)] px-4 py-4">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:18px_18px] opacity-40" />
          <div className="relative flex items-start justify-between gap-3">
            <span className="rounded-full border-2 border-[#d8cfbf] bg-white px-3 py-1 font-pixel text-[10px] uppercase tracking-[0.14em] text-[#50452e]">
              {productTypeLabel[product.type]}
            </span>

            <div className="flex items-center gap-2">
              <span className={`rounded-full border-2 px-2.5 py-1 text-[10px] font-bold uppercase ${rarityClassName[product.rarity]}`}>
                {rarityLabel[product.rarity]}
              </span>
              {product.badge && (
                <span className={`rounded-full border-2 px-2.5 py-1 text-[10px] font-bold uppercase ${badgeClassName[product.badge]}`}>
                  {badgeLabel[product.badge]}
                </span>
              )}
              {isInCart && (
                <span className="rounded-full border-2 border-[#8c5a12] bg-[#f7d04e] px-2.5 py-1 text-[10px] font-bold uppercase text-[#3b2903] shadow-[0_3px_0_0_#8c5a12]">
                  W koszyku x{quantityInCart}
                </span>
              )}
            </div>
          </div>

          <div className="relative mt-4 flex min-h-[160px] items-center justify-center rounded-[24px] border-[3px] border-[#e4dac8] bg-[linear-gradient(180deg,#fffdf9_0%,#f1e8d4_100%)] p-4">
            <div className="absolute inset-3 rounded-[18px] border border-white/65" />
            <img
              src={imageMap[product.image]}
              alt={product.name}
              className="relative z-10 h-24 w-24 pixel-art drop-shadow-[0_8px_10px_rgba(0,0,0,0.16)] transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        <div className="flex h-full flex-col p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold leading-tight text-foreground">
                {product.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {getProductSummary(product)}
              </p>
            </div>
            {product.popular && (
              <span className="inline-flex items-center gap-1 rounded-full border-2 border-[#8c5a12] bg-[#f7d04e] px-2.5 py-1 text-[10px] font-bold uppercase text-[#3b2903] shadow-[0_3px_0_0_#8c5a12]">
                <Sparkles className="h-3 w-3" />
                Top
              </span>
            )}
          </div>

          <div className="mt-4 grid gap-2">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#e6ddcf] bg-[#fffdf7] px-3 py-2 text-sm text-[#564b36]"
              >
                <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>

          {isInCart && (
            <div className="mt-4 rounded-[18px] border-2 border-[#f1d17b] bg-[#fff4cf] px-3 py-3 text-sm font-medium text-[#6b5012]">
              Ten pakiet jest juz w koszyku. Mozesz dodac kolejna sztuke albo przejsc dalej.
            </div>
          )}

          <div className="mt-auto border-t border-[#e6ddcf] pt-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Cena
                </p>
                <p className="mt-2 text-[2rem] font-black leading-none text-[#18223c]">
                  {product.price.toFixed(2)}
                  <span className="ml-1 text-sm font-bold text-muted-foreground">PLN</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] border-2 border-[#8c5a12] bg-[#f7d04e] text-[#3b2903] shadow-[0_4px_0_0_#8c5a12] transition-transform hover:translate-y-[-1px]"
                aria-label={`${isInCart ? "Dodaj kolejna sztuke" : "Dodaj"} ${product.name} do koszyka`}
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="mt-4 w-full rounded-[18px] border-2 border-[#8c5a12] bg-[linear-gradient(180deg,#ffd65a_0%,#f4b51f_100%)] px-4 py-3 text-center font-pixel text-[11px] uppercase tracking-[0.16em] text-[#342203] shadow-[0_5px_0_0_#8c5a12] transition-transform hover:translate-y-[-1px]"
            >
              {isInCart ? "Dodaj kolejna sztuke" : "Dodaj do koszyka"}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
