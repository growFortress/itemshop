import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import type { CartItem } from "@/hooks/useCart";
import {
  getCartPaymentOptions,
  getCheckoutLines,
  getCheckoutTotal,
  isValidNickname,
} from "@/lib/checkout";
import { createCheckoutDraft, createOrder } from "@/lib/storefrontApi";
import type { CheckoutDraftResponseDto, OrderResponseDto } from "@/types/storefront";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CheckoutStep = "editing" | "review" | "submitted";

interface CheckoutModalProps {
  items: CartItem[];
  modeName?: string | null;
  open: boolean;
  source?: "cart" | "buy-now";
  onClose: () => void;
}

function formatPreviewExpiry(expiresAt: string | null) {
  if (!expiresAt) {
    return null;
  }

  const date = new Date(expiresAt);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getLegalCopy(legalText: string) {
  const cleaned = legalText
    .replace(/\s+/g, " ")
    .replace(/pakiet!Klikając/gu, "pakiet! Klikając")
    .trim();

  const consentStart = cleaned.search(/Klikając/u);

  if (consentStart === -1) {
    return {
      paymentInfo: cleaned,
      consentInfo: null,
    };
  }

  return {
    paymentInfo: cleaned.slice(0, consentStart).trim(),
    consentInfo: cleaned.slice(consentStart).trim(),
  };
}

export default function CheckoutModal({
  items,
  modeName,
  open,
  source = "cart",
  onClose,
}: CheckoutModalProps) {
  const [nickname, setNickname] = useState("");
  const [selectedPaymentOptionId, setSelectedPaymentOptionId] = useState("");
  const [step, setStep] = useState<CheckoutStep>("editing");
  const [isDraftSubmitting, setIsDraftSubmitting] = useState(false);
  const [isOrderSubmitting, setIsOrderSubmitting] = useState(false);
  const [draft, setDraft] = useState<CheckoutDraftResponseDto | null>(null);
  const [order, setOrder] = useState<OrderResponseDto | null>(null);
  const paymentOptions = useMemo(() => getCartPaymentOptions(items), [items]);
  const checkoutLines = useMemo(
    () => getCheckoutLines(items, selectedPaymentOptionId),
    [items, selectedPaymentOptionId]
  );
  const checkoutTotal = useMemo(
    () => getCheckoutTotal(items, selectedPaymentOptionId),
    [items, selectedPaymentOptionId]
  );
  const selectedPaymentOption =
    paymentOptions.find((option) => option.id === selectedPaymentOptionId) ?? null;
  const previewExpiresAt = formatPreviewExpiry(order?.expiresAt ?? null);
  const legalCopy = selectedPaymentOption
    ? getLegalCopy(selectedPaymentOption.legalText)
    : null;

  useEffect(() => {
    if (!open) {
      setStep("editing");
      setDraft(null);
      setOrder(null);
      return;
    }

    if (!paymentOptions.length) {
      setSelectedPaymentOptionId("");
      return;
    }

    if (!paymentOptions.some((option) => option.id === selectedPaymentOptionId)) {
      setSelectedPaymentOptionId(paymentOptions[0].id);
    }
  }, [open, paymentOptions, selectedPaymentOptionId]);

  if (!items.length) {
    return null;
  }

  const handleDraftSubmit = async () => {
    if (!selectedPaymentOptionId) {
      toast.error("Wybierz metode platnosci");
      return;
    }

    if (!isValidNickname(nickname)) {
      toast.error("Wpisz poprawny nick", {
        description: "Nick powinien miec od 1 do 16 znakow i nie moze zawierac spacji.",
      });
      return;
    }

    setIsDraftSubmitting(true);

    try {
      const nextDraft = await createCheckoutDraft({
        modeId: items[0].product.gameMode,
        paymentOptionId: selectedPaymentOptionId,
        nickname: nickname.trim(),
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      setDraft(nextDraft);
      setOrder(null);
      setStep("review");
    } catch (error) {
      toast.error("Nie udalo sie przygotowac podsumowania", {
        description:
          error instanceof Error
            ? error.message
            : "Sprawdz konfiguracje API albo sprobuj ponownie.",
      });
    } finally {
      setIsDraftSubmitting(false);
    }
  };

  const handleOrderSubmit = async () => {
    if (!draft) {
      return;
    }

    setIsOrderSubmitting(true);

    try {
      const nextOrder = await createOrder({
        modeId: draft.modeId,
        paymentOptionId: draft.paymentOptionId,
        nickname: draft.nickname,
        draftToken: draft.orderToken,
        items: draft.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      setOrder(nextOrder);
      setStep("submitted");

      if (nextOrder.checkoutUrl) {
        window.location.assign(nextOrder.checkoutUrl);
        return;
      }

      toast.message("Zamowienie utworzone", {
        description: `${nextOrder.orderToken} / ${nextOrder.amount.toFixed(2)} ${nextOrder.currency}.`,
      });
    } catch (error) {
      toast.error("Nie udalo sie utworzyc zamowienia", {
        description:
          error instanceof Error
            ? error.message
            : "Sprawdz konfiguracje API albo sprobuj ponownie.",
      });
    } finally {
      setIsOrderSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto border-[3px] border-[#d8cfbf] bg-[#fffaf0] p-0 shadow-[0_12px_0_0_#d8cfbf,0_30px_80px_-28px_rgba(15,23,42,0.42)]">
        <div className="minecraft-strip h-[5px]" />
        <div className="border-b-[3px] border-[#eadfcb] bg-[linear-gradient(180deg,#fff9eb_0%,#fff0c9_100%)] px-5 py-5 sm:px-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
              {source === "buy-now"
                ? `Kup teraz dla ${modeName ?? "wybranego trybu"}`
                : `Checkout dla ${modeName ?? "wybranego trybu"}`}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {step === "editing"
                ? source === "buy-now"
                  ? "Szybka sciezka zakupu dla jednego pakietu. Zawartosc koszyka pozostaje bez zmian."
                  : "Jeden nick, jedna metoda platnosci i ceny policzone dopiero po stronie backendu."
                : step === "review"
                  ? "To jest serwerowe podsumowanie przed utworzeniem prawdziwego zamowienia."
                  : "Zamowienie zostalo utworzone. W produkcji ten krok prowadzi dalej do operatora platnosci."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_0.92fr]">
          <section className="space-y-5">
            {step === "editing" ? (
              <>
                <div className="rounded-[24px] border border-[#d8cfbf] bg-white p-4 shadow-[0_18px_30px_-26px_rgba(15,23,42,0.16)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Nick gracza</p>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(event) => setNickname(event.target.value.slice(0, 16))}
                    placeholder="Twoj Nick"
                    className="mt-3 h-11 w-full rounded-[14px] border border-[#e2d7c4] bg-[#f8f4ec] px-3 text-sm text-foreground"
                  />
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Plugin dostanie ten nick razem z potwierdzonym zamowieniem.
                  </p>
                </div>

                <div className="rounded-[24px] border border-[#d8cfbf] bg-white p-4 shadow-[0_18px_30px_-26px_rgba(15,23,42,0.16)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Metoda platnosci</p>
                  <div className="mt-4 space-y-2.5">
                    {paymentOptions.map((option) => {
                      const isSelected = option.id === selectedPaymentOptionId;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setSelectedPaymentOptionId(option.id)}
                          className={`flex w-full items-center justify-between gap-3 rounded-[18px] border px-4 py-3 text-left transition-colors ${
                            isSelected
                              ? "border-primary/35 bg-[#fff7df] text-foreground"
                              : "border-[#eadfcb] bg-[#fffaf0] text-muted-foreground hover:border-primary/18"
                          }`}
                        >
                          <span className="inline-flex items-center gap-3">
                            <span className="inventory-slot flex h-10 w-10 items-center justify-center rounded-[16px] text-[#6e624e]">
                              <CreditCard className="h-4 w-4" />
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-foreground">{option.label}</span>
                              <span className="block text-xs text-muted-foreground">
                                Dostepna dla wszystkich pozycji w koszyku.
                              </span>
                            </span>
                          </span>
                          <span className="text-lg font-black text-[#18223c]">{option.totalAmount.toFixed(2)} PLN</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedPaymentOption ? (
                  <div className="rounded-[24px] border border-[#d8cfbf] bg-white p-4 shadow-[0_18px_30px_-26px_rgba(15,23,42,0.16)]">
                    <div className="flex items-center gap-3">
                      <span className="inventory-slot flex h-11 w-11 items-center justify-center rounded-[18px] text-primary">
                        <ShieldCheck className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                          Platnosc i zasady
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Najwazniejsze informacje przed przejsciem do operatora platnosci.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {legalCopy?.paymentInfo ? (
                        <div className="rounded-[18px] border border-[#eadfcb] bg-[#fffaf0] px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                          {legalCopy.paymentInfo}
                        </div>
                      ) : null}

                      {legalCopy?.consentInfo ? (
                        <div className="rounded-[18px] border border-[#eadfcb] bg-[#fffaf0] px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                          {legalCopy.consentInfo}
                        </div>
                      ) : null}
                    </div>

                    {selectedPaymentOption.legalLinks.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedPaymentOption.legalLinks.map((link) => (
                          <a
                            key={`${link.label}-${link.href}`}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="shop-button shop-button-secondary min-h-0 rounded-[14px] px-3 py-2 text-sm"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : null}

            {step === "review" && draft ? (
              <>
                <div className="rounded-[24px] border border-primary/24 bg-[#fff9eb] p-4 shadow-[0_18px_30px_-26px_rgba(15,23,42,0.16)]">
                  <div className="flex items-center gap-3">
                    <ReceiptText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Serwer policzyl zamowienie</p>
                      <p className="text-sm text-muted-foreground">{draft.orderToken}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Nick: <span className="font-semibold text-foreground">{draft.nickname}</span>. Metoda:
                    {" "}
                    <span className="font-semibold text-foreground">{draft.paymentOptionLabel}</span>.
                  </p>
                </div>

                <div className="rounded-[24px] border border-[#d8cfbf] bg-white p-4 shadow-[0_18px_30px_-26px_rgba(15,23,42,0.16)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Pozycje z backendu</p>
                  <div className="mt-4 space-y-2.5">
                    {draft.items.map((line) => (
                      <div key={line.productId} className="rounded-[18px] border border-[#eadfcb] bg-[#fffaf0] px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground">{line.productName}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {line.quantity} x {line.unitAmount.toFixed(2)} PLN
                            </p>
                          </div>
                          <p className="text-base font-black text-[#18223c]">{line.totalAmount.toFixed(2)} PLN</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {step === "submitted" && order ? (
              <>
                <div className="rounded-[24px] border border-primary/24 bg-[#fff9eb] p-4 shadow-[0_18px_30px_-26px_rgba(15,23,42,0.16)]">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Zamowienie utworzone</p>
                      <p className="text-sm text-muted-foreground">{order.orderToken}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Status: <span className="font-semibold text-foreground">{order.status}</span>. Provider:
                    {" "}
                    <span className="font-semibold text-foreground">{order.paymentProvider}</span>.
                  </p>
                  {previewExpiresAt ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Wygasa: <span className="font-semibold text-foreground">{previewExpiresAt}</span>.
                    </p>
                  ) : null}
                </div>

                <div className="rounded-[24px] border border-[#d8cfbf] bg-white p-4 shadow-[0_18px_30px_-26px_rgba(15,23,42,0.16)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Co dalej</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    W preview zostajesz na tej planszy. Po podpieciu Laravela ten etap zwroci prawdziwy `checkoutUrl`
                    i przekieruje gracza do operatora platnosci.
                  </p>
                  {order.checkoutUrl ? (
                    <a
                      href={order.checkoutUrl}
                      className="shop-button btn-premium mt-4 w-full"
                    >
                      Przejdz do platnosci
                    </a>
                  ) : null}
                </div>
              </>
            ) : null}
          </section>

          <section className="space-y-5">
            <div className="rounded-[24px] border border-[#d8cfbf] bg-white p-4 shadow-[0_18px_30px_-26px_rgba(15,23,42,0.16)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                {step === "editing" ? "Podsumowanie" : step === "review" ? "Podsumowanie draftu" : "Podsumowanie zamowienia"}
              </p>
              <div className="mt-4 space-y-2.5">
                {(step === "review" && draft ? draft.items : step === "submitted" && order ? order.items : checkoutLines).map((line) => (
                  <div key={line.productId} className="rounded-[18px] border border-[#eadfcb] bg-[#fffaf0] px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground">{line.productName}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {line.quantity} x {line.unitAmount.toFixed(2)} PLN
                        </p>
                      </div>
                      <p className="text-base font-black text-[#18223c]">{line.totalAmount.toFixed(2)} PLN</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-[18px] border border-primary/24 bg-[#fff7df] px-4 py-3">
                <p className="text-sm font-semibold text-foreground">Do zaplaty</p>
                <p className="text-2xl font-black text-[#18223c]">
                  {(step === "review" && draft ? draft.amount : step === "submitted" && order ? order.amount : checkoutTotal).toFixed(2)} PLN
                </p>
              </div>

              {step === "editing" ? (
                <button
                  type="button"
                  onClick={handleDraftSubmit}
                  disabled={isDraftSubmitting}
                  className="shop-button btn-premium mt-4 w-full disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-55"
                >
                  {isDraftSubmitting
                    ? "Pobieram podsumowanie..."
                    : source === "buy-now"
                      ? "Sprawdz zakup teraz"
                      : "Policz na serwerze"}
                </button>
              ) : null}

              {step === "review" ? (
                <>
                  <button
                    type="button"
                    onClick={handleOrderSubmit}
                    disabled={isOrderSubmitting}
                    className="shop-button btn-premium mt-4 w-full disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-55"
                  >
                    {isOrderSubmitting
                      ? "Tworze zamowienie..."
                      : source === "buy-now"
                        ? "Kup teraz"
                        : "Utworz zamowienie"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("editing")}
                    className="shop-button shop-button-secondary mt-3 w-full"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Wroc do edycji
                  </button>
                </>
              ) : null}

              {step === "submitted" ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="shop-button shop-button-secondary mt-4 w-full"
                >
                  Zamknij podsumowanie
                </button>
              ) : null}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
