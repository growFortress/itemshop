import { motion } from "framer-motion";
import { GameMode } from "@/data/shopData";
import { Skeleton } from "@/components/ui/skeleton";

interface GameModeSelectorProps {
  activeMode: string;
  gameModes: GameMode[];
  isLoading?: boolean;
  onModeChange: (id: string) => void;
}

const modeBackgrounds: Record<
  string,
  {
    src: string;
    position: string;
    size: string;
    glow: string;
  }
> = {
  "og-lucky-skyblock": {
    src: "/Gemini_Generated_Image_dyfu7fdyfu7fdyfu.png",
    position: "63% 46%",
    size: "116%",
    glow: "rgba(114, 185, 255, 0.42)",
  },
  "survival-extreme": {
    src: "/Gemini_Generated_Image_ppov58ppov58ppov.png",
    position: "58% 46%",
    size: "116%",
    glow: "rgba(255, 118, 59, 0.4)",
  },
  "survival-dzialki": {
    src: "/Gemini_Generated_Image_5vfyqd5vfyqd5vfy.png",
    position: "58% 42%",
    size: "114%",
    glow: "rgba(255, 210, 130, 0.42)",
  },
  oneblock: {
    src: "/Gemini_Generated_Image_39d4wv39d4wv39d4.png",
    position: "58% 47%",
    size: "116%",
    glow: "rgba(197, 206, 255, 0.38)",
  },
  creative: {
    src: "/Gemini_Generated_Image_uyxjpguyxjpguyxj.png",
    position: "60% 46%",
    size: "114%",
    glow: "rgba(255, 203, 110, 0.44)",
  },
  "box-pvp": {
    src: "/Gemini_Generated_Image_2jwy0m2jwy0m2jwy.png",
    position: "64% 49%",
    size: "118%",
    glow: "rgba(255, 142, 74, 0.34)",
  },
};

const hoverTransition = {
  type: "spring",
  stiffness: 260,
  damping: 22,
};

