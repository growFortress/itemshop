import { motion } from "framer-motion";
import { gameModes } from "@/data/shopData";
import floatingIsland from "@/assets/floating-island.png";
import swordImg from "@/assets/sword.png";
import chestImg from "@/assets/chest.png";
import keyImg from "@/assets/key.png";
import crownImg from "@/assets/crown.png";

interface GameModeSelectorProps {
  activeMode: string;
  cartItems: number;
  cartModeName?: string | null;
  onModeChange: (id: string) => void;
  onOpenCart: () => void;
}

const modeImages: Record<string, string> = {
  "og-lucky-skyblock": floatingIsland,
  "survival-extreme": swordImg,
  "survival-dzialki": chestImg,
  oneblock: keyImg,
  creative: crownImg,
  "box-pvp": swordImg,
};

const modeTone: Record<
  string,
  {
    border: string;
    shadow: string;
    accent: string;
    iconBg: string;
    badge: string;
  }
> = {
  "og-lucky-skyblock": {
    border: "border-[#67d8ee]",
    shadow: "shadow-[0_8px_0_0_rgba(30,163,193,0.28)]",
    accent: "from-[#67d8ee] to-[#12b9db]",
    iconBg: "bg-[#e6fbff]",
    badge: "bg-[#67d8ee] text-[#08313d]",
  },
  "survival-extreme": {
    border: "border-[#ff9db6]",
    shadow: "shadow-[0_8px_0_0_rgba(235,78,121,0.24)]",
    accent: "from-[#ff9db6] to-[#ff5e87]",
    iconBg: "bg-[#fff0f4]",
    badge: "bg-[#ff7a9f] text-[#43111d]",
  },
  "survival-dzialki": {
    border: "border-[#9fdcab]",
    shadow: "shadow-[0_8px_0_0_rgba(76,178,95,0.24)]",
    accent: "from-[#9fdcab] to-[#5cc878]",
    iconBg: "bg-[#f1fff4]",
    badge: "bg-[#7ad38d] text-[#112f18]",
  },
  oneblock: {
    border: "border-[#9ec5ff]",
    shadow: "shadow-[0_8px_0_0_rgba(74,132,237,0.22)]",
    accent: "from-[#9ec5ff] to-[#4f8fff]",
    iconBg: "bg-[#eff6ff]",
    badge: "bg-[#8cb7ff] text-[#132a4c]",
  },
  creative: {
    border: "border-[#cdb8ff]",
    shadow: "shadow-[0_8px_0_0_rgba(145,95,240,0.22)]",
    accent: "from-[#cdb8ff] to-[#9668ff]",
    iconBg: "bg-[#f7f1ff]",
    badge: "bg-[#c0a2ff] text-[#281148]",
  },
  "box-pvp": {
    border: "border-[#f8c188]",
    shadow: "shadow-[0_8px_0_0_rgba(237,140,48,0.24)]",
    accent: "from-[#ffd09a] to-[#ff9734]",
    iconBg: "bg-[#fff5e9]",
    badge: "bg-[#ffbe74] text-[#452207]",
  },
};

