import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { formatCurrency } from '../utils/format'

interface SummaryCardsProps {
  income: number
  expense: number
  balance: number
}

export function SummaryCards({ income, expense, balance }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex items-center gap-4">
        <div className="rounded-full bg-indigo-500/15 text-indigo-400 p-3">
          <Wallet size={22} />
        </div>
        <div>
          <p className="text-slate-400 text-sm">Bakiye</p>
          <p className={`text-xl font-semibold ${balance >= 0 ? 'text-slate-50' : 'text-rose-400'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </div>
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex items-center gap-4">
        <div className="rounded-full bg-emerald-500/15 text-emerald-400 p-3">
          <TrendingUp size={22} />
        </div>
        <div>
          <p className="text-slate-400 text-sm">Toplam Gelir</p>
          <p className="text-xl font-semibold text-emerald-400">{formatCurrency(income)}</p>
        </div>
      </div>
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex items-center gap-4">
        <div className="rounded-full bg-rose-500/15 text-rose-400 p-3">
          <TrendingDown size={22} />
        </div>
        <div>
          <p className="text-slate-400 text-sm">Toplam Gider</p>
          <p className="text-xl font-semibold text-rose-400">{formatCurrency(expense)}</p>
        </div>
      </div>
    </div>
  )
}