const GameModeSelector = ({
  activeMode,
  gameModes,
  isLoading = false,
  onModeChange,
}: GameModeSelectorProps) => {
  if (isLoading) {
    return (
      <section className="mx-auto max-w-[1240px] px-4 py-6 md:py-10">
        <div className="panel-soft relative overflow-hidden rounded-[30px] px-4 py-5 sm:rounded-[34px] sm:px-6 sm:py-6 md:px-7 md:py-7">
          <div className="minecraft-strip absolute inset-x-0 top-0 h-[4px]" />
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-pixel text-[11px] uppercase tracking-[0.24em] text-primary">
                Tryb sklepu
              </p>
              <Skeleton className="mt-3 h-10 w-full max-w-[32rem] rounded-2xl sm:h-12" />
            </div>

            <Skeleton className="h-[50px] w-full rounded-full sm:w-[220px]" />
          </div>

          <div className="mt-6 grid gap-4 sm:mt-7 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-[#161f31] aspect-[1.65/1] min-h-[190px] shadow-[0_26px_60px_-42px_rgba(18,20,28,0.35)] sm:min-h-[220px]"
              >
                <div className="minecraft-strip absolute inset-x-5 top-0 h-[4px] rounded-b-md opacity-60" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_34%,transparent_60%)]" />
                <Skeleton className="absolute inset-x-6 bottom-6 h-8 w-28 rounded-full bg-white/12" />
                <Skeleton className="absolute bottom-6 right-6 h-8 w-20 rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1240px] px-4 py-6 md:py-10">
      <div className="panel-soft relative overflow-hidden rounded-[30px] px-4 py-5 sm:rounded-[34px] sm:px-6 sm:py-6 md:px-7 md:py-7">
        <div className="minecraft-strip absolute inset-x-0 top-0 h-[4px]" />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-pixel text-[11px] uppercase tracking-[0.24em] text-primary">
              Tryb sklepu
            </p>
            <h2 className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-foreground sm:text-3xl md:text-5xl">
              Wybierz serwer, dla ktorego kupujesz
            </h2>
          </div>

          <div className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-border/90 bg-white/80 px-5 py-3 text-sm font-semibold text-foreground shadow-[0_18px_35px_-28px_rgba(32,24,12,0.42)] backdrop-blur-sm sm:w-fit">
            <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_6px_rgba(233,171,27,0.12)]" />
            {gameModes.length} serwerow w sklepie
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:mt-7 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {gameModes.map((mode) => {
            const isActive = mode.id === activeMode;
            const background = modeBackgrounds[mode.id];

            return (
              <motion.button
                key={mode.id}
                type="button"
                onClick={() => onModeChange(mode.id)}
                aria-pressed={isActive}
                whileHover={{ y: -6, scale: 1.008 }}
                transition={hoverTransition}
                className={[
                  "group relative isolate overflow-hidden rounded-[28px] border text-left",
                  "aspect-[1.65/1] min-h-[190px] bg-[#111827] sm:min-h-[220px]",
                  "shadow-[0_26px_60px_-42px_rgba(18,20,28,0.7)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2",
                  isActive
                    ? "border-primary/75 shadow-[0_30px_70px_-44px_rgba(233,171,27,0.58)] ring-1 ring-primary/24"
                    : "border-white/10 hover:border-white/20",
                ].join(" ")}
              >
                <div
                  aria-hidden="true"
                  className={`minecraft-strip absolute inset-x-5 top-0 h-[4px] rounded-b-md transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                  }`}
                />
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0"
                  whileHover={{ scale: 1.1, x: 4, y: -2, filter: "brightness(1.06) saturate(1.08)" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    backgroundImage: `url(${background?.src ?? ""})`,
                    backgroundPosition: background?.position ?? "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: background?.size ?? "cover",
                  }}
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,18,0.08)_0%,rgba(7,10,18,0.14)_28%,rgba(7,10,18,0.62)_70%,rgba(7,10,18,0.95)_100%)] transition-opacity duration-300 group-hover:opacity-90" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.02)_34%,transparent_60%)] opacity-80" />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-[-35%] top-0 h-full rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)] opacity-0 transition-all duration-700 group-hover:translate-x-[52%] group-hover:opacity-100"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-60 transition-opacity duration-300 group-hover:opacity-90"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${background?.glow ?? "rgba(255,255,255,0.18)"} 0%, rgba(0,0,0,0) 58%)`,
                  }}
                />

                <div className="relative flex h-full flex-col justify-between p-4 sm:p-5 md:p-6">
                  <div className="flex justify-end">
                    {isActive ? (
                      <span className="inline-flex h-8 items-center justify-center gap-2 rounded-full border border-white/16 bg-black/28 px-3 font-pixel text-[9px] uppercase tracking-[0.18em] text-[#ffe2a1] shadow-[0_10px_28px_-18px_rgba(233,171,27,0.7)] backdrop-blur-md sm:h-9 sm:px-3.5 sm:text-[10px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_0_5px_rgba(233,171,27,0.14)]" />
                        Aktywny
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <div className="max-w-[calc(100%-7.5rem)]">
                      <motion.h3
                        className="text-[1.45rem] font-semibold leading-[0.92] tracking-[-0.055em] text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.48)] sm:text-[1.65rem] md:text-[1.95rem]"
                        whileHover={{ y: -4 }}
                        transition={hoverTransition}
                      >
                        {mode.name}
                      </motion.h3>
                    </div>

                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={hoverTransition}
                      className="flex shrink-0 flex-col items-end pb-1 text-right"
                    >
                      <span
                        className={[
                          "text-[9px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 sm:text-[10px]",
                          isActive
                            ? "text-[#ffe2a1]"
                            : "text-white/68 group-hover:text-white/90",
                        ].join(" ")}
                      >
                        {isActive ? "Aktywny serwer" : "Wybierz serwer"}
                      </span>
                      <span
                        aria-hidden="true"
                        className={[
                          "mt-2 h-[2px] rounded-full transition-all duration-300",
                          isActive
                            ? "w-14 bg-primary/82 shadow-[0_8px_18px_-12px_rgba(233,171,27,0.92)]"
                            : "w-10 bg-white/40 group-hover:w-14 group-hover:bg-white/72",
                        ].join(" ")}
                      />
                    </motion.div>
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset transition-all duration-300",
                    isActive ? "ring-primary/55" : "ring-white/0 group-hover:ring-white/12",
                  ].join(" ")}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GameModeSelector;
