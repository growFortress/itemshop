import { Product } from "@/data/shopData";

export type ProductCategoryId = "all" | "rank" | "key" | "chest" | "set" | "other";

export interface ProductCategoryOption {
  id: ProductCategoryId;
  label: string;
  eyebrow: string;
  description: string;
  posterTitle: string;
  art: "island" | "crown" | "key" | "chest" | "bundle" | "spark";
  count: number;
  order: number;
  accentClassName: string;
  heroGradientClassName: string;
  heroBadgeClassName: string;
  surfaceClassName: string;
  iconClassName: string;
  badgeClassName: string;
  ctaLabel: string;
}

const categoryMeta: Record<
  ProductCategoryId,
  Omit<ProductCategoryOption, "count">
> = {
  all: {
    id: "all",
    label: "Wszystkie",
    eyebrow: "Pelna oferta",
    description: "Rangi, klucze, skrzynie i zestawy w jednym widoku.",
    posterTitle: "SKLEP",
    art: "island",
    order: 0,
    accentClassName: "border-[#88ab69]",
    heroGradientClassName: "from-[#f8b44a] via-[#d86a2b] to-[#6b1f34]",
    heroBadgeClassName: "border-[#ffd26a]/35 bg-[#fff2b0]/15 text-[#fff4c7]",
    surfaceClassName: "from-[#fdfff8] via-[#f2f8e9] to-[#e5efda]",
    iconClassName: "border-[#d3e0c3] bg-[#edf6e4]",
    badgeClassName: "border-[#d3e0c3] bg-[#edf6e4] text-[#355126]",
    ctaLabel: "Pokaz cala oferte",
  },
  rank: {
    id: "rank",
    label: "Rangi",
    eyebrow: "Stale bonusy",
    description: "Dostep do rang, perkow i szybkiego porownania.",
    posterTitle: "RANGI",
    art: "crown",
    order: 1,
    accentClassName: "border-[#d7b565]",
    heroGradientClassName: "from-[#ff5877] via-[#d71c50] to-[#6e1736]",
    heroBadgeClassName: "border-[#ffd27a]/35 bg-[#fff1b9]/15 text-[#fff4d4]",
    surfaceClassName: "from-[#fffef7] via-[#fff5dc] to-[#f9e9b9]",
    iconClassName: "border-[#edd796] bg-[#fff4d3]",
    badgeClassName: "border-[#edd796] bg-[#fff4d3] text-[#8a6210]",
    ctaLabel: "Przejdz do rang",
  },
  key: {
    id: "key",
    label: "Klucze",
    eyebrow: "Otwieranie dropu",
    description: "Pakiety kluczy do skrzyn i szybkich losowan.",
    posterTitle: "KLUCZE",
    art: "key",
    order: 2,
    accentClassName: "border-[#7fb8db]",
    heroGradientClassName: "from-[#42d8ff] via-[#1d93e8] to-[#27406d]",
    heroBadgeClassName: "border-[#b7ebff]/35 bg-[#dff7ff]/15 text-[#ebfbff]",
    surfaceClassName: "from-[#fbfeff] via-[#edf7ff] to-[#dfeffc]",
    iconClassName: "border-[#cbe1f0] bg-[#eef8ff]",
    badgeClassName: "border-[#cbe1f0] bg-[#eef8ff] text-[#2f6688]",
    ctaLabel: "Przejdz do kluczy",
  },
  chest: {
    id: "chest",
    label: "Skrzynie",
    eyebrow: "Losowe nagrody",
    description: "Otwarcia skrzyn i paczki z losowymi bonusami.",
    posterTitle: "SKRZYNIE",
    art: "chest",
    order: 3,
    accentClassName: "border-[#c89b63]",
    heroGradientClassName: "from-[#ffca6f] via-[#d8863c] to-[#6c2b25]",
    heroBadgeClassName: "border-[#ffe0a4]/35 bg-[#fff0ca]/15 text-[#fff5e0]",
    surfaceClassName: "from-[#fffbf6] via-[#f8ebdc] to-[#efd4b2]",
    iconClassName: "border-[#e8cbac] bg-[#fff1e1]",
    badgeClassName: "border-[#e8cbac] bg-[#fff1e1] text-[#8f5624]",
    ctaLabel: "Przejdz do skrzyn",
  },
  set: {
    id: "set",
    label: "Zestawy",
    eyebrow: "Pakiety laczone",
    description: "Wieksze zestawy dla graczy, ktorzy chca kupic wiecej naraz.",
    posterTitle: "ZESTAWY",
    art: "bundle",
    order: 4,
    accentClassName: "border-[#82a85c]",
    heroGradientClassName: "from-[#88d964] via-[#4ea551] to-[#2a5643]",
    heroBadgeClassName: "border-[#d9ffb8]/35 bg-[#f0ffd2]/15 text-[#f4ffe8]",
    surfaceClassName: "from-[#fbfff8] via-[#eef7e5] to-[#ddeccd]",
    iconClassName: "border-[#cfe0c0] bg-[#eef7e5]",
    badgeClassName: "border-[#cfe0c0] bg-[#eef7e5] text-[#42602c]",
    ctaLabel: "Przejdz do zestawow",
  },
  other: {
    id: "other",
    label: "Dodatki",
    eyebrow: "Dodatkowe bonusy",
    description: "Specjalne przedmioty, boosty i mniejsze dodatki.",
    posterTitle: "BONUSY",
    art: "spark",
    order: 5,
    accentClassName: "border-[#a491da]",
    heroGradientClassName: "from-[#9f8cff] via-[#6f56e6] to-[#2d2b6b]",
    heroBadgeClassName: "border-[#e0d7ff]/35 bg-[#f1edff]/15 text-[#f5f2ff]",
    surfaceClassName: "from-[#fcfbff] via-[#f2efff] to-[#e5defc]",
    iconClassName: "border-[#ddd5f3] bg-[#f5f1ff]",
    badgeClassName: "border-[#ddd5f3] bg-[#f5f1ff] text-[#654b99]",
    ctaLabel: "Przejdz do dodatkow",
  },
};

export function buildCategories(products: Product[]): ProductCategoryOption[] {
  const counts: Record<ProductCategoryId, number> = {
    all: products.length,
    rank: 0,
    key: 0,
    chest: 0,
    set: 0,
    other: 0,
  };

  for (const item of products) {
    counts[item.type] += 1;
  }

  return (Object.keys(categoryMeta) as ProductCategoryId[])
    .filter((id) => id === "all" || counts[id] > 0)
    .map((id) => ({
      ...categoryMeta[id],
      count: counts[id],
    }))
    .sort((left, right) => left.order - right.order);
}

export function filterByCategory(products: Product[], category: ProductCategoryId): Product[] {
  if (category === "all") {
    return products;
  }

  return products.filter((product) => product.type === category);
}
