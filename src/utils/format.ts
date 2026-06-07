export const currencyFormat = new Intl.NumberFormat('id-ID')

export function formatDiscountValue (value: number, type: 'percentage' | 'amount'): string {
  if (type === 'percentage') {
    return `${value}%`
  }
  return `Rp ${currencyFormat.format(value)}`
}
