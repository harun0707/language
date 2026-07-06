export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  category: string
  description: string
  date: string
}

export const INCOME_CATEGORIES = ['Maaş', 'Ek Gelir', 'Yatırım', 'Hediye', 'Diğer'] as const
export const EXPENSE_CATEGORIES = [
  'Market',
  'Kira',
  'Faturalar',
  'Ulaşım',
  'Sağlık',
  'Eğlence',
  'Giyim',
  'Eğitim',
  'Diğer',
] as const
