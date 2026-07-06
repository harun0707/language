import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Transaction } from '../types'
import { formatCurrency } from '../utils/format'

interface TrendChartProps {
  transactions: Transaction[]
}

export function TrendChart({ transactions }: TrendChartProps) {
  const data = useMemo(() => {
    const months = new Map<string, { month: string; income: number; expense: number }>()
    transactions.forEach((t) => {
      const key = t.date.slice(0, 7)
      const entry = months.get(key) ?? { month: key, income: 0, expense: 0 }
      entry[t.type] += t.amount
      months.set(key, entry)
    })
    return Array.from(months.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
  }, [transactions])

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
      <h3 className="text-slate-200 font-medium mb-2">Aylık Trend</h3>
      {data.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-16">Henüz işlem kaydı yok.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            <Bar dataKey="income" name="Gelir" fill="#4ade80" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Gider" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
