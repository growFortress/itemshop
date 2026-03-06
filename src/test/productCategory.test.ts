import { describe, expect, it } from "vitest";
import { products } from "@/data/shopData";
import { buildCategories, filterByCategory } from "@/lib/productCategory";

describe("productCategory helpers", () => {
  it("builds categories in storefront order and skips empty ones", () => {
    const modeProducts = products.filter((product) => product.gameMode === "survival-dzialki");
    const categories = buildCategories(modeProducts);

    expect(categories.map((category) => category.id)).toEqual([
      "all",
      "rank",
      "key",
      "chest",
      "set",
    ]);
    expect(categories.find((category) => category.id === "rank")?.count).toBe(3);
    expect(categories.find((category) => category.id === "other")).toBeUndefined();
  });

  it("filters products by selected category", () => {
    const modeProducts = products.filter((product) => product.gameMode === "survival-dzialki");

    expect(filterByCategory(modeProducts, "set").map((product) => product.id)).toEqual([
      "survival-dzialki-644",
      "survival-dzialki-645",
    ]);
    expect(filterByCategory(modeProducts, "all")).toHaveLength(modeProducts.length);
  });
});
