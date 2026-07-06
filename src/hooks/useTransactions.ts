import { useCallback, useEffect, useState } from 'react'
import type { Transaction } from '../types'

const STORAGE_KEY = 'finance-tracker:transactions'

function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Transaction[]) : []
  } catch {
    return []
  }
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    setTransactions((prev) => [
      { ...transaction, id: crypto.randomUUID() },
      ...prev,
    ])
  }, [])

  const removeTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { transactions, addTransaction, removeTransaction }
}
