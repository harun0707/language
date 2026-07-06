import { useMemo } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Transaction } from '../types'
import { formatCurrency } from '../utils/format'

interface CategoryChartProps {
  transactions: Transaction[]
}

const COLORS = ['#818cf8', '#f472b6', '#fb923c', '#facc15', '#4ade80', '#22d3ee', '#a78bfa', '#f87171', '#34d399']

export function CategoryChart({ transactions }: CategoryChartProps) {
  const data = useMemo(() => {
    const totals = new Map<string, number>()
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount))
    return Array.from(totals.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
      <h3 className="text-slate-200 font-medium mb-2">Gider Dağılımı</h3>
      {data.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-16">Henüz gider kaydı yok.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
