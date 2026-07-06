import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'
import type { Transaction, TransactionType } from '../types'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types'

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void
}

const today = () => new Date().toISOString().slice(0, 10)

export function TransactionForm({ onAdd }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0])
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(today())

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType)
    setCategory(nextType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0])
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const parsedAmount = Number(amount)
    if (!parsedAmount || parsedAmount <= 0) return

    onAdd({
      type,
      amount: parsedAmount,
      category,
      description: description.trim() || category,
      date,
    })

    setAmount('')
    setDescription('')
    setDate(today())
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
      <div className="flex rounded-xl bg-slate-800 p-1">
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            type === 'expense' ? 'bg-rose-500 text-white' : 'text-slate-400'
          }`}
        >
          Gider
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('income')}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            type === 'income' ? 'bg-emerald-500 text-white' : 'text-slate-400'
          }`}
        >
          Gelir
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="col-span-2 sm:col-span-1 text-sm text-slate-400">
          Tutar
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
            className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
          />
        </label>

        <label className="col-span-2 sm:col-span-1 text-sm text-slate-400">
          Kategori
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="col-span-2 sm:col-span-1 text-sm text-slate-400">
          Açıklama
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Örn: Migros market alışverişi"
            className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
          />
        </label>

        <label className="col-span-2 sm:col-span-1 text-sm text-slate-400">
          Tarih
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
          />
        </label>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 transition-colors text-white font-medium py-2.5"
      >
        <Plus size={18} />
        İşlem Ekle
      </button>
    </form>
  )
}
