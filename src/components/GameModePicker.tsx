import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gameModes } from "@/data/shopData";

const modeGradients: Record<string, string> = {
  "og-lucky-skyblock": "from-cyan-400/20 to-cyan-500/5",
  "survival-extreme": "from-red-400/20 to-orange-500/5",
  "survival-dzialki": "from-green-400/20 to-emerald-500/5",
  "oneblock": "from-blue-400/20 to-indigo-500/5",
  "creative": "from-purple-400/20 to-fuchsia-500/5",
  "box-pvp": "from-orange-400/20 to-amber-500/5",
};

const modeAccents: Record<string, string> = {
  "og-lucky-skyblock": "border-cyan-400/50 shadow-cyan-400/20",
  "survival-extreme": "border-red-400/50 shadow-red-400/20",
  "survival-dzialki": "border-green-400/50 shadow-green-400/20",
  "oneblock": "border-blue-400/50 shadow-blue-400/20",
  "creative": "border-purple-400/50 shadow-purple-400/20",
  "box-pvp": "border-orange-400/50 shadow-orange-400/20",
};

const modeTextColors: Record<string, string> = {
  "og-lucky-skyblock": "text-cyan-600",
  "survival-extreme": "text-red-500",
  "survival-dzialki": "text-green-600",
  "oneblock": "text-blue-500",
  "creative": "text-purple-500",
  "box-pvp": "text-orange-500",
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, bounce: 0.35 } }
};

interface GameModePickerProps {
  onSelect: (modeId: string) => void;
}

export default function GameModePicker({ onSelect }: GameModePickerProps) {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);

  return (
    <AnimatePresence>
      <motion.div
        key="picker-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          key="picker-modal"
          initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateX: 20 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
          className="bg-card/95 backdrop-blur-md pixel-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 relative"
          style={{ perspective: "1000px" }}
        >
          {/* Animated Glow behind modal */}
          {hoveredMode && (
            <motion.div
              layoutId="modal-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              className={`absolute inset-0 pointer-events-none bg-gradient-to-br ${modeGradients[hoveredMode]} blur-3xl`}
              transition={{ duration: 0.4 }}
            />
          )}

          {/* Header Section */}
          <div className="relative p-8 pb-4 text-center z-10">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 border border-primary/20 shadow-inner"
            >
              <motion.span
                className="text-4xl"
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                ⚔️
              </motion.span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-pixel text-lg text-primary mb-3 tracking-widest uppercase"
            >
              NA JAKIM TRYBIE GRASZ?
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-muted-foreground max-w-md mx-auto"
            >
              Wybierz swój główny tryb, abyśmy mogli dopasować ofertę do Twoich potrzeb. Pamiętaj, że zawsze możesz go zmienić w górnym menu.
            </motion.p>
          </div>

          {/* Mode Grid Section */}
          <motion.div 
            className="relative p-8 pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 z-10"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {gameModes.map((mode) => {
              const isHovered = hoveredMode === mode.id;
              return (
                <motion.button
                  key={mode.id}
                  variants={item}
                  onClick={() => onSelect(mode.id)}
                  onMouseEnter={() => setHoveredMode(mode.id)}
                  onMouseLeave={() => setHoveredMode(null)}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                    isHovered
                      ? `bg-gradient-to-b ${modeGradients[mode.id]} ${modeAccents[mode.id]} border-opacity-100 shadow-xl`
                      : "bg-secondary/20 border-border/50 hover:border-muted-foreground/30"
                  }`}
                >
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary/40 animate-ping" />
                  </div>

                  {/* Icon */}
                  <motion.span 
                    className="text-4xl mb-4 relative z-10 drop-shadow-lg"
                    animate={isHovered ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {mode.icon}
                  </motion.span>

                  {/* Name */}
                  <span
                    className={`font-pixel text-[11px] leading-tight text-center tracking-wider transition-all duration-300 relative z-10 ${
                      isHovered ? modeTextColors[mode.id] : "text-foreground/80 group-hover:text-foreground"
                    }`}
                  >
                    {mode.name}
                  </span>

                  {/* Active Indicator Bar */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: isHovered ? "40%" : "0%" }}
                    className="absolute bottom-3 h-0.5 bg-primary/40 rounded-full"
                  />
                </motion.button>
              );
            })}
          </motion.div>

          {/* Footer Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="relative px-8 pb-8 pt-2 z-10"
          >
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 flex items-center justify-center gap-3">
              <span className="text-lg">💡</span>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Dobieramy pakiety i promocje specjalnie pod Twój ulubiony tryb rozgrywki.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
