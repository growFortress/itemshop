import { motion } from "framer-motion";
import floatingIsland from "@/assets/floating-island.png";
import chestImg from "@/assets/chest.png";
import crownImg from "@/assets/crown.png";
import keyImg from "@/assets/key.png";
import swordImg from "@/assets/sword.png";
import { ProductCategoryId, ProductCategoryOption } from "@/lib/productCategory";

interface CategoryTabsProps {
  activeCategory: ProductCategoryId;
  categories: ProductCategoryOption[];
  onCategoryChange: (id: ProductCategoryId) => void;
}

const artMap = {
  island: floatingIsland,
  crown: crownImg,
  key: keyImg,
  chest: chestImg,
  bundle: swordImg,
  spark: swordImg,
};

const artClassMap = {
  island: "h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40",
  crown: "h-16 w-16 sm:h-20 sm:w-20",
  key: "h-16 w-16 sm:h-20 sm:w-20",
  chest: "h-16 w-16 sm:h-20 sm:w-20",
  bundle: "h-20 w-20 sm:h-24 sm:w-24",
  spark: "h-16 w-16 sm:h-20 sm:w-20",
};

export default function CategoryTabs({
  activeCategory,
  categories,
  onCategoryChange,
}: CategoryTabsProps) {
  const featuredCategoryId = categories
    .filter((category) => category.id !== "all")
    .sort((left, right) => right.count - left.count)[0]?.id;

  return (
    <div className="mb-8">
      <div className="grid auto-rows-[minmax(156px,1fr)] gap-3 md:grid-cols-12">
        {categories.map((category, index) => {
          const active = activeCategory === category.id;
          const isFeatured = category.id === featuredCategoryId;
          const art = artMap[category.art];

          return (
            <motion.button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: index * 0.04 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
              className={`group relative overflow-hidden rounded-[28px] border-[4px] p-0 text-left transition-transform ${category.accentClassName} ${category.layoutClassName}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.surfaceClassName}`} />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_2px,transparent_2px),linear-gradient(90deg,rgba(255,255,255,0.08)_2px,transparent_2px)] bg-[size:24px_24px] opacity-20" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_28%)] opacity-80" />

              {active && (
                <motion.div
                  layoutId="active-category-outline"
                  className="absolute inset-[8px] rounded-[18px] border-[3px] border-[#fff4b5] shadow-[0_0_0_3px_rgba(32,37,47,0.2)]"
                  transition={{ type: "spring", stiffness: 280, damping: 24 }}
                />
              )}

              {isFeatured && (
                <span className="absolute right-4 top-4 z-20 rounded-full border-2 border-[#9d7b0b] bg-[#f8d84f] px-3 py-1 font-bold text-[#2d2105] shadow-[0_4px_0_0_#9d7b0b]">
                  Most Popular
                </span>
              )}

              <div className={`relative z-10 flex h-full flex-col justify-between p-4 sm:p-5 ${category.textClassName}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="max-w-[220px]">
                    <p className="font-pixel text-[10px] uppercase tracking-[0.16em] opacity-80">
                      {category.eyebrow}
                    </p>
                    <h3 className="mt-3 font-pixel text-lg uppercase leading-tight sm:text-[22px]">
                      {category.label}
                    </h3>
                    <p className="mt-3 max-w-[26ch] text-sm leading-relaxed opacity-90">
                      {category.description}
                    </p>
                  </div>

                  <span className="rounded-full border-2 border-black/15 bg-white/20 px-3 py-1 text-sm font-bold shadow-[0_3px_0_0_rgba(0,0,0,0.16)] backdrop-blur-sm">
                    {category.count}
                  </span>
                </div>

                <div className="mt-6 flex items-end justify-between gap-4">
                  <span className="inline-flex rounded-full border-2 border-black/15 bg-black/15 px-3 py-1.5 font-pixel text-[10px] uppercase tracking-[0.14em] shadow-[0_3px_0_0_rgba(0,0,0,0.16)]">
                    {category.ctaLabel}
                  </span>

                  <div className="relative flex shrink-0 items-end">
                    <img
                      src={art}
                      alt=""
                      className={`pixel-art drop-shadow-[0_12px_20px_rgba(0,0,0,0.24)] transition-transform duration-300 group-hover:translate-y-[-2px] ${artClassMap[category.art]}`}
                    />
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
