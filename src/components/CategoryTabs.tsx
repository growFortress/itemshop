import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ProductCategoryId, ProductCategoryOption } from "@/lib/productCategory";

interface CategoryTabsProps {
  activeCategory: ProductCategoryId;
  categories: ProductCategoryOption[];
  onCategoryChange: (id: ProductCategoryId) => void;
}

const artMap = {
  island: {
    src: "/kategorie/wszystkie.png",
    imageClassName: "h-full w-full object-cover scale-[1.12]",
  },
  crown: {
    src: "/kategorie/rangi.png",
    imageClassName: "h-full w-full object-cover",
  },
  key: {
    src: "/kategorie/klucze.png",
    imageClassName: "h-full w-full object-cover",
  },
  chest: {
    src: "/kategorie/skrzynie.png",
    imageClassName: "h-full w-full object-cover",
  },
  bundle: {
    src: "/kategorie/zestawy.png",
    imageClassName: "h-full w-full object-cover",
  },
  spark: {
    src: "/kategorie/dodatki.png",
    imageClassName: "h-full w-full object-cover",
  },
};

export default function CategoryTabs({
  activeCategory,
  categories,
  onCategoryChange,
}: CategoryTabsProps) {
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const desktopGridClassName =
    categories.length >= 5
      ? "md:grid-cols-2 xl:grid-cols-3"
      : categories.length === 4
        ? "md:grid-cols-2 xl:grid-cols-4"
        : categories.length === 3
          ? "md:grid-cols-2 xl:grid-cols-3"
          : "md:grid-cols-2";

  useEffect(() => {
    const activeButton = buttonRefs.current[activeCategory];
    activeButton?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeCategory]);

  return (
    <div className="mb-10">
      {categories.length > 1 ? (
        <p className="mb-3 pl-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:hidden">
          Przesun, aby zobaczyc wszystkie kategorie
        </p>
      ) : null}

      <div
        className={[
          "-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 pt-1 scrollbar-hide snap-x-mandatory",
          "md:mx-0 md:grid md:gap-5 md:overflow-visible md:px-0 md:pb-0 md:pt-2",
          desktopGridClassName,
        ].join(" ")}
      >
        {categories.map((category, index) => {
          const active = activeCategory === category.id;
          const art = artMap[category.art];
          const actionLabel = active ? "Aktywna kategoria" : "Otworz kategorie";

          return (
            <motion.button
              key={category.id}
              ref={(node) => {
                buttonRefs.current[category.id] = node;
              }}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              aria-pressed={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: index * 0.04 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
              className="group min-w-[292px] snap-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/55 focus-visible:ring-offset-2 md:min-w-0"
            >
              <div
                className={`relative h-[228px] md:h-[242px] overflow-hidden rounded-[26px] border border-[#e7d9bf] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.26),transparent_36%),linear-gradient(180deg,#fffdf8_0%,#f3e7d4_100%)] shadow-[0_18px_32px_-22px_rgba(15,23,42,0.28)] ${
                  active ? "ring-2 ring-[#ffe08a]/50" : ""
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br opacity-85 ${category.heroGradientClassName}`}
                />
                <img
                  src={art.src}
                  alt=""
                  className={`absolute inset-0 h-full w-full object-cover opacity-24 mix-blend-screen transition-transform duration-300 ${
                    active ? "scale-[1.06]" : "scale-[1.02] group-hover:scale-[1.06]"
                  } ${art.imageClassName}`}
                />

                <div className="relative z-10 flex h-full flex-col p-4 sm:p-5">
                  <div className="mt-auto">
                    <p className="font-pixel text-[10px] uppercase tracking-[0.14em] text-white/80">
                      {category.ctaLabel}
                    </p>
                    <h3 className="pixel-title-banner mt-4 text-[1.45rem] leading-[1.06] sm:text-[1.68rem]">
                      {category.posterTitle}
                    </h3>
                    <p className="mt-4 max-w-[17rem] text-sm leading-relaxed text-white/90">
                      {category.description}
                    </p>
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
