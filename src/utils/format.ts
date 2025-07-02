export function formatNumber(num: number, decimals = 5): string {
  if (isNaN(num)) return "--";
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export const formatPrice = (num: number) => formatNumber(num, 1);
export const formatSize = (num: number) => formatNumber(num, 0);
export const formatTotal = (num: number) => formatNumber(num, 0);
