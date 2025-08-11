// src/utils.ts

export function formatDate(
    input: string | Date | null | undefined,
    options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
    locale: string = 'vi-VN'
  ): string {
    if (!input) return '';
  
    const date = new Date(input);
    if (isNaN(date.getTime())) return '';
  
    return date.toLocaleDateString(locale, options);
  }

export function formatPrice(
  price: string | number,
  locale: string = 'vi-VN',
  currency: string = 'VND'
): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) return '0 ₫';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(numericPrice);
}

export function calculateDiscountedPrice(
  originalPrice: string | number,
  discountPercentage: string | number
): number {
  const price = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice;
  const discount = typeof discountPercentage === 'string' ? parseFloat(discountPercentage) : discountPercentage;
  
  if (isNaN(price) || isNaN(discount)) return price || 0;
  
  return price * (1 - discount / 100);
}
  