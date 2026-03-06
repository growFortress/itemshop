import { useState } from "react";
import { motion } from "framer-motion";
import { gameModes } from "@/data/shopData";
import floatingIsland from "@/assets/floating-island.png";
import swordImg from "@/assets/sword.png";
import chestImg from "@/assets/chest.png";
import keyImg from "@/assets/key.png";
import crownImg from "@/assets/crown.png";

const modeCards: Record<string, { gradient: string; glow: string; image: string }> = {
  "og-lucky-skyblock": {
    gradient: "from-cyan-900 via-cyan-800/90 to-sky-950",
    glow: "rgba(34,211,238,0.3)",
    image: floatingIsland,
  },
  "survival-extreme": {
    gradient: "from-red-900 via-orange-900/90 to-red-950",
    glow: "rgba(248,113,113,0.3)",
    image: swordImg,
  },
  "survival-dzialki": {
    gradient: "from-green-900 via-emerald-800/90 to-green-950",
    glow: "rgba(74,222,128,0.3)",
    image: chestImg,
  },
  "oneblock": {
    gradient: "from-blue-900 via-indigo-800/90 to-blue-950",
    glow: "rgba(96,165,250,0.3)",
    image: keyImg,
  },
  "creative": {
    gradient: "from-purple-900 via-fuchsia-800/90 to-purple-950",
    glow: "rgba(192,132,252,0.3)",
    image: crownImg,
  },
  "box-pvp": {
    gradient: "from-orange-900 via-amber-800/90 to-orange-950",
    glow: "rgba(251,146,60,0.3)",
    image: swordImg,
  },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, bounce: 0.25, duration: 0.6 },
  },
};

interface GameModePickerProps {
  onSelect: (modeId: string) => void;
}

export default function GameModePicker({ onSelect }: GameModePickerProps) {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-pixel text-sm text-primary/80 tracking-[0.25em] uppercase mb-6"
      >
        TRYBY GRY
      </motion.h2>

      {/* Card Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {gameModes.map((mode) => {
          const card = modeCards[mode.id];
          const isHovered = hoveredMode === mode.id;

          return (
            <motion.button
              key={mode.id}
              variants={item}
              onClick={() => onSelect(mode.id)}
              onMouseEnter={() => setHoveredMode(mode.id)}
              onMouseLeave={() => setHoveredMode(null)}
              whileTap={{ scale: 0.97 }}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} transition-all duration-500`} />

              {/* Ambient glow on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(ellipse at 50% 40%, ${card.glow} 0%, transparent 70%)`,
                }}
              />

              {/* Decorative particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-white/20"
                    style={{
                      left: `${15 + i * 14}%`,
                      top: `${20 + (i * 17) % 50}%`,
                      animation: `sparkle ${3 + i * 0.7}s ease-in-out infinite`,
                      animationDelay: `${i * 0.4}s`,
                    }}
                  />
                ))}
              </div>

              {/* Mode image */}
              <motion.img
                src={card.image}
                alt={mode.name}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-28 h-28 sm:w-32 sm:h-32 object-contain pixel-art drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] select-none pointer-events-none z-10"
                animate={isHovered ? { scale: 1.12, y: "-58%" } : { scale: 1, y: "-55%" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />

              {/* Bottom gradient overlay for text */}
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20" />

              {/* Mode name */}
              <div className="absolute inset-x-0 bottom-0 z-30 p-4 sm:p-5">
                <motion.span
                  className="font-pixel text-[11px] sm:text-xs text-white tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                  animate={isHovered ? { letterSpacing: "0.2em" } : { letterSpacing: "0.15em" }}
                  transition={{ duration: 0.3 }}
                >
                  {mode.name}
                </motion.span>
              </div>

              {/* Hover border glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none z-40"
                animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  boxShadow: `inset 0 0 0 2px ${card.glow}, 0 0 30px ${card.glow}`,
                }}
              />
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
}
