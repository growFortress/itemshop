import { Crown, KeyRound, Package, ShoppingCart, Sparkles, Trash2 } from "lucide-react";
import { Product } from "@/data/shopData";
import { CartItem } from "@/hooks/useCart";
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
  onUpdateQuantity: (productId: string, quantity: number) => void;
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
  set: "Bundle",
  other: "Dodatek",
};

export default function CartSheet({
  items,
  modeName,
  open,
  recommendations,
  totalPrice,
  onOpenChange,
  onRemoveItem,
  onUpdateQuantity,
  onAddRecommendation,
  onClearCart,
  onCheckout,
}: CartSheetProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-l-[3px] border-[#d8cfbf] bg-[linear-gradient(180deg,#fffdf7_0%,#f6edda_100%)] px-0 sm:max-w-md"
      >
        <div className="border-b-[3px] border-[#e5ddcf] px-5 py-5">
          <SheetHeader className="gap-2 text-left">
            <div className="flex items-center justify-between gap-3">
              <SheetTitle className="flex items-center gap-2 text-foreground">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[18px] border-2 border-[#8c5a12] bg-[#f7d04e] text-[#342203] shadow-[0_4px_0_0_#8c5a12]">
                  <ShoppingCart className="h-5 w-5" />
                </span>
                <span className="text-2xl font-black">Koszyk</span>
              </SheetTitle>

              {items.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="rounded-full border-2 border-[#d8cfbf] bg-white px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-destructive/30 hover:text-destructive"
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

        <div className="flex flex-1 flex-col overflow-hidden px-5 pb-5">
          {items.length === 0 ? (
            <div className="mt-5 rounded-[28px] border-[3px] border-[#d8cfbf] bg-[#fffaf0] px-5 py-8 text-center shadow-[0_8px_0_0_#d8cfbf]">
              <ShoppingCart className="mx-auto h-10 w-10 text-primary" />
              <p className="mt-4 font-pixel text-sm text-foreground">Koszyk jest pusty</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Kliknij w pakiet na planszy sklepu, a od razu dodasz go tutaj.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-5 flex-1 space-y-4 overflow-y-auto pr-1">
                <div className="rounded-[24px] border-[3px] border-[#d8cfbf] bg-white px-4 py-4 shadow-[0_6px_0_0_#d8cfbf]">
                  <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
                    Aktywny tryb
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-black text-foreground">{modeName ?? "Wybrany tryb"}</p>
                      <p className="text-sm text-muted-foreground">{totalItems} szt. w koszyku</p>
                    </div>
                    <span className="rounded-full border-2 border-[#8c5a12] bg-[#f7d04e] px-3 py-1 font-pixel text-[10px] uppercase tracking-[0.14em] text-[#342203] shadow-[0_3px_0_0_#8c5a12]">
                      Jedno konto
                    </span>
                  </div>
                </div>

                {items.map((item) => {
                  const Icon = typeIcon[item.product.type];

                  return (
                    <div
                      key={item.product.id}
                      className="rounded-[28px] border-[3px] border-[#d8cfbf] bg-[#fffaf0] p-4 shadow-[0_8px_0_0_#d8cfbf]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border-2 border-[#eadfcb] bg-white text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-base font-black text-foreground">{item.product.name}</p>
                            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              {typeLabel[item.product.type]}
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                              {item.product.price.toFixed(2)} PLN / szt.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-[16px] border border-transparent text-muted-foreground transition-colors hover:border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Usun ${item.product.name} z koszyka`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-end justify-between gap-3">
                        <div className="inline-flex items-center gap-2 rounded-[18px] border-2 border-[#eadfcb] bg-white p-1">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#eadfcb] bg-[#fffaf0] text-lg font-bold text-foreground"
                            aria-label={`Zmniejsz ilosc ${item.product.name}`}
                          >
                            -
                          </button>
                          <span className="min-w-8 text-center text-lg font-black text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#eadfcb] bg-[#fffaf0] text-lg font-bold text-foreground"
                            aria-label={`Zwiks ilosc ${item.product.name}`}
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            Razem
                          </p>
                          <p className="mt-2 text-2xl font-black leading-none text-[#18223c]">
                            {(item.product.price * item.quantity).toFixed(2)}
                            <span className="ml-1 text-sm font-bold text-muted-foreground">PLN</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {recommendations.length > 0 && (
                  <div className="rounded-[28px] border-[3px] border-[#d8cfbf] bg-white px-4 py-4 shadow-[0_8px_0_0_#d8cfbf]">
                    <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
                      Dobierz cos jeszcze
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Tylko pakiety z tego samego trybu, zeby koszyk dalej byl prosty i czytelny.
                    </p>
                    <div className="mt-4 space-y-3">
                      {recommendations.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => onAddRecommendation(product)}
                          className="flex w-full items-center justify-between gap-3 rounded-[20px] border-2 border-[#eadfcb] bg-[#fffaf0] px-4 py-3 text-left transition-colors hover:border-primary/30"
                        >
                          <div>
                            <p className="font-semibold text-foreground">{product.name}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{product.price.toFixed(2)} PLN</p>
                          </div>
                          <span className="rounded-full border-2 border-[#8c5a12] bg-[#f7d04e] px-3 py-1 font-pixel text-[10px] uppercase tracking-[0.14em] text-[#342203] shadow-[0_3px_0_0_#8c5a12]">
                            Dodaj
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 rounded-[28px] border-[3px] border-[#d8cfbf] bg-white px-4 py-4 shadow-[0_8px_0_0_#d8cfbf]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
                      Podsumowanie
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Dane gracza i platnosc beda kolejnym krokiem.
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
                  className="mt-4 w-full rounded-[18px] border-2 border-[#8c5a12] bg-[linear-gradient(180deg,#ffd65a_0%,#f4b51f_100%)] px-4 py-3 font-pixel text-[11px] uppercase tracking-[0.16em] text-[#342203] shadow-[0_5px_0_0_#8c5a12] transition-transform hover:translate-y-[-1px]"
                >
                  Przejdz dalej
                </button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
