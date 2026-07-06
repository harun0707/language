import { useMemo, useState } from 'react'
import { Trash2, Search } from 'lucide-react'
import type { Transaction } from '../types'
import { formatCurrency, formatDate } from '../utils/format'

interface TransactionListProps {
  transactions: Transaction[]
  onRemove: (id: string) => void
}

export function TransactionList({ transactions, onRemove }: TransactionListProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesType = filter === 'all' || t.type === filter
      const matchesQuery =
        query.trim() === '' ||
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())
      return matchesType && matchesQuery
    })
  }, [transactions, filter, query])

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="İşlem ara..."
            className="w-full rounded-lg bg-slate-800 border border-slate-700 pl-9 pr-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex rounded-lg bg-slate-800 p-1 text-sm">
          {(['all', 'income', 'expense'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filter === key ? 'bg-slate-700 text-slate-50' : 'text-slate-400'
              }`}
            >
              {key === 'all' ? 'Tümü' : key === 'income' ? 'Gelir' : 'Gider'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-8">Kayıtlı işlem bulunamadı.</p>
      ) : (
        <ul className="divide-y divide-slate-800">
          {filtered.map((t) => (
            <li key={t.id} className="flex items-center justify-between py-3">
              <div className="min-w-0">
                <p className="text-slate-100 font-medium truncate">{t.description}</p>
                <p className="text-slate-500 text-xs">
                  {t.category} · {formatDate(t.date)}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`font-semibold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {t.type === 'income' ? '+' : '-'}
                  {formatCurrency(t.amount)}
                </span>
                <button
                  onClick={() => onRemove(t.id)}
                  aria-label="İşlemi sil"
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
