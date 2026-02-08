export function toCurrency(number: string | number, currency: string) {
  const data = parseFloat(number as string);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(data);
}
