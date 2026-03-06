import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";
import floatingIsland from "@/assets/floating-island.png";

interface HeroSectionProps {
  activeModeName: string;
  cartModeName?: string | null;
  productCount: number;
}

export default function HeroSection({
  activeModeName,
  cartModeName,
  productCount,
}: HeroSectionProps) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, index) => ({
        left: `${(index * 7.9 + 9) % 100}%`,
        top: `${(index * 14.1 + 6) % 100}%`,
        delay: `${index * 0.18}s`,
      })),
    []
  );

  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_28%),linear-gradient(180deg,#fffbf3_0%,hsl(var(--background))_72%)]" />
      <img
        src={floatingIsland}
        alt=""
        className="pointer-events-none absolute -right-12 top-6 hidden w-[320px] select-none opacity-[0.06] pixel-art xl:block"
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {sparkles.map((sparkle, index) => (
          <span
            key={index}
            className="absolute h-1.5 w-1.5 rounded-sm bg-primary/40 animate-sparkle"
            style={{ left: sparkle.left, top: sparkle.top, animationDelay: sparkle.delay }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 lg:py-7">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-[28px] border border-border/70 bg-card/92 p-5 shadow-[0_18px_42px_-30px_rgba(15,23,42,0.24)] lg:p-6"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Sklep sieci Crafted.pl
            </span>
            <span className="inline-flex rounded-full border border-border/70 bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground">
              Tryb: <span className="ml-1 text-foreground">{activeModeName}</span>
            </span>
            <span className="inline-flex rounded-full border border-border/70 bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground">
              {productCount} pakietow w tym trybie
            </span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
            <div>
              <h1 className="font-pixel text-lg leading-tight text-primary text-shadow-pixel sm:text-xl xl:text-2xl">
                PROSTY SKLEP DLA SIECI MC
              </h1>
              <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                Wybierasz tryb i od razu widzisz cala oferte. Rangi, klucze, skrzynie i bundle sa
                w jednym miejscu, a porownanie rang otwierasz dopiero wtedy, kiedy faktycznie tego potrzebujesz.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {[
                  "Wszystkie pakiety od razu",
                  "Zakup przez proste okno",
                  "Jeden koszyk = jeden tryb",
                ].map((item) => (
                  <div
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/85 px-3.5 py-2 text-sm text-foreground"
                  >
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-border/70 bg-background/90 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
                    Start zakupow
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Najpierw wybierz tryb, potem dodaj pakiety do koszyka przypisanego do tego serwera.
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShoppingCart className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border/70 bg-card px-4 py-3">
                <p className="text-[10px] font-pixel uppercase tracking-[0.16em] text-muted-foreground">
                  Status koszyka
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  {cartModeName
                    ? `Koszyk jest przypisany do trybu ${cartModeName}.`
                    : "Pierwszy dodany pakiet przypisze koszyk do aktualnego trybu."}
                </p>
              </div>

              <a
                href="#shop"
                className="btn-premium mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold tracking-wider text-primary-foreground"
              >
                <span className="font-pixel text-[11px]">PRZEJDZ DO OFERTY</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
