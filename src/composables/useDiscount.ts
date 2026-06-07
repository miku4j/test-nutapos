import type { Ref } from 'vue'
import { useCrud } from './useCrud'

export interface Discount {
  _id?: string
  name: string
  value: number
  type: 'percentage' | 'amount'
}

export function useDiscount (url: Ref<string>) {
  return useCrud<Discount>(url, 'discounts')
}