export default function GameModeSelector({
  activeMode,
  cartItems,
  cartModeName,
  onModeChange,
  onOpenCart,
}: GameModeSelectorProps) {
  const activeModeName = gameModes.find((mode) => mode.id === activeMode)?.name ?? "Wybrany tryb";
  const cartHeadline = cartItems === 1 ? "1 pakiet w koszyku" : `${cartItems} szt. w koszyku`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-5">
      <div className="rounded-[28px] border-[3px] border-[#d8cfbf] bg-[#fffaf0] px-5 py-5 shadow-[0_8px_0_0_#d8cfbf] sm:px-6">
        <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="rounded-[24px] border-[3px] border-[#e1d7c7] bg-white px-4 py-4 shadow-[0_6px_0_0_#e1d7c7]">
            <p className="font-pixel text-[10px] uppercase tracking-[0.18em] text-primary">
              Aktualny serwer
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border-2 border-[#8c5a12] bg-[#f7d04e] px-3 py-1 font-pixel text-[10px] uppercase tracking-[0.16em] text-[#342203] shadow-[0_3px_0_0_#8c5a12]">
                Aktywny tryb
              </span>
              <span className="rounded-full border-2 border-[#e6ddcf] bg-[#fffaf0] px-3 py-1 text-xs font-semibold text-[#5f543d]">
                {activeModeName}
              </span>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Wszystkie plansze i pakiety ponizej naleza do tego trybu. Jesli szukasz innego
              serwera, zmien go na kaflach nizej.
            </p>
          </div>

          <div className="rounded-[24px] border-[3px] border-[#e1d7c7] bg-[linear-gradient(180deg,#fff8e7_0%,#fff2cb_100%)] px-4 py-4 shadow-[0_6px_0_0_#e1d7c7]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-pixel text-[10px] uppercase tracking-[0.18em] text-primary">
                  Twoj koszyk
                </p>
                <p className="mt-3 text-lg font-black text-foreground">
                  {cartItems > 0 ? cartHeadline : "Koszyk jest pusty"}
                </p>
              </div>

              <div className="rounded-full border-2 border-[#e1d7c7] bg-white px-3 py-1.5 text-xs font-semibold text-[#5f543d] shadow-[0_3px_0_0_#e1d7c7]">
                1 koszyk = 1 tryb
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {cartItems > 0 && cartModeName
                ? `Masz juz wybrane pakiety dla trybu ${cartModeName}. Otworz koszyk i przejdz dalej albo dobierz kolejne rzeczy z tej samej planszy.`
                : "Najpierw kliknij kategorie albo konkretny pakiet. Po dodaniu produktu od razu zobaczysz go w koszyku."}
            </p>

            {cartItems > 0 ? (
              <button
                type="button"
                onClick={onOpenCart}
                className="mt-4 inline-flex items-center justify-center rounded-[16px] border-2 border-[#8c5a12] bg-[#f7d04e] px-4 py-3 font-pixel text-[11px] uppercase tracking-[0.14em] text-[#342203] shadow-[0_4px_0_0_#8c5a12] transition-transform hover:translate-y-[-1px]"
              >
                Otworz koszyk
              </button>
            ) : (
              <div className="mt-4 inline-flex rounded-[16px] border-2 border-[#e1d7c7] bg-white px-4 py-3 text-sm font-medium text-[#5f543d]">
                Krok 1: wybierz plansze albo pakiet nizej
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-pixel text-[10px] uppercase tracking-[0.18em] text-primary">
              Zmien serwer
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Gdy grasz na innym trybie, kliknij odpowiedni kafel. Zmiana przelacza cala oferte sklepu.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          {gameModes.map((mode, index) => {
            const active = activeMode === mode.id;
            const tone = modeTone[mode.id];

            return (
              <motion.button
                key={mode.id}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onModeChange(mode.id)}
                aria-pressed={active}
                className={`group relative overflow-hidden rounded-[24px] border-[3px] bg-white text-left transition-all ${tone.border} ${
                  active ? `${tone.shadow} translate-y-[-2px]` : "shadow-[0_6px_0_0_rgba(216,207,191,0.9)] hover:border-[#c9beaa]"
                }`}
              >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:18px_18px] opacity-40" />

                <div className="relative p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-white ${tone.iconBg}`}>
                      <img
                        src={modeImages[mode.id]}
                        alt={mode.name}
                        className="h-7 w-7 pixel-art transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-pixel text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                          Tryb
                        </span>
                        {active && (
                          <span className={`rounded-full px-2 py-1 font-pixel text-[9px] uppercase tracking-[0.16em] shadow-[0_2px_0_0_rgba(0,0,0,0.12)] ${tone.badge}`}>
                            Teraz tutaj
                          </span>
                        )}
                      </div>
                      <p className="mt-2 truncate text-base font-bold leading-snug text-foreground">
                        {mode.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`h-1.5 w-full bg-gradient-to-r ${tone.accent}`} />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
