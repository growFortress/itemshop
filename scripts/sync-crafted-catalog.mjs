import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const modeMap = [
  { id: "og-lucky-skyblock", server: "skyblock3" },
  { id: "survival-extreme", server: "survivalex24" },
  { id: "survival-dzialki", server: "svsmp1" },
  { id: "oneblock", server: "oneblock" },
  { id: "creative", server: "creative" },
  { id: "box-pvp", server: "boxpvp" },
];

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function stripLegalPrefix(value) {
  return value.replace(/\s+/g, " ").replace(/\s+,/g, ",").trim();
}

function parseMoney(value) {
  if (!value) return null;
  const normalized = value
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}\b)/g, "")
    .replace(",", ".");
  const amount = Number.parseFloat(normalized);
  return Number.isFinite(amount) ? amount : null;
}

function extractLowestPriceLines(details) {
  const lowestPriceIndex = details.findIndex((line) => /^Najniższa cena/i.test(line));
  if (lowestPriceIndex === -1) {
    return { details, lowestPriceLabel: null, lowestPriceLines: [] };
  }

  return {
    details: details.slice(0, lowestPriceIndex),
    lowestPriceLabel: details[lowestPriceIndex] ?? null,
    lowestPriceLines: details.slice(lowestPriceIndex + 1),
  };
}

function parsePaymentLabel(paneId) {
  if (paneId.startsWith("PaySafeCard-")) return "PaySafeCard";
  if (paneId.startsWith("Transfer-")) return "Przelew";
  return paneId.split("-")[0];
}

function parsePaymentId(label) {
  const normalized = label.toLowerCase();
  if (normalized.includes("paysafecard")) return "paysafecard";
  if (normalized.includes("przelew")) return "transfer";
  return normalized.replace(/\s+/g, "-");
}

async function fetchDocument(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "pixel-bazaar-sync/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return new JSDOM(await response.text()).window.document;
}

async function buildCatalog() {
  const result = {
    generatedAt: new Date().toISOString(),
    sourceUrl: "https://crafted.pl/sklep/",
    modes: {},
    products: {},
  };

  for (const mode of modeMap) {
    const pageUrl = `https://crafted.pl/sklep/index.php?server=${mode.server}`;
    const document = await fetchDocument(pageUrl);

    const titleParagraph = document.querySelector("#title p");
    const footerLinks = [...document.querySelectorAll("footer a, #footer a")];
    const contactEmailText = normalizeWhitespace(document.body.textContent ?? "");
    const emailMatch = contactEmailText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);

    result.modes[mode.id] = {
      id: mode.id,
      server: mode.server,
      pageUrl,
      title: normalizeWhitespace(titleParagraph?.textContent ?? mode.id),
      regulationsUrl:
        footerLinks.find((link) => /15164-regulamin/i.test(link.href))?.href ??
        "https://crafted.pl/topic/15164-regulamin-og%C3%B3lny/",
      privacyUrl:
        footerLinks.find((link) => /16518-polityka-prywatno/i.test(link.href))?.href ??
        "https://crafted.pl/topic/16518-polityka-prywatno%C5%9Bci/",
      contactUrl:
        footerLinks.find((link) => /\/contact\b/i.test(link.href))?.href ?? "https://crafted.pl/contact",
      email: emailMatch?.[0] ?? "pomoc@crafted.pl",
    };

    const productButtons = [...document.querySelectorAll('button[data-target^=".usluga-"]')];

    for (const button of productButtons) {
      const target = button.getAttribute("data-target") ?? "";
      const serviceId = target.match(/usluga-(\d+)/)?.[1];
      if (!serviceId) continue;

      const card = button.closest(".col-sm-6.col-md-4");
      const modal = document.querySelector(`#usluga-${serviceId}`);
      if (!card || !modal) continue;

      const rawDetails = [...modal.querySelectorAll(".modal-left-align li a")]
        .map((node) => normalizeWhitespace(node.textContent ?? ""))
        .filter(Boolean);

      const { details, lowestPriceLabel, lowestPriceLines } = extractLowestPriceLines(rawDetails);
      const paymentPanes = [...modal.querySelectorAll(".tab-pane")];
        const paymentOptions = paymentPanes.map((pane) => {
          const label = parsePaymentLabel(pane.id);
          const legalContainer = pane.querySelector(".alert span");
          const legalLinks = [...pane.querySelectorAll(".alert a")].map((link) => ({
            label: normalizeWhitespace(link.textContent ?? ""),
            href: link.href,
          }));

        return {
          id: parsePaymentId(label),
          label,
          price: parseMoney(pane.querySelector("strong")?.textContent ?? ""),
          note: normalizeWhitespace(pane.querySelector("p")?.textContent ?? ""),
          buttonLabel: normalizeWhitespace(pane.querySelector('button[type="submit"]')?.textContent ?? "Zapłać"),
          nicknamePlaceholder:
            pane.querySelector('input[placeholder]')?.getAttribute("placeholder") ?? "Twoj Nick",
          legalText: stripLegalPrefix(legalContainer?.textContent ?? ""),
          legalLinks,
        };
      });

      const displayPrice =
        paymentOptions.find((option) => option.id === "transfer")?.price ??
        paymentOptions.find((option) => option.price !== null)?.price ??
        null;

      const previewLines = details.slice(0, 2);

      result.products[`${mode.id}-${serviceId}`] = {
        id: `${mode.id}-${serviceId}`,
        sourceServiceId: serviceId,
        gameMode: mode.id,
        sourcePageUrl: pageUrl,
        name: normalizeWhitespace(card.querySelector(".caption h3")?.textContent ?? ""),
        subtitle: normalizeWhitespace(card.querySelector(".caption p")?.textContent ?? ""),
        summary: previewLines.join(" / "),
        previewLines,
        details,
        lowestPriceLabel,
        lowestPriceLines,
        paymentOptions,
        displayPrice,
      };
    }
  }

  return result;
}

function toModuleSource(payload) {
  return `export const craftedCatalog = ${JSON.stringify(payload, null, 2)} as const;\n`;
}

const catalog = await buildCatalog();
const targetFile = path.join(repoRoot, "src", "data", "craftedCatalog.generated.ts");
await fs.mkdir(path.dirname(targetFile), { recursive: true });
await fs.writeFile(targetFile, toModuleSource(catalog), "utf8");

console.log(`Wrote ${path.relative(repoRoot, targetFile)}`);
