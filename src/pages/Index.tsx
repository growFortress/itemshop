import { useMemo, useState } from "react";
import {
  ArrowRight,
  FileText,
  HelpCircle,
  MessageCircle,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/shopData";
import CartSheet from "@/components/CartSheet";
import CheckoutModal from "@/components/CheckoutModal";
import GameModeSelector from "@/components/GameModeSelector";
import MobileCartBar from "@/components/MobileCartBar";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import PurchaseModal from "@/components/PurchaseModal";
import RankComparisonModal from "@/components/RankComparisonModal";
import { useCart, type AddItemResult, type CartItem } from "@/hooks/useCart";
import { getCartPaymentOptions, getCartProductQuantities } from "@/lib/checkout";
import { useStorefront } from "@/hooks/useStorefront";
import type { StorefrontModeDto } from "@/types/storefront";
import { ShopButton } from "@/components/ui/shop-button";
import { ShopBadge } from "@/components/ui/shop-badge";

const craftedRegulationsUrl = "https://crafted.pl/topic/15164-regulamin-og%C3%B3lny/";
const craftedPrivacyUrl = "https://crafted.pl/topic/16518-polityka-prywatno%C5%9Bci/";
const craftedContactUrl = "https://crafted.pl/contact";
const emptyModes: StorefrontModeDto[] = [];
const emptyProducts: Product[] = [];

function getInitialMode() {
  return "";
}

function getModeName(
  modeId: string | null,
  gameModes: { id: string; name: string }[]
) {
  if (!modeId) return null;
  return gameModes.find((mode) => mode.id === modeId)?.name ?? null;
}

const Index = () => {
  const [activeMode, setActiveMode] = useState(() => getInitialMode());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutSource, setCheckoutSource] = useState<"cart" | "buy-now">("cart");
  const [instantCheckoutItems, setInstantCheckoutItems] = useState<CartItem[]>([]);
  const [showRankComparison, setShowRankComparison] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [pendingBuyNowProduct, setPendingBuyNowProduct] = useState<Product | null>(null);
  const { data: storefrontData, isLoading: isStorefrontLoading } = useStorefront();
  const {
    items: cartItems,
    modeId: cartModeId,
    addItem,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();
  const cartEnabled = storefrontData?.storefront.cartEnabled ?? false;
  const gameModes = storefrontData?.modes ?? emptyModes;
  const storefrontProducts = storefrontData?.products ?? emptyProducts;

  const handleModeChange = (id: string) => {
    if (id === activeMode) return;
    setActiveMode(id);
  };

  const activeModeDetails = useMemo(
    () => gameModes.find((mode) => mode.id === activeMode) ?? null,
    [activeMode, gameModes]
  );
  const activeModeLabel = useMemo(
    () => getModeName(activeMode, gameModes) ?? "Czeka na wybor",
    [activeMode, gameModes]
  );
  const cartModeLabel = useMemo(
    () => getModeName(cartModeId, gameModes) ?? activeModeLabel,
    [cartModeId, gameModes, activeModeLabel]
  );
  const activeCheckoutItems = useMemo(
    () => (checkoutSource === "buy-now" ? instantCheckoutItems : cartItems),
    [cartItems, checkoutSource, instantCheckoutItems]
  );
  const activeCheckoutModeLabel = useMemo(() => {
    const checkoutModeId = activeCheckoutItems[0]?.product.gameMode ?? cartModeId;
    return getModeName(checkoutModeId ?? null, gameModes) ?? activeModeLabel;
  }, [activeCheckoutItems, activeModeLabel, cartModeId, gameModes]);
  const cartQuantities = useMemo(() => getCartProductQuantities(cartItems), [cartItems]);
  const checkoutPaymentOptions = useMemo(() => getCartPaymentOptions(cartItems), [cartItems]);
  const recommendations = useMemo(() => {
    if (!cartModeId) {
      return [];
    }

    const itemsInCart = new Set(cartItems.map((item) => item.product.id));
    const hasRankInCart = cartItems.some((item) => item.product.type === "rank");

    return storefrontProducts
      .filter((product) => (
        product.gameMode === cartModeId &&
        !itemsInCart.has(product.id) &&
        (!hasRankInCart || product.type !== "rank")
      ))
      .slice(0, 3);
  }, [cartItems, cartModeId, storefrontProducts]);
  const footerLinks = useMemo(
    () => [
      {
        href: storefrontData?.storefront.legal.regulationsUrl ?? craftedRegulationsUrl,
        label: "Regulamin",
        description: "Zasady zakupow, realizacji i odpowiedzialnosci za pakiety.",
        icon: FileText,
      },
      {
        href: storefrontData?.storefront.legal.privacyUrl ?? craftedPrivacyUrl,
        label: "Polityka prywatnosci",
        description: "Informacje o danych, platnosciach i bezpieczenstwie zamowien.",
        icon: Shield,
      },
      {
        href: storefrontData?.storefront.support.contactUrl ?? craftedContactUrl,
        label: "Kontakt",
        description: "Formularz kontaktowy i pomoc przy zakupach pakietow.",
        icon: HelpCircle,
      },
    ],
    [storefrontData]
  );
  const supportContactUrl = storefrontData?.storefront.support.contactUrl ?? craftedContactUrl;
  const supportEmail = storefrontData?.storefront.support.email ?? "pomoc@crafted.pl";
  const activeModeVersion = useMemo(() => {
    if (!activeModeDetails?.storefrontTitle) {
      return null;
    }

    const versionMatch = activeModeDetails.storefrontTitle.match(/\(([^)]+)\)/);
    return versionMatch?.[1] ?? null;
  }, [activeModeDetails]);
  const selectedProductQuantity = selectedProduct ? cartQuantities[selectedProduct.id] ?? 0 : 0;
  const selectedProductConflictingRank = useMemo(() => {
    if (!selectedProduct || selectedProduct.type !== "rank") {
      return null;
    }

    return cartItems.find((item) => (
      item.product.type === "rank" &&
      item.product.id !== selectedProduct.id
    ))?.product ?? null;
  }, [cartItems, selectedProduct]);

  const handleCartAddResult = (
    result: AddItemResult,
    product: Product,
    productModeLabel: string
  ) => {
    if (result.status === "mode-mismatch") {
      toast.error("Koszyk trzyma tylko jeden tryb naraz", {
        description: `Najpierw zakoncz koszyk dla ${cartModeLabel}, a dopiero potem dorzuc pakiety z ${productModeLabel}. Jesli chcesz, mozesz skorzystac z opcji Kup teraz tylko dla tego jednego pakietu.`,
      });
      return false;
    }

    if (result.status === "rank-conflict") {
      toast.error("W koszyku moze byc tylko jedna ranga", {
        description: `${result.conflictingProduct?.name ?? "Inna ranga"} jest juz w koszyku. Usun ja albo zakoncz ten zakup, zanim dodasz ${product.name}.`,
      });
      return false;
    }

    if (result.status === "already-in-cart") {
      toast.message("Ten pakiet juz jest w koszyku", {
        description: `${product.name} czeka juz w koszyku dla ${productModeLabel}.`,
      });
      return false;
    }

    return true;
  };

  const handleAddProduct = (product: Product, quantity = 1) => {
    if (!cartEnabled) {
      setSelectedProduct(product);
      return;
    }

    const productModeLabel = getModeName(product.gameMode, gameModes) ?? activeModeLabel;
    const result = addItem(product, quantity, product.gameMode);

    if (!handleCartAddResult(result, product, productModeLabel)) {
      return;
    }

    setCheckoutSource("cart");
    setInstantCheckoutItems([]);
    setSelectedProduct(null);
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
    toast.message("Dodano do koszyka", {
      description: `${product.name} czeka juz w koszyku dla ${productModeLabel}.`,
    });
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const openInstantCheckout = (product: Product) => {
    setCheckoutSource("buy-now");
    setInstantCheckoutItems([{ product, quantity: 1 }]);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleBuyNow = (product: Product) => {
    if (selectedProduct?.id === product.id) {
      setPendingBuyNowProduct(product);
      setSelectedProduct(null);
      return;
    }

    openInstantCheckout(product);
  };

  const handlePurchaseModalExited = () => {
    if (!pendingBuyNowProduct) {
      return;
    }

    const product = pendingBuyNowProduct;
    setPendingBuyNowProduct(null);
    openInstantCheckout(product);
  };

  const handleRecommendationAdd = (product: Product) => {
    const productModeLabel = getModeName(product.gameMode, gameModes) ?? activeModeLabel;
    const result = addItem(product, 1, product.gameMode);

    if (!handleCartAddResult(result, product, productModeLabel)) {
      return;
    }

    setCheckoutSource("cart");
    setInstantCheckoutItems([]);
    setIsCheckoutOpen(false);
  };

  const handleOpenCart = () => {
    if (!cartEnabled) {
      toast.message("Checkout jest w trybie podgladu", {
        description: "Koszyk zadziała po podpieciu backendu lub Vercelowych funkcji API.",
      });
      return;
    }

    setCheckoutSource("cart");
    setInstantCheckoutItems([]);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handleStartCheckout = () => {
    if (!cartItems.length) {
      return;
    }

    if (!checkoutPaymentOptions.length) {
      toast.error("Brak wspolnej metody platnosci", {
        description: "Ten koszyk laczy pozycje bez jednej wspolnej metody. Rozdziel zamowienie na prostsze zestawy.",
      });
      return;
    }

    setCheckoutSource("cart");
    setInstantCheckoutItems([]);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleClearCart = () => {
    clearCart();
    setIsCheckoutOpen(false);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    if (cartItems.length === 1) {
      setIsCheckoutOpen(false);
    }
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setCheckoutSource("cart");
    setInstantCheckoutItems([]);
  };

  return (
    <div className="relative min-h-screen bg-background bg-pixel-grid">
      <Navbar
        cartEnabled={cartEnabled}
        cartItems={totalItems}
        onOpenCart={handleOpenCart}
      />

      <CheckoutModal
        items={activeCheckoutItems}
        modeName={activeCheckoutModeLabel}
        open={isCheckoutOpen}
        source={checkoutSource}
        onClose={handleCloseCheckout}
      />

      <CartSheet
        items={cartItems}
        modeName={cartModeLabel}
        open={isCartOpen}
        recommendations={recommendations}
        totalPrice={totalPrice}
        onOpenChange={setIsCartOpen}
        onRemoveItem={handleRemoveItem}
        onAddRecommendation={handleRecommendationAdd}
        onClearCart={handleClearCart}
        onCheckout={handleStartCheckout}
      />

      <MobileCartBar
        items={totalItems}
        totalPrice={totalPrice}
        visible={cartEnabled && totalItems > 0}
        onOpenCart={handleOpenCart}
      />

      <div className="h-[68px]" />

      <div id="shop" className="border-b border-border/35 bg-background/92 scroll-mt-20">
        <GameModeSelector
          activeMode={activeMode}
          gameModes={gameModes}
          isLoading={isStorefrontLoading}
          onModeChange={handleModeChange}
        />
      </div>

      <ProductGrid
        activeGameMode={activeMode}
        gameModes={gameModes}
        products={storefrontProducts}
        isLoading={isStorefrontLoading}
        cartEnabled={cartEnabled}
        cartProductQuantities={cartQuantities}
        onOpenProduct={handleOpenProduct}
        onBuyNow={handleBuyNow}
        onCompareRanks={() => setShowRankComparison(true)}
      />

      {showRankComparison && (
        <RankComparisonModal
          cartEnabled={cartEnabled}
          gameMode={activeMode}
          products={storefrontProducts}
          onClose={() => setShowRankComparison(false)}
          onSelectProduct={(product) => {
            setShowRankComparison(false);
            setSelectedProduct(product);
          }}
        />
      )}

      <PurchaseModal
        activeModeName={activeModeLabel}
        cartEnabled={cartEnabled}
        quantityInCart={selectedProductQuantity}
        conflictingRankName={selectedProductConflictingRank?.name ?? null}
        onAddToCart={handleAddProduct}
        onBuyNow={handleBuyNow}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onExited={handlePurchaseModalExited}
      />

      <footer className="relative mt-12 overflow-hidden border-t border-border/35 bg-[linear-gradient(180deg,#fffdf8_0%,#f7efe1_100%)] sm:mt-14 lg:mt-16">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,174,32,0.14),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(67,118,156,0.08),transparent_24%)]" />

        <div className="relative mx-auto max-w-[1240px] px-4 py-8 sm:py-9 lg:py-12">
          <div className="panel-soft relative overflow-hidden rounded-[28px] sm:rounded-[34px]">
            <div className="minecraft-strip absolute inset-x-0 top-0 h-[4px]" />
            <div className="grid gap-4 p-4 sm:gap-5 sm:p-5 lg:grid-cols-[1.2fr_0.95fr_0.95fr] lg:p-6">
              <div className="relative overflow-hidden rounded-[24px] border border-[#e7d9bf] bg-[radial-gradient(circle_at_top_left,rgba(244,177,22,0.16),transparent_36%),linear-gradient(180deg,#fffdf8_0%,#f9f1e4_100%)] p-4 shadow-[0_24px_40px_-30px_rgba(122,87,20,0.3)] sm:rounded-[28px] sm:p-5 lg:p-6">
                <div className="minecraft-strip absolute inset-x-0 top-0 h-[4px]" />
                <img
                  src="/logo.png"
                  alt="Crafted.pl"
                  className="-ml-3 block h-7 w-auto opacity-95 [filter:brightness(0)_saturate(100%)] sm:h-8"
                  draggable={false}
                />
                <div className="mt-3 rounded-[22px] border border-[#ddcfb4] bg-white/72 p-4 shadow-[0_16px_28px_-26px_rgba(27,36,56,0.28)] sm:mt-4 sm:rounded-[24px] sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-pixel text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        Info o serwerze
                      </p>
                      <h4 className="mt-2 text-[1.02rem] font-bold leading-tight text-foreground sm:text-lg">
                        {activeModeDetails
                          ? activeModeDetails.storefrontTitle
                          : "Wybierz tryb, a pokazemy jego szczegoly"}
                      </h4>
                      <p className="mt-2 text-[13px] leading-[1.6] text-muted-foreground sm:text-sm sm:leading-relaxed">
                        {activeModeDetails
                          ? `Pakiety z tego widoku trafiaja tylko do koszyka dla ${activeModeDetails.name}. Bez mieszania zakupow miedzy serwerami.`
                          : "Po wyborze serwera pokazemy tutaj jego nazwe, wersje Minecraft i szybki skrot do zrodlowej oferty Crafted."}
                      </p>
                    </div>

                    {activeModeDetails ? (
                      <ShopBadge
                        tone="highlight"
                        className="shrink-0"
                      >
                        {activeModeDetails.shortName}
                      </ShopBadge>
                    ) : null}
                  </div>

                  <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                    <div className="rounded-[18px] border border-[#eadfcb] bg-[#fffaf0] px-3.5 py-3 shadow-[0_12px_22px_-24px_rgba(15,23,42,0.24)]">
                      <p className="font-pixel text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                        Tryb
                      </p>
                      <p className="mt-2 text-sm font-bold text-foreground">
                        {activeModeDetails?.name ?? "Brak wyboru"}
                      </p>
                    </div>

                    <div className="rounded-[18px] border border-[#eadfcb] bg-[#fffaf0] px-3.5 py-3 shadow-[0_12px_22px_-24px_rgba(15,23,42,0.24)]">
                      <p className="font-pixel text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                        Wersja
                      </p>
                      <p className="mt-2 text-sm font-bold text-foreground">
                        {activeModeVersion ?? "Po wyborze"}
                      </p>
                    </div>

                    <div className="rounded-[18px] border border-[#eadfcb] bg-[#fffaf0] px-3.5 py-3 shadow-[0_12px_22px_-24px_rgba(15,23,42,0.24)]">
                      <p className="font-pixel text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                        Serwer
                      </p>
                      <p className="mt-2 text-sm font-bold text-foreground">
                        {activeModeDetails?.sourceServer ?? "Po wyborze"}
                      </p>
                    </div>
                  </div>

                  {activeModeDetails ? (
                    <a
                      href={activeModeDetails.storefrontUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#7a5714] transition-colors hover:text-primary"
                    >
                      <span>Otworz oryginalna oferte serwera</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>

                  <div className="mt-4 sm:mt-6">
                    <ShopButton
                      asChild={false}
                      variant="primary"
                      size="lg"
                      className="rounded-2xl text-[13px] sm:text-sm"
                    >
                      <>
                        <span>Wroc do oferty</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    </ShopButton>
                  </div>
              </div>

              <div className="relative overflow-hidden rounded-[24px] border border-[#e7dccb] bg-white/82 p-4 shadow-[0_22px_34px_-30px_rgba(15,23,42,0.2)] sm:rounded-[28px] sm:p-5">
                <div className="minecraft-strip absolute inset-x-0 top-0 h-[4px] opacity-75" />
                <p className="font-pixel text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Pomoc i zasady
                </p>
                <h4 className="mt-2 text-[1.05rem] font-bold text-foreground sm:text-lg">Najwazniejsze linki</h4>

                <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
                  {footerLinks.map((item) => {
                    const Icon = item.icon;

                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        className="group flex items-start gap-3 rounded-[18px] border border-[#eadfce] bg-[#fffdfa] p-3 transition-all duration-200 hover:border-primary/24 hover:bg-white sm:rounded-[20px] sm:p-3.5"
                      >
                        <div className="inventory-slot flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#6e624e] transition-colors group-hover:text-primary sm:h-10 sm:w-10 sm:rounded-2xl">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-foreground">{item.label}</p>
                            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                          </div>
                          <p className="mt-1 text-[13px] leading-[1.55] text-muted-foreground sm:text-sm sm:leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="relative overflow-hidden rounded-[24px] border border-[#e7dccb] bg-white/82 p-4 shadow-[0_22px_34px_-30px_rgba(15,23,42,0.2)] sm:rounded-[28px] sm:p-5">
                  <div className="minecraft-strip absolute inset-x-0 top-0 h-[4px] opacity-75" />
                  <p className="font-pixel text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Spolecznosc
                  </p>
                  <h4 className="mt-2 text-[1.05rem] font-bold text-foreground sm:text-lg">Discord i wsparcie</h4>

                  <a
                    href={supportContactUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-between rounded-[18px] border border-[#ddd1bf] bg-[#fffdfa] px-3.5 py-3 text-sm text-foreground transition-all duration-200 hover:border-primary/24 hover:bg-white hover:text-primary sm:mt-5 sm:rounded-[22px] sm:px-4 sm:py-3.5"
                  >
                    <span className="inline-flex items-center gap-3">
                      <span className="inventory-slot flex h-9 w-9 items-center justify-center rounded-xl text-[#6e624e] sm:h-10 sm:w-10 sm:rounded-2xl">
                        <MessageCircle className="h-4 w-4" />
                      </span>
                      <span className="text-left">
                        <span className="block text-sm font-semibold text-foreground">Kontakt</span>
                        <span className="block text-[11px] leading-[1.35] text-muted-foreground sm:text-xs">
                          Pomoc przy zakupach i obsluga sklepu
                        </span>
                      </span>
                    </span>
                    <ShopBadge tone="highlight">Crafted</ShopBadge>
                  </a>

                  <p className="mt-4 text-[13px] leading-[1.65] text-muted-foreground sm:text-sm sm:leading-relaxed">
                    Jesli potrzebujesz pomocy z zakupem albo chcesz dopytac o pakiet,
                    przejdz bezposrednio do formularza kontaktowego Crafted lub napisz na {supportEmail}.
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-[22px] border border-[#e8ddcc] bg-[#fffdfa] p-4 shadow-[0_18px_30px_-28px_rgba(15,23,42,0.18)] sm:rounded-[24px]">
                  <div className="minecraft-strip absolute inset-x-0 top-0 h-[4px] opacity-70" />
                  <p className="font-pixel text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Informacja
                  </p>
                  <p className="mt-2 text-[13px] leading-[1.65] text-muted-foreground sm:text-sm sm:leading-relaxed">
                    Nie jestesmy powiazani z Mojang Studios. Ten widok prezentuje storefront i
                    uporzadkowana oferte pakietow serwerowych.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#e6dbc9] bg-white/38 px-4 py-3 sm:px-5 sm:py-4 lg:px-6">
              <div className="text-[11px] text-[#6b6357] sm:text-xs">
                <p>(c) 2026 Crafted.pl - Wszystkie prawa zastrzezone</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
