import { motion } from "framer-motion";
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
  // Zachowujemy stare klucze na wszelki wypadek, jeśli są używane gdzie indziej
  chest: chestImg,
  sword: swordImg,
  crown: crownImg,
  key: keyImg,
};

const rarityBadgeStyles: Record<string, string> = {
  common: "text-rarity-common border-rarity-common/30 bg-rarity-common/5",
  rare: "text-rarity-rare border-rarity-rare/30 bg-rarity-rare/5",
  epic: "text-rarity-epic border-rarity-epic/30 bg-rarity-epic/5",
  legendary: "text-rarity-legendary border-rarity-legendary/30 bg-rarity-legendary/10",
};

const rarityLabels: Record<string, string> = {
  common: "Zwykły",
  rare: "Rzadki",
  epic: "Epicki",
  legendary: "Legendarny",
};

const rarityImageBg: Record<string, string> = {
  common: "bg-gradient-to-b from-muted/20 to-muted/40",
  rare: "bg-gradient-to-b from-rarity-rare/5 to-rarity-rare/10",
  epic: "bg-gradient-to-b from-rarity-epic/5 to-rarity-epic/10",
  legendary: "bg-gradient-to-b from-amber-50 to-rarity-legendary/10",
};

const rarityRingAccent: Record<string, string> = {
  common: "",
  rare: "ring-1 ring-rarity-rare/10",
  epic: "ring-1 ring-rarity-epic/10",
  legendary: "ring-1 ring-rarity-legendary/15",
};

const badgeConfig: Record<string, { label: string; className: string }> = {
  hot: { label: "🔥 HOT", className: "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20" },
  new: { label: "✨ NOWE", className: "bg-rarity-epic text-primary-foreground shadow-lg shadow-rarity-epic/20" },
  sale: { label: "💰 SALE", className: "bg-emerald text-primary-foreground shadow-lg shadow-emerald/20" },
};

const rankTierStars: Record<string, string> = {
  rare: "★",
  epic: "★★",
  legendary: "★★★",
};

interface ProductCardProps {
  product: Product;
  index: number;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, index, onSelect }: ProductCardProps) {
  const isLegendary = product.rarity === "legendary";
  const badge = product.badge ? badgeConfig[product.badge] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative"
    >
      <button
        onClick={() => onSelect(product)}
        className={`w-full text-left bg-card rounded-xl p-4 sm:p-5 card-lift card-rarity-${product.rarity} cursor-pointer relative overflow-hidden border border-border/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full`}
      >
        {/* Legendary shimmer overlay */}
        {isLegendary && <div className="absolute inset-0 shimmer-legendary rounded-xl pointer-events-none" />}

        {/* Badge */}
        {badge && (
          <div className={`absolute top-3 right-3 z-10 text-[10px] font-bold px-2.5 py-1 rounded-md font-pixel tracking-wide ${badge.className}`}>
            {badge.label}
          </div>
        )}

        {/* Image — premium card-style with generous padding */}
        <div className={`relative flex justify-center items-center py-6 sm:py-8 mb-4 rounded-xl ${rarityImageBg[product.rarity]} ${rarityRingAccent[product.rarity]}`}>
          <img
            src={imageMap[product.image]}
            alt={product.name}
            className="w-32 h-32 sm:w-40 sm:h-40 object-contain pixel-art transition-transform duration-500 group-hover:scale-110 img-hover-float drop-shadow-xl"
          />
          {/* Subtle radial glow behind image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 rounded-full bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>

        {/* Rarity + Name row */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`text-[9px] font-pixel px-2 py-0.5 rounded-md border uppercase tracking-widest ${rarityBadgeStyles[product.rarity]}`}>
            {rarityLabels[product.rarity]}
          </div>
        </div>

        <h3 className="font-semibold text-foreground text-[16px] leading-snug mb-1 tracking-tight">
          {product.name}
          {product.image === "crown" && rankTierStars[product.rarity] && (
            <span className={`ml-1.5 text-xs ${rarityBadgeStyles[product.rarity].split(" ")[0]}`}>
              {rankTierStars[product.rarity]}
            </span>
          )}
        </h3>
        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed flex-grow">
          {product.description}
        </p>

        {/* Price & CTA hook footer */}
        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-border/40">
          <div className="flex items-center justify-center">
            <span className="text-xl font-bold text-primary tracking-tight">{product.price.toFixed(2)} PLN</span>
          </div>
          <div className="w-full py-2.5 rounded text-center text-[11px] font-bold tracking-wider uppercase bg-secondary/50 text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_15px_rgba(255,170,0,0.4)] transition-all duration-300">
            Wybierz pakiet
          </div>
        </div>
      </button>
    </motion.div>
  );
}
