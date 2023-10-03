import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toCurrency(number: string | number, currency: string) {
  const data = parseFloat(number as string);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(data);
}
