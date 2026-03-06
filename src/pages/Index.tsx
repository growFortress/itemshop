import { useMemo, useState } from "react";
import {
  FileText,
  HelpCircle,
  MessageCircle,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Product, gameModes, products } from "@/data/shopData";
import Navbar from "@/components/Navbar";
import CartSheet from "@/components/CartSheet";
import GameModeSelector from "@/components/GameModeSelector";
import MobileCartBar from "@/components/MobileCartBar";
import ProductGrid from "@/components/ProductGrid";
import RankComparisonModal from "@/components/RankComparisonModal";
import { useCart } from "@/hooks/useCart";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STORAGE_KEY = "crafted-preferred-mode";

function getInitialMode() {
  const storedMode = localStorage.getItem(STORAGE_KEY);
  if (storedMode && gameModes.some((mode) => mode.id === storedMode)) {
    return storedMode;
  }

  return gameModes[0]?.id ?? "";
}

function getModeName(modeId: string | null) {
  if (!modeId) return null;
  return gameModes.find((mode) => mode.id === modeId)?.name ?? null;
}

function sortRecommendations(left: Product, right: Product) {
  const priorityDiff = (left.sortPriority ?? 999) - (right.sortPriority ?? 999);
  if (priorityDiff !== 0) {
    return priorityDiff;
  }

  if (left.popular !== right.popular) {
    return left.popular ? -1 : 1;
  }

  return right.price - left.price;
}

