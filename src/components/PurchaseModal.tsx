import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/data/shopData";
import { toast } from "sonner";
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

const rarityColors: Record<string, string> = {
  common: "text-rarity-common",
  rare: "text-rarity-rare",
  epic: "text-rarity-epic",
  legendary: "text-rarity-legendary",
};

const rarityLabels: Record<string, string> = {
  common: "Zwykły",
  rare: "Rzadki",
  epic: "Epicki",
  legendary: "Legendarny",
};

interface PurchaseModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function PurchaseModal({ product, onClose }: PurchaseModalProps) {
  const [nick, setNick] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [particles, setParticles] = useState<{ id: number; tx: number; ty: number }[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);

  const spawnParticles = useCallback(() => {
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      tx: (Math.random() - 0.5) * 120,
      ty: -(Math.random() * 80 + 20),
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 700);
  }, []);

  const handlePurchase = () => {
    if (!nick.trim()) return;
    spawnParticles();
    toast.success("Dodano do koszyka!", {
      description: `${product?.name} × ${quantity}`,
      duration: 3000,
    });
    setTimeout(onClose, 600);
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card pixel-border rounded-lg w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <h2 className="font-pixel text-sm text-primary">{product.name}</h2>
              <span className={`text-[10px] font-pixel ${rarityColors[product.rarity]}`}>
                [{rarityLabels[product.rarity]}]
              </span>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">
              ✕
            </button>
          </div>

          <div className="p-6 flex flex-col sm:flex-row gap-6">
            {/* Left: Image */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <motion.img
                src={imageMap[product.image]}
                alt={product.name}
                className="w-32 h-32 object-contain pixel-art"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Right: Details */}
            <div className="flex-1 space-y-4">
              {/* Top part: Description & Bonuses */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

                {product.bonuses && product.bonuses.length > 0 && (
                  <div className="bg-secondary/30 rounded-lg p-3.5 space-y-2 border border-border/40">
                    <span className="text-[10px] font-pixel text-primary tracking-wider">ZAWARTOŚĆ PAKIETU</span>
                    <ul className="space-y-1.5">
                      {product.bonuses.map((bonus, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                          <span className="text-primary mt-0.5 text-[10px]">✦</span>
                          <span>{bonus}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Price & Quantity flex */}
              <div className="flex items-center justify-between py-2 border-y border-border/30 my-4">
                <div>
                  <label className="text-[10px] font-pixel text-muted-foreground uppercase mb-1 block">WYBIERZ ILOŚĆ</label>
                  <div className="flex items-center gap-1 bg-secondary/50 rounded p-1 border border-border">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 bg-background rounded text-foreground hover:bg-muted transition-colors flex items-center justify-center font-mono"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-sm font-mono">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 bg-background rounded text-foreground hover:bg-muted transition-colors flex items-center justify-center font-mono"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-pixel text-muted-foreground uppercase mb-1 block">DO ZAPŁATY</span>
                  <span className="text-2xl font-bold text-primary tracking-tight">
                    {(product.price * quantity).toFixed(2)} <span className="text-sm text-primary/70">PLN</span>
                  </span>
                </div>
              </div>

              {/* Nick player input */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <label className="text-[10px] font-pixel text-primary uppercase mb-2 block tracking-wider pl-2">KTO OTRZYMA PAKIET?</label>
                <div className="relative pl-2">
                  <input
                    type="text"
                    value={nick}
                    onChange={(e) => setNick(e.target.value)}
                    placeholder="Wpisz tutaj swój nick Minecraft"
                    autoFocus
                    className="w-full bg-background border-2 border-border text-foreground px-4 py-3 text-base rounded focus:border-primary focus:outline-none transition-all font-mono shadow-inner block"
                  />
                  {nick.length >= 3 && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald font-pixel text-sm drop-shadow">
                      ✓
                    </span>
                  )}
                </div>
                {nick.length > 0 && nick.length < 3 && (
                  <p className="text-[10px] text-destructive mt-1.5 pl-2">Nick musi mieć co najmniej 3 znaki</p>
                )}
              </div>

              {/* Buy button */}
              <div className="relative pt-2">
                <button
                  ref={btnRef}
                  onClick={handlePurchase}
                  disabled={nick.length < 3}
                  className={`w-full py-4 font-bold rounded text-sm tracking-wider transition-all duration-300 ${nick.length >= 3
                      ? "bg-primary text-primary-foreground pixel-border-gold glow-gold shadow-lg hover:brightness-110 translate-y-0"
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
                    }`}
                >
                  <span className="font-pixel text-[12px]">{nick.length >= 3 ? "PRZEJDŹ DO PŁATNOŚCI" : "WPISZ NICK ABY KUPIĆ"}</span>
                </button>

                {/* Particles */}
                {particles.map((p) => (
                  <span
                    key={p.id}
                    className="absolute left-1/2 top-1/2 w-2 h-2 bg-primary rounded-sm particle pointer-events-none"
                    style={{ "--tx": `${p.tx}px`, "--ty": `${p.ty}px` } as React.CSSProperties}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
