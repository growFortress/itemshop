import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlayerStatus() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-40">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 glass rounded-full px-4 py-2.5 hover:shadow-md transition-all duration-200 group"
      >
        {/* Pixel avatar placeholder */}
        <div className="w-7 h-7 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full pixel-art flex items-center justify-center text-xs border border-primary/20">
          👤
        </div>
        <span className="text-sm font-medium text-foreground hidden sm:block">Gracz</span>
        <div className="h-4 w-px bg-border hidden sm:block" />
        <span className="text-xs text-primary font-bold">0.00 PLN</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute right-0 top-full mt-2 glass-strong rounded-xl p-3 min-w-[220px] shadow-xl"
          >
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground px-2">
                <span>Saldo:</span>
                <span className="text-primary font-bold">0.00 PLN</span>
              </div>
              <div className="border-t border-border/50 my-2" />
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/5 text-foreground transition-colors text-xs flex items-center gap-2">
                📦 <span>Moje zakupy</span>
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/5 text-foreground transition-colors text-xs flex items-center gap-2">
                💰 <span>Doładuj konto</span>
              </button>
              <div className="border-t border-border/50 my-1" />
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-destructive/5 text-muted-foreground hover:text-destructive transition-colors text-xs flex items-center gap-2">
                🚪 <span>Wyloguj</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
