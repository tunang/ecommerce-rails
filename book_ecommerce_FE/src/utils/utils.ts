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
  