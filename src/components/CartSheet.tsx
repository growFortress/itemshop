import { Crown, KeyRound, Package, ShoppingCart, Sparkles, Trash2 } from "lucide-react";
import { Product } from "@/data/shopData";
import { CartItem } from "@/hooks/useCart";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CartSheetProps {
  items: CartItem[];
  modeName?: string | null;
  open: boolean;
  recommendations: Product[];
  totalPrice: number;
  onOpenChange: (open: boolean) => void;
  onRemoveItem: (productId: string) => void;
  onAddRecommendation: (product: Product) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

const typeIcon = {
  rank: Crown,
  key: KeyRound,
  chest: Package,
  set: Package,
  other: Sparkles,
};

const typeLabel = {
  rank: "Ranga",
  key: "Klucz",
  chest: "Skrzynia",
  set: "Zestaw",
  other: "Dodatek",
};

function getPositionLabel(count: number) {
  if (count === 1) {
    return "1 pozycja";
  }

  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} pozycje`;
  }

  return `${count} pozycji`;
}

export default function CartSheet({
  items,
  modeName,
  open,
  recommendations,
  totalPrice,
  onOpenChange,
  onRemoveItem,
  onAddRecommendation,
  onClearCart,
  onCheckout,
}: CartSheetProps) {
  const isMobile = useIsMobile();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const visibleRecommendations = isMobile ? recommendations.slice(0, 2) : recommendations;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col overflow-hidden border-l border-[#d8cfbf] bg-[linear-gradient(180deg,#fffdf7_0%,#f6efdf_100%)] p-0 sm:max-w-[440px]"
      >
        <div className="shrink-0 border-b border-[#e5ddcf] bg-[#fffbf4]/96 px-4 py-5 backdrop-blur sm:px-5">
          <SheetHeader className="gap-2 text-left">
            <div className="flex items-center justify-between gap-3 pr-10">
              <SheetTitle className="flex items-center gap-3 text-foreground">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[18px] border border-[#8c5a12] bg-[#f7d04e] text-[#342203] shadow-[0_10px_18px_-14px_rgba(177,128,21,0.5)]">
                  <ShoppingCart className="h-5 w-5" />
                </span>
                <span className="text-2xl font-black">Koszyk</span>
              </SheetTitle>

              {items.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="rounded-full border border-[#d8cfbf] bg-white px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-destructive/30 hover:text-destructive"
                >
                  Wyczysc
                </button>
              )}
            </div>

            <SheetDescription className="text-sm leading-relaxed text-muted-foreground">
              {modeName
                ? `Ten koszyk jest przypisany do trybu ${modeName}.`
                : "Pierwszy dodany pakiet przypisze koszyk do aktualnego trybu."}
            </SheetDescription>
          </SheetHeader>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center px-4 py-6 sm:px-5">
            <div className="w-full rounded-[28px] border border-[#d8cfbf] bg-[#fffaf0] px-5 py-8 text-center shadow-[0_20px_30px_-28px_rgba(15,23,42,0.16)]">
              <ShoppingCart className="mx-auto h-10 w-10 text-primary" />
              <p className="mt-4 font-pixel text-sm text-foreground">Koszyk jest pusty</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Otworz szczegoly pakietu na karcie produktu, a potem zdecyduj, czy dorzucasz go tutaj, czy kupujesz od razu.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-5">
              <div className="space-y-3.5">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[24px] border border-primary/22 bg-[#fff9eb] px-4 py-4 shadow-[0_18px_28px_-24px_rgba(177,128,21,0.18)]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                      Serwer
                    </p>
                    <p className="mt-3 text-lg font-black text-foreground">{modeName ?? "Wybrany tryb"}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Koszyk przypisany do jednego trybu</p>
                  </div>

                  <div className="rounded-[24px] border border-[#d8cfbf] bg-white/92 px-4 py-4 shadow-[0_18px_28px_-24px_rgba(15,23,42,0.16)]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                      Pozycje
                    </p>
                    <p className="mt-3 text-lg font-black text-foreground">{getPositionLabel(totalItems)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Jeden nick dla calego zamowienia</p>
                  </div>

                  <div className="rounded-[24px] border border-[#d8cfbf] bg-white/92 px-4 py-4 shadow-[0_18px_28px_-24px_rgba(15,23,42,0.16)]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                      Do zaplaty
                    </p>
                    <p className="mt-3 text-lg font-black text-foreground">{totalPrice.toFixed(2)} PLN</p>
                    <p className="mt-1 text-sm text-muted-foreground">Wybor metody platnosci w checkoutcie</p>
                  </div>
                </div>

                {items.map((item) => {
                  const Icon = typeIcon[item.product.type];

                  return (
                    <div
                      key={item.product.id}
                      className="rounded-[24px] border border-[#d8cfbf] bg-white/92 p-4 shadow-[0_20px_30px_-28px_rgba(15,23,42,0.18)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border border-[#eadfcb] bg-[#fffaf0] text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-base font-black text-foreground">{item.product.name}</p>
                            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              {typeLabel[item.product.type]}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                              {item.product.subtitle || item.product.previewLines[0] || item.product.description}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] border border-transparent text-muted-foreground transition-colors hover:border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Usun ${item.product.name} z koszyka`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <p className="text-2xl font-black leading-none text-[#18223c]">
                          {(item.product.price * item.quantity).toFixed(2)}
                          <span className="ml-1 text-sm font-bold text-muted-foreground">PLN</span>
                        </p>
                      </div>
                    </div>
                  );
                })}

                {visibleRecommendations.length > 0 && (
                  <div className="rounded-[24px] border border-[#d8cfbf] bg-white/92 px-4 py-4 shadow-[0_20px_30px_-28px_rgba(15,23,42,0.16)]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                      Dobierz cos z tego samego serwera
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {isMobile
                        ? "Szybkie propozycje z tego samego trybu, bez przejmowania calego koszyka."
                        : "Tylko pakiety z tego samego trybu, zeby koszyk dalej byl prosty, czytelny i gotowy do jednego checkoutu."}
                    </p>
                    <div className="mt-4 space-y-2.5">
                      {visibleRecommendations.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => onAddRecommendation(product)}
                          className="flex w-full items-center justify-between gap-3 rounded-[18px] border border-[#eadfcb] bg-[#fffaf0] px-3 py-3 text-left transition-colors hover:border-primary/28"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-foreground">{product.name}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{product.price.toFixed(2)} PLN</p>
                          </div>
                          <span className="inline-flex min-w-[72px] justify-center rounded-full border border-[#b78419] bg-primary/12 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#6f4f12]">
                            Dorzuc
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 border-t border-[#e5ddcf] bg-[#fffbf4]/96 px-4 py-4 backdrop-blur sm:px-5">
              <div className="rounded-[24px] border border-[#d8cfbf] bg-white px-4 py-4 shadow-[0_18px_30px_-26px_rgba(15,23,42,0.16)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                      Podsumowanie
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Jeden nick i jedna metoda platnosci beda kolejnym krokiem dla calego tego koszyka.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Do zaplaty</p>
                    <p className="mt-1 text-3xl font-black leading-none text-[#18223c]">
                      {totalPrice.toFixed(2)}
                      <span className="ml-1 text-sm font-bold text-muted-foreground">PLN</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onCheckout}
                  className="shop-button btn-premium mt-4 w-full"
                >
                  Przejdz do platnosci
                </button>

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Checkout policzy finalna kwote po stronie backendu i pokaze tylko metody platnosci wspolne dla wszystkich pozycji.
                </p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
