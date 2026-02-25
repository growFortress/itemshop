export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  gameMode: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  popular?: boolean;
  badge?: "hot" | "new" | "sale";
  bonuses?: string[];
}

export interface GameMode {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const gameModes: GameMode[] = [
  { id: "og-lucky-skyblock", name: "OG Lucky SkyBlock", icon: "🏝️", color: "text-cyan-400" },
  { id: "survival-extreme", name: "Survival Extreme", icon: "🔥", color: "text-red-400" },
  { id: "survival-dzialki", name: "Survival Działki", icon: "🏡", color: "text-green-400" },
  { id: "oneblock", name: "OneBlock", icon: "🧊", color: "text-blue-400" },
  { id: "creative", name: "Creative", icon: "🎨", color: "text-purple-400" },
  { id: "box-pvp", name: "Box PvP", icon: "⚔️", color: "text-orange-400" },
];

export const products: Product[] = [
  // OG Lucky SkyBlock
  { id: "vip-sky", name: "VIP", description: "Fly, /heal, kolorowy nick, dostęp do /is warp i więcej!", price: 19.99, gameMode: "og-lucky-skyblock", image: "crown", rarity: "rare", badge: "hot", bonuses: ["Komenda /fly na wyspie", "Komenda /heal co 60s", "Kolorowy nick na chacie", "Dostęp do /is warp", "2 dodatkowe sethome"] },
  { id: "svip-sky", name: "SVIP", description: "Wszystko z VIP + /fix, efekty cząsteczkowe, 3 sethome.", price: 34.99, gameMode: "og-lucky-skyblock", image: "crown", rarity: "epic", bonuses: ["Wszystko z VIP", "Komenda /fix all", "Efekty cząsteczkowe", "3 sethome", "Priorytet w kolejce"] },
  { id: "mvp-sky", name: "MVP", description: "Najwyższa ranga! Wszystkie komendy, efekty i ekskluzywne itemy.", price: 59.99, gameMode: "og-lucky-skyblock", image: "crown", rarity: "legendary", bonuses: ["Wszystko z SVIP", "Wszystkie komendy VIP", "Ekskluzywne efekty", "Nielimitowane sethome", "Specjalne itemy startowe", "Prefix [MVP] na chacie"] },
  { id: "crate-sky", name: "Lucky Skrzynka", description: "Skrzynka z losowymi nagrodami — szansa na lucky blocki!", price: 9.99, gameMode: "og-lucky-skyblock", image: "chest", rarity: "rare", bonuses: ["Losowe nagrody", "Szansa na Lucky Blocki", "Rzadkie itemy enchantowane"] },
  { id: "crate-sky-leg", name: "Skrzynka Legendarna", description: "Gwarantowany legendarny drop z wyspy!", price: 24.99, gameMode: "og-lucky-skyblock", image: "chest", rarity: "legendary", badge: "new", bonuses: ["Gwarantowany legendarny drop", "Ekskluzywne skiny narzędzi", "Szansa na Elytry"] },
  { id: "key-sky", name: "Klucz Lucky", description: "Otwiera Lucky Skrzynkę.", price: 5.99, gameMode: "og-lucky-skyblock", image: "key", rarity: "rare", bonuses: ["Otwiera 1× Lucky Skrzynkę"] },
  { id: "key-sky-leg", name: "Klucz Legendarny", description: "Otwiera Skrzynkę Legendarną.", price: 14.99, gameMode: "og-lucky-skyblock", image: "key", rarity: "legendary", bonuses: ["Otwiera 1× Skrzynkę Legendarną"] },
  { id: "fly-sky", name: "Permanent Fly", description: "Latanie na wyspie na zawsze.", price: 12.99, gameMode: "og-lucky-skyblock", image: "sword", rarity: "epic", badge: "sale", bonuses: ["Permanentny /fly na wyspie", "Działa po restarcie serwera"] },

  // Survival Extreme
  { id: "vip-surv", name: "VIP Survival", description: "/heal, /feed, kolorowy nick, 5 sethome.", price: 14.99, gameMode: "survival-extreme", image: "crown", rarity: "rare", badge: "hot", bonuses: ["Komenda /heal co 120s", "Komenda /feed", "Kolorowy nick", "5 sethome"] },
  { id: "svip-surv", name: "SVIP Survival", description: "Wszystko z VIP + /fly w lobby, /enderchest, 10 sethome.", price: 29.99, gameMode: "survival-extreme", image: "crown", rarity: "epic", bonuses: ["Wszystko z VIP", "/fly w lobby", "/enderchest", "10 sethome"] },
  { id: "crate-surv", name: "Skrzynka Extreme", description: "Losowe nagrody — netherite, elytra, diamenty!", price: 7.99, gameMode: "survival-extreme", image: "chest", rarity: "rare", bonuses: ["Szansa na Netherite", "Szansa na Elytrę", "Diamenty i emeraldy"] },
  { id: "netherite-set", name: "Zestaw Netheritowy", description: "Pełen zestaw netheritowej zbroi z enchantami.", price: 19.99, gameMode: "survival-extreme", image: "sword", rarity: "legendary", bonuses: ["Pełna zbroja Netherite", "Protection IV", "Unbreaking III", "Mending na każdej części"] },
  { id: "god-pick-surv", name: "Kilof Boga", description: "Fortune III, Efficiency V, Unbreaking III, Mending.", price: 8.99, gameMode: "survival-extreme", image: "sword", rarity: "epic", badge: "new", bonuses: ["Fortune III", "Efficiency V", "Unbreaking III", "Mending"] },

  // Survival Działki
  { id: "vip-dzialki", name: "VIP Działki", description: "Większa działka, /fly na działce, kolorowy nick.", price: 14.99, gameMode: "survival-dzialki", image: "crown", rarity: "rare", badge: "hot", bonuses: ["Większa działka (+50%)", "/fly na swojej działce", "Kolorowy nick"] },
  { id: "svip-dzialki", name: "SVIP Działki", description: "Podwójna działka + wszystko z VIP.", price: 29.99, gameMode: "survival-dzialki", image: "crown", rarity: "epic", bonuses: ["Podwójna działka", "Wszystko z VIP", "/fly wszędzie"] },
  { id: "plot-expand", name: "Rozszerzenie Działki", description: "Powiększ swoją działkę o 50%.", price: 9.99, gameMode: "survival-dzialki", image: "key", rarity: "rare", bonuses: ["Powiększenie działki o 50%", "Jednorazowy zakup"] },
  { id: "crate-dzialki", name: "Skrzynka Budowniczego", description: "Losowe bloki dekoracyjne i narzędzia.", price: 6.99, gameMode: "survival-dzialki", image: "chest", rarity: "rare", badge: "new", bonuses: ["Losowe bloki dekoracyjne", "Szansa na narzędzia", "Unikalne bloki sezonowe"] },

  // OneBlock
  { id: "vip-oneblock", name: "VIP OneBlock", description: "/heal, szybsze fazy, kolorowy nick.", price: 14.99, gameMode: "oneblock", image: "crown", rarity: "rare", badge: "hot", bonuses: ["/heal co 90s", "Szybsze przechodzenie faz", "Kolorowy nick"] },
  { id: "mvp-oneblock", name: "MVP OneBlock", description: "Wszystkie perki + ekskluzywne bloki w fazach.", price: 44.99, gameMode: "oneblock", image: "crown", rarity: "legendary", bonuses: ["Wszystkie perki VIP", "Ekskluzywne bloki w fazach", "Podwójne nagrody z faz"] },
  { id: "phase-skip", name: "Pomiń Fazę", description: "Natychmiastowe przejście do następnej fazy.", price: 4.99, gameMode: "oneblock", image: "key", rarity: "common", bonuses: ["Przeskoczenie 1 fazy"] },
  { id: "crate-oneblock", name: "Skrzynka OneBlock", description: "Losowe nagrody z zaawansowanych faz.", price: 8.99, gameMode: "oneblock", image: "chest", rarity: "epic", bonuses: ["Nagrody z faz 8-12", "Szansa na ekskluzywne bloki"] },

  // Creative
  { id: "vip-creative", name: "VIP Creative", description: "WorldEdit, większa działka, /fly.", price: 9.99, gameMode: "creative", image: "crown", rarity: "rare", badge: "hot", bonuses: ["WorldEdit", "Większa działka", "/fly"] },
  { id: "mvp-creative", name: "MVP Creative", description: "Nieograniczona działka, VoxelSniper, Arceon.", price: 29.99, gameMode: "creative", image: "crown", rarity: "legendary", bonuses: ["Nieograniczona działka", "VoxelSniper", "Arceon", "Wszystkie perki VIP"] },
  { id: "plot-mega", name: "Mega Działka", description: "256x256 działka — buduj bez limitów.", price: 14.99, gameMode: "creative", image: "key", rarity: "epic", badge: "sale", bonuses: ["Działka 256×256", "Bez limitu bloków"] },
  { id: "particle-fire", name: "Aura Ognia", description: "Efekt cząsteczkowy ognia wokół Twojej postaci.", price: 7.99, gameMode: "creative", image: "key", rarity: "rare", bonuses: ["Efekt cząsteczkowy ognia", "Widoczny dla innych graczy"] },

  // Box PvP
  { id: "vip-pvp", name: "VIP PvP", description: "Kit Diamentowy, /heal w walce co 60s, kolorowy nick.", price: 14.99, gameMode: "box-pvp", image: "crown", rarity: "rare", badge: "hot", bonuses: ["Kit Diamentowy", "/heal co 60s w walce", "Kolorowy nick"] },
  { id: "mvp-pvp", name: "MVP PvP", description: "Kit Netheritowy, /heal co 30s, efekty killstreaka.", price: 39.99, gameMode: "box-pvp", image: "crown", rarity: "legendary", bonuses: ["Kit Netheritowy", "/heal co 30s", "Efekty killstreaka", "Wszystko z VIP"] },
  { id: "sword-god", name: "Miecz Boga", description: "Sharpness V, Fire Aspect II, Unbreaking III.", price: 15.99, gameMode: "box-pvp", image: "sword", rarity: "legendary", badge: "new", bonuses: ["Sharpness V", "Fire Aspect II", "Unbreaking III", "Mending"] },
  { id: "crate-pvp", name: "Skrzynka PvP", description: "Losowa broń lub zbroja z enchantami.", price: 7.99, gameMode: "box-pvp", image: "chest", rarity: "rare", bonuses: ["Losowa broń lub zbroja", "Enchanty PvP", "Szansa na Netherite"] },
  { id: "trail-stars", name: "Ślad Gwiazd", description: "Zostawiaj ślad gwiazd za sobą w walce.", price: 6.99, gameMode: "box-pvp", image: "key", rarity: "rare", badge: "new", bonuses: ["Ślad gwiazd za postacią", "Widoczny w walce"] },
];
