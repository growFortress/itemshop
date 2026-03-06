import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { products } from "@/data/shopData";

const nicknames = [
  "xKreper", "DiamentBoy", "Koxu", "ProPvP_", "BuilderPL",
  "MineKing22", "CraftMaster", "EndermanPL", "SkyWars_Pro", "Noobek123",
  "DragonSlayer", "NetherBoss", "RedstoneGod", "PvPLegend", "BlockHead_",
  "CreeperHunter", "ZombiePL", "GoldMiner99", "IronGolem", "WitchCraft",
];

const timeLabels = [
  "przed chwilą",
  "1 min temu",
  "2 min temu",
  "3 min temu",
  "5 min temu",
  "8 min temu",
  "12 min temu",
  "15 min temu",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface RecentPurchasesProps {
  activeGameMode: string;
}

export default function RecentPurchases({ activeGameMode }: RecentPurchasesProps) {
  const modeProducts = useMemo(
    () => products.filter((p) => p.gameMode === activeGameMode),
    [activeGameMode]
  );

  const generatePurchase = useCallback(() => {
    if (modeProducts.length === 0) return null;
    return {
      nick: pickRandom(nicknames),
      product: pickRandom(modeProducts),
      time: pickRandom(timeLabels),
      id: Date.now() + Math.random(),
    };
  }, [modeProducts]);

  const [purchase, setPurchase] = useState(() => generatePurchase());

  useEffect(() => {
    setPurchase(generatePurchase());
  }, [activeGameMode, generatePurchase]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPurchase(generatePurchase());
    }, 4500);
    return () => clearInterval(interval);
  }, [generatePurchase]);

  if (!purchase) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-2">
      <div className="glass rounded-full px-4 py-2.5 flex items-center justify-center gap-2.5 overflow-hidden">
        <ShoppingCart className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <AnimatePresence mode="wait">
          <motion.p
            key={purchase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-xs sm:text-sm text-muted-foreground truncate"
          >
            <span className="font-semibold text-foreground">{purchase.nick}</span>
            {" kupił "}
            <span className="font-semibold text-foreground">{purchase.product.name}</span>
            <span className="hidden sm:inline text-muted-foreground/60"> • {purchase.time}</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