const Index = () => {
  const [activeMode, setActiveMode] = useState(() => getInitialMode());
  const [cartOpen, setCartOpen] = useState(false);
  const [showRankComparison, setShowRankComparison] = useState(false);
  const [pendingMode, setPendingMode] = useState<string | null>(null);
  const { items, modeId, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  const applyModeChange = (id: string) => {
    setActiveMode(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const handleModeChange = (id: string) => {
    if (id === activeMode) return;

    if (modeId && modeId !== id && items.length > 0) {
      setPendingMode(id);
      return;
    }

    applyModeChange(id);
  };

  const handleConfirmModeChange = () => {
    if (!pendingMode) return;

    clearCart();
    setCartOpen(false);
    applyModeChange(pendingMode);
    setPendingMode(null);
    toast.success("Przelaczono tryb sklepu", {
      description: "Koszyk zostal wyczyszczony, zeby nie mieszac pakietow z roznych trybow.",
    });
  };

  const handleCancelModeChange = () => {
    setPendingMode(null);
  };

  const modeProducts = useMemo(
    () => products.filter((product) => product.gameMode === activeMode),
    [activeMode]
  );
  const activeModeLabel = useMemo(() => getModeName(activeMode) ?? "Wybrany tryb", [activeMode]);
  const cartModeLabel = useMemo(() => getModeName(modeId), [modeId]);

  const recommendedProducts = useMemo(() => {
    const cartIds = new Set(items.map((item) => item.product.id));

    return modeProducts
      .filter((product) => !cartIds.has(product.id))
      .sort(sortRecommendations)
      .slice(0, 3);
  }, [items, modeProducts]);
  const cartQuantities = useMemo(
    () =>
      items.reduce<Record<string, number>>((acc, item) => {
        acc[item.product.id] = item.quantity;
        return acc;
      }, {}),
    [items]
  );

  const handleAddProduct = (product: Product, quantity = 1) => {
    const result = addItem(product, quantity, activeMode);

    if (result.status === "mode-mismatch") {
      toast.error("Koszyk jest przypisany do innego trybu", {
        description: "Przelacz tryb albo wyczysc koszyk, zanim dodasz kolejny pakiet.",
      });
      return;
    }

    setCartOpen(true);
    toast.success("Dodano do koszyka", {
      description: `${product.name} x${quantity} dla trybu ${activeModeLabel}.`,
    });
  };

  const handleCheckout = () => {
    toast.message("Kolejny krok", {
      description: "Integracja checkoutu nie jest jeszcze podlaczona w tej makiecie sklepu.",
    });
  };

  return (
    <div className="relative min-h-screen bg-background bg-pixel-grid">
      <Navbar
        activeModeName={activeModeLabel}
        cartItems={totalItems}
        cartModeName={cartModeLabel}
        onOpenCart={() => setCartOpen(true)}
      />

      <div className="h-[76px]" />

      <div id="shop" className="border-b border-border/40 bg-background/95 scroll-mt-24">
        <GameModeSelector
          activeMode={activeMode}
          cartItems={totalItems}
          cartModeName={cartModeLabel}
          onModeChange={handleModeChange}
          onOpenCart={() => setCartOpen(true)}
        />
      </div>

      <ProductGrid
        activeGameMode={activeMode}
        activeCartMode={modeId}
        cartItems={totalItems}
        cartProductQuantities={cartQuantities}
        onAddProduct={handleAddProduct}
        onCompareRanks={() => setShowRankComparison(true)}
        onOpenCart={() => setCartOpen(true)}
      />

      {showRankComparison && (
        <RankComparisonModal
          gameMode={activeMode}
          onClose={() => setShowRankComparison(false)}
          onSelectProduct={(product) => {
            setShowRankComparison(false);
            handleAddProduct(product);
          }}
        />
      )}

      <CartSheet
        items={items}
        modeName={cartModeLabel}
        open={cartOpen}
        recommendations={recommendedProducts}
        totalPrice={totalPrice}
        onOpenChange={setCartOpen}
        onRemoveItem={removeItem}
        onUpdateQuantity={updateQuantity}
        onAddRecommendation={(product) => handleAddProduct(product)}
        onClearCart={clearCart}
        onCheckout={handleCheckout}
      />

      <MobileCartBar
        items={totalItems}
        totalPrice={totalPrice}
        visible={totalItems > 0 && !cartOpen}
        onOpenCart={() => setCartOpen(true)}
      />

      <AlertDialog
        open={Boolean(pendingMode)}
        onOpenChange={(open) => !open && handleCancelModeChange()}
      >
        <AlertDialogContent className="border-border/70 bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Zmienic tryb sklepu?</AlertDialogTitle>
            <AlertDialogDescription>
              Koszyk jest teraz przypisany do trybu {cartModeLabel ?? "aktualnego serwera"}. Jesli
              przejdziesz do {getModeName(pendingMode) ?? "innego trybu"}, koszyk zostanie wyczyszczony.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Pozostan przy tym trybie</AlertDialogCancel>
            <AlertDialogAction className="btn-premium border-0" onClick={handleConfirmModeChange}>
              Wyczysc koszyk i przelacz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <footer className="relative mt-12 border-t border-border/40 bg-card/95">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <h3 className="font-pixel text-sm text-primary">CRAFTED.PL</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Pixelowy sklep Crafted.pl. Wybierasz tryb, pakiety i od razu kompletujesz koszyk dla
              swojego serwera.
            </p>
            <span className="mt-4 inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-foreground">
              crafted.pl/sklep
            </span>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Najwazniejsze linki</h4>
            <div className="mt-4 space-y-3 text-sm">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
              >
                <FileText className="h-4 w-4" />
                Regulamin
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
              >
                <Shield className="h-4 w-4" />
                Polityka prywatnosci
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
              >
                <HelpCircle className="h-4 w-4" />
                FAQ i pomoc
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Spolecznosc</h4>
            <div className="mt-4 space-y-3">
              <a
                href="#"
                className="inline-flex w-full items-center justify-between rounded-[18px] border border-border/70 bg-background px-4 py-3 text-sm text-foreground transition-colors hover:border-primary/25 hover:text-primary"
              >
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Discord
                </span>
                <span className="font-pixel text-[10px] uppercase tracking-[0.14em]">Online</span>
              </a>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Nie jestesmy powiazani z Mojang Studios. Sklep pokazuje tylko pre-checkout flow i
                prezentacje pakietow.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>(c) 2026 Crafted.pl - Wszystkie prawa zastrzezone</p>
            <p>Projekt storefrontu w stylu pixel-shop.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
