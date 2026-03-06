import { Product } from "@/data/shopData";

export type ProductCategoryId = "all" | "rank" | "key" | "chest" | "set" | "other";

export interface ProductCategoryOption {
  id: ProductCategoryId;
  label: string;
  eyebrow: string;
  description: string;
  art: "island" | "crown" | "key" | "chest" | "bundle" | "spark";
  count: number;
  order: number;
  accentClassName: string;
  surfaceClassName: string;
  textClassName: string;
  layoutClassName: string;
  ctaLabel: string;
}

const categoryMeta: Record<
  ProductCategoryId,
  Omit<ProductCategoryOption, "count">
> = {
  all: {
    id: "all",
    label: "Wszystko",
    eyebrow: "Start tutaj",
    description: "Rangi, klucze, skrzynie i bundle w jednym miejscu.",
    art: "island",
    order: 0,
    accentClassName: "border-[#2f3440] bg-[#20252f]",
    surfaceClassName:
      "from-[#313948] via-[#232936] to-[#1b2029] before:bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.06)_10px,transparent_10px,transparent_20px)]",
    textClassName: "text-white",
    layoutClassName: "md:col-span-5 md:row-span-2",
    ctaLabel: "Pokaz wszystko",
  },
  rank: {
    id: "rank",
    label: "Rangi",
    eyebrow: "Premium",
    description: "Stale bonusy, wygoda i porownanie rang.",
    art: "crown",
    order: 1,
    accentClassName: "border-[#7a2127] bg-[#c73242]",
    surfaceClassName:
      "from-[#d54858] via-[#c73242] to-[#a61d2e] before:bg-[linear-gradient(180deg,rgba(255,255,255,0.11)_0,rgba(255,255,255,0.05)_42%,transparent_42%)]",
    textClassName: "text-[#fff7f5]",
    layoutClassName: "md:col-span-3",
    ctaLabel: "Zobacz rangi",
  },
  key: {
    id: "key",
    label: "Klucze",
    eyebrow: "Drop",
    description: "Szybkie zakupy do skrzyn i losowan.",
    art: "key",
    order: 2,
    accentClassName: "border-[#3c7aa7] bg-[#4ea2d9]",
    surfaceClassName:
      "from-[#62b8e6] via-[#4ea2d9] to-[#347dba] before:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_28%)]",
    textClassName: "text-[#f9fdff]",
    layoutClassName: "md:col-span-4",
    ctaLabel: "Kup klucze",
  },
  chest: {
    id: "chest",
    label: "Skrzynie",
    eyebrow: "Otwarcia",
    description: "Mystery boxy i skrzynie z dropem.",
    art: "chest",
    order: 3,
    accentClassName: "border-[#b08a12] bg-[#f2d03c]",
    surfaceClassName:
      "from-[#ffe46c] via-[#f2d03c] to-[#d5aa1f] before:bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_0,rgba(255,255,255,0.1)_12px,transparent_12px,transparent_24px)]",
    textClassName: "text-[#3c2404]",
    layoutClassName: "md:col-span-4",
    ctaLabel: "Otworz skrzynie",
  },
  set: {
    id: "set",
    label: "Bundle",
    eyebrow: "Duze pakiety",
    description: "Mocne zestawy dla szybkiego progresu.",
    art: "bundle",
    order: 4,
    accentClassName: "border-[#ab5b14] bg-[#eb8c2b]",
    surfaceClassName:
      "from-[#f5a245] via-[#eb8c2b] to-[#cf6d17] before:bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.08)_16px,transparent_16px)]",
    textClassName: "text-[#fff8f1]",
    layoutClassName: "md:col-span-7",
    ctaLabel: "Zobacz bundle",
  },
  other: {
    id: "other",
    label: "Dodatki",
    eyebrow: "Extra",
    description: "Specjalne przedmioty i drobne boosty.",
    art: "spark",
    order: 5,
    accentClassName: "border-[#7248b4] bg-[#8f63d4]",
    surfaceClassName:
      "from-[#a278ea] via-[#8f63d4] to-[#6f45b0] before:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_24%)]",
    textClassName: "text-[#faf6ff]",
    layoutClassName: "md:col-span-5",
    ctaLabel: "Sprawdz dodatki",
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
