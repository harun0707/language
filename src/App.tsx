import { Wallet2 } from 'lucide-react'
import { useMemo } from 'react'
import { SummaryCards } from './components/SummaryCards'
import { TransactionForm } from './components/TransactionForm'
import { TransactionList } from './components/TransactionList'
import { CategoryChart } from './components/CategoryChart'
import { TrendChart } from './components/TrendChart'
import { useTransactions } from './hooks/useTransactions'

function App() {
  const { transactions, addTransaction, removeTransaction } = useTransactions()

  const { income, expense, balance } = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const expense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    return { income, expense, balance: income - expense }
  }, [transactions])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <header className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-500/15 text-indigo-400 p-2.5">
            <Wallet2 size={26} />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Finans Takip</h1>
            <p className="text-slate-500 text-sm">Gelir ve giderlerini kolayca yönet</p>
          </div>
        </header>

        <SummaryCards income={income} expense={expense} balance={balance} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <TransactionForm onAdd={addTransaction} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <CategoryChart transactions={transactions} />
              <TrendChart transactions={transactions} />
            </div>
            <TransactionList transactions={transactions} onRemove={removeTransaction} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
