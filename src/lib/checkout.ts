import type { PaymentLink, Product } from "@/data/shopData";
import type { CartItem } from "@/hooks/useCart";

export interface CartCheckoutLine {
  productId: string;
  productName: string;
  quantity: number;
  unitAmount: number;
  totalAmount: number;
}

export interface CartPaymentOptionSummary {
  id: string;
  label: string;
  legalText: string;
  legalLinks: PaymentLink[];
  totalAmount: number;
}

const nicknamePattern = /^[^\s]{1,16}$/;

function normalizeLinks(links: PaymentLink[]) {
  const seen = new Set<string>();

  return links.filter((link) => {
    const key = `${link.label}|${link.href}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function getOptionMap(product: Product) {
  return new Map(
    product.paymentOptions
      .filter((option) => option.price !== null)
      .map((option) => [option.id, option])
  );
}

export function isValidNickname(nickname: string) {
  return nicknamePattern.test(nickname.trim());
}

export function getCartProductQuantities(items: CartItem[]) {
  return items.reduce<Record<string, number>>((accumulator, item) => {
    accumulator[item.product.id] = item.quantity;
    return accumulator;
  }, {});
}

export function getCartPaymentOptions(items: CartItem[]): CartPaymentOptionSummary[] {
  if (items.length === 0) {
    return [];
  }

  const commonIds = [...getOptionMap(items[0].product).keys()].filter((optionId) =>
    items.every((item) => getOptionMap(item.product).has(optionId))
  );

  return commonIds.map((optionId) => {
    const option = getOptionMap(items[0].product).get(optionId)!;
    const totalAmount = items.reduce((sum, item) => {
      const itemOption = getOptionMap(item.product).get(optionId)!;
      return sum + itemOption.price! * item.quantity;
    }, 0);
    const legalLinks = normalizeLinks(
      items.flatMap((item) => getOptionMap(item.product).get(optionId)!.legalLinks)
    );

    return {
      id: option.id,
      label: option.label,
      legalText: option.legalText,
      legalLinks,
      totalAmount: Number(totalAmount.toFixed(2)),
    };
  });
}

export function getCheckoutLines(items: CartItem[], paymentOptionId: string): CartCheckoutLine[] {
  return items.flatMap((item) => {
    const paymentOption = item.product.paymentOptions.find(
      (option) => option.id === paymentOptionId && option.price !== null
    );

    if (!paymentOption) {
      return [];
    }

    const unitAmount = paymentOption.price!;
    return [
      {
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitAmount,
        totalAmount: Number((unitAmount * item.quantity).toFixed(2)),
      },
    ];
  });
}

export function getCheckoutTotal(items: CartItem[], paymentOptionId: string) {
  return Number(
    getCheckoutLines(items, paymentOptionId)
      .reduce((sum, item) => sum + item.totalAmount, 0)
      .toFixed(2)
  );
}
